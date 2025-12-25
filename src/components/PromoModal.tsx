import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { issuePromoCode } from '@/features/promo/api';
import { hmacSign, verifyHmac } from '@/lib/crypto';
import { Analytics } from '@/lib/analytics';
import { toast } from 'sonner@2.0.3';

type SeenPayload = { next: string };

const KEY = 'c4i_promo_seen';
const SIG = 'c4i_promo_sig';

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export default function PromoModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const secret = useMemo(() => (import.meta.env as any).VITE_PROMO_SECRET as string, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(KEY);
        const sig = localStorage.getItem(SIG);
        if (!raw || !sig || !(await verifyHmac(raw, sig, secret))) {
          setOpen(true);
          Analytics.PromoImpression();
          return;
        }
        const payload = JSON.parse(raw) as SeenPayload;
        if (Date.now() > new Date(payload.next).getTime()) {
          setOpen(true);
          Analytics.PromoImpression();
        }
      } catch {
        setOpen(true);
        Analytics.PromoImpression();
      }
    })();
  }, [secret]);

  // If the user logs in during this session, issue code once
  useEffect(() => {
    (async () => {
      if (user && open === false) {
        try {
          const row = await issuePromoCode();
          toast.success(`Welcome! Your 20% code: ${row.code}`);
          Analytics.PromoClaimed(row.code);
        } catch {
          // already has a code or RLS rejected; ignore
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!open) return null;

  const setSeen = async (days: number) => {
    const payload: SeenPayload = { next: addDays(days) };
    const raw = JSON.stringify(payload);
    const sig = await hmacSign(raw, secret);
    localStorage.setItem(KEY, raw);
    localStorage.setItem(SIG, sig);
  };

  const onDismiss = async () => {
    await setSeen(30);
    setOpen(false);
    Analytics.PromoDismissed();
  };

  const onRemind = async () => {
    await setSeen(7);
    setOpen(false);
    Analytics.PromoRemindLater();
  };

  const onCreateAccount = () => {
    setAuthOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6">
          <h3 className="mb-2">Get 20% off your first consultation</h3>
          <p className="text-muted-foreground mb-6">
            Create a free account today and your discount will apply automatically at checkout.
          </p>
          <div className="flex gap-2">
            <Button onClick={onCreateAccount}>Create account</Button>
            <Button variant="outline" onClick={onRemind}>Remind me later</Button>
            <Button variant="ghost" onClick={onDismiss}>No thanks</Button>
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" />
    </>
  );
}

