import { memo, useCallback } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  active: boolean;
  onClick: () => void;
  size?: number;
}

export default memo(function HeartButton({ active, onClick, size = 16 }: Props) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick();
    },
    [onClick]
  );

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      className="shrink-0 transition-all duration-150 hover:scale-110 active:scale-95"
      style={{
        color: active ? 'var(--mc-accent-primary)' : 'var(--mc-text-muted)',
        opacity: active ? 1 : 0.6,
      }}
    >
      <Heart
        style={{ width: size, height: size }}
        fill={active ? 'currentColor' : 'none'}
        strokeWidth={active ? 0 : 2}
      />
    </button>
  );
});
