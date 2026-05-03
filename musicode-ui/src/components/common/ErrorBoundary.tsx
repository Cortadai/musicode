import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches runtime errors in the component tree
 * and shows a fallback UI instead of a white screen.
 *
 * WHY A CLASS COMPONENT: React error boundaries require componentDidCatch
 * and getDerivedStateFromError, which only exist on class components.
 * There's no hook equivalent as of React 19. This is the one place
 * where a class component is still necessary.
 *
 * Without this, a null reference in any component's render function
 * crashes the entire app with no recovery path.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--mc-bg-base)' }}>
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 mx-auto" style={{ color: 'var(--mc-text-error)' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--mc-text-primary)' }}>Something went wrong</h2>
            <p className="text-sm max-w-md" style={{ color: 'var(--mc-text-muted)' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-4 py-2 mc-btn-primary text-sm font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
