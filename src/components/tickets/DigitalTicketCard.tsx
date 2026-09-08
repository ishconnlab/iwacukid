import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Download,
  Share2,
  CalendarPlus,
  AlertTriangle,
  Hash,
  PhoneOutgoing,
  TicketCheck,
} from 'lucide-react';
import { Ticket } from '../../types';
import { generateTicketPDF } from '../../utils/pdfTicketGenerator';

interface DigitalTicketCardProps {
  ticket: Ticket;
  compact?: boolean;
}

export function DigitalTicketCard({ ticket, compact }: DigitalTicketCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function generateQr() {
      try {
        const url = await QRCode.toDataURL(ticket.qrPayload, {
          width: 280,
          margin: 1,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    }
    generateQr();
  }, [ticket.qrPayload]);

  const isValid = ticket.status === 'VALID';
  const isUsed = ticket.status === 'USED';

  // Add to Calendar helper (.ics file generation)
  const handleAddToCalendar = () => {
    const startIso = ticket.eventDate.replace(/-/g, '') + 'T120000Z';
    const endIso = ticket.eventDate.replace(/-/g, '') + 'T170000Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//IWACU Kids//Ticketing System//EN',
      'BEGIN:VEVENT',
      `UID:${ticket.id}@iwacukids.rw`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:IWACU Kids: ${ticket.eventTitle}`,
      `DESCRIPTION:Your official digital ticket (${ticket.ticketCode}) for ${ticket.attendeeName}. Show your QR at entrance in ${ticket.eventLocation}.`,
      `LOCATION:${ticket.eventLocation}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IWACU-Kids-Ticket-${ticket.ticketCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateTicketPDF(ticket);
    } catch (err) {
      console.error('Failed to generate PDF ticket:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `IWACU Kids Ticket: ${ticket.eventTitle}`,
          text: `My digital entrance ticket for IWACU Kids (${ticket.ticketCode}) in Nyakaliro, Rwanda!`,
          url: window.location.href,
        });
      } catch {
        // Share dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ticket link copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Outer Ticket Card */}
      <div
        ref={ticketRef}
        className="relative bg-white rounded-3xl overflow-hidden border border-stone-300/80 shadow-xl transition-all"
      >
        {/* Cultural top header strip */}
        <div className="h-3 w-full rwandan-pattern-line" />

        {/* Top Header */}
        <div className="p-6 bg-gradient-to-b from-stone-900 to-stone-950 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-sm text-white shadow-sm">
                IK
              </div>
              <div>
                <span className="text-xs font-black tracking-widest text-white uppercase block leading-tight">
                  IWACU <span className="text-orange-400">KIDS</span>
                </span>
                <span className="text-[9px] text-stone-400 font-semibold tracking-wider uppercase block">
                  Digital Pass • Nyakaliro
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1 shadow-sm ${
                isValid
                  ? 'bg-emerald-500 text-white'
                  : isUsed
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-red-500 text-white'
              }`}
            >
              {isValid && <ShieldCheck className="w-3.5 h-3.5" />}
              {isUsed && <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{ticket.status}</span>
            </div>
          </div>

          {/* Event Title */}
          <div className="mt-5 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
              Official Entrance Ticket
            </span>
            <h3 className="text-lg font-extrabold text-white leading-snug">{ticket.eventTitle}</h3>
          </div>
        </div>

        {/* Cutout Notch Divider */}
        <div className="relative flex items-center justify-between px-2 bg-stone-950 py-1">
          <div className="w-4 h-8 bg-[#FAF8F5] rounded-r-full -ml-2" />
          <div className="flex-1 border-t-2 border-dashed border-stone-700 mx-2" />
          <div className="w-4 h-8 bg-[#FAF8F5] rounded-l-full -mr-2" />
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 bg-white space-y-5">
          {/* Key metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-600" /> Date
              </span>
              <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">
                {ticket.eventDate}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-600" /> Time
              </span>
              <span className="font-extrabold text-stone-900 text-xs mt-0.5 block line-clamp-1">
                {ticket.eventTime}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 col-span-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-600" /> Location
              </span>
              <span className="font-extrabold text-stone-900 text-xs mt-0.5 block">
                {ticket.eventLocation}
              </span>
              {ticket.eventVenue && (
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  {ticket.eventVenue}
                </span>
              )}
            </div>

            {ticket.companyPhone && (
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 col-span-2">
                <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                  <PhoneOutgoing className="w-3 h-3 text-orange-600" /> Company / Support Line
                </span>
                <span className="font-extrabold text-stone-900 text-xs mt-0.5 block font-mono">
                  {ticket.companyPhone}
                </span>
              </div>
            )}
          </div>

          {/* Attendee Info & Tier */}
          <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-200/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <User className="w-3 h-3 text-orange-600" /> Attendee
              </span>
              <span className="font-extrabold text-stone-900 text-sm block">
                {ticket.attendeeName}
              </span>
              <span className="text-[11px] text-stone-500 font-medium block">
                {ticket.attendeePhone}
              </span>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-stone-900 text-white">
                {ticket.ticketTypeName}
              </span>
              <span className="text-xs font-black text-orange-700 block mt-1">
                {ticket.price.toLocaleString()} RWF
              </span>
            </div>
          </div>

          {/* Registration number strip (sequential attendee position from 1) */}
          {ticket.ticketNumber !== undefined && (
            <div className="p-3 rounded-2xl bg-stone-900 text-white flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-orange-400" />
                {ticket.eventTime ? 'Registration Number' : 'Ticket Number'}
              </span>
              <span className="font-mono text-2xl font-black text-orange-400">
                #{ticket.ticketNumber}
              </span>
            </div>
          )}

          {/* Secure QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-stone-200 mb-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${ticket.ticketCode}`}
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-stone-400">
                  Generating Secure QR...
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <span className="text-xs font-mono font-black tracking-wider text-stone-900 block">
                {ticket.ticketCode}
              </span>
              <span className="text-[10px] text-stone-500 block">
                Present this QR code at {ticket.eventVenue || ticket.eventLocation} entrance gate
              </span>
            </div>

            {isUsed && ticket.checkInNumber !== undefined && (
              <div className="mt-2 w-full flex items-center justify-center gap-2 p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-black">
                <TicketCheck className="w-4 h-4" />
                <span>Check-in #{ticket.checkInNumber}</span>
              </div>
            )}

            {isUsed && (
              <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold w-full">
                Checked in at {new Date(ticket.checkedInAt || '').toLocaleTimeString()} by {ticket.checkedInBy || 'Gate Staff'}
              </div>
            )}
          </div>

          {/* Barcode Strip graphic */}
          <div className="h-6 w-full barcode-strip rounded opacity-80" />
        </div>
      </div>

      {/* Ticket Action Buttons */}
      {!compact && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-stone-200 hover:border-orange-500 text-stone-700 hover:text-orange-600 transition-colors shadow-sm text-xs font-bold"
          >
            <CalendarPlus className="w-4 h-4 mb-1 text-orange-600" />
            <span>Calendar</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-stone-200 hover:border-orange-500 text-stone-700 hover:text-orange-600 transition-colors shadow-sm text-xs font-bold disabled:opacity-50 cursor-pointer"
            title="Download printable PDF entrance ticket"
          >
            <Download className={`w-4 h-4 mb-1 text-orange-600 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
            <span>{isGeneratingPdf ? 'Saving...' : 'PDF Pass'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-stone-200 hover:border-orange-500 text-stone-700 hover:text-orange-600 transition-colors shadow-sm text-xs font-bold"
          >
            <Share2 className="w-4 h-4 mb-1 text-orange-600" />
            <span>Share</span>
          </button>
        </div>
      )}
    </div>
  );
}
