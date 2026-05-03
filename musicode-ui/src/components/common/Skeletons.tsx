export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="mc-skeleton w-6 h-3" />
      <div className="mc-skeleton w-8 h-8 rounded" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="mc-skeleton w-40 h-3.5" />
        <div className="mc-skeleton w-24 h-3" />
      </div>
      <div className="mc-skeleton w-14 h-5 rounded-full" />
      <div className="mc-skeleton w-10 h-3" />
    </div>
  );
}

export function TrackListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-0.5">
      {Array.from({ length: count }, (_, i) => (
        <TrackRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function AlbumCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
      <div className="aspect-square mc-skeleton rounded-none" />
      <div className="p-3 space-y-2">
        <div className="mc-skeleton w-28 h-3.5" />
        <div className="mc-skeleton w-20 h-3" />
      </div>
    </div>
  );
}

export function AlbumGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArtistCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
      <div className="mc-skeleton w-20 h-20 rounded-full" />
      <div className="mc-skeleton w-20 h-3.5" />
      <div className="mc-skeleton w-12 h-3" />
    </div>
  );
}

export function ArtistGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function AlbumDetailSkeleton() {
  return (
    <div>
      <div className="mc-skeleton w-28 h-4 mb-6" />
      <div className="flex gap-8 mb-8">
        <div className="mc-skeleton w-48 h-48 rounded-xl shrink-0" />
        <div className="flex flex-col justify-end gap-2">
          <div className="mc-skeleton w-12 h-3" />
          <div className="mc-skeleton w-56 h-7" />
          <div className="mc-skeleton w-36 h-4" />
        </div>
      </div>
      <TrackListSkeleton count={8} />
    </div>
  );
}

export function ArtistDetailSkeleton() {
  return (
    <div>
      <div className="mc-skeleton w-28 h-4 mb-6" />
      <div className="flex items-center gap-6 mb-8">
        <div className="mc-skeleton w-24 h-24 rounded-full shrink-0" />
        <div className="space-y-2">
          <div className="mc-skeleton w-12 h-3" />
          <div className="mc-skeleton w-48 h-7" />
          <div className="mc-skeleton w-20 h-4" />
        </div>
      </div>
      <AlbumGridSkeleton count={6} />
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="mc-skeleton w-4 h-4 rounded" />
        <div className="mc-skeleton w-16 h-3" />
      </div>
      <div className="mc-skeleton w-20 h-7" />
    </div>
  );
}

function TopListSkeleton() {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
      <div className="mc-skeleton w-24 h-4 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="mc-skeleton w-5 h-3" />
            <div className="flex-1 space-y-1">
              <div className="mc-skeleton w-32 h-3.5" />
              <div className="mc-skeleton w-20 h-3" />
            </div>
            <div className="mc-skeleton w-14 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="mc-skeleton w-20 h-6" />
        <div className="mc-skeleton w-48 h-8 rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="rounded-xl p-4 mb-8" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
        <div className="mc-skeleton w-24 h-4 mb-3" />
        <div className="mc-skeleton w-full h-[200px]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <TopListSkeleton />
        <TopListSkeleton />
        <TopListSkeleton />
      </div>
    </div>
  );
}
