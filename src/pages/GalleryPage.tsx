import { useState, useEffect } from 'react';
import { Camera, X, Sparkles, Filter } from 'lucide-react';
import { GalleryItem } from '../types';
import { api } from '../api/client';

export function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Events', 'Dance', 'Kids', 'Summer', 'Behind the Scenes'];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await api.getGallery(selectedCategory === 'All' ? undefined : selectedCategory);
        setGallery(data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
          <Camera className="w-3.5 h-3.5" />
          <span>Moments & Highlights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          IWACU Kids Photo Gallery
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          Glimpses into our vibrant dance recitals, drumming circles, summer camps, and community smiles in Nyakaliro, Rwanda.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-orange-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Masonry/Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : gallery.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
          <p className="text-stone-500 text-sm">No photos found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer aspect-square shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  {item.category}
                </span>
                <h4 className="font-bold text-sm leading-tight">{item.title}</h4>
                <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-black">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 space-y-1">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {activeItem.category}
              </span>
              <h3 className="text-lg font-black">{activeItem.title}</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activeItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
