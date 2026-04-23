import { render, screen, fireEvent } from '@testing-library/react';
import TransportControls from './TransportControls';

describe('TransportControls', () => {
  const defaultProps = {
    isPlaying: false,
    shuffle: false,
    repeatMode: 'off' as const,
    hasNext: true,
    hasPrev: true,
    onPlayPause: vi.fn(),
    onNext: vi.fn(),
    onPrev: vi.fn(),
    onToggleShuffle: vi.fn(),
    onToggleRepeat: vi.fn(),
  };

  beforeEach(() => {
    Object.values(defaultProps).forEach((v) => {
      if (typeof v === 'function') (v as ReturnType<typeof vi.fn>).mockClear();
    });
  });

  it('renders all 5 transport buttons', () => {
    render(<TransportControls {...defaultProps} />);
    expect(screen.getByRole('button', { name: /shuffle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous track/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^play$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next track/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /repeat/i })).toBeInTheDocument();
  });

  it('shows Pause label when playing', () => {
    render(<TransportControls {...defaultProps} isPlaying={true} />);
    expect(screen.getByRole('button', { name: /^pause$/i })).toBeInTheDocument();
  });

  it('calls onPlayPause when play/pause clicked', () => {
    render(<TransportControls {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /^play$/i }));
    expect(defaultProps.onPlayPause).toHaveBeenCalledTimes(1);
  });

  it('calls onNext and onPrev', () => {
    render(<TransportControls {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /next track/i }));
    fireEvent.click(screen.getByRole('button', { name: /previous track/i }));
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
  });

  it('disables next/prev when hasNext/hasPrev is false', () => {
    render(<TransportControls {...defaultProps} hasNext={false} hasPrev={false} />);
    expect(screen.getByRole('button', { name: /next track/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous track/i })).toBeDisabled();
  });

  it('sets aria-pressed on shuffle when active', () => {
    render(<TransportControls {...defaultProps} shuffle={true} />);
    expect(screen.getByRole('button', { name: /shuffle/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets aria-pressed on repeat when active', () => {
    render(<TransportControls {...defaultProps} repeatMode="all" />);
    expect(screen.getByRole('button', { name: /repeat/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows repeat mode in label', () => {
    render(<TransportControls {...defaultProps} repeatMode="one" />);
    expect(screen.getByRole('button', { name: /repeat: one/i })).toBeInTheDocument();
  });

  it('wraps buttons in a group with aria-label', () => {
    render(<TransportControls {...defaultProps} />);
    expect(screen.getByRole('group', { name: /playback controls/i })).toBeInTheDocument();
  });
});
