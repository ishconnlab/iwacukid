import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TicketWalletProvider } from './context/TicketWalletContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { Footer } from './components/layout/Footer';
import { HotSupportWidget } from './components/common/HotSupportWidget';

// Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TicketSuccessPage } from './pages/TicketSuccessPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { LocationPage } from './pages/LocationPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminCheckInPage } from './pages/admin/AdminCheckInPage';

function AppLayout() {
  const location = useLocation();
  const isGateScanner = location.pathname === '/check-in' || location.pathname === '/admin/check-in';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/tickets/success/:orderId" element={<TicketSuccessPage />} />
          <Route path="/tickets" element={<MyTicketsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Gate Scanner Direct Access */}
          <Route path="/check-in" element={<AdminCheckInPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/check-in" element={<AdminCheckInPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer (hidden when on active scanner) */}
      {!isGateScanner && <Footer />}

      {/* Hot Support Hotline Floating Widget (always accessible) */}
      {!isGateScanner && <HotSupportWidget />}

      {/* Native App-like Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TicketWalletProvider>
          <Router>
            <AppLayout />
          </Router>
        </TicketWalletProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
