import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishSignIn = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (!code) {
        toast.error('No auth code found. Please try signing in again.');
        navigate('/');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        toast.error('Sign-in failed. Please try again.');
      } else {
        toast.success('Signed in successfully.');
      }
      navigate('/');
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
