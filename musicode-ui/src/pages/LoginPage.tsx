import { useState, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useParticlesEnabled } from '../hooks/useParticles';
import { Music, Loader2 } from 'lucide-react';
const ParticlesBackground = lazy(() => import('../components/layout/ParticlesBackground'));
const LoginTransition = lazy(() => import('../components/auth/LoginTransition'));

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const particles = useParticlesEnabled();
  const btnRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(username, password);
      setTransitioning(true);
    } catch {
      setError('Invalid username or password');
      setSubmitting(false);
    }
  }

  function handleTransitionComplete() {
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--mc-bg-base)' }}>
      {particles && <Suspense><ParticlesBackground /></Suspense>}

      <div className="w-full max-w-sm p-8 relative z-[1]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music className="w-8 h-8" style={{ color: 'var(--mc-accent-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mc-text-primary)' }}>Musicode</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: 'var(--mc-text-secondary)' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              disabled={submitting}
              className="w-full px-4 py-2.5 text-sm mc-input"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--mc-text-secondary)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={submitting}
              className="w-full px-4 py-2.5 text-sm mc-input"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--mc-text-error)' }}>{error}</p>
          )}

          <button
            ref={btnRef}
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 mc-btn-primary text-sm font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>

      {transitioning && (
        <Suspense>
          <LoginTransition
            active={transitioning}
            originRef={btnRef}
            onComplete={handleTransitionComplete}
          />
        </Suspense>
      )}
    </div>
  );
}
