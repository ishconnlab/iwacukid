import { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Flame,
  X,
  Clock,
  MapPin,
  HelpCircle,
  Check,
  Copy,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function HotSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);
  const { isRw } = useLanguage();

  const handleCopyUssd = () => {
    navigator.clipboard.writeText('*182*8*1#');
    setCopiedUssd(true);
    setTimeout(() => setCopiedUssd(false), 2000);
  };

  return (
    <>
      {/* FLOATING HOT SUPPORT BUTTON */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
        <button
          type="button"
          id="hot-support-floating-btn"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          aria-label="Open Hot Support"
        >
          <div className="relative">
            <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
          </div>
          <span className="tracking-wide">
            {isRw ? 'UBUFASHA BWIHUSE' : 'HOT SUPPORT'}
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] uppercase font-bold">
            24/7
          </span>
        </button>
      </div>

      {/* HOT SUPPORT SHEET / MODAL */}
      {isOpen && (
        <div
          id="hot-support-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom duration-200">
            {/* Header with Hot Flame & Rwandan Cultural Accent */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                    <Flame className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                        {isRw ? 'Ibiro Byihuse By’Ubufasha' : 'Direct Assistance Hotline'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black leading-tight text-white">
                      {isRw ? 'Ubufasha Bwihuse bwa Nyakaliro' : 'Nyakaliro Hot Support Desk'}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  id="hot-support-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
              <p className="text-stone-600 leading-relaxed font-medium">
                {isRw
                  ? 'Ukeneye ubufasha bwo kugura itike, kwemeza MoMo, kubika itike cyangwa kwinjira ku irembo i Nyakaliro? Twandikire cyangwa uduhamagare ako kanya:'
                  : 'Need instant help with ticket booking, MoMo payment verification, PDF download, or gate check-in at Nyakaliro? Contact our hot desk directly:'}
              </p>

              {/* 1. HOTTEST ACTION: WHATSAPP CHAT */}
              <a
                href="https://wa.me/250788000000?text=Muraho%20IWACU%20Kids!%20Nkeneye%20ubufasha%20ku%20itike%20y%27ibirori%20i%20Nyakaliro."
                target="_blank"
                rel="noreferrer"
                id="hot-support-whatsapp-link"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <MessageCircle className="w-5 h-5 fill-emerald-600 stroke-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black text-emerald-950">
                        WhatsApp Instant Chat
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                        HOT
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium block">
                      Fast reply in seconds • Kinyarwanda & English
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  Chat →
                </span>
              </a>

              {/* 2. DIRECT PHONE CALL */}
              <a
                href="tel:+250788000000"
                id="hot-support-call-link"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-950 font-bold transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <Phone className="w-5 h-5 fill-white stroke-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black text-orange-950">
                        Hotline Voice Call
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-black uppercase">
                        24/7
                      </span>
                    </div>
                    <span className="text-[11px] text-orange-800 font-semibold block">
                      +250 788 000 000 (Gate Operations)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-orange-700 group-hover:translate-x-0.5 transition-transform">
                  Call →
                </span>
              </a>

              {/* 3. QUICK USSD PAYMENT SHORTCUT */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-700">
                    {isRw ? 'Gukoresha USSD kuri MTN/Airtel' : 'Quick USSD Merchant Code'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUssd}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-[10px] font-bold text-stone-800 transition-colors"
                  >
                    {copiedUssd ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-black text-orange-600 bg-white px-2.5 py-1 rounded-lg border border-stone-300">
                    *182*8*1#
                  </code>
                  <span className="text-[10px] text-stone-500">
                    Pay Bill / Merchant (Code: 123456)
                  </span>
                </div>
              </div>

              {/* 4. EMAIL & LOCATION */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="mailto:info@iwacukids.rw"
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:text-orange-600 flex items-center gap-2 text-[11px] font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="truncate">info@iwacukids.rw</span>
                </a>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 flex items-center gap-2 text-[11px] font-semibold">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="truncate">Nyakaliro, Rwanda</span>
                </div>
              </div>

              {/* Organizer Badge */}
              <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Executive Leadership: <strong>Coopstar (CEO)</strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-orange-600 uppercase">
                  Verified Org
                </span>
              </div>
            </div>

            {/* Bottom Dismiss */}
            <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
              >
                {isRw ? 'Funga' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
