import { render, screen, fireEvent } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  const onSeek = vi.fn();

  beforeEach(() => {
    onSeek.mockClear();
  });

  it('renders current time and duration', () => {
    render(<ProgressBar currentTime={65} duration={200} onSeek={onSeek} />);
    expect(screen.getByText('1:05')).toBeInTheDocument();
    expect(screen.getByText('3:20')).toBeInTheDocument();
  });

  it('renders dash for zero duration', () => {
    render(<ProgressBar currentTime={0} duration={0} onSeek={onSeek} />);
    const dashes = screen.getAllByText('—');
    expect(dashes).toHaveLength(2);
  });

  it('sets slider value as percentage of progress', () => {
    render(<ProgressBar currentTime={50} duration={200} onSeek={onSeek} />);
    const slider = screen.getByRole('slider', { name: /seek position/i });
    expect(slider).toHaveValue('25');
  });

  it('calls onSeek with time in seconds when slider changes', () => {
    render(<ProgressBar currentTime={0} duration={200} onSeek={onSeek} />);
    const slider = screen.getByRole('slider', { name: /seek position/i });
    fireEvent.change(slider, { target: { value: '50' } });
    expect(onSeek).toHaveBeenCalledWith(100);
  });

  it('does not seek when duration is zero', () => {
    render(<ProgressBar currentTime={0} duration={0} onSeek={onSeek} />);
    const slider = screen.getByRole('slider', { name: /seek position/i });
    fireEvent.change(slider, { target: { value: '50' } });
    expect(onSeek).not.toHaveBeenCalled();
  });

  it('has accessible valuetext', () => {
    render(<ProgressBar currentTime={65} duration={200} onSeek={onSeek} />);
    const slider = screen.getByRole('slider', { name: /seek position/i });
    expect(slider).toHaveAttribute('aria-valuetext', '1:05 of 3:20');
  });
});
