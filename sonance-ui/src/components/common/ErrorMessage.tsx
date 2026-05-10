import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  message: string;
  detail?: string;
  onRetry?: () => void;
}

/**
 * Reusable error display component.
 * Replaces the scattered `<p className="text-red-400">...</p>` pattern across pages.
 */
export default function ErrorMessage({ message, detail, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <AlertTriangle className="w-10 h-10" style={{ color: 'var(--mc-text-error)' }} />
      <p className="font-medium" style={{ color: 'var(--mc-text-primary)' }}>{message}</p>
      {detail && (
        <p className="text-sm max-w-md" style={{ color: 'var(--mc-text-muted)' }}>{detail}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mt-2 px-4 py-2 text-sm rounded-lg transition-colors mc-nav-item"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
