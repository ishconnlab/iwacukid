import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Ticket as TicketIcon,
  ArrowRight,
  ShieldCheck,
  Download,
  Printer,
  Flame,
  Phone,
  MessageCircle,
  FileText,
  Calendar,
  MapPin,
} from 'lucide-react';
import { TicketOrder, Ticket } from '../types';
import { api } from '../api/client';
import { DigitalTicketCard } from '../components/tickets/DigitalTicketCard';
import { generateTicketPDF, generateAllTicketsPDF } from '../utils/pdfTicketGenerator';
import { useLanguage } from '../context/LanguageContext';

export function TicketSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<TicketOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingTicketId, setDownloadingTicketId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { isRw } = useLanguage();

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#1c1917'],
      });
    } catch {
      // safe fallback
    }

    async function loadOrder() {
      if (!orderId) return;
      try {
        const data = await api.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleDownloadAll = async () => {
    if (!order) return;
    setDownloadingAll(true);
    try {
      await generateAllTicketsPDF(order);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to download all tickets PDF:', err);
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleDownloadSingle = async (ticket: Ticket) => {
    if (!order) return;
    setDownloadingTicketId(ticket.id);
    try {
      await generateTicketPDF(ticket, order);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to download single ticket PDF:', err);
    } finally {
      setDownloadingTicketId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-bold text-stone-600">
          {isRw ? 'Biratunganywa... Birimo gushakishwa...' : 'Retrieving official digital pass...'}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-stone-900">
          {isRw ? 'Itike Ntibonetse' : 'Order Record Not Found'}
        </h2>
        <p className="text-sm text-stone-500">
          {isRw
            ? 'Ntitwashoboye kubona iyi tike. Reba ahabitswe amatike yawe.'
            : 'We could not load this ticket. Please check your "My Tickets" tab.'}
        </p>
        <Link
          to="/tickets"
          className="inline-block px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl"
        >
          {isRw ? 'Reba Amatike Yanjye' : 'Go to My Tickets'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-28">
      {/* 1. TOP CELEBRATION HEADER */}
      <div className="text-center space-y-2.5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isRw ? 'Ibyishyu Byemejwe • Amatike Yasohotse' : 'Payment Verified • Tickets Issued'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {isRw ? `Witegure Kwinjira: ${order.eventTitle}!` : `You're Going to ${order.eventTitle}!`}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          {isRw
            ? 'Itike yawe yo kwinjira ku irembo i Nyakaliro yateguwe neza. Yimanurire muri PDF yiteguye gucapishwa cyangwa uyibike kuri telefoni.'
            : `Your digital ticket${
                order.quantity > 1 ? 's are' : ' is'
              } ready. Download your printable PDF ticket pass below or keep the QR code handy on your phone.`}
        </p>
      </div>

      {/* 2. PROMINENT PDF DOWNLOAD & PRINT BAR */}
      <div
        id="pdf-download-action-card"
        className="bg-gradient-to-br from-orange-600 via-orange-600 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl shadow-orange-600/20 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-200" />
              <h3 className="text-base sm:text-lg font-black text-white">
                {isRw ? 'Manura Itike Nka PDF Yo Gucapa' : 'Download Printable Ticket (PDF)'}
              </h3>
            </div>
            <p className="text-xs text-orange-100 leading-relaxed">
              {isRw
                ? 'Itike ifite QR Code isobanutse neza, amategeko yo kwinjira n’amakuru yose y’ibirori i Nyakaliro.'
                : 'Includes high-definition scannable QR code, gate entrance instructions, and official stamp.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="download-all-pdf-btn"
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 active:bg-orange-100 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[44px]"
            >
              <Download className={`w-4 h-4 text-orange-600 ${downloadingAll ? 'animate-bounce' : ''}`} />
              <span>
                {downloadingAll
                  ? isRw
                    ? 'Biratunganywa...'
                    : 'Generating PDF...'
                  : order.tickets.length > 1
                  ? isRw
                    ? `Manura Amatike Yose (${order.tickets.length} PDF)`
                    : `Download All (${order.tickets.length} Passes)`
                  : isRw
                  ? 'Manura Itike (PDF)'
                  : 'Download PDF Pass'}
              </span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Print directly"
              aria-label="Print Ticket"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-2.5 rounded-xl bg-white/20 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-yellow-200" />
            <span>
              {isRw
                ? 'Itike yawe ya PDF yamanuwe neza kuri telefoni/mudasobwa yawe!'
                : 'Your printable PDF ticket has been downloaded successfully!'}
            </span>
          </div>
        )}
      </div>

      {/* 3. TICKETS LIST WITH INDIVIDUAL PDF DOWNLOADS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-stone-700">
            {isRw ? 'Amatike Yawe Yo Kwinjira' : 'Your Digital Entrance Passes'}
          </h2>
          <span className="text-xs font-bold text-stone-500">
            {order.tickets.length} {order.tickets.length === 1 ? 'Ticket' : 'Tickets'}
          </span>
        </div>

        {order.tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="space-y-3 bg-white p-3 sm:p-4 rounded-3xl border border-stone-200 shadow-sm"
          >
            <div className="flex items-center justify-between px-2 text-xs font-bold text-stone-600">
              <span className="flex items-center gap-1.5">
                <TicketIcon className="w-3.5 h-3.5 text-orange-600" />
                <span>
                  Pass #{index + 1} • {ticket.attendeeName}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleDownloadSingle(ticket)}
                disabled={downloadingTicketId === ticket.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3 h-3 text-orange-600" />
                <span>
                  {downloadingTicketId === ticket.id
                    ? isRw
                      ? 'Birakorwa...'
                      : 'Saving...'
                    : 'PDF'}
                </span>
              </button>
            </div>

            <DigitalTicketCard ticket={ticket} />
          </div>
        ))}
      </div>

      {/* 4. "HOT SUPPORT" DIRECT CONTACT CARD */}
      <div
        id="ticket-success-hot-support"
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white border border-stone-800 shadow-md space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white shadow-sm">
              <Flame className="w-4 h-4 fill-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 block">
                {isRw ? 'Ubufasha Bwihuse bwo ku Muryango' : 'Nyakaliro Gate Hot Support'}
              </span>
              <h4 className="text-sm sm:text-base font-black text-white">
                {isRw ? 'Ukeneye Ubufasha Ako Kanya?' : 'Need Instant Assistance?'}
              </h4>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-600/80 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
            24/7 HOT
          </span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          {isRw
            ? 'Ufite ikibazo ku itike yawe cyangwa ku kwinjira ku irembo i Nyakaliro? Twandikire kuri WhatsApp cyangwa uhamagare umurongo utaziguye:'
            : 'Having trouble with your PDF ticket, MoMo receipt, or gate entrance in Nyakaliro? Contact our gate assistance desk directly:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <a
            href={`https://wa.me/250788000000?text=Muraho%20IWACU%20Kids!%20Nkeneye%20ubufasha%20kuri%20Order%20${order.id}%20(Itike%20ya%20${encodeURIComponent(
              order.eventTitle
            )}).`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-sm transition-all min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp Hot Chat</span>
          </a>

          <a
            href="tel:+250788000000"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-sm transition-all min-h-[44px]"
          >
            <Phone className="w-4 h-4" />
            <span>Direct Hotline (+250 788 000 000)</span>
          </a>
        </div>
      </div>

      {/* 5. BOTTOM NAVIGATION ACTIONS */}
      <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link
          to="/tickets"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs flex items-center justify-center gap-2 min-h-[44px]"
        >
          <TicketIcon className="w-4 h-4 text-orange-500" />
          <span>{isRw ? 'Reba ahabitswe amatike' : 'View in Ticket Wallet'}</span>
        </Link>

        <Link
          to="/events"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:text-orange-600 font-bold text-xs flex items-center justify-center gap-2 min-h-[44px]"
        >
          <span>{isRw ? 'Reba Ibindi Birori' : 'Explore More Events'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
