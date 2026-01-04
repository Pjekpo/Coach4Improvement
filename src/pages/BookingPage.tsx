import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { z } from 'zod';
import BookingGate from '@/features/booking/BookingGate';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/auth/AuthProvider';
import { Analytics } from '@/lib/analytics';
import { toast } from 'sonner@2.0.3';

const timeSlots = Array.from({ length: 9 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`);

const schema = z.object({
  date: z.date(),
  timeSlot: z.string().min(1, 'Choose a time slot'),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  serviceNeed: z.string().min(1, 'Please tell us what you need'),
  notes: z.string().optional(),
});

type SlotMap = Record<string, Set<string>>;

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceNeed, setServiceNeed] = useState('');
  const [notes, setNotes] = useState('');
  const { user, session } = useAuth();
  const isSignedIn = !!user;
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [bookedSlots, setBookedSlots] = useState<SlotMap>({});
  const supabaseReady = supabaseConfigured && !!supabase;

  const dateKey = (d: Date) => d.toISOString().split('T')[0];

  const toGCalDateTime = (d: Date) => {
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const hours = `${d.getHours()}`.padStart(2, "0");
    const minutes = `${d.getMinutes()}`.padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}00`;
  };

  const buildGoogleCalendarUrl = (d: Date, slot?: string, detail?: string) => {
    const startDateTime = new Date(d);
    if (slot) {
      const [h, m] = slot.split(':').map((n) => Number(n));
      startDateTime.setHours(h, m ?? 0, 0, 0);
    }
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 1);
    const start = toGCalDateTime(startDateTime);
    const end = toGCalDateTime(endDateTime);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Consultation with Coach4Improvement",
      dates: `${start}/${end}`,
      details:
        detail ??
        "Booked via Coach4Improvement. We will confirm meeting details shortly.",
      location: "Online meeting",
    });
    return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
  };

  const isFullyBooked = (key: string, slots: Set<string>) => {
    if (slots.has('ALL')) return true;
    return timeSlots.every((slot) => slots.has(slot));
  };

  useEffect(() => {
    if (!supabaseReady || !supabase) return;
    const client = supabase;
    (async () => {
      const { data, error } = await client
        .from('bookings')
        .select('date,time_slot')
        .not('date', 'is', null);
      if (!error && Array.isArray(data)) {
        const map: SlotMap = {};
        data.forEach((row: any) => {
          const key = (row.date as string).split('T')[0];
          const slot = (row.time_slot as string | null | undefined) ?? 'ALL';
          if (!map[key]) map[key] = new Set();
          map[key].add(slot.trim() || 'ALL');
        });
        setBookedSlots(map);
        const fully = Object.entries(map)
          .filter(([k, slots]) => isFullyBooked(k, slots))
          .map(([k]) => k);
        setUnavailableDates(new Set(fully));
      }
    })();
  }, [supabaseReady]);

  useEffect(() => {
    // Reset time slot when date changes so we don't keep an unavailable slot
    setTimeSlot(undefined);
  }, [date]);

  const availableSlots = useMemo(() => {
    if (!date) return timeSlots;
    const key = dateKey(date);
    const booked = bookedSlots[key];
    if (!booked) return timeSlots;
    if (booked.has('ALL')) return [];
    return timeSlots.filter((slot) => !booked.has(slot));
  }, [date, bookedSlots]);

  const updateBookedState = (key: string, slot: string) => {
    setBookedSlots((prev) => {
      const next: SlotMap = { ...prev };
      const set = new Set(next[key] ?? []);
      set.add(slot);
      next[key] = set;
      setUnavailableDates((prevDates) => {
        const nextDates = new Set(prevDates);
        if (isFullyBooked(key, set)) {
          nextDates.add(key);
        } else {
          nextDates.delete(key);
        }
        return nextDates;
      });
      return next;
    });
  };

  const completeBooking = async () => {
    const parsed = schema.safeParse({
      date,
      timeSlot,
      fullName,
      phone,
      serviceNeed,
      notes: notes.trim() || undefined,
    });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Please complete the form.';
      toast.error(firstError);
      return;
    }
    const { date: parsedDate, timeSlot: parsedSlot } = parsed.data;
    const combinedNotes = [
      `Service requested: ${parsed.data.serviceNeed}`,
      parsed.data.notes ? `Additional info: ${parsed.data.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const bookingPayload = {
      date: parsedDate.toISOString(),
      time_slot: parsedSlot,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      notes: combinedNotes || null,
      user_id: user?.id ?? null,
    };
    if (!supabaseReady || !supabase) {
      toast.error('Booking system is unavailable. Please try again later.');
      return;
    }

    const { error } = await supabase.from('bookings').insert([bookingPayload]);
    if (error) {
      toast.error('Unable to save your booking. Please try again.');
      return;
    }

    Analytics.BookingCompleted();
    toast.success('Booking confirmed! A confirmation email will be sent shortly.');
    updateBookedState(dateKey(parsedDate), parsedSlot);
    const detail = [
      `Booked by: ${parsed.data.fullName}`,
      `Phone: ${parsed.data.phone}`,
      `Service: ${parsed.data.serviceNeed}`,
      parsed.data.notes ? `Notes: ${parsed.data.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const pushToGoogleCalendar = async () => {
      if (!session?.provider_token) return false;
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const start = new Date(parsedDate);
      const [h, m] = parsedSlot.split(':').map((n) => Number(n));
      start.setHours(h, m ?? 0, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 1);

      const payload = {
        summary: 'Consultation - Coach4Improvement',
        description: detail,
        start: { dateTime: start.toISOString(), timeZone: tz },
        end: { dateTime: end.toISOString(), timeZone: tz },
        reminders: { useDefault: true },
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Google Calendar event failed');
      return true;
    };

    try {
      const pushed = await pushToGoogleCalendar();
      if (!pushed) {
        const url = buildGoogleCalendarUrl(parsedDate, parsedSlot, detail);
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      const url = buildGoogleCalendarUrl(parsedDate, parsedSlot, detail);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="container mx-auto flex max-w-4xl flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-4">Book Your Consultation</h1>
        <h2 className="mb-6 text-muted-foreground">Pick a preferred date</h2>
      </div>

      <BookingGate onBlocked={() => {}}>
        {({ canBook, requestBook, emailVerified }) => (
          <div className="w-full max-w-2xl space-y-4">
            {isSignedIn && !emailVerified && (
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-center text-sm">
                Please verify your email to proceed with booking.
              </div>
            )}

            {!isSignedIn && (
              <div className="rounded-md border border-slate-200 bg-white p-3 text-center text-sm">
                Sign in or create an account to choose a date and enter your details.
                <div className="mt-2 flex justify-center">
                  <Button type="button" variant="outline" onClick={requestBook}>
                    Sign in or create account
                  </Button>
                </div>
              </div>
            )}

            <div className={`flex justify-center ${!isSignedIn ? 'pointer-events-none opacity-60' : ''}`}>
              <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{
                  before: new Date(),
                  dates: Array.from(unavailableDates).map((d) => new Date(d)),
                }}
              />
            </div>

            {date && (
              <div
                className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 ${!isSignedIn ? 'pointer-events-none opacity-60' : ''}`}
              >
                <h3 className="font-semibold text-slate-800">Choose a time</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const unavailable = !availableSlots.includes(slot);
                    return (
                      <Button
                        key={slot}
                        type="button"
                        variant={timeSlot === slot ? 'default' : 'outline'}
                        disabled={unavailable || !isSignedIn}
                        className={timeSlot === slot ? '' : 'bg-white'}
                        onClick={() => setTimeSlot(slot)}
                      >
                        {slot}
                        {unavailable ? ' (booked)' : ''}
                      </Button>
                    );
                  })}
                </div>
                {availableSlots.length === 0 && (
                  <p className="text-sm text-amber-600">All time slots are booked for this date.</p>
                )}
              </div>
            )}

            <div
              className={`grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${!isSignedIn ? 'pointer-events-none opacity-60' : ''}`}
            >
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  disabled={!isSignedIn}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7123 456 789"
                  disabled={!isSignedIn}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="serviceNeed">What service do you need?</Label>
                <Input
                  id="serviceNeed"
                  value={serviceNeed}
                  onChange={(e) => setServiceNeed(e.target.value)}
                  placeholder="e.g. Compliance audit, governance review"
                  disabled={!isSignedIn}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Additional information</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share anything we should know before the call."
                  rows={4}
                  disabled={!isSignedIn}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  if (!canBook) {
                    requestBook();
                    return;
                  }
                  if (!date) {
                    toast.error('Choose a date to continue.');
                    return;
                  }
                  const key = dateKey(date);
                  const todayKey = dateKey(new Date());
                  if (key < todayKey) {
                    toast.error('Please choose a future date.');
                    return;
                  }
                  if (unavailableDates.has(key)) {
                    toast.error('That date is already booked. Please choose another.');
                    return;
                  }
                  completeBooking();
                }}
              >
                Book consultation
              </Button>
            </div>
          </div>
        )}
      </BookingGate>
    </div>
  );
}
