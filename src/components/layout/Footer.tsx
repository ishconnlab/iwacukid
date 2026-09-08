import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Shield,
  Heart,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  BadgeCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE, whatsappLink, mapsPinLink } from '../../lib/site';
import { TikTokIcon, SpotifyIcon } from '../social/SocialIcons';

export function Footer() {
  const { t, isRw } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const quickLinks = [
    { to: '/', label: t.navHome },
    { to: '/events', label: t.navEvents },
    { to: '/programs', label: t.navPrograms },
    { to: '/gallery', label: t.navGallery },
    { to: '/about', label: t.navAbout },
    { to: '/location', label: t.navLocation },
  ];

  return (
    <footer className="hidden md:block bg-stone-900 text-stone-400 pt-12 sm:pt-16 pb-12 border-t border-stone-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-stone-800">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                IK
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                IWACU <span className="text-orange-500">KIDS</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">{t.footerBrandDesc}</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={mapsPinLink(SITE.name)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700 text-[11px] font-semibold text-stone-300 hover:border-orange-500/60 hover:text-orange-300 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                {SITE.location}
              </a>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700 text-[11px] font-semibold text-stone-300">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t.loginBadge}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-200">{t.quickLinksTitle}</h4>
            <ul className="space-y-2 text-[13px]">
              {quickLinks.map((l) => (
                <li key={l.to + l.label}>
                  <Link
                    to={l.to}
                    className="inline-flex items-center gap-1.5 text-stone-400 hover:text-orange-400 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-stone-600" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-200">{t.contactTitle}</h4>
            <div className="space-y-2.5 text-[13px]">
              <a
                href={whatsappLink(t.waPrefilled)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-stone-300 hover:text-emerald-300 transition-colors font-bold"
              >
                <span className="w-7 h-7 rounded-lg bg-[#25D366]/15 border border-emerald-800/60 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-stone-900" />
                </span>
                WhatsApp: {SITE.supportPhoneDisplay}
              </a>
              <a
                href={`tel:+${SITE.supportPhoneDigits}`}
                className="flex items-center gap-2 text-stone-300 hover:text-orange-400 transition-colors"
              >
                <span className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                </span>
                {SITE.supportPhoneDisplay}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="flex items-center gap-2 text-stone-300 hover:text-orange-400 transition-colors cursor-pointer group w-full text-left"
                title={copiedEmail ? (isRw ? 'Koporowe!' : 'Copied!') : SITE.email}
              >
                <span className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                </span>
                <span className="truncate">{SITE.email}</span>
              </button>
            </div>

            {/* Social */}
            <div className="pt-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-200 mb-2">{t.followTitle}</h4>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappLink(t.waPrefilled)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:bg-[#25D366] hover:text-white hover:border-emerald-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
                <a
                  href={SITE.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:bg-[#1877F2] hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4 fill-current" />
                </a>
                <a
                  href={SITE.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:bg-[#E1306C] hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 fill-current" />
                </a>
                <a
                  href={SITE.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:bg-[#FF0000] hover:text-white transition-colors"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                </a>
                <a
                  href={SITE.socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:bg-white hover:text-stone-900 transition-colors"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href={SITE.socials.spotify}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Spotify"
                  className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:bg-[#1DB954] hover:text-white transition-colors"
                >
                  <SpotifyIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Payments + Legal */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-200">{t.paymentsTitle}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="w-3 h-3 rounded-full bg-[#FFCC00]"></span>
                <span className="text-xs font-bold text-white">MTN Mobile Money (MoMo)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="w-3 h-3 rounded-full bg-[#E60000]"></span>
                <span className="text-xs font-bold text-white">Airtel Money Rwanda</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.heroTrustQr}</span>
              </div>
            </div>

            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-200 pt-2">{t.legalTitle}</h4>
            <ul className="text-[13px] space-y-1.5">
              <li className="text-stone-400 transition-colors">{t.legalPrivacy}</li>
              <li className="text-stone-400 transition-colors">{t.legalTerms}</li>
              <li className="text-stone-400 transition-colors">{t.legalTicketPolicy}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1.5 text-center">
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            © {new Date().getFullYear()} {t.rightsLine}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/check-in" className="hover:text-orange-400 transition-colors">
              {t.navGateScanner}
            </Link>
            <Link to="/login" className="hover:text-orange-400 transition-colors">
              {t.navStaffLogin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}