import { useEffect, useState } from 'react';
import { BadgeCheck, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE } from '../../lib/site';
import {
  TikTokIcon,
  SpotifyIcon,
  YoutubeBrandIcon,
  InstagramBrandIcon,
} from './SocialIcons';

const DIMISS_KEY = 'iwacu_social_ad_closed_until';
const RESHOW_DELAY_MS = 5000;
const CLOSE_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6h until the ad may come back

type BrandIcon = typeof TikTokIcon;

interface Platform {
  key: 'youtube' | 'tiktok' | 'instagram' | 'spotify';
  href: string;
  label: string;
  action: string;
  color: string;
  Icon: BrandIcon;
}

export function SocialFollowAd() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const until = Number(localStorage.getItem(DIMISS_KEY) || 0);
        if (until < Date.now()) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, RESHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(DIMISS_KEY, String(Date.now() + CLOSE_COOLDOWN_MS));
    } catch {
      /* storage unavailable */
    }
  };

  if (!visible) return null;

  const platforms: Platform[] = [
    {
      key: 'youtube',
      href: SITE.socials.youtube,
      label: 'YouTube',
      action: t.adSubscribeBtn,
      color: '#FF0000',
      Icon: YoutubeBrandIcon,
    },
    {
      key: 'tiktok',
      href: SITE.socials.tiktok,
      label: 'TikTok',
      action: t.adFollowBtn,
      color: '#111827',
      Icon: TikTokIcon,
    },
    {
      key: 'instagram',
      href: SITE.socials.instagram,
      label: 'Instagram',
      action: t.adFollowBtn,
      color: '#E1306C',
      Icon: InstagramBrandIcon,
    },
    {
      key: 'spotify',
      href: SITE.socials.spotify,
      label: 'Spotify',
      action: t.adListenBtn,
      color: '#1DB954',
      Icon: SpotifyIcon,
    },
  ];

  return (
    <aside
      role="complementary"
      aria-label={t.adTitle}
      className="fixed bottom-4 left-4 z-40 w-[calc(100%-2rem)] max-w-sm"
    >
      <div className="relative bg-white rounded-2xl border border-stone-200 shadow-2xl shadow-stone-900/20 overflow-hidden animate-scale-in">
        {/* Top "Ad" strip */}
        <div className="flex items-center justify-between pl-3 pr-1.5 py-1.5 bg-stone-50 border-b border-stone-100">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-stone-500">
            <BadgeCheck className="w-3.5 h-3.5 text-orange-600" />
            {t.adLabel}
          </span>
          <button
            type="button"
            onClick={close}
            className="w-7 h-7 rounded-full hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t.adCloseLabel}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 pt-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              IK
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-stone-900 leading-tight truncate">{t.adTitle}</h3>
              <p className="text-[11px] text-stone-500 leading-tight">{t.adDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => (
              <a
                key={p.key}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-2.5 py-2 rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all group"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  <p.Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-[11px] font-bold text-stone-800 truncate group-hover:text-orange-600 transition-colors">
                    {p.label}
                  </span>
                  <span className="block text-[9px] font-black uppercase tracking-wide text-stone-400">
                    {p.action}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <p className="text-[10px] text-stone-400 leading-snug flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
            {t.adTrustLine}
          </p>
        </div>
      </div>
    </aside>
  );
}