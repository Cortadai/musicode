import { useTheme } from '../../themes';
import { palettes } from '../../themes';
import type { PaletteName } from '../../themes';

const darkPalettes: PaletteName[] = ['zinc', 'indigo', 'crimson', 'emerald', 'amber', 'cyan'];
const lightPalettes: PaletteName[] = ['daylight', 'sunrise', 'frost'];

function Swatch({ name, active, onClick }: { name: PaletteName; active: boolean; onClick: () => void }) {
  const palette = palettes[name];
  return (
    <button
      onClick={onClick}
      title={palette.label}
      className="flex flex-col items-center gap-1.5 transition-all duration-150"
    >
      <div
        className="w-6 h-6 rounded-full border-2 transition-all duration-150"
        style={{
          backgroundColor: palette.swatch || palette.tokens.accentPrimary,
          borderColor: active ? 'var(--mc-text-primary)' : 'transparent',
          boxShadow: active ? `0 0 0 2px ${(palette.swatch || palette.tokens.accentPrimary)}40` : 'none',
          transform: active ? 'scale(1.15)' : 'scale(1)',
        }}
      />
      <span
        className="text-[10px] font-medium leading-none"
        style={{ color: active ? 'var(--mc-text-primary)' : 'var(--mc-text-muted)' }}
      >
        {palette.label}
      </span>
    </button>
  );
}

export default function PaletteSelector() {
  const { paletteName, setPalette } = useTheme();

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wider mr-1" style={{ color: 'var(--mc-text-muted)' }}>Dark</span>
        <div className="flex gap-3">
          {darkPalettes.map(name => (
            <Swatch key={name} name={name} active={name === paletteName} onClick={() => setPalette(name)} />
          ))}
        </div>
      </div>
      <div className="w-px h-8 shrink-0" style={{ backgroundColor: 'var(--mc-border-subtle)' }} />
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wider mr-1" style={{ color: 'var(--mc-text-muted)' }}>Light</span>
        <div className="flex gap-3">
          {lightPalettes.map(name => (
            <Swatch key={name} name={name} active={name === paletteName} onClick={() => setPalette(name)} />
          ))}
        </div>
      </div>
    </div>
  );
}
