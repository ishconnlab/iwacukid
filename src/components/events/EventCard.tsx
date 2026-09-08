import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  featured?: boolean;
  key?: string | number;
}

export function EventCard({ event, featured }: EventCardProps) {
  // Format date parts
  const dateObj = new Date(event.eventDate + 'T00:00:00');
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  // Find lowest price
  const prices = event.ticketTypes.map((t) => t.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 1000;

  const isSoldOut = event.status === 'SOLD_OUT';

  return (
    <article
      className={`group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${
        featured ? 'ring-1 ring-orange-500/30' : ''
      }`}
    >
      {/* Image Container with Date Badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-stone-900/85 backdrop-blur-md text-orange-400 border border-stone-700/50">
          {event.categoryName}
        </span>

        {/* Status or Featured */}
        {isSoldOut ? (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black uppercase bg-red-600 text-white shadow-sm">
            SOLD OUT
          </span>
        ) : featured ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-orange-600 text-white shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Next Event
          </span>
        ) : null}

        {/* Date Stamp Square */}
        <div className="absolute bottom-3 left-3 bg-white rounded-xl p-2 text-center shadow-md min-w-[52px]">
          <span className="block text-lg font-extrabold text-stone-900 leading-none">{day}</span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-600">
            {month}
          </span>
        </div>

        {/* Price Tag in Corner */}
        <div className="absolute bottom-3 right-3 bg-stone-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10">
          From <span className="text-orange-400 font-extrabold">{minPrice.toLocaleString()} RWF</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              {event.startTime} - {event.endTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {event.location}
            </span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        {/* CTA Bar */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            {isSoldOut ? 'Join waiting list' : 'Instant mobile ticketing'}
          </span>
          <Link
            to={`/events/${event.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSoldOut
                ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-sm'
            }`}
          >
            <span>{isSoldOut ? 'View Details' : 'GET TICKETS'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
