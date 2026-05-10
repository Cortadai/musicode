import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router';

vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn(), user: null, isAdmin: false }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./hooks/useParticles', () => ({
  useParticlesEnabled: () => false,
}));

vi.mock('./hooks/useOnlineStatus', () => ({
  useOnlineStatus: () => false,
}));

import LoginPage from './pages/LoginPage';
import OfflineBanner from './components/common/OfflineBanner';

async function expectNoA11yCriticals(container: HTMLElement) {
  const results = await axe(container, {
    rules: { region: { enabled: false } },
  });
  const critical = results.violations.filter(
    (v: { impact?: string }) => v.impact === 'critical' || v.impact === 'serious'
  );
  if (critical.length > 0) {
    const summary = critical.map(
      (v: { id: string; impact?: string; description: string }) =>
        `[${v.impact}] ${v.id}: ${v.description}`
    );
    expect.fail(summary.join('\n'));
  }
}

describe('Accessibility audit', () => {
  it('LoginPage: no critical/serious violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    await expectNoA11yCriticals(container);
  });

  it('OfflineBanner: no critical/serious violations', async () => {
    const { container } = render(<OfflineBanner />);
    await expectNoA11yCriticals(container);
  });
});
