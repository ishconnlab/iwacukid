import { useState } from 'react';
import { Play, X, Video, AlertTriangle } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { useLanguage } from '../../context/LanguageContext';

// Welcome showcase video (IWACU KIDS cultural performances)
const VIDEO_ID = 'd7LSfDfjth4';
const THUMB_URL = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;

export function VideoShowcase() {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const openPlayer = () => {
    setFailed(false);
    setLoading(true);
    setPlaying(true);
  };

  return (
    <Reveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/15 border border-orange-500/30 text-orange-700 text-[10px] font-black uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            {t.brandName}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {t.videoSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
            {t.videoSectionDesc}
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-stone-900 aspect-video group">
          {playing && !failed && (
            <>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                title={t.videoSectionTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setFailed(true);
                }}
              />
              {loading && (
                <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 text-white text-xs font-bold">
                    <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    {t.videoLoading}
                  </span>
                </div>
              )}
            </>
          )}

          {!playing && (
            <button
              type="button"
              onClick={openPlayer}
              className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              aria-label={t.videoPlayBtn}
            >
              <img
                src={THUMB_URL}
                alt={t.videoSectionTitle}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.src =
                    'data:image/svg+xml;charset=utf-8,' +
                    encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="100%" height="100%" fill="#1c1917"/><circle cx="640" cy="360" r="90" fill="#ea580c" opacity="0.9"/><polygon points="610,310 610,410 700,360" fill="#fff"/></svg>`
                    );
                }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-orange-600/95 hover:bg-orange-500 text-white text-xs sm:text-sm font-extrabold shadow-2xl shadow-orange-600/40 transition-all group-hover:scale-110 active:scale-95">
                  <Play className="w-4 h-4 fill-current" />
                  {t.videoPlayBtn}
                </span>
              </span>
              <span className="absolute bottom-4 left-0 right-0 text-center text-white text-[11px] font-bold tracking-widest uppercase opacity-80">
                IWACU KIDS • Nyakaliro
              </span>
            </button>
          )}

          {playing && !failed && (
            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {failed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
              <AlertTriangle className="w-10 h-10 text-orange-400" />
              <p className="text-sm font-bold max-w-sm">{t.videoNotAvailable}</p>
              <button
                type="button"
                onClick={() => {
                  setFailed(false);
                  setPlaying(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold transition-colors cursor-pointer"
              >
                {t.tryAgainBtn}
              </button>
            </div>
          )}
        </div>
      </section>
    </Reveal>
  );
}