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

const SEVERITY_STYLES = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: AlertTriangle },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: AlertCircle },
  low: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: Info },
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
        <HeartPulse className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-semibold">Library Health</h2>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Tracks</p>
          <p className="text-2xl font-bold text-zinc-100">{s.totalTracks.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Albums</p>
          <p className="text-2xl font-bold text-zinc-100">{s.totalAlbums.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Issues Found</p>
          <p className={`text-2xl font-bold ${s.totalIssues > 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {s.totalIssues.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Clean library state */}
      {s.totalIssues === 0 && (
        <div className="flex items-center gap-3 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
          <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-300">Your library metadata looks good!</p>
            <p className="text-xs text-zinc-500 mt-1">All tracks have the essential metadata fields populated.</p>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left ${
                  isSelected
                    ? `${styles.bg} ${styles.border}`
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${styles.text}`} />
                <span className="text-sm text-zinc-200 flex-1">{ISSUE_LABELS[type]}</span>
                <span className={`text-sm font-medium tabular-nums ${styles.text}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Issue detail table */}
      {selectedType && (
        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-300">
              {ISSUE_LABELS[selectedType]}
              {issues.data && (
                <span className="text-zinc-500 ml-2">
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
              <div className="divide-y divide-zinc-800">
                {issues.data.content.map((issue, i) => (
                  <div key={`${issue.entityId}-${i}`} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-zinc-200">{issue.entityName}</span>
                    </div>
                    {issue.detail && (
                      <p className="text-xs text-zinc-500">{issue.detail}</p>
                    )}
                    <p className="text-xs text-zinc-600 mt-1 font-mono truncate">{issue.filePath}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {issues.data.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={issues.data.first}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400"
                  >
                    <ChevronLeft className="w-3 h-3" /> Previous
                  </button>
                  <span className="text-xs text-zinc-500">
                    Page {issues.data.number + 1} of {issues.data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={issues.data.last}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400"
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="p-4 text-sm text-zinc-500">No issues found.</p>
          )}
        </div>
      )}

      {/* Picard hint */}
      {s.totalIssues > 0 && (
        <div className="mt-6 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-xs text-zinc-400">
            Use <span className="text-zinc-300 font-medium">MusicBrainz Picard</span> to fix metadata issues, then re-scan your library in Settings.
          </p>
        </div>
      )}
    </div>
  );
}
