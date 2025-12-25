import { useState } from 'react';
import { Mail, Lock, Chrome, BadgeCheck, BookOpen } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner@2.0.3';
import LogoImage from '@/assets/asset-1.png';

type Props = {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
};

export default function AuthModal({ open, onClose, defaultTab = 'signup' }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'signup' && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setSubmitting(true);
      if (tab === 'signup') {
        await signUpWithEmail(email, password);
        // Attempt immediate sign-in so the header updates to Log Out after signup
        await signInWithEmail(email, password);
        toast.success('Account created and signed in.');
        onClose();
      } else {
        await signInWithEmail(email, password);
        toast.success('Signed in successfully');
        onClose();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unable to process request';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const switchTab = (next: 'login' | 'signup') => {
    setTab(next);
    setPassword('');
    setConfirmPassword('');
  };

  const onGoogle = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not start Google sign-in';
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const emailNotVerified = !!user && !user.email_confirmed_at;
  const title = tab === 'signup' ? 'Lets Start Learning' : 'Welcome back';
  const subtitle = tab === 'signup' ? 'Create your account to continue' : 'Sign in to continue';
  const cta = tab === 'signup' ? 'Sign Up' : 'Log In';

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-3">
      <div className="relative w-full max-w-md sm:max-w-lg">
        <div className="absolute -left-10 -bottom-10 hidden sm:block opacity-80 select-none">
          <div className="h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-orange-50">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <img
                src={LogoImage}
                alt="Coach4Improvement"
                className="h-12 w-12 object-contain"
                loading="eager"
                decoding="async"
              />
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 leading-tight">Care Plan Quality Audit</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                    <BadgeCheck className="h-4 w-4" /> CQC Quality
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">
                    <BookOpen className="h-4 w-4" /> Clinical Standards
                  </span>
                </div>
                <p className="text-sm text-gray-500">{subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

            {emailNotVerified && (
              <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
                Email not verified. Please click the link sent to your email.
              </div>
            )}

          <form className="space-y-3" onSubmit={onEmailSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your Email"
                className="pl-10 h-12 rounded-xl bg-gray-50 border-0 focus-visible:ring-orange-200 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="pl-10 h-12 rounded-xl bg-gray-50 border-0 focus-visible:ring-orange-200 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {tab === 'signup' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                  className="pl-10 h-12 rounded-xl bg-gray-50 border-0 focus-visible:ring-orange-200 text-gray-800 placeholder:text-gray-400"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-sm disabled:opacity-70"
            >
              {submitting ? 'Please wait...' : cta}
            </Button>
          </form>

          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
              onClick={onGoogle}
              disabled={googleLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              {googleLoading ? 'Redirecting...' : 'Google'}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            {tab === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                  onClick={() => switchTab('login')}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                New here?{' '}
                <button
                  type="button"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                  onClick={() => switchTab('signup')}
                >
                  Create account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
