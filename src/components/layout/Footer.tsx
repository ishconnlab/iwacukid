import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Sparkles, Shield, Heart, Flame, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="hidden md:block bg-stone-900 text-stone-300 pt-14 pb-14 border-t border-stone-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                IK
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                IWACU <span className="text-orange-500">KIDS</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Culture • Creativity • Talent • Fun • Community. Empowering children and youth through traditional dance, drumming, and creative celebrations in Rwanda.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700 text-xs text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Nyakaliro, Rwanda</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="hover:text-orange-400 transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-orange-400 transition-colors">
                  Youth Programs
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-orange-400 transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/tickets" className="hover:text-orange-400 transition-colors">
                  My Digital Tickets
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  About IWACU Kids
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-orange-400 transition-colors">
                  Location & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Leadership & Hot Support Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">
                Hotline & Support 24/7
              </h4>
            </div>
            <div className="text-sm space-y-2.5 text-stone-300">
              <div className="p-3 rounded-xl bg-stone-800/80 border border-orange-500/30">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">
                  Nyakaliro Event Operations
                </span>
                <span className="text-sm font-bold text-white">Coopstar (CEO)</span>
                <span className="text-xs text-stone-400 block">IWACU Kids Rwanda</span>
              </div>
              
              <a
                href="https://wa.me/250788000000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-800/60"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-stone-900" />
                <span>WhatsApp: +250 788 000 000</span>
              </a>

              <a
                href="tel:+250788000000"
                className="flex items-center gap-2 text-xs text-stone-300 hover:text-orange-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Direct Hotline: +250 788 000 000</span>
              </a>

              <a
                href="mailto:info@iwacukids.rw"
                className="flex items-center gap-2 text-xs text-stone-300 hover:text-orange-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span>info@iwacukids.rw</span>
              </a>
            </div>
          </div>

          {/* Payment & Security Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Official Mobile Payments</h4>
            <p className="text-xs text-stone-400">
              Instant digital tickets authorized via verified Rwandan mobile money:
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="w-3 h-3 rounded-full bg-[#FFCC00]"></span>
                <span className="text-xs font-bold text-white">MTN Mobile Money (MoMo)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800 border border-stone-700">
                <span className="w-3 h-3 rounded-full bg-[#E60000]"></span>
                <span className="text-xs font-bold text-white">Airtel Money Rwanda</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Server-validated QR entrance ticketing</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} IWACU Kids. All rights reserved. Nyakaliro, Rwanda.</p>
          <div className="flex items-center gap-4">
            <Link to="/check-in" className="hover:text-orange-400 text-stone-400">
              Gate Check-In
            </Link>
            <Link to="/login" className="hover:text-orange-400 text-stone-400">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
