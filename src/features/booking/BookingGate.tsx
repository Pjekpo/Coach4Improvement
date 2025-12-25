import { ReactNode, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import AuthModal from '@/components/AuthModal';
import { Analytics } from '@/lib/analytics';

export function isEmailVerified(user: { email_confirmed_at?: string | null } | null) {
  return !!user?.email_confirmed_at;
}

export default function BookingGate({
  children,
  onBlocked,
}: {
  children: (props: { canBook: boolean; requestBook: () => void; emailVerified: boolean }) => ReactNode;
  onBlocked?: (reason: 'unauth' | 'unverified') => void;
}) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const emailVerified = isEmailVerified(user);
  const canBook = !!user && emailVerified;

  const requestBook = () => {
    if (!user) {
      setAuthOpen(true);
      Analytics.BookingAttemptBlocked('unauth');
      onBlocked?.('unauth');
      return;
    }
    if (!emailVerified) {
      Analytics.BookingAttemptBlocked('unverified');
      onBlocked?.('unverified');
      return;
    }
    Analytics.BookingStarted();
  };

  return (
    <>
      {children({ canBook, requestBook, emailVerified })}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" />
    </>
  );
}

