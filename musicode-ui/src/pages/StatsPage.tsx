import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopArtists, getTopAlbums, getTopTracks, getSummary, getHistory } from '../api/stats';
import type { Period } from '../api/stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Music, Disc3, Users, Clock, TrendingUp } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';
import { useTheme } from '../themes/useTheme';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all', label: 'All Time' },
];

function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s`;
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export default function StatsPage() {
  const { theme } = useTheme();
  const t = theme.tokens;
  const [period, setPeriod] = useState<Period>('month');

  const summary = useQuery({
    queryKey: ['stats', 'summary', period],
    queryFn: () => getSummary(period),
  });

  const topArtists = useQuery({
    queryKey: ['stats', 'top-artists', period],
    queryFn: () => getTopArtists(period, 10),
  });

  const topAlbums = useQuery({
    queryKey: ['stats', 'top-albums', period],
    queryFn: () => getTopAlbums(period, 10),
  });

  const topTracks = useQuery({
    queryKey: ['stats', 'top-tracks', period],
    queryFn: () => getTopTracks(period, 10),
  });

  const history = useQuery({
    queryKey: ['stats', 'history', period],
    queryFn: () => getHistory(period),
  });

  const isLoading = summary.isLoading;
  const error = summary.error || topArtists.error;

  if (isLoading) return <Spinner text="Loading stats…" />;
  if (error) return <ErrorMessage message="Failed to load stats" detail={getErrorMessage(error)} onRetry={() => summary.refetch()} />;

  const s = summary.data;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--mc-accent-primary)' }} />
          Stats
        </h2>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                period === value
                  ? 'mc-btn-primary'
                  : 'mc-interactive-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      {s && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <SummaryCard icon={Music} label="Total Plays" value={s.totalPlays.toLocaleString()} />
          <SummaryCard icon={Clock} label="Listening Time" value={formatDuration(s.totalListeningSec)} />
          <SummaryCard icon={Users} label="Artists" value={s.uniqueArtists.toLocaleString()} />
          <SummaryCard icon={Disc3} label="Albums" value={s.uniqueAlbums.toLocaleString()} />
        </div>
      )}

      {/* Daily plays chart */}
      {history.data && history.data.length > 0 && (
        <div className="rounded-xl p-4 mb-8" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--mc-text-primary)' }}>Plays per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={history.data.map(d => ({ ...d, date: d.date.substring(5) }))}>
              <XAxis dataKey="date" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: t.bgSurface, border: `1px solid ${t.borderDefault}`, borderRadius: '8px' }}
                labelStyle={{ color: t.textSecondary }}
                itemStyle={{ color: t.accentPrimary }}
              />
              <Bar dataKey="count" fill={t.accentPrimaryHover} radius={[4, 4, 0, 0]} name="Plays" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top lists grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopList title="Top Artists" icon={Users} items={topArtists.data} nameKey="name" />
        <TopList title="Top Albums" icon={Disc3} items={topAlbums.data} nameKey="title" subKey="artistName" />
        <TopList title="Top Tracks" icon={Music} items={topTracks.data} nameKey="title" subKey="artistName" />
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color: 'var(--mc-accent-primary)' }} />
        <span className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--mc-text-primary)' }}>{value}</p>
    </div>
  );
}

interface TopListProps<T extends { playCount: number }> {
  title: string;
  icon: React.ElementType;
  items?: T[];
  nameKey: keyof T & string;
  subKey?: keyof T & string;
}

function TopList<T extends { playCount: number }>({ title, icon: Icon, items, nameKey, subKey }: TopListProps<T>) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--mc-text-primary)' }}>
          <Icon className="w-4 h-4" style={{ color: 'var(--mc-accent-primary)' }} /> {title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>No data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--mc-text-primary)' }}>
        <Icon className="w-4 h-4" style={{ color: 'var(--mc-accent-primary)' }} /> {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs w-5 text-right tabular-nums" style={{ color: 'var(--mc-text-muted)' }}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: 'var(--mc-text-primary)' }}>{String(item[nameKey])}</p>
              {subKey && item[subKey] && (
                <p className="text-xs truncate" style={{ color: 'var(--mc-text-muted)' }}>{String(item[subKey])}</p>
              )}
            </div>
            <span className="text-xs tabular-nums" style={{ color: 'var(--mc-accent-primary)' }}>{item.playCount} plays</span>
          </div>
        ))}
      </div>
    </div>
  );
}
