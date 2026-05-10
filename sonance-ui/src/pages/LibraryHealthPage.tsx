import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getHealthSummary,
  getHealthIssues,
  ISSUE_LABELS,
  ISSUE_SEVERITY,
  type HealthIssueType,
} from '../api/health';
import { HeartPulse, AlertTriangle, AlertCircle, Info, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';

const SEVERITY_ORDER: HealthIssueType[] = [
  'MISSING_ARTIST',
  'MISSING_TITLE',
  'MISSING_ALBUM',
  'MISSING_COVER_ART',
  'MISSING_TRACK_NUMBER',
  'MISSING_YEAR',
  'MISSING_GENRE',
];

const SEVERITY_STYLES: Record<string, { colorVar: string; icon: typeof AlertTriangle }> = {
  high: { colorVar: 'var(--mc-text-error)', icon: AlertTriangle },
  medium: { colorVar: 'var(--mc-text-warning)', icon: AlertCircle },
  low: { colorVar: 'var(--mc-text-info)', icon: Info },
};

export default function LibraryHealthPage() {
  const [selectedType, setSelectedType] = useState<HealthIssueType | null>(null);
  const [page, setPage] = useState(0);

  const summary = useQuery({
    queryKey: ['health', 'summary'],
    queryFn: getHealthSummary,
  });

  const issues = useQuery({
    queryKey: ['health', 'issues', selectedType, page],
    queryFn: () => getHealthIssues(selectedType!, page),
    enabled: selectedType !== null,
  });

  if (summary.isLoading) return <Spinner text="Analyzing library health…" />;
  if (summary.error) return <ErrorMessage message="Failed to load health data" detail={getErrorMessage(summary.error)} onRetry={() => summary.refetch()} />;

  const s = summary.data!;
  const issueTypes = SEVERITY_ORDER.filter(t => (s.issueCounts[t] ?? 0) > 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <HeartPulse className="w-5 h-5" style={{ color: 'var(--mc-accent-primary)' }} />
        <h2 className="text-xl font-semibold">Library Health</h2>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--mc-text-muted)' }}>Tracks</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--mc-text-primary)' }}>{s.totalTracks.toLocaleString()}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--mc-text-muted)' }}>Albums</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--mc-text-primary)' }}>{s.totalAlbums.toLocaleString()}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--mc-text-muted)' }}>Issues Found</p>
          <p className="text-2xl font-bold" style={{ color: s.totalIssues > 0 ? 'var(--mc-text-warning)' : 'var(--mc-text-success)' }}>
            {s.totalIssues.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Clean library state */}
      {s.totalIssues === 0 && (
        <div className="flex items-center gap-3 p-6 rounded-xl border" style={{ backgroundColor: 'color-mix(in srgb, var(--mc-text-success) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--mc-text-success) 20%, transparent)' }}>
          <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: 'var(--mc-text-success)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--mc-text-success)' }}>Your library metadata looks good!</p>
            <p className="text-xs mt-1" style={{ color: 'var(--mc-text-muted)' }}>All tracks have the essential metadata fields populated.</p>
          </div>
        </div>
      )}

      {/* Issue cards */}
      {issueTypes.length > 0 && (
        <div className="space-y-2 mb-6">
          {issueTypes.map(type => {
            const count = s.issueCounts[type] ?? 0;
            const severity = ISSUE_SEVERITY[type];
            const styles = SEVERITY_STYLES[severity];
            const Icon = styles.icon;
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => { setSelectedType(isSelected ? null : type); setPage(0); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left"
                style={isSelected
                  ? { backgroundColor: `color-mix(in srgb, ${styles.colorVar} 8%, transparent)`, borderColor: `color-mix(in srgb, ${styles.colorVar} 20%, transparent)` }
                  : { backgroundColor: 'var(--mc-bg-surface)', borderColor: 'var(--mc-border-default)' }
                }
              >
                <Icon className="w-4 h-4 shrink-0" style={{ color: styles.colorVar }} />
                <span className="text-sm flex-1" style={{ color: 'var(--mc-text-primary)' }}>{ISSUE_LABELS[type]}</span>
                <span className="text-sm font-medium tabular-nums" style={{ color: styles.colorVar }}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Issue detail table */}
      {selectedType && (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--mc-border-default)' }}>
            <h3 className="text-sm font-medium" style={{ color: 'var(--mc-text-secondary)' }}>
              {ISSUE_LABELS[selectedType]}
              {issues.data && (
                <span className="ml-2" style={{ color: 'var(--mc-text-muted)' }}>
                  ({issues.data.totalElements} total)
                </span>
              )}
            </h3>
          </div>

          {issues.isLoading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : issues.error ? (
            <div className="p-4">
              <ErrorMessage message="Failed to load issues" detail={getErrorMessage(issues.error)} onRetry={() => issues.refetch()} />
            </div>
          ) : issues.data && issues.data.content.length > 0 ? (
            <>
              <div>
                {issues.data.content.map((issue, i) => (
                  <div key={`${issue.entityId}-${i}`} className="px-4 py-3" style={{ borderBottom: '1px solid var(--mc-border-default)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>{issue.entityName}</span>
                    </div>
                    {issue.detail && (
                      <p className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>{issue.detail}</p>
                    )}
                    <p className="text-xs mt-1 font-mono truncate" style={{ color: 'var(--mc-text-muted)', opacity: 0.6 }}>{issue.filePath}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {issues.data.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid var(--mc-border-default)' }}>
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={issues.data.first}
                    className="flex items-center gap-1 text-xs mc-interactive-muted transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3 h-3" /> Previous
                  </button>
                  <span className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>
                    Page {issues.data.number + 1} of {issues.data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={issues.data.last}
                    className="flex items-center gap-1 text-xs mc-interactive-muted transition-colors disabled:opacity-30"
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="p-4 text-sm" style={{ color: 'var(--mc-text-muted)' }}>No issues found.</p>
          )}
        </div>
      )}

      {/* Picard hint */}
      {s.totalIssues > 0 && (
        <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: 'var(--mc-bg-surface)', borderColor: 'var(--mc-border-default)' }}>
          <p className="text-xs" style={{ color: 'var(--mc-text-secondary)' }}>
            Use <span className="font-medium" style={{ color: 'var(--mc-text-primary)' }}>MusicBrainz Picard</span> to fix metadata issues, then re-scan your library in Settings.
          </p>
        </div>
      )}
    </div>
  );
}
