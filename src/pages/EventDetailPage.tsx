import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  Share2,
  Users,
  ShieldCheck,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Event, TicketType } from '../types';
import { api } from '../api/client';
import { TicketTypeSelector } from '../components/events/TicketTypeSelector';

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    async function loadEvent() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getEvent(slug);
        setEvent(data);
        if (data.ticketTypes.length > 0) {
          const firstAvailable = data.ticketTypes.find((t) => t.status === 'ACTIVE') || data.ticketTypes[0];
          setSelectedTicketType(firstAvailable);
        }
      } catch (err) {
        console.error('Failed to load event:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [slug]);

  const handleSelectTicketType = (tt: TicketType, qty: number) => {
    setSelectedTicketType(tt);
    setSelectedQuantity(qty);
  };

  const handleProceedToCheckout = () => {
    if (!event || !selectedTicketType) return;
    navigate('/checkout', {
      state: {
        eventId: event.id,
        ticketTypeId: selectedTicketType.id,
        quantity: selectedQuantity,
      },
    });
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join IWACU Kids for ${event.title} in Nyakaliro, Rwanda!`,
          url: window.location.href,
        });
      } catch {
        // dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="h-72 rounded-3xl bg-stone-200 animate-pulse" />
        <div className="h-10 w-2/3 rounded-xl bg-stone-200 animate-pulse" />
        <div className="h-32 rounded-2xl bg-stone-200 animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-stone-900">Event Not Found</h2>
        <p className="text-stone-500 text-sm">
          We couldn't locate this event. It may have moved or been updated.
        </p>
        <Link
          to="/events"
          className="inline-block px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl"
        >
          Browse All Events
        </Link>
      </div>
    );
  }

  const minPrice = Math.min(...event.ticketTypes.map((t) => t.price));
  const isSoldOut = event.status === 'SOLD_OUT';

  return (
    <div className="pb-32 md:pb-16 bg-[#FAF8F5]">
      {/* Top Floating Mobile Navigation Bar */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md px-4 py-3 border-b border-stone-200/80 md:hidden flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-stone-200 shadow-sm text-stone-700 flex items-center gap-1 text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-xl bg-white border border-stone-200 shadow-sm text-stone-700"
          aria-label="Share event"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-8">
        {/* Hero Image with Overlay */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] bg-stone-900 shadow-lg">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-900/90 text-orange-400 border border-stone-700">
              {event.categoryName}
            </span>
          </div>

          <div className="absolute top-4 right-4 hidden md:flex">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-stone-900/80 backdrop-blur-md text-white border border-white/20 hover:bg-stone-800 transition-colors"
              title="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              IWACU Kids Rwanda
            </span>
            <h1 className="text-xl sm:text-3xl font-black leading-tight text-white">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Date, Time, Location Fast Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-stone-400 block">Date</span>
              <span className="font-extrabold text-stone-900 text-sm">{event.eventDate}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-stone-400 block">Time</span>
              <span className="font-extrabold text-stone-900 text-sm">
                {event.startTime} - {event.endTime}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-stone-400 block">Location</span>
              <span className="font-extrabold text-stone-900 text-xs sm:text-sm line-clamp-1">
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-stone-900">About This Celebration</h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {event.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-500">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              Target: {event.ageRange}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Capacity: {event.capacity} Attendees
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct MoMo & Airtel Money
            </span>
          </div>
        </section>

        {/* What's Included */}
        {event.whatsIncluded && event.whatsIncluded.length > 0 && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-stone-900">What's Included</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.whatsIncluded.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/40 border border-orange-100 text-xs sm:text-sm text-stone-800"
                >
                  <Check className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TICKET TYPES SELECTION SECTION */}
        <section id="tickets-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Select Your Access Tier
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                Available Ticket Types
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-500">
              Prices configured in RWF
            </span>
          </div>

          <TicketTypeSelector
            ticketTypes={event.ticketTypes}
            selectedTicketTypeId={selectedTicketType?.id || null}
            onSelectTicketType={handleSelectTicketType}
          />
        </section>

        {/* Location Map Visual & Directions */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-stone-900">Event Location & Venue</h2>
            <Link
              to="/location"
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              View Full Directions →
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-stone-900">{event.venue}</p>
            <p className="text-xs text-stone-500">{event.location}</p>
          </div>
          {/* Stylized map preview visual */}
          <div className="aspect-[21/9] rounded-2xl bg-stone-100 border border-stone-200 relative overflow-hidden flex items-center justify-center p-6 text-center">
            <div className="space-y-2 max-w-sm">
              <MapPin className="w-8 h-8 text-orange-600 mx-auto animate-bounce" />
              <p className="font-extrabold text-sm text-stone-900">Nyakaliro Cultural Arena</p>
              <p className="text-xs text-stone-500">
                Easy public transport and family parking available on arrival.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {event.faqs && event.faqs.length > 0 && (
          <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-3">
              {event.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <h4 className="font-bold text-sm text-stone-900">{faq.question}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* STICKY BOTTOM PURCHASE BAR FOR MOBILE & DESKTOP DOCK */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-4 py-3 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-stone-400 block">
              {selectedTicketType ? selectedTicketType.name : 'Starts From'}
            </span>
            <div className="text-lg sm:text-2xl font-black text-stone-900">
              {selectedTicketType
                ? `${(selectedTicketType.price * selectedQuantity).toLocaleString()} RWF`
                : `From ${minPrice.toLocaleString()} RWF`}
              {selectedTicketType && selectedQuantity > 1 && (
                <span className="text-xs font-semibold text-stone-500 ml-1">
                  ({selectedQuantity}x)
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceedToCheckout}
            disabled={isSoldOut}
            className={`px-6 sm:px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-md flex items-center gap-2 ${
              isSoldOut
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white shadow-orange-600/30'
            }`}
          >
            <TicketIcon className="w-4 h-4" />
            <span>{isSoldOut ? 'SOLD OUT' : 'BUY TICKETS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
