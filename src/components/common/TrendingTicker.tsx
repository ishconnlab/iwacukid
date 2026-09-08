import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function TrendingTicker() {
  const { t, isRw } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const tickerItems = t.tickerEvents;

  return (
    <div
      id="trending-sliding-events-ad"
      className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white border-b border-orange-500/30 overflow-hidden select-none py-1.5 px-2 sm:px-4"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2.5">
        {/* Fixed Title Chip */}
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
          <span>{t.marqueeTitle}</span>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="shrink-0 p-1 rounded-md bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
          title={isPaused ? 'Resume sliding' : 'Pause sliding to read'}
          aria-label={isPaused ? 'Resume sliding' : 'Pause sliding'}
        >
          {isPaused ? <Play className="w-3 h-3 text-orange-400" /> : <Pause className="w-3 h-3 text-stone-400" />}
        </button>

        {/* Continuous Smooth, Slow Right-to-Left Sliding Loop */}
        <div className="relative flex-1 overflow-hidden mask-fade-edges">
          <div
            className="animate-marquee-rtl flex items-center gap-10 text-xs sm:text-sm font-semibold tracking-wide text-stone-100"
            style={{
              animationPlayState: isPaused ? 'paused' : undefined,
            }}
          >
            {/* Duplicated list for infinite seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <Link
                key={idx}
                to="/events"
                className="inline-flex items-center gap-2.5 hover:text-orange-400 transition-colors whitespace-nowrap group py-0.5"
              >
                <span className="font-semibold text-white group-hover:text-orange-300">{item}</span>
                <span className="inline-block px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-md bg-orange-600/20 text-orange-400 border border-orange-500/40 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  {isRw ? 'Reba' : 'View'}
                </span>
                <span className="text-orange-500/60 mx-1">•</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick link button on desktop */}
        <Link
          to="/events"
          className="hidden sm:inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition-colors"
        >
          <span>{isRw ? 'Amatike yose' : 'All Events'}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
