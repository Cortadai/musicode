import { render, screen, fireEvent } from '@testing-library/react';

// jsdom doesn't have ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

import EqPopover from './EqPopover';

vi.mock('../../audio/eqProcessor', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../audio/eqProcessor')>();
  return {
    ...actual,
    default: {
      setBands: vi.fn(),
      setPreamp: vi.fn(),
      setEnabled: vi.fn(),
      updateBand: vi.fn(),
      applyPreset: vi.fn(),
      addBand: vi.fn(() => null),
      removeBand: vi.fn(() => false),
      getBands: vi.fn(() => [
        { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 0, Q: 0.707 },
        { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 0, Q: 1.0 },
        { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 0, Q: 1.0 },
        { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 0, Q: 1.0 },
        { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 0, Q: 0.707 },
      ]),
      getPreset: vi.fn(() => 'flat'),
      getPreamp: vi.fn(() => 0),
      getBandCount: vi.fn(() => 5),
    },
    EQ_PRESETS: [
      {
        name: 'flat', label: 'Flat', preamp: 0,
        bands: [
          { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 0, Q: 0.707 },
          { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 0, Q: 1.0 },
          { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 0, Q: 1.0 },
          { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 0, Q: 1.0 },
          { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 0, Q: 0.707 },
        ],
      },
      {
        name: 'rock', label: 'Rock', preamp: -1,
        bands: [
          { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 4,  Q: 0.707 },
          { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 2,  Q: 1.0 },
          { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: -1, Q: 1.0 },
          { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 3,  Q: 1.0 },
          { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 5,  Q: 0.707 },
        ],
      },
    ],
  };
});

vi.mock('../../audio/audioPreferences', () => ({
  loadPreferences: vi.fn(() => ({
    eqEnabled: false,
    eqBands: [
      { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 0, Q: 0.707 },
      { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 0, Q: 1.0 },
      { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 0, Q: 1.0 },
      { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 0, Q: 1.0 },
      { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 0, Q: 0.707 },
    ],
    eqPreamp: 0,
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

  it('renders 5 band sliders + preamp = 6 sliders total', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(6); // 5 bands + 1 preamp
  });

  it('band sliders have labels with frequency', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('slider', { name: /60 band gain/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /4k band gain/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /12k band gain/i })).toBeInTheDocument();
  });

  it('changes band gain and calls eqProcessor.updateBand + savePreferences', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    const slider60 = screen.getByRole('slider', { name: /60 band gain/i });
    fireEvent.change(slider60, { target: { value: '6' } });
    expect(eqProcessor.updateBand).toHaveBeenCalledWith(0, { gain: 6 });
    expect(savePreferences).toHaveBeenCalled();
  });

  it('renders preset selector', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('button', { name: /eq preset/i })).toBeInTheDocument();
  });

  it('changes preset and calls eqProcessor.applyPreset', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    const presetBtn = screen.getByRole('button', { name: /eq preset/i });
    fireEvent.click(presetBtn);
    const rockOption = screen.getByRole('option', { name: /rock/i });
    fireEvent.click(rockOption);
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

  it('renders preamp slider', () => {
    render(<EqPopover />);
    fireEvent.click(screen.getByRole('button', { name: /equalizer/i }));
    expect(screen.getByRole('slider', { name: /preamp/i })).toBeInTheDocument();
  });
});
