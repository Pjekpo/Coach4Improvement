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
const formspreeBookingEndpoint = 'https://formspree.io/f/mojvkzad';

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
  const { user } = useAuth();
  const isSignedIn = !!user;
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [bookedSlots, setBookedSlots] = useState<SlotMap>({});
  const supabaseReady = supabaseConfigured && !!supabase;

  const dateKey = (d: Date) => d.toISOString().split('T')[0];

  const isFullyBooked = (key: string, slots: Set<string>) => {
    if (slots.has('ALL')) return true;
    return timeSlots.every((slot) => slots.has(slot));
  };

  const normalizeSlot = (value?: string | null) => value?.trim() || 'ALL';

  const sendBookingToFormspree = async (payload: {
    fullName: string;
    phone: string;
    serviceNeed: string;
    dateLabel: string;
    timeSlot: string;
    notes?: string;
    email?: string;
  }) => {
    const formData = new FormData();
    formData.append('_subject', 'New consultation booking');
    formData.append('fullName', payload.fullName);
    formData.append('phone', payload.phone);
    formData.append('serviceNeed', payload.serviceNeed);
    formData.append('date', payload.dateLabel);
    formData.append('timeSlot', payload.timeSlot);
    if (payload.notes) {
      formData.append('notes', payload.notes);
    }
    if (payload.email) {
      formData.append('email', payload.email);
    }

    const res = await fetch(formspreeBookingEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Formspree submission failed');
    }
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
          const slot = normalizeSlot(row.time_slot as string | null | undefined);
          if (!map[key]) map[key] = new Set();
          map[key].add(slot);
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

  const removeBookedState = (key: string, slot: string) => {
    setBookedSlots((prev) => {
      const next: SlotMap = { ...prev };
      const set = new Set(next[key] ?? []);
      set.delete(slot);
      if (set.size === 0) {
        delete next[key];
      } else {
        next[key] = set;
      }
      setUnavailableDates((prevDates) => {
        const nextDates = new Set(prevDates);
        if (set.size === 0 || !isFullyBooked(key, set)) {
          nextDates.delete(key);
        } else {
          nextDates.add(key);
        }
        return nextDates;
      });
      return next;
    });
  };

  useEffect(() => {
    if (!supabaseReady || !supabase) return;
    const client = supabase;
    const channel = client
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          const row = payload.new as { date?: string | null; time_slot?: string | null };
          if (!row?.date) return;
          const key = row.date.split('T')[0];
          updateBookedState(key, normalizeSlot(row.time_slot));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'bookings' },
        (payload) => {
          const row = payload.old as { date?: string | null; time_slot?: string | null };
          if (!row?.date) return;
          const key = row.date.split('T')[0];
          removeBookedState(key, normalizeSlot(row.time_slot));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings' },
        (payload) => {
          const oldRow = payload.old as { date?: string | null; time_slot?: string | null };
          const newRow = payload.new as { date?: string | null; time_slot?: string | null };
          if (oldRow?.date) {
            removeBookedState(oldRow.date.split('T')[0], normalizeSlot(oldRow.time_slot));
          }
          if (newRow?.date) {
            updateBookedState(newRow.date.split('T')[0], normalizeSlot(newRow.time_slot));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [supabaseReady]);

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

    const existingCheck = await supabase
      .from('bookings')
      .select('id')
      .eq('date', bookingPayload.date)
      .eq('time_slot', parsedSlot)
      .limit(1);

    if (!existingCheck.error && existingCheck.data?.length) {
      updateBookedState(dateKey(parsedDate), parsedSlot);
      toast.error('That time slot was just booked. Please choose another.');
      return;
    }

    const { error } = await supabase.from('bookings').insert([bookingPayload]);
    if (error) {
      if (error.code === '23505') {
        updateBookedState(dateKey(parsedDate), parsedSlot);
        toast.error('That time slot was just booked. Please choose another.');
        return;
      }
      toast.error('Unable to save your booking. Please try again.');
      return;
    }

    Analytics.BookingCompleted();
    toast.success('Booking confirmed! A confirmation email will be sent shortly.');
    updateBookedState(dateKey(parsedDate), parsedSlot);

    try {
      await sendBookingToFormspree({
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        serviceNeed: parsed.data.serviceNeed,
        dateLabel: parsedDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        timeSlot: parsedSlot,
        notes: parsed.data.notes ?? undefined,
        email: user?.email ?? undefined,
      });
    } catch {
      toast.error('Booking saved, but we could not send the email notification.');
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
