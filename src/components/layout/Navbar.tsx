import { Link, NavLink } from 'react-router-dom';
import { Ticket, Sparkles, Languages, ExternalLink } from 'lucide-react';
import { useTicketWallet } from '../../context/TicketWalletContext';
import { useLanguage } from '../../context/LanguageContext';
import { TrendingTicker } from '../common/TrendingTicker';
import { InstallPWAButton } from '../pwa/InstallPWAButton';
import { SITE } from '../../lib/site';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-3 py-2 rounded-xl text-xs font-extrabold transition-colors ${
    isActive ? 'text-orange-600 bg-orange-100/70' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
  }`;

export function Navbar() {
  const { savedTickets } = useTicketWallet();
  const { toggleLanguage, t, isRw } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
      {/* Native App-Style Clean Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-14 sm:h-16">
          {/* Brand */}
          <Link
            to="/"
            id="header-app-logo"
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
            aria-label="IWACU KIDS Home"
          >
            <img
              src="/icons/icon-192.png"
              alt="IWACU KIDS logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-sm shadow-orange-600/20 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg tracking-tight text-stone-900 leading-tight">
                IWACU <span className="text-orange-600">KIDS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-stone-400 leading-none">
                {t.brandRegion}
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            <NavLink to="/" end className={navItemClass}>
              {t.navHome}
            </NavLink>
            <NavLink to="/events" className={navItemClass}>
              {t.navEvents}
            </NavLink>
            <NavLink to="/programs" className={navItemClass}>
              {t.navPrograms}
            </NavLink>
            <NavLink to="/gallery" className={navItemClass}>
              {t.navGallery}
            </NavLink>
            <NavLink to="/about" className={navItemClass}>
              {t.navAbout}
            </NavLink>
            <NavLink to="/location" className={navItemClass}>
              {t.navLocation}
            </NavLink>
            <NavLink to="/programs" className={navItemClass}>
              {t.navServices}
            </NavLink>
            <a
              href={SITE.partners.ishconnect.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              {t.navIshConnect}
              <ExternalLink className="w-3 h-3 text-orange-600" />
            </a>
          </nav>

          {/* App controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <InstallPWAButton variant="compact" />

            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              id="header-lang-toggle"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-extrabold border border-stone-200 transition-all cursor-pointer active:scale-95"
              title={isRw ? 'Hindura ururimi / Switch to English' : 'Koresha Ikinyarwanda'}
              aria-label="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>{isRw ? 'RW' : 'EN'}</span>
            </button>

            {/* My Tickets quick icon (desktop only) */}
            {savedTickets.length > 0 && (
              <Link
                to="/tickets"
                id="header-tickets-shortcut"
                className="hidden md:flex relative p-1.5 sm:p-2 text-stone-700 hover:text-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
                title={t.navTickets}
                aria-label="My Tickets"
              >
                <Ticket className="w-5 h-5 text-orange-600" />
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {savedTickets.length}
                </span>
              </Link>
            )}

            {/* Get Tickets button */}
            <Link
              to="/events"
              id="header-get-tickets-btn"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-sm shadow-orange-600/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{t.navGetTickets}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CONTINUOUS RIGHT-TO-LEFT SLIDING EVENT & ADS BANNER (ONLY FOR MOBILE) */}
      <div className="block md:hidden">
        <TrendingTicker />
      </div>
    </header>
  );
}