import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, Filter, Sparkles } from 'lucide-react';
import { Event, EventCategory } from '../types';
import { api } from '../api/client';
import { EventCard } from '../components/events/EventCard';

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [evts, cats] = await Promise.all([
          api.getEvents({
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            search: searchQuery || undefined,
          }),
          api.getCategories(),
        ]);
        setEvents(evts);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (!query.trim()) {
      params.delete('search');
    } else {
      params.set('search', query);
    }
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
          <Calendar className="w-3.5 h-3.5" />
          <span>Events in Nyakaliro, Rwanda</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Explore Kids & Youth Events
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          Discover traditional drum showcases, modern dance competitions, vacation holiday programs, and community festivals.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-stone-900 shadow-sm transition-all"
          />
        </div>

        {/* Category Pills (horizontal scroll on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-orange-400'
            }`}
          >
            All Events
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-orange-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-stone-200/70 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">No events found</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            We could not find any events matching your filter. Try adjusting your search term or select "All Events".
          </p>
          <button
            onClick={() => {
              setSearchParams({});
            }}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} featured={evt.featured} />
          ))}
        </div>
      )}
    </div>
  );
}
