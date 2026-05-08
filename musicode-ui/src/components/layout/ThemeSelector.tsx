import { useTheme } from '../../themes';
import type { ThemeName } from '../../themes';

const options: { name: ThemeName; label: string }[] = [
  { name: 'evolved', label: 'Evolved' },
  { name: 'nova', label: 'Nova' },
  { name: 'minimal', label: 'Minimal' },
];

export default function ThemeSelector() {
  const { themeName, setTheme } = useTheme();

  return (
    <div
      className="flex rounded-lg p-0.5 gap-0.5"
      style={{ backgroundColor: 'var(--mc-bg-surface)' }}
    >
      {options.map(({ name, label }) => {
        const active = name === themeName;
        return (
          <button
            key={name}
            onClick={() => setTheme(name)}
            className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-150"
            style={{
              backgroundColor: active ? 'var(--mc-accent-primary)' : 'transparent',
              color: active ? 'var(--mc-text-inverse)' : 'var(--mc-text-muted)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
