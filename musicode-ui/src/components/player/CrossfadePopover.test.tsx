import { render, screen, fireEvent } from '@testing-library/react';
import CrossfadePopover from './CrossfadePopover';

describe('CrossfadePopover', () => {
  const getCrossfadeDuration = vi.fn(() => 3);
  const setCrossfadeDuration = vi.fn();

  beforeEach(() => {
    getCrossfadeDuration.mockClear().mockReturnValue(3);
    setCrossfadeDuration.mockClear();
  });

  it('renders trigger button with crossfade label', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    expect(screen.getByRole('button', { name: /crossfade: 3s/i })).toBeInTheDocument();
  });

  it('shows Gapless label when duration is 0', () => {
    getCrossfadeDuration.mockReturnValue(0);
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    expect(screen.getByRole('button', { name: /crossfade: gapless/i })).toBeInTheDocument();
  });

  it('opens popover on click', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    fireEvent.click(screen.getByRole('button', { name: /crossfade/i }));
    expect(screen.getByRole('dialog', { name: /crossfade settings/i })).toBeInTheDocument();
  });

  it('sets aria-expanded on trigger', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    const trigger = screen.getByRole('button', { name: /crossfade/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls setCrossfadeDuration when slider changes', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    fireEvent.click(screen.getByRole('button', { name: /crossfade/i }));
    const slider = screen.getByRole('slider', { name: /crossfade duration/i });
    fireEvent.change(slider, { target: { value: '8' } });
    expect(setCrossfadeDuration).toHaveBeenCalledWith(8);
  });

  it('closes popover on Escape key', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    fireEvent.click(screen.getByRole('button', { name: /crossfade/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes popover on click outside', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    fireEvent.click(screen.getByRole('button', { name: /crossfade/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('toggles closed when trigger clicked again', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    const trigger = screen.getByRole('button', { name: /crossfade/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has aria-haspopup on trigger', () => {
    render(<CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />);
    expect(screen.getByRole('button', { name: /crossfade/i })).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
