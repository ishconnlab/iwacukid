import { Link } from 'react-router-dom';
import { Award, Heart, Sparkles, Users, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 pb-24">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Heart</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          About IWACU KIDS
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Preserving Rwanda's cultural heritage by empowering children and youth through rhythm, traditional dance, drumming, and artistic celebrations.
        </p>
      </div>

      {/* Hero Visual / Cultural Quote */}
      <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 relative overflow-hidden border border-stone-800 shadow-xl">
        <div className="relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
            Nyakaliro, Rwanda
          </span>
          <h2 className="text-2xl sm:text-3xl font-black leading-snug">
            "IWACU means 'our home' in Kinyarwanda. Here, every child finds their voice, their rhythm, and their cultural belonging."
          </h2>
        </div>
      </div>

      {/* Leadership Profile: CEO Coopstar */}
      <section className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Executive Leadership
          </span>
          <h2 className="text-2xl font-black text-stone-900">Coopstar, Chief Executive Officer</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-3xl shadow-lg shrink-0">
            C
          </div>

          <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
            <p>
              As the Chief Executive Officer of IWACU Kids, <strong>Coopstar</strong> has dedicated his leadership to providing a vibrant, safe, and culturally enriching platform for children and youth throughout Nyakaliro and Rwanda.
            </p>
            <p>
              Under Coopstar's direction, IWACU Kids unites master traditional choreographers, contemporary dancers, and community educators to produce world-class youth events, summer holiday vacation camps, and accessible digital ticketing.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-bold text-stone-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" /> Nyakaliro, Rwanda
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Leadership
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Our Pillars
          </span>
          <h2 className="text-2xl font-black text-stone-900">The 5 Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-extrabold text-base text-stone-900">Culture</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Preserving traditional Rwandan dance, poetry, drumming (Ingoma), and indigenous heritage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-extrabold text-base text-stone-900">Creativity</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Empowering youth to innovate with modern afro-fusion dance, stage drama, and visual arts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-extrabold text-base text-stone-900">Talent</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Discovering and nurturing innate gifts with professional stage coaching and mentorship.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="font-extrabold text-base text-stone-900">Fun</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Creating joyful, memorable vacation programs, carnivals, and holiday festivals filled with play.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2 sm:col-span-2 md:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              5
            </div>
            <h3 className="font-extrabold text-base text-stone-900">Community</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Deeply rooted in Nyakaliro families, fostering solidarity, safe spaces, and accessible ticket prices for all children.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition-all"
        >
          <span>Explore Upcoming Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
