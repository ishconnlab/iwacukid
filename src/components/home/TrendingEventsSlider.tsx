import { useState, useEffect, useRef, TouchEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react';
import { Event } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  events: Event[];
}

export function TrendingEventsSlider({ events }: Props) {
  const { isRw } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch and drag swipe state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // If no events loaded yet, use fallback placeholder items
  const displayEvents = events.length > 0 ? events : [
    {
      id: 'evt-trad-dance-2026',
      title: 'Traditional Dance Festival & Drum Showcase',
      slug: 'traditional-dance-festival',
      categoryName: 'Traditional Dance',
      eventDate: '2026-09-12',
      eventTime: '13:00 - 17:30',
      location: 'Nyakaliro Cultural Amphitheatre',
      shortDescription: 'Spectacular youth Intore dance performances, live drumming, and cultural storytelling.',
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      ticketTypes: [{ price: 1000 }],
    } as any,
    {
      id: 'evt-modern-dance-2026',
      title: 'Modern Kids Dance & Afro-Beats Showcase',
      slug: 'modern-kids-dance-show',
      categoryName: 'Modern Dance',
      eventDate: '2026-09-19',
      eventTime: '14:00 - 18:00',
      location: 'Nyakaliro Youth Arena',
      shortDescription: 'High-energy youth afro-fusion, choreography battles, and modern street dance in Nyakaliro.',
      coverImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
      ticketTypes: [{ price: 1000 }],
    } as any,
    {
      id: 'evt-summer-fest-2026',
      title: 'IWACU Youth Summer Fun Gala & Family Carnival',
      slug: 'youth-summer-fun-gala',
      categoryName: 'Summer Events',
      eventDate: '2026-09-26',
      eventTime: '11:00 - 18:30',
      location: 'Nyakaliro Recreation Park',
      shortDescription: 'Inflatables, cultural games, face painting, music stages, and talent exhibitions.',
      coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
      ticketTypes: [{ price: 1000 }],
    } as any,
  ];

  const total = displayEvents.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Automatic right-to-left slide interval (moves forward to next slide)
  useEffect(() => {
    if (isPaused || isDragging || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, total, currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    setTouchEndX(currentX);
    setDragOffset(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (diff > minSwipeDistance) {
      // Swiped Left -> Advance to next slide
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      // Swiped Right -> Go to previous slide
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e: MouseEvent) => {
    setTouchStartX(e.clientX);
    setTouchEndX(null);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || touchStartX === null) return;
    const currentX = e.clientX;
    setTouchEndX(currentX);
    setDragOffset(currentX - touchStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset(0);
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      const minSwipeDistance = 50;
      if (diff > minSwipeDistance) {
        nextSlide();
      } else if (diff < -minSwipeDistance) {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const currentEvent = displayEvents[currentIndex];
  const lowestPrice = currentEvent.ticketTypes?.length
    ? Math.min(...currentEvent.ticketTypes.map((t: any) => t.price))
    : 1000;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-sm">
              <Flame className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {isRw ? 'Ibyamamare i Nyakaliro' : 'Trending Events Gallery'}
                </h3>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                  {isRw ? 'Gusikana ku ifoto' : 'Swipeable'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {isRw
                  ? 'Ibirori bishyushye birimo gukurikirwa cyane • Kanda cyangwa unyaze witegereze'
                  : 'High-demand upcoming spectacles • Swipe or explore automatic right-to-left showcase'}
              </p>
            </div>
          </div>

          {/* Autoplay toggle and arrows */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors text-xs font-bold flex items-center gap-1"
              title={isPaused ? 'Start auto-slide' : 'Pause auto-slide'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-orange-600" /> : <Pause className="w-3.5 h-3.5 text-stone-600" />}
              <span className="hidden sm:inline text-[11px]">{isPaused ? 'Play' : 'Pause'}</span>
            </button>

            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous event"
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-orange-500 hover:text-orange-600 shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next event"
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-orange-500 hover:text-orange-600 shadow-xs transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SWIPEABLE SLIDER CONTAINER */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            if (isDragging) handleMouseUp();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative overflow-hidden rounded-3xl bg-stone-950 text-white shadow-2xl border border-stone-800 select-none cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Main Slide Card */}
          <div
            className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] flex items-end transition-transform duration-500 ease-out"
            style={{
              transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0px)',
            }}
          >
            {/* Background High-Res Image with smooth fade */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentEvent.coverImage}
                alt={currentEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform scale-105 transition-all duration-700 brightness-[0.75]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />
            </div>

            {/* Slide Content Overlay */}
            <div className="relative z-10 p-5 sm:p-8 lg:p-10 w-full max-w-4xl space-y-4">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                  <Flame className="w-3.5 h-3.5" />
                  <span>#{currentIndex + 1} {isRw ? 'Bikunzwe cyane' : 'Trending'}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  <span>{currentEvent.categoryName || 'Cultural Performance'}</span>
                </span>

                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
                  {isRw ? 'Amatike ari kugurwa vuba' : 'Fast Selling'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h4 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-md">
                  {currentEvent.title}
                </h4>
                <p className="text-stone-300 text-xs sm:text-sm lg:text-base line-clamp-2 max-w-2xl leading-relaxed">
                  {currentEvent.shortDescription}
                </p>
              </div>

              {/* Details & CTA bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-200 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>{currentEvent.eventDate}</span>
                    {currentEvent.eventTime && (
                      <span className="text-stone-400">({currentEvent.eventTime})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>{currentEvent.location || 'Nyakaliro, Rwanda'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">
                      {isRw ? 'Igiciro gitangirira kuri' : 'Starting from'}
                    </span>
                    <span className="text-base sm:text-lg font-black text-orange-400">
                      {lowestPrice.toLocaleString()} <span className="text-xs text-stone-400">RWF</span>
                    </span>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/events/${currentEvent.slug}`}
                    className="px-5 py-3 sm:px-6 sm:py-3.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-orange-600/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{isRw ? 'Gura Itike Nonaha' : 'Get Tickets Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile swipe helper hint */}
            <div className="absolute top-4 right-4 z-20 md:hidden bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-300 border border-white/10 flex items-center gap-1 pointer-events-none">
              <span>👈 {isRw ? 'Nyaza' : 'Swipe'} 👉</span>
            </div>
          </div>

          {/* Dots Indicator at the Bottom */}
          <div className="absolute bottom-3 right-4 sm:right-8 z-20 flex items-center gap-1.5">
            {displayEvents.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-orange-500 shadow-sm'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
