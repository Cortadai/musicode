import { render, screen, fireEvent } from '@testing-library/react';
import VolumeControl from './VolumeControl';

describe('VolumeControl', () => {
  const onVolumeChange = vi.fn();

  beforeEach(() => {
    onVolumeChange.mockClear();
  });

  it('renders mute button', () => {
    render(<VolumeControl volume={0.8} onVolumeChange={onVolumeChange} />);
    expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
  });

  it('shows volume slider always visible', () => {
    render(<VolumeControl volume={0.8} onVolumeChange={onVolumeChange} />);
    expect(screen.getByRole('slider', { name: /volume/i })).toBeInTheDocument();
  });

  it('mutes to 0 when clicking mute button', () => {
    render(<VolumeControl volume={0.8} onVolumeChange={onVolumeChange} />);
    fireEvent.click(screen.getByRole('button', { name: /mute/i }));
    expect(onVolumeChange).toHaveBeenCalledWith(0);
  });

  it('unmutes to 0.8 when clicking unmute button at volume 0', () => {
    render(<VolumeControl volume={0} onVolumeChange={onVolumeChange} />);
    fireEvent.click(screen.getByRole('button', { name: /unmute/i }));
    expect(onVolumeChange).toHaveBeenCalledWith(0.8);
  });

  it('shows Unmute label when volume is 0', () => {
    render(<VolumeControl volume={0} onVolumeChange={onVolumeChange} />);
    expect(screen.getByRole('button', { name: /unmute/i })).toBeInTheDocument();
  });

  it('slider has accessible valuetext with percentage', () => {
    render(<VolumeControl volume={0.75} onVolumeChange={onVolumeChange} />);
    const slider = screen.getByRole('slider', { name: /volume/i });
    expect(slider).toHaveAttribute('aria-valuetext', '75%');
  });
});
