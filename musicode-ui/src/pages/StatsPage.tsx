import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopArtists, getTopAlbums, getTopTracks, getSummary, getHistory } from '../api/stats';
import type { Period } from '../api/stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Music, Disc3, Users, Clock, TrendingUp } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';

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
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Stats
        </h2>
        <div className="flex gap-1 bg-zinc-900 rounded-lg p-0.5">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                period === value
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
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
        <div className="bg-zinc-900 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Plays per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={history.data.map(d => ({ ...d, date: d.date.substring(5) }))}>
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                labelStyle={{ color: '#a1a1aa' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Plays" />
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
    <div className="bg-zinc-900 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-indigo-400" />
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
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
      <div className="bg-zinc-900 rounded-xl p-4">
        <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
          <Icon className="w-4 h-4 text-indigo-400" /> {title}
        </h3>
        <p className="text-xs text-zinc-500">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4">
      <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-indigo-400" /> {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-zinc-600 w-5 text-right tabular-nums">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-200 truncate">{String(item[nameKey])}</p>
              {subKey && item[subKey] && (
                <p className="text-xs text-zinc-500 truncate">{String(item[subKey])}</p>
              )}
            </div>
            <span className="text-xs text-indigo-400 tabular-nums">{item.playCount} plays</span>
          </div>
        ))}
      </div>
    </div>
  );
}
