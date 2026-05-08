import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';

export default function TopBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="h-14 flex items-center px-6 gap-4" style={{ backgroundColor: 'var(--mc-bg-base)', borderBottom: '1px solid var(--mc-border-default)' }}>
      <form onSubmit={handleSubmit} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks, albums, artists…"
            className="w-full pl-10 pr-4 py-1.5 text-sm mc-input transition-colors"
          />
        </div>
      </form>
    </header>
  );
}
