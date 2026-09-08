import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Ticket, Compass, QrCode } from 'lucide-react';
import { useTicketWallet } from '../../context/TicketWalletContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function MobileNavigation() {
  const location = useLocation();
  const { savedTickets } = useTicketWallet();
  const { isStaffOrAdmin } = useAuth();
  const { t, isRw } = useLanguage();

  const navItems = [
    { label: t.navHome, path: '/', icon: Home },
    { label: t.navEvents, path: '/events', icon: Calendar },
    { label: t.navPrograms, path: '/programs', icon: Compass },
    {
      label: isRw ? 'Amatike' : 'Tickets',
      path: '/tickets',
      icon: Ticket,
      badge: savedTickets.length > 0 ? savedTickets.length : null,
    },
    {
      label: isStaffOrAdmin ? (isRw ? 'Ibiro' : 'Admin') : (isRw ? 'Gusikana' : 'Scan'),
      path: isStaffOrAdmin ? '/admin' : '/check-in',
      icon: QrCode,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      id="mobile-bottom-taskbar"
      aria-label="Fixed Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5] border-t-2 border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] select-none"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        transform: 'none',
      }}
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              id={`mobile-nav-${item.path.replace('/', '') || 'home'}`}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors relative ${
                active ? 'text-orange-600 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px] scale-110' : 'stroke-[2px]'}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#FAF8F5]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-[64px] text-center ${active ? 'font-black' : 'font-medium'}`}>
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-1 w-6 h-1 bg-orange-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
