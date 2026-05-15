import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus, Minus, Save, Download, Upload, X } from 'lucide-react';
import audioGraph from '../../audio/audioGraph';
import eqProcessor, {
  EQ_PRESETS,
  GAIN_MIN,
  GAIN_MAX,
  MIN_BANDS,
  MAX_BANDS,
  freqLabel,
} from '../../audio/eqProcessor';
import type { EqBand, EqFilterType } from '../../audio/eqProcessor';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';
import {
  getCustomPresets,
  saveCustomPreset,
  deleteCustomPreset,
  exportPreset,
  importPreset,
  isReservedName,
} from '../../audio/eqPresetStorage';
import type { CustomPreset } from '../../audio/eqPresetStorage';
import EqFrequencyResponse from './EqFrequencyResponse';

const FILTER_TYPE_OPTIONS: { value: EqFilterType; label: string }[] = [
  { value: 'highpass', label: 'HP' },
  { value: 'lowshelf', label: 'LS' },
  { value: 'peaking', label: 'PK' },
  { value: 'highshelf', label: 'HS' },
  { value: 'lowpass', label: 'LP' },
];

function EqPresetDropdown({
  preset,
  customPresets,
  onSelect,
  onSelectCustom,
  onDeleteCustom,
}: {
  preset: string;
  customPresets: CustomPreset[];
  onSelect: (name: string) => void;
  onSelectCustom: (preset: CustomPreset) => void;
  onDeleteCustom: (name: string) => void;
}) {
  const [listOpen, setListOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const builtInOptions = EQ_PRESETS.map((p) => ({ value: p.name, label: p.label }));

  const currentLabel =
    builtInOptions.find((o) => o.value === preset)?.label
    ?? customPresets.find((p) => p.name === preset)?.name
    ?? (preset === 'custom' ? 'Custom' : preset);

  useEffect(() => {
    if (!listOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setListOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [listOpen]);

  useEffect(() => {
    if (!listOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setListOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [listOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setListOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={listOpen}
        aria-label="EQ preset"
        className="flex items-center justify-between gap-1 text-[11px] border rounded px-1.5 py-0.5 outline-none
          focus-visible:ring-1 w-[120px]"
        style={{
          backgroundColor: 'var(--mc-waveform-buffered)',
          color: 'var(--mc-text-primary)',
          borderColor: 'var(--mc-scrollbar-thumb-hover)',
          ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
        }}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>
      {listOpen && (
        <ul
          role="listbox"
          aria-label="EQ presets"
          className="absolute right-0 top-full mt-1 border rounded shadow-xl z-50 py-0.5 w-[140px]"
          style={{ backgroundColor: 'var(--mc-bg-surface-hover)', borderColor: 'var(--mc-waveform-buffered)' }}
        >
          {builtInOptions.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === preset}
              onClick={() => { onSelect(o.value); setListOpen(false); }}
              className="text-[11px] px-2 py-1 cursor-pointer transition-colors"
              style={o.value === preset
                ? { backgroundColor: 'var(--mc-accent-primary-hover)', color: 'var(--mc-text-primary)' }
                : { color: 'var(--mc-text-primary)' }}
            >
              {o.label}
            </li>
          ))}

          {customPresets.length > 0 && (
            <>
              <li
                className="mx-1.5 my-0.5"
                style={{ borderTop: '1px solid var(--mc-scrollbar-thumb)', height: 0 }}
                role="separator"
              />
              {customPresets.map((cp) => (
                <li
                  key={`custom-${cp.name}`}
                  role="option"
                  aria-selected={cp.name === preset}
                  onClick={() => { onSelectCustom(cp); setListOpen(false); }}
                  className="text-[11px] px-2 py-1 cursor-pointer transition-colors flex items-center justify-between group"
                  style={cp.name === preset
                    ? { backgroundColor: 'var(--mc-accent-primary-hover)', color: 'var(--mc-text-primary)' }
                    : { color: 'var(--mc-text-primary)' }}
                >
                  <span className="truncate">{cp.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteCustom(cp.name); setListOpen(false); }}
                    className="opacity-0 group-hover:opacity-70 hover:!opacity-100 transition-opacity ml-1 shrink-0"
                    aria-label={`Delete preset ${cp.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </>
          )}

          {preset === 'custom' && (
            <>
              <li
                className="mx-1.5 my-0.5"
                style={{ borderTop: '1px solid var(--mc-scrollbar-thumb)', height: 0 }}
                role="separator"
              />
              <li
                role="option"
                aria-selected
                className="text-[11px] px-2 py-1 italic"
                style={{ color: 'var(--mc-text-muted)' }}
              >
                Custom
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

function FilterTypeSelector({
  value,
  onChange,
  disabled,
}: {
  value: EqFilterType;
  onChange: (type: EqFilterType) => void;
  disabled: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as EqFilterType)}
      disabled={disabled}
      className="text-[9px] border rounded px-0.5 py-0 outline-none bg-transparent
        disabled:opacity-40 cursor-pointer"
      style={{
        color: 'var(--mc-text-muted)',
        borderColor: 'var(--mc-scrollbar-thumb)',
        width: '32px',
      }}
      aria-label="Filter type"
    >
      {FILTER_TYPE_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

interface EqPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EqPopover({ open, onOpenChange }: EqPopoverProps) {
  const [enabled, setEnabled] = useState(() => loadPreferences().eqEnabled);
  const [bands, setBands] = useState<EqBand[]>(() => loadPreferences().eqBands);
  const [preset, setPreset] = useState(() => loadPreferences().eqPreset);
  const [preamp, setPreampState] = useState(() => loadPreferences().eqPreamp);
  const [selectedBand, setSelectedBand] = useState<number | null>(null);
  const [curveSize, setCurveSize] = useState({ width: 0, height: 0 });
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>(() => getCustomPresets());
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState('');

  const dialogRef = useRef<HTMLDivElement>(null);
  const curveContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);

  const sampleRate = audioGraph.getAudioContext()?.sampleRate ?? 48000;

  // ResizeObserver for the curve container
  useEffect(() => {
    const el = curveContainerRef.current;
    if (!el || !open) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setCurveSize({
          width: Math.floor(entry.contentRect.width),
          height: Math.floor(entry.contentRect.height),
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Apply saved EQ state on mount
  useEffect(() => {
    eqProcessor.setBands(bands);
    eqProcessor.setPreamp(preamp);
    eqProcessor.setEnabled(enabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((updates: Parameters<typeof savePreferences>[0]) => {
    savePreferences(updates);
  }, []);

  const handleToggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    eqProcessor.setEnabled(next);
    persist({ eqEnabled: next });
  }, [enabled, persist]);

  const handleBandGainChange = useCallback(
    (bandIndex: number, value: number) => {
      eqProcessor.updateBand(bandIndex, { gain: value });
      const updated = eqProcessor.getBands();
      setBands(updated);
      const p = eqProcessor.getPreset();
      setPreset(p);
      persist({ eqBands: updated, eqPreset: p });
    },
    [persist],
  );

  const handleBandDrag = useCallback(
    (index: number, updates: Partial<EqBand>) => {
      eqProcessor.updateBand(index, updates);
      const updated = eqProcessor.getBands();
      setBands(updated);
      const p = eqProcessor.getPreset();
      setPreset(p);
      persist({ eqBands: updated, eqPreset: p });
    },
    [persist],
  );

  const handleBandTypeChange = useCallback(
    (index: number, type: EqFilterType) => {
      eqProcessor.updateBand(index, { type });
      const updated = eqProcessor.getBands();
      setBands(updated);
      const p = eqProcessor.getPreset();
      setPreset(p);
      persist({ eqBands: updated, eqPreset: p });
    },
    [persist],
  );

  const handlePreampChange = useCallback((value: number) => {
    eqProcessor.setPreamp(value);
    setPreampState(value);
    const p = eqProcessor.getPreset();
    setPreset(p);
    persist({ eqPreamp: value, eqPreset: p });
  }, [persist]);

  const handlePresetChange = useCallback((presetName: string) => {
    const p = EQ_PRESETS.find((x) => x.name === presetName);
    if (!p) return;
    eqProcessor.applyPreset(presetName);
    setPreset(presetName);
    setBands(eqProcessor.getBands());
    setPreampState(p.preamp);
    setSelectedBand(null);
    persist({ eqBands: eqProcessor.getBands(), eqPreamp: p.preamp, eqPreset: presetName });
  }, [persist]);

  const handleSelectCustomPreset = useCallback((cp: CustomPreset) => {
    eqProcessor.setBands(cp.bands.map((b) => ({ ...b })));
    eqProcessor.setPreamp(cp.preamp);
    setBands(eqProcessor.getBands());
    setPreampState(cp.preamp);
    setPreset(cp.name);
    setSelectedBand(null);
    persist({ eqBands: eqProcessor.getBands(), eqPreamp: cp.preamp, eqPreset: cp.name });
  }, [persist]);

  const handleSavePreset = useCallback(() => {
    const trimmed = saveName.trim();
    if (!trimmed || isReservedName(trimmed)) return;
    if (saveCustomPreset(trimmed, bands, preamp)) {
      setCustomPresets(getCustomPresets());
      setPreset(trimmed);
      persist({ eqPreset: trimmed });
      setSaving(false);
      setSaveName('');
    }
  }, [saveName, bands, preamp, persist]);

  const handleDeleteCustomPreset = useCallback((name: string) => {
    deleteCustomPreset(name);
    setCustomPresets(getCustomPresets());
    if (preset === name) {
      setPreset('custom');
      persist({ eqPreset: 'custom' });
    }
  }, [preset, persist]);

  const handleExport = useCallback(() => {
    const cp = customPresets.find((p) => p.name === preset);
    const data = cp
      ? exportPreset(cp)
      : exportPreset({ name: preset === 'custom' ? 'my-preset' : preset, bands, preamp });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eq-${(cp?.name ?? preset).replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [customPresets, preset, bands, preamp]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const imported = importPreset(text);
      if (!imported) return;
      if (saveCustomPreset(imported.name, imported.bands, imported.preamp)) {
        setCustomPresets(getCustomPresets());
        handleSelectCustomPreset(imported);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [handleSelectCustomPreset]);

  const handleAddBand = useCallback(() => {
    const newBand = eqProcessor.addBand();
    if (!newBand) return;
    const updated = eqProcessor.getBands();
    setBands(updated);
    setPreset('custom');
    setSelectedBand(updated.findIndex((b) => b.id === newBand.id));
    persist({ eqBands: updated, eqPreset: 'custom' });
  }, [persist]);

  const handleRemoveBand = useCallback((index: number) => {
    if (!eqProcessor.removeBand(index)) return;
    const updated = eqProcessor.getBands();
    setBands(updated);
    const p = eqProcessor.getPreset();
    setPreset(p);
    setSelectedBand(null);
    persist({ eqBands: updated, eqPreset: p });
  }, [persist]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onOpenChange]);

  // Escape key closes, focus management
  useEffect(() => {
    if (!open) return;
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [role="switch"], input, select',
    );
    firstFocusable?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
        <div
          ref={dialogRef}
          role="dialog"
          aria-label="Equalizer settings"
          className="absolute bottom-8 right-0 border rounded-lg p-3 shadow-xl z-50"
          style={{
            backgroundColor: 'var(--mc-bg-surface-hover)',
            borderColor: 'var(--mc-waveform-buffered)',
            width: '380px',
          }}
        >
          {/* Header: toggle + actions + preset selector */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--mc-text-secondary)' }} id="eq-toggle-label">Equalizer</span>
              <button
                onClick={handleToggle}
                role="switch"
                aria-checked={enabled}
                aria-labelledby="eq-toggle-label"
                className="w-8 h-4 rounded-full transition-colors relative
                  focus-visible:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: enabled ? 'var(--mc-accent-primary-hover)' : 'var(--mc-scrollbar-thumb-hover)',
                  ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
                }}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${enabled ? 'left-4' : 'left-0.5'}`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setSaving(true); setSaveName(''); setTimeout(() => saveInputRef.current?.focus(), 0); }}
                className="p-0.5 rounded transition-colors hover:opacity-80"
                style={{ color: 'var(--mc-text-muted)' }}
                aria-label="Save preset"
                title="Save preset"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExport}
                className="p-0.5 rounded transition-colors hover:opacity-80"
                style={{ color: 'var(--mc-text-muted)' }}
                aria-label="Export preset"
                title="Export preset"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-0.5 rounded transition-colors hover:opacity-80"
                style={{ color: 'var(--mc-text-muted)' }}
                aria-label="Import preset"
                title="Import preset"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <EqPresetDropdown
                preset={preset}
                customPresets={customPresets}
                onSelect={handlePresetChange}
                onSelectCustom={handleSelectCustomPreset}
                onDeleteCustom={handleDeleteCustomPreset}
              />
            </div>
          </div>

          {/* Save preset inline input */}
          {saving && (
            <div className="flex items-center gap-1 mb-2">
              <input
                ref={saveInputRef}
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePreset();
                  if (e.key === 'Escape') { setSaving(false); setSaveName(''); }
                }}
                placeholder="Preset name..."
                maxLength={30}
                className="flex-1 text-[11px] border rounded px-1.5 py-0.5 outline-none focus-visible:ring-1"
                style={{
                  backgroundColor: 'var(--mc-bg-primary)',
                  color: 'var(--mc-text-primary)',
                  borderColor: 'var(--mc-scrollbar-thumb-hover)',
                  ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
                }}
              />
              <button
                onClick={handleSavePreset}
                disabled={!saveName.trim() || isReservedName(saveName.trim())}
                className="text-[10px] px-2 py-0.5 rounded transition-colors disabled:opacity-30"
                style={{
                  backgroundColor: 'var(--mc-accent-primary)',
                  color: 'var(--mc-text-on-accent, #fff)',
                }}
              >
                Save
              </button>
              <button
                onClick={() => { setSaving(false); setSaveName(''); }}
                className="text-[10px] px-1 py-0.5 rounded transition-colors"
                style={{ color: 'var(--mc-text-muted)' }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Frequency response curve */}
          <div
            ref={curveContainerRef}
            className="w-full rounded overflow-hidden mb-2"
            style={{
              height: '140px',
              backgroundColor: 'var(--mc-bg-primary)',
              border: '1px solid var(--mc-scrollbar-thumb)',
            }}
          >
            <EqFrequencyResponse
              bands={bands}
              enabled={enabled}
              selectedBandIndex={selectedBand}
              onBandDrag={handleBandDrag}
              onBandSelect={setSelectedBand}
              sampleRate={sampleRate}
              width={curveSize.width}
              height={curveSize.height}
              showSpectrum={enabled}
            />
          </div>

          {/* Preamp slider */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] w-12 shrink-0" style={{ color: 'var(--mc-text-muted)' }}>Preamp</span>
            <div
              className="flex-1 relative h-4 flex items-center"
              style={{ opacity: enabled ? 1 : 0.4 }}
              onDoubleClick={() => { if (enabled) handlePreampChange(0); }}
              onMouseDown={(e) => {
                if (!enabled) return;
                const track = e.currentTarget;
                const update = (clientX: number) => {
                  const rect = track.getBoundingClientRect();
                  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                  const raw = -12 + ratio * 24;
                  handlePreampChange(Math.round(raw * 2) / 2);
                };
                update(e.clientX);
                const onMove = (ev: MouseEvent) => update(ev.clientX);
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
              role="slider"
              aria-label="Preamp"
              aria-valuemin={-12}
              aria-valuemax={12}
              aria-valuenow={preamp}
              aria-valuetext={`${preamp > 0 ? '+' : ''}${preamp} dB`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (!enabled) return;
                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  handlePreampChange(Math.min(12, preamp + 0.5));
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  handlePreampChange(Math.max(-12, preamp - 0.5));
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  handlePreampChange(-12);
                } else if (e.key === 'End') {
                  e.preventDefault();
                  handlePreampChange(12);
                }
              }}
            >
              {/* Track */}
              <div
                className="w-full h-[3px] rounded-full"
                style={{ backgroundColor: 'var(--mc-waveform-buffered)' }}
              />
              {/* Center tick */}
              <div
                className="absolute h-[7px] w-[1px]"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'var(--mc-text-muted)',
                  opacity: 0.4,
                }}
              />
              {/* Thumb */}
              <div
                className="absolute w-3 h-3 rounded-full shadow-sm"
                style={{
                  left: `${((preamp + 12) / 24) * 100}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'var(--mc-accent-primary)',
                  cursor: enabled ? 'grab' : 'default',
                }}
              />
            </div>
            <span className="text-[10px] tabular-nums w-8 text-right" style={{ color: 'var(--mc-text-muted)' }}>
              {preamp > 0 ? '+' : ''}{preamp}
            </span>
          </div>

          {/* Band sliders with type selectors */}
          <div className="flex items-end justify-between gap-0.5">
            {bands.map((band, i) => {
              const isSelected = selectedBand === i;
              return (
                <div
                  key={band.id}
                  className="flex flex-col items-center gap-0.5 flex-1 rounded px-0.5 py-1 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'var(--mc-waveform-buffered)' : 'transparent',
                  }}
                  onClick={() => setSelectedBand(i)}
                >
                  {/* Filter type */}
                  <FilterTypeSelector
                    value={band.type}
                    onChange={(type) => handleBandTypeChange(i, type)}
                    disabled={!enabled}
                  />

                  {/* Gain display */}
                  <span className="text-[9px] tabular-nums" style={{ color: 'var(--mc-text-muted)' }}>
                    {band.gain > 0 ? '+' : ''}{band.gain}
                  </span>

                  {/* Vertical gain slider */}
                  <input
                    type="range"
                    min={GAIN_MIN}
                    max={GAIN_MAX}
                    step={0.5}
                    value={band.gain}
                    onChange={(e) => handleBandGainChange(i, Number(e.target.value))}
                    disabled={!enabled}
                    aria-label={`${freqLabel(band.frequency)} band gain`}
                    aria-valuetext={`${band.gain > 0 ? '+' : ''}${band.gain} dB`}
                    className="eq-slider appearance-none cursor-pointer disabled:opacity-40
                      focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      writingMode: 'vertical-lr',
                      direction: 'rtl',
                      height: '70px',
                      width: '18px',
                      accentColor: 'var(--mc-accent-primary)',
                      ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
                    } as React.CSSProperties}
                  />

                  {/* Frequency label */}
                  <span className="text-[9px]" style={{ color: 'var(--mc-text-muted)' }}>
                    {freqLabel(band.frequency)}
                  </span>

                  {/* Remove button */}
                  {bands.length > MIN_BANDS && isSelected && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveBand(i); }}
                      className="text-[9px] rounded-full w-4 h-4 flex items-center justify-center
                        transition-colors hover:opacity-80"
                      style={{
                        color: 'var(--mc-text-muted)',
                        backgroundColor: 'var(--mc-scrollbar-thumb)',
                      }}
                      aria-label={`Remove ${freqLabel(band.frequency)} band`}
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add band button */}
            {bands.length < MAX_BANDS && (
              <div className="flex flex-col items-center justify-end pb-1">
                <button
                  onClick={handleAddBand}
                  disabled={!enabled}
                  className="w-5 h-5 rounded-full flex items-center justify-center
                    transition-colors hover:opacity-80 disabled:opacity-30"
                  style={{
                    color: 'var(--mc-text-muted)',
                    backgroundColor: 'var(--mc-scrollbar-thumb)',
                  }}
                  aria-label="Add EQ band"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
  );
}
