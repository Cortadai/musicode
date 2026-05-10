import { render } from '@testing-library/react';
import EqMiniCurve from './EqMiniCurve';
import type { EqBand } from '../../audio/eqProcessor';

const band: EqBand = { id: 'b1', type: 'peaking', frequency: 1000, gain: 6, Q: 1.4 };

describe('EqMiniCurve', () => {
  it('renders nothing when disabled', () => {
    const { container } = render(<EqMiniCurve bands={[band]} enabled={false} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders a curve path when enabled with non-flat bands', () => {
    const { container } = render(<EqMiniCurve bands={[band]} enabled={true} />);
    expect(container.querySelector('path')).toBeTruthy();
    expect(container.querySelector('line')).toBeNull();
  });

  it('renders a flat line when enabled with no bands', () => {
    const { container } = render(<EqMiniCurve bands={[]} enabled={true} />);
    // No bands means all magnitudes are 0, which produces a straight line — still rendered as path
    const path = container.querySelector('path');
    expect(path).toBeTruthy();
  });

  it('is aria-hidden', () => {
    const { container } = render(<EqMiniCurve bands={[band]} enabled={true} />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('hides behind pointer-events-none', () => {
    const { container } = render(<EqMiniCurve bands={[band]} enabled={true} />);
    expect(container.querySelector('svg')?.classList.contains('pointer-events-none')).toBe(true);
  });
});
