import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/auth/AuthProvider';
import { supabase, supabaseConfigured } from '@/lib/supabase';

type Copy = {
  title: string;
  subtitle: string;
  cta: string;
};

const copyByMode: Record<string, Copy> = {
  invite: {
    title: 'Set your password',
    subtitle: 'Create a password to finish your account setup.',
    cta: 'Set password',
  },
  recovery: {
    title: 'Reset your password',
    subtitle: 'Choose a new password to finish signing in.',
    cta: 'Update password',
  },
  default: {
    title: 'Set your password',
    subtitle: 'Create a password to continue.',
    cta: 'Set password',
  },
};

function resolveNext(nextParam: string | null) {
  if (nextParam && nextParam.startsWith('/')) return nextParam;
  return '/';
}

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mode = (searchParams.get('mode') ?? '').toLowerCase();
  const copy = copyByMode[mode] ?? copyByMode.default;
  const next = resolveNext(searchParams.get('next'));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!supabaseConfigured || !supabase) {
      toast.error('Supabase is not configured.');
      return;
    }
    if (!user) {
      toast.error('Your session expired. Please use the invite link again.');
      return;
    }
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Password updated.');
      navigate(next, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (!supabaseConfigured || !supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-3 rounded-2xl border bg-card p-6 text-center shadow-lg">
          <h1 className="text-xl font-semibold">Set password unavailable</h1>
          <p className="text-sm text-muted-foreground">Supabase is not configured for this site.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold">Loading account...</h1>
          <p className="text-sm text-muted-foreground">Please wait while we check your session.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-3 rounded-2xl border bg-card p-6 text-center shadow-lg">
          <h1 className="text-xl font-semibold">Invite link expired</h1>
          <p className="text-sm text-muted-foreground">
            Please request a new invite or password reset link.
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>Back to home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-6 shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{copy.title}</h1>
          <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Enter a password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Saving...' : copy.cta}
          </Button>
        </form>
      </div>
    </div>
  );
}
