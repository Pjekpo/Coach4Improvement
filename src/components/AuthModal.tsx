import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { toast } from 'sonner@2.0.3';

type Props = {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
  embedded?: boolean;
  showClose?: boolean;
};

export default function AuthModal({
  open,
  onClose,
  defaultTab = 'signup',
  embedded = false,
  showClose = true,
}: Props) {
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
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
        await signUpWithEmail(email, password, name.trim());
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
      const rawMsg = e instanceof Error ? e.message : 'Unable to process request';
      const normalized = rawMsg.toLowerCase();
      const msg =
        normalized.includes('email not confirmed') || normalized.includes('email not verified')
          ? 'Confirm your email'
          : rawMsg;
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const switchTab = (next: 'login' | 'signup') => {
    setTab(next);
    setName('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const emailNotVerified = !!user && !user.email_confirmed_at;
  const subtitle = tab === 'signup' ? 'Create your account to continue' : 'Sign in to continue';
  const embeddedSubtitle =
    tab === 'signup'
      ? 'Create your account with an approved email to continue.'
      : 'Sign in with your approved email to continue.';
  const cta = tab === 'signup' ? 'Sign Up' : 'Log In';

  const cardContent = (
    <div style={{ width: 'min(460px, 100%)' }}>
      <style>
        {`
          .auth-embed-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.25);
            font-family: "Poppins", "Segoe UI", sans-serif;
          }
          .auth-embed-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
          }
          .auth-embed-title {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.01em;
          }
          .auth-embed-subtitle {
            font-size: 13px;
            color: #64748b;
            margin-top: 4px;
          }
          .auth-embed-close {
            border: none;
            background: transparent;
            color: #94a3b8;
            font-size: 14px;
            cursor: pointer;
          }
          .auth-embed-tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            padding: 5px;
            margin-top: 16px;
            border-radius: 999px;
            background: #e2e8f0;
          }
          .auth-embed-tab {
            border: none;
            background: transparent;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 700;
            color: #64748b;
            padding: 8px 10px;
            cursor: pointer;
          }
          .auth-embed-tab[data-active="true"] {
            background: #ffffff;
            color: #0f172a;
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
          }
          .auth-embed-alert {
            margin-top: 12px;
            border-radius: 12px;
            border: 1px solid #fed7aa;
            background: #fff7ed;
            padding: 10px 12px;
            font-size: 12px;
            color: #9a3412;
          }
          .auth-embed-form {
            display: grid;
            gap: 12px;
            margin-top: 16px;
          }
          .auth-embed-field {
            display: grid;
            gap: 6px;
          }
          .auth-embed-label {
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #94a3b8;
            font-weight: 600;
          }
          .auth-embed-input-wrap {
            position: relative;
            display: block;
          }
          .auth-embed-input {
            width: 100%;
            height: 44px;
            border-radius: 12px;
            border: 1px solid #cbd5f5;
            background: #ffffff;
            padding: 0 12px 0 38px;
            font-size: 14px;
            color: #0f172a;
            box-sizing: border-box;
          }
          .auth-embed-input--with-toggle {
            padding-right: 44px;
          }
          .auth-embed-input:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
          }
          .auth-embed-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
          }
          .auth-embed-toggle {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            border: none;
            background: transparent;
            color: #64748b;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            padding: 4px;
          }
          .auth-embed-toggle:focus-visible {
            outline: 2px solid rgba(79, 70, 229, 0.6);
            outline-offset: 2px;
            border-radius: 6px;
          }
          .auth-embed-actions {
            display: grid;
            gap: 10px;
            margin-top: 4px;
          }
          .auth-embed-primary {
            height: 44px;
            border-radius: 999px;
            border: none;
            background: #4f46e5;
            color: #ffffff;
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 0.04em;
            cursor: pointer;
          }
          .auth-embed-primary:hover {
            background: #4338ca;
          }
          .auth-embed-primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .auth-embed-footer {
            margin-top: 14px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
          }
          .auth-embed-footer button {
            background: none;
            border: none;
            color: #4f46e5;
            font-weight: 700;
            cursor: pointer;
            padding: 0;
          }
          @media (max-width: 520px) {
            .auth-embed-card {
              padding: 20px;
            }
          }
        `}
      </style>
      <div className="auth-embed-card">
        <div className="auth-embed-head">
          <div>
            <div className="auth-embed-title">{tab === 'signup' ? 'Create your account' : 'Welcome back'}</div>
            <div className="auth-embed-subtitle">{embedded ? embeddedSubtitle : subtitle}</div>
          </div>
          {showClose && (
            <button onClick={onClose} className="auth-embed-close" aria-label="Close">
              X
            </button>
          )}
        </div>

        <div className="auth-embed-tabs" role="tablist" aria-label="Authentication options">
          <button
            type="button"
            className="auth-embed-tab"
            data-active={tab === 'signup'}
            onClick={() => switchTab('signup')}
          >
            Sign up
          </button>
          <button
            type="button"
            className="auth-embed-tab"
            data-active={tab === 'login'}
            onClick={() => switchTab('login')}
          >
            Log in
          </button>
        </div>

        {emailNotVerified && <div className="auth-embed-alert">Confirm your email.</div>}

        <form className="auth-embed-form" onSubmit={onEmailSubmit}>
          {tab === 'signup' && (
            <label className="auth-embed-field">
              <span className="auth-embed-label">Name</span>
              <span className="auth-embed-input-wrap">
                <User className="auth-embed-icon" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  autoComplete="name"
                  className="auth-embed-input"
                />
              </span>
            </label>
          )}

          <label className="auth-embed-field">
            <span className="auth-embed-label">Email address</span>
            <span className="auth-embed-input-wrap">
              <Mail className="auth-embed-icon" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                autoComplete="email"
                className="auth-embed-input"
              />
            </span>
          </label>

          <label className="auth-embed-field">
            <span className="auth-embed-label">Password</span>
            <span className="auth-embed-input-wrap">
              <Lock className="auth-embed-icon" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                className="auth-embed-input auth-embed-input--with-toggle"
              />
              <button
                type="button"
                className="auth-embed-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {'\u{1F441}'}
              </button>
            </span>
          </label>

          {tab === 'signup' && (
            <label className="auth-embed-field">
              <span className="auth-embed-label">Confirm password</span>
              <span className="auth-embed-input-wrap">
                <Lock className="auth-embed-icon" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="auth-embed-input"
                />
              </span>
            </label>
          )}

          <div className="auth-embed-actions">
            <button type="submit" disabled={submitting} className="auth-embed-primary">
              {submitting ? 'Please wait...' : cta}
            </button>
          </div>
        </form>

        <div className="auth-embed-footer">
          {tab === 'signup' ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchTab('login')}>
                Log in
              </button>
            </>
          ) : (
            <>
              New here?{' '}
              <button type="button" onClick={() => switchTab('signup')}>
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return cardContent;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {cardContent}
    </div>
  );
}
