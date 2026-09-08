import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Music,
  Sun,
  Users,
  Award,
  ChevronRight,
  QrCode,
  CreditCard,
} from 'lucide-react';
import { Event } from '../types';
import { api } from '../api/client';
import { EventCard } from '../components/events/EventCard';
import { TrendingEventsSlider } from '../components/home/TrendingEventsSlider';
import { InteractiveKidsShowcase } from '../components/home/InteractiveKidsShowcase';
import { VideoShowcase } from '../components/home/VideoShowcase';
import { Reveal } from '../components/common/Reveal';
import { useLanguage } from '../context/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featuredEvent = events.find((e) => e.featured) || events[0];

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-stone-900 text-white overflow-hidden border border-stone-800 shadow-2xl">
          {/* Hero backdrop video (autoplay, muted, loops) with poster fallback */}
          {featuredEvent && (
            <div className="absolute inset-0 z-0">
              {!videoFailed && (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={featuredEvent.coverImage}
                  onError={() => setVideoFailed(true)}
                  aria-hidden="true"
                >
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                    type="video/mp4"
                  />
                </video>
              )}
              {videoFailed && (
                <img
                  src={featuredEvent.coverImage}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  aria-hidden="true"
                />
              )}
            </div>
          )}

          {/* Subtle Cultural Pattern Background */}
          <div className="absolute inset-0 opacity-15 rwandan-pattern-line pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-900/60 z-10" />

          {/* Floating decorative particles */}
          <div className="pointer-events-none absolute top-8 right-10 w-24 h-24 rounded-full bg-orange-500/20 blur-3xl animate-aurora z-10" />
          <div className="pointer-events-none absolute bottom-16 left-6 w-28 h-28 rounded-full bg-amber-400/10 blur-3xl animate-aurora z-10" style={{ animationDelay: '1.8s' }} />

          {/* Hero Content Grid */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-14">
            <div className="lg:col-span-7 space-y-5">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span>{t.heroEyebrow}</span>
              </div>

              {/* Display Heading */}
              <div className="space-y-1 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase text-stone-400 block">
                  {t.brandName}
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                  {t.heroTitleLine1} <br />
                  <span className="text-shine">
                    {t.heroTitleHighlight}
                  </span>
                </h1>
              </div>

              {/* Subtitle tagline */}
              <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] text-amber-300/90 animate-fade-up" style={{ animationDelay: '0.18s' }}>
                {t.heroSubtitleTag}
              </p>

              <p className="text-stone-300 text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.26s' }}>
                {t.heroDescription}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '0.34s' }}>
                <Link
                  to="/events"
                  className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 min-h-[48px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.heroExploreBtn}</span>
                </Link>

                <Link
                  to="/checkout"
                  className="px-6 py-3.5 bg-stone-800/90 hover:bg-stone-700 active:scale-95 text-stone-200 text-xs sm:text-sm font-bold rounded-2xl border border-stone-700 transition-all flex items-center gap-2 min-h-[48px]"
                >
                  <span>{t.heroBuyTicketsBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-400 animate-fade-up" style={{ animationDelay: '0.42s' }}>
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.heroTrustQr}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span>{t.heroTrustMtn}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span>{t.heroTrustAirtel}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <span>{t.heroTrustUssd}</span>
                </div>
              </div>
            </div>

            {/* Featured Hero Card Showcase */}
            {featuredEvent && (
              <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="relative rounded-2xl overflow-hidden bg-stone-800/80 border border-stone-700/80 shadow-2xl p-4 sm:p-5 backdrop-blur-sm hover:border-orange-500/60 transition-colors group">
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {t.heroNextEvent}
                    </span>
                    <span className="text-xs font-bold text-stone-400">Nyakaliro</span>
                  </div>

                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                    <img
                      src={featuredEvent.coverImage}
                      alt={featuredEvent.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-extrabold text-base sm:text-lg line-clamp-1">
                        {featuredEvent.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-300 mt-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-orange-400" />
                        <span>{featuredEvent.eventDate}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{featuredEvent.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-stone-400 block">
                        {t.heroStartingFrom}
                      </span>
                      <span className="text-lg font-black text-orange-400">
                        1,000 <span className="text-xs font-bold text-stone-400">RWF</span>
                      </span>
                    </div>

                    <Link
                      to={`/events/${featuredEvent.slug}`}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all"
                    >
                      {t.eventBuyPass}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK STATS STRIP */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Calendar, label: t.landingStatsEvents, value: '40+' },
              { icon: Users, label: t.landingStatsMembers, value: '2,000+' },
              { icon: Sparkles, label: t.landingStatsSessions, value: '120+' },
              { icon: MapPin, label: t.landingStatsVenue, value: '100%' },
            ].map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-orange-500/60 hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black shrink-0">
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-lg font-black text-stone-900 block leading-none">{s.value}</span>
                  <span className="text-[11px] text-stone-500 leading-tight block truncate">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* HOW IT WORKS */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/15 border border-orange-500/30 text-orange-700 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {t.howItWorksEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t.howItWorksTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
              {t.howItWorksDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Calendar, title: t.stepPickTitle, desc: t.stepPickDesc, step: '01' },
              { icon: CreditCard, title: t.stepPayTitle, desc: t.stepPayDesc, step: '02' },
              { icon: QrCode, title: t.stepJoinTitle, desc: t.stepJoinDesc, step: '03' },
            ].map((s) => (
              <div
                key={s.step}
                className="relative group p-6 rounded-3xl bg-white border border-stone-200/90 hover:border-orange-500/60 hover:shadow-xl transition-all overflow-hidden"
              >
                <span className="absolute -top-4 -right-2 text-7xl font-black text-stone-100 group-hover:text-orange-100 transition-colors select-none">
                  {s.step}
                </span>
                <div className="relative w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="relative mt-4 font-extrabold text-sm sm:text-base text-stone-900">
                  {s.title}
                </h3>
                <p className="relative mt-1.5 text-xs text-stone-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* SWIPEABLE TRENDING EVENTS SLIDER (AUTOMATIC RIGHT-TO-LEFT) */}
      <TrendingEventsSlider events={events} />

      {/* QUICK CATEGORY CHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Reveal delay={0} className="h-full">
            <Link
              to="/events?category=traditional-dance"
              className="h-full p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-orange-500 hover:shadow-md transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Music className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-orange-600">
                  {t.catTraditional}
                </h4>
                <span className="text-[11px] text-stone-500 block truncate">{t.catTraditionalSub}</span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={1} className="h-full">
            <Link
              to="/events?category=modern-dance"
              className="h-full p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-orange-500 hover:shadow-md transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-orange-600">
                  {t.catModern}
                </h4>
                <span className="text-[11px] text-stone-500 block truncate">{t.catModernSub}</span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={2} className="h-full">
            <Link
              to="/events?category=summer-events"
              className="h-full p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-orange-500 hover:shadow-md transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Sun className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-orange-600">
                  {t.catSummer}
                </h4>
                <span className="text-[11px] text-stone-500 block truncate">{t.catSummerSub}</span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={3} className="h-full">
            <Link
              to="/programs"
              className="h-full p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-orange-500 hover:shadow-md transition-all group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-orange-600">
                  {t.catVacation}
                </h4>
                <span className="text-[11px] text-stone-500 block truncate">{t.catVacationSub}</span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE IMAGES SPOTLIGHT (CULTURAL DISCOVERY & SOUNDS) */}
      <Reveal>
        <InteractiveKidsShowcase />
      </Reveal>

      {/* WELCOME VIDEO — MENYA IWACU KIDS */}
      <VideoShowcase />

      {/* UPCOMING EVENTS DISCOVERY */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              {t.brandTagline}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t.upcomingSectionTitle}
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-2xl bg-stone-200/70 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 6).map((evt, i) => (
                <div key={evt.id}>
                  <EventCard event={evt} featured={evt.featured} />
                </div>
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* LEADERSHIP & BRAND PHILOSOPHY BANNER */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 lg:p-14 border border-stone-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-orange-400">
                {t.leadershipEyebrow}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
                {t.leadershipQuote}
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {t.leadershipDesc}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-600/30 border-2 border-orange-500 flex items-center justify-center font-bold text-orange-400 text-lg">
                    C
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{t.ceoNameTitle}</h4>
                    <span className="text-xs text-stone-400">{t.ceoBadge}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80">
                <Award className="w-5 h-5 text-orange-400 mb-1" />
                <h5 className="font-bold text-sm text-white">{t.pillTraditionTitle}</h5>
                <p className="text-stone-400 text-xs mt-0.5">
                  {t.pillTraditionDesc}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/80">
                <Users className="w-5 h-5 text-orange-400 mb-1" />
                <h5 className="font-bold text-sm text-white">{t.pillCommunityTitle}</h5>
                <p className="text-stone-400 text-xs mt-0.5">
                  {t.pillCommunityDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>
      </Reveal>
    </div>
  );
}

