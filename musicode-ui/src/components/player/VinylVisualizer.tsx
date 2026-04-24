import { useState, useEffect } from 'react';

interface Props {
  coverSrc: string | null;
  isPlaying: boolean;
}

export default function VinylVisualizer({ coverSrc, isPlaying }: Props) {
  const [discOut, setDiscOut] = useState(false);
  const [slideComplete, setSlideComplete] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setDiscOut(true), 100);
      return () => clearTimeout(timer);
    } else {
      setDiscOut(false);
      setSlideComplete(false);
    }
  }, [isPlaying]);

  const handleTransitionEnd = () => {
    if (discOut) setSlideComplete(true);
  };

  return (
    <div className="vinyl-stage">
      <div className={`vinyl-group ${discOut ? 'vinyl-out' : ''}`}>
        <div
          className="vinyl-disc-slide"
          onTransitionEnd={handleTransitionEnd}
        >
          <div
            className="vinyl-disc"
            style={{ animationPlayState: slideComplete && isPlaying ? 'running' : 'paused' }}
          >
            <div className="vinyl-grooves" />
            <div className="vinyl-label">
              {coverSrc ? (
                <img src={coverSrc} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-700 to-orange-900" />
              )}
            </div>
            <div className="vinyl-center-hole" />
          </div>
        </div>

        <div className="vinyl-sleeve">
          {coverSrc ? (
            <img src={coverSrc} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-5xl text-zinc-600">&#9835;</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
