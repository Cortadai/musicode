import { render, screen, fireEvent } from '@testing-library/react';
import EqPopover from './EqPopover';

vi.mock('../../audio/eqProcessor', () => ({
  default: {
    setAllGains: vi.fn(),
    setEnabled: vi.fn(),
    setGain: vi.fn(),
    applyPreset: vi.fn(),
    getPreset: vi.fn(() => 'flat'),
    BAND_DEFS: [
      { frequency: 60, label: '60' },
      { frequency: 230, label: '230' },
      { frequency: 910, label: '910' },
      { frequency: 3600, label: '3.6k' },
      { frequency: 14000, label: '14k' },
    ],
  },
  EQ_PRESETS: [
    { name: 'flat', label: 'Flat', gains: [0, 0, 0, 0, 0] },
    { name: 'bass-boost', label: 'Bass Boost', gains: [6, 4, 0, 0, 0] },
    { name: 'rock', label: 'Rock', gains: [4, 2, -1, 3, 5] },
  ],
  GAIN_MIN: -12,
  GAIN_MAX: 12,
}));

vi.mock('../../audio/audioPreferences', () => ({
  loadPreferences: vi.fn(() => ({
    eqEnabled: false,
    eqBands: [0, 0, 0, 0, 0],
    eqPreset: 'flat',
  })),
  savePreferences: vi.fn(),
}));

import eqProcessor from '../../audio/eqProcessor';
import { savePreferences } from '../../audio/audioPreferences';

describe('EqPopover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button with EQ label', () => {
    render(<EqPopover />);
    expect(screen.getByRole('button', { name: /equalizer: off/i })).toBeInTheDocument();
  });

  it('opens dialog on click', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('dialog', { name: /equalizer settings/i })).toBeInTheDocument();
  });

  it('sets aria-expanded on trigger', () => {
    render(<EqPopover />);
    const trigger = screen.getByRole('button', { name: /equalizer/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders EQ toggle switch', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles EQ on and calls eqProcessor.setEnabled', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    fireEvent.click(screen.getByRole('switch'));
    expect(eqProcessor.setEnabled).toHaveBeenCalledWith(true);
    expect(savePreferences).toHaveBeenCalledWith({ eqEnabled: true });
  });

  it('renders 5 band sliders', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(5);
  });

  it('band sliders have labels with frequency', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('slider', { name: /60 band/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /3\.6k band/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /14k band/i })).toBeInTheDocument();
  });

  it('changes band gain and calls eqProcessor + savePreferences', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    const slider60 = screen.getByRole('slider', { name: /60 band/i });
    fireEvent.change(slider60, { target: { value: '6' } });
    expect(eqProcessor.setGain).toHaveBeenCalledWith(0, 6);
    expect(savePreferences).toHaveBeenCalled();
  });

  it('renders preset selector', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('combobox', { name: /eq preset/i })).toBeInTheDocument();
  });

  it('changes preset and calls eqProcessor.applyPreset', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    const select = screen.getByRole('combobox', { name: /eq preset/i });
    fireEvent.change(select, { target: { value: 'rock' } });
    expect(eqProcessor.applyPreset).toHaveBeenCalledWith('rock');
    expect(savePreferences).toHaveBeenCalled();
  });

  it('closes on Escape key', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on click outside', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has aria-haspopup on trigger', () => {
    render(<EqPopover />);
    expect(screen.getByRole('button', { name: /equalizer/i })).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
