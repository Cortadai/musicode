import { useState, useEffect, useCallback, useRef } from 'react';
import { getRecentActivity } from '../../api/activity';
import type { ActivityEvent } from '../../api/activity';
import { Music } from 'lucide-react';

/**
 * Real-time activity feed using Server-Sent Events.
 * Shows what users are listening to — updates live when anyone plays a track.
 * Falls back to polling /api/activity/recent on initial load.
 *
 * EventSource auto-reconnects on disconnect (browser-native behavior).
 */
export default function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load initial recent events
  useEffect(() => {
    getRecentActivity()
      .then((data) => { setEvents(data); setLoadError(false); })
      .catch(() => setLoadError(true));
  }, []);

  // SSE connection
  useEffect(() => {
    const es = new EventSource('/api/activity/stream');
    eventSourceRef.current = es;

    es.addEventListener('play', (e: MessageEvent) => {
      try {
        const event: ActivityEvent = JSON.parse(e.data);
        setEvents(prev => [event, ...prev].slice(0, 20));
      } catch {
        // Malformed event — skip
      }
    });

    es.onopen = () => setReconnecting(false);

    es.onerror = () => {
      setReconnecting(true);
      console.debug('[activity] SSE connection error — will auto-reconnect');
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, []);

  const formatTime = useCallback((ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    return date.toLocaleDateString();
  }, []);

  if (events.length === 0 && !loadError) {
    return null;
  }

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center gap-2 px-3 mb-2">
        <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--mc-text-muted)' }}>Activity</p>
        {reconnecting && (
          <span className="text-[10px]" style={{ color: 'var(--mc-text-warning)', opacity: 0.7 }}>reconnecting…</span>
        )}
      </div>
      {loadError && events.length === 0 && (
        <p className="text-xs px-3" style={{ color: 'var(--mc-text-muted)' }}>Could not load activity</p>
      )}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {events.slice(0, 5).map((event, i) => (
          <div key={`${event.timestamp}-${i}`} className="flex items-start gap-2 px-3 py-1.5 rounded text-xs">
            <Music className="w-3 h-3 mt-0.5 shrink-0" style={{ color: 'var(--mc-accent-primary)' }} />
            <div className="min-w-0">
              <p className="truncate" style={{ color: 'var(--mc-text-secondary)' }}>
                <span style={{ color: 'var(--mc-text-primary)' }}>{event.username}</span>
                {' · '}
                <span style={{ color: 'var(--mc-text-primary)' }}>{event.trackTitle}</span>
              </p>
              <p className="truncate" style={{ color: 'var(--mc-text-muted)' }}>
                {event.artistName} · {formatTime(event.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
