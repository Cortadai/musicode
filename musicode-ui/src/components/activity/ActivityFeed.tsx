import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { getRecentActivity } from '../../api/activity';
import type { ActivityEvent } from '../../api/activity';
import { Music } from 'lucide-react';

export default function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getRecentActivity()
      .then((data) => { setEvents(data); setLoadError(false); })
      .catch(() => setLoadError(true));
  }, []);

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
    <div
      className="flex flex-col min-h-0 flex-1 px-3 pb-2 pt-3"
      style={{ borderTop: '1px solid var(--mc-border-default)' }}
    >
      <div className="flex items-center gap-2 px-3 mb-2 shrink-0">
        <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--mc-text-muted)' }}>Activity</p>
        {reconnecting && (
          <span className="text-[10px]" style={{ color: 'var(--mc-text-warning)', opacity: 0.7 }}>reconnecting…</span>
        )}
      </div>
      {loadError && events.length === 0 && (
        <p className="text-xs px-3" style={{ color: 'var(--mc-text-muted)' }}>Could not load activity</p>
      )}
      <div className="space-y-1 overflow-y-auto min-h-0 flex-1">
        {events.slice(0, 10).map((event, i) => (
          <div key={`${event.timestamp}-${i}`} className="flex items-start gap-2 px-2 py-1.5 rounded text-xs">
            {event.hasCoverArt && event.albumId ? (
              <button
                onClick={() => navigate(`/albums/${event.albumId}`)}
                className="shrink-0 mt-0.5 rounded overflow-hidden hover:opacity-80 transition-opacity"
                title={event.albumTitle}
              >
                <img
                  src={`/api/covers/${event.albumId}`}
                  alt=""
                  className="w-7 h-7 object-cover"
                />
              </button>
            ) : (
              <Music className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--mc-accent-primary)' }} />
            )}
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
