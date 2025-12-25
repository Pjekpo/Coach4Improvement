import { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { z } from 'zod';
import BookingGate from '@/features/booking/BookingGate';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthProvider';
import { Analytics } from '@/lib/analytics';
import { toast } from 'sonner@2.0.3';

const schema = z.object({ date: z.date() });

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { user } = useAuth();
  const [activeCode, setActiveCode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .is('redeemed_at', null)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
      if (!error && (data as any)?.code) setActiveCode((data as any).code as string);
    })();
  }, [user?.id]);

  const completeBooking = async () => {
    const parsed = schema.safeParse({ date });
    if (!parsed.success) {
      toast.error('Choose a date to continue.');
      return;
    }
    if (activeCode) {
      await supabase
        .from('promo_codes')
        .update({ redeemed_at: new Date().toISOString() })
        .is('redeemed_at', null);
    }
    Analytics.BookingCompleted();
    toast.success('Booking confirmed! A confirmation email will be sent shortly.');
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
            {!emailVerified && (
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-center text-sm">
                Please verify your email to proceed with booking.
              </div>
            )}

            <div className="flex justify-center">
              <DayPicker mode="single" selected={date} onSelect={setDate} />
            </div>

            {activeCode && (
              <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-center text-sm">
                20% off applied automatically at checkout (code {activeCode})
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  if (!canBook) {
                    requestBook();
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
