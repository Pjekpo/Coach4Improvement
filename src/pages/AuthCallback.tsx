import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { supabase, supabaseConfigured } from '@/lib/supabase';

const passwordFlowTypes = new Set(['invite', 'recovery']);

function getUrlParam(name: string) {
  const searchParams = new URLSearchParams(window.location.search);
  const fromSearch = searchParams.get(name);
  if (fromSearch) return fromSearch;

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!hash) return null;

  const hashParams = new URLSearchParams(hash);
  return hashParams.get(name);
}

function resolveNext(nextParam: string | null) {
  if (nextParam && nextParam.startsWith('/')) return nextParam;
  return '/';
}

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishSignIn = async () => {
      const code = getUrlParam('code');
      const type = (getUrlParam('type') ?? '').toLowerCase();
      const next = resolveNext(getUrlParam('next'));

      if (!code) {
        toast.error('No auth code found. Please try signing in again.');
        navigate('/');
        return;
      }

      if (!supabaseConfigured || !supabase) {
        toast.error('Sign-in unavailable: Supabase is not configured.');
        navigate('/');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        toast.error('Sign-in failed. Please try again.');
        navigate('/');
        return;
      }

      if (passwordFlowTypes.has(type)) {
        const params = new URLSearchParams();
        params.set('mode', type);
        if (next && next !== '/') {
          params.set('next', next);
        }
        navigate(`/auth/set-password?${params.toString()}`, { replace: true });
        return;
      }

      toast.success('Signed in successfully.');
      navigate(next, { replace: true });
    };

    void finishSignIn();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-semibold">Finishing sign-in...</h1>
        <p className="text-sm text-muted-foreground">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}
