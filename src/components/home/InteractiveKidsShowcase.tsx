import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Info,
  ChevronRight,
  ShieldCheck,
  Heart,
  Music,
  Eye,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Hotspot {
  id: string;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  titleRw: string;
  titleEn: string;
  descRw: string;
  descEn: string;
  badgeRw: string;
  badgeEn: string;
}

interface ShowcaseItem {
  id: string;
  titleRw: string;
  titleEn: string;
  categoryRw: string;
  categoryEn: string;
  imageSrc: string;
  descriptionRw: string;
  descriptionEn: string;
  rhythmBpm: number;
  hotspots: Hotspot[];
}

const SHOWCASES: ShowcaseItem[] = [
  {
    id: 'dance-heritage',
    titleRw: "Itorero Ry'Abato ry'i Nyakaliro",
    titleEn: 'Nyakaliro Youth Cultural Dance Troupe',
    categoryRw: 'Imbyino Gakondo • Amaraba',
    categoryEn: 'Traditional Dance • Amaraba',
    imageSrc: '/src/assets/images/rwanda_kids_dance_1788635866082.jpg',
    descriptionRw:
      "Abana bato b'i Nyakaliro bitoza gushayaya, gushyira amaboko mu kirere no gutera amabaheku mu mbyino gakondo zishimisha umuryango nyarwanda.",
    descriptionEn:
      'Young children in Nyakaliro master the grace of Umushayayo, poised arm movements, and celebratory footwork honoring Rwandan traditions.',
    rhythmBpm: 104,
    hotspots: [
      {
        id: 'hotspot-1',
        xPercent: 32,
        yPercent: 38,
        titleRw: 'Umushanana & Umuringa',
        titleEn: 'Umushanana & Ceremonial Regalia',
        descRw: 'Imyenda y’agaciro k’umuco w’u Rwanda yambarwa mu birori by’abana n’abakuru.',
        descEn: 'Authentic ceremonial silk draped attire worn during joyous youth milestones.',
        badgeRw: 'Umuco',
        badgeEn: 'Heritage',
      },
      {
        id: 'hotspot-2',
        xPercent: 68,
        yPercent: 35,
        titleRw: 'Amasaro n’Urushako',
        titleEn: 'Traditional Headband & Beadwork',
        descRw: 'Ibisabo n’amasaro bitatse ku mutwe bigaragaza ubwiza n’icyubahiro cy’umunyarwandakazi.',
        descEn: 'Intricately beaded crown headpieces symbolizing dignity, grace, and pride.',
        badgeRw: 'Ubuhanzi',
        badgeEn: 'Artistry',
      },
      {
        id: 'hotspot-3',
        xPercent: 50,
        yPercent: 82,
        titleRw: 'Amayugi ku maguru',
        titleEn: 'Amayugi Ankle Rattles',
        descRw: 'Utwuma tw’amayugi twometswe ku birenge bitanga injyana ihuza n’intambwe z’ababyinnyi.',
        descEn: 'Hand-forged rhythmic bells strapped to ankles that accentuate every dance step.',
        badgeRw: 'Injyana',
        badgeEn: 'Rhythm',
      },
    ],
  },
  {
    id: 'drums-rhythm',
    titleRw: "Ingoma z'u Rwanda & Urugwiro",
    titleEn: 'The Royal Ingoma Drumming Academy',
    categoryRw: 'Ingoma • Umuco Nyarwanda',
    categoryEn: 'Sacred Drums • Cultural Pulse',
    imageSrc: '/src/assets/images/rwanda_kids_drums_1788635879270.jpg',
    descriptionRw:
      "Abaramyi b'abato i Nyakaliro bavugiriza hamwe ingoma n'imitozo, biga umubare w'ingoma n'ubufatanye mu gushimisha abari mu birori.",
    descriptionEn:
      'Youth percussionists in Nyakaliro practice resonant drum calls, building discipline, musical stamina, and collective joy for festival visitors.',
    rhythmBpm: 120,
    hotspots: [
      {
        id: 'hotspot-drum-1',
        xPercent: 44,
        yPercent: 62,
        titleRw: 'Ingoma y’Igiti Cyabajwe',
        titleEn: 'Hand-Carved Wooden Drum',
        descRw: 'Ikozwe mu giti cy’umuvumu n’uruhu rw’inka y’inyambo, itanga ijwi ritigisa ikirere.',
        descEn: 'Crafted from hollowed native cedar and taut cowhide to generate deep resonant tones.',
        badgeRw: 'Igikoresho',
        badgeEn: 'Instrument',
      },
      {
        id: 'hotspot-drum-2',
        xPercent: 72,
        yPercent: 42,
        titleRw: 'Imirishyo n’Imbaraga',
        titleEn: 'Drumsticks & Syncopation',
        descRw: 'Ibiti by’imirishyo bifashishwa n’abato batanga injyana y’amarushanwa n’umunezero.',
        descEn: 'Balanced wooden drumsticks creating rapid celebratory syncopated tempos.',
        badgeRw: 'Umuvuduko',
        badgeEn: 'Syncopation',
      },
    ],
  },
  {
    id: 'modern-afro',
    titleRw: "Imbyino Zigezweho z'Abana",
    titleEn: 'Modern Afro-Choreography & Battles',
    categoryRw: 'Imbyino Zigezweho • Hip-hop',
    categoryEn: 'Afro-Beats & Youth Battles',
    imageSrc: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    descriptionRw:
      "Imbyino zigezweho zihuza injyana y'Afurika (Afro-beats), imbaraga z'abato, n'amarushanwa meza abera mu birori bya IWACU Kids.",
    descriptionEn:
      'Energetic choreography combining contemporary African street rhythms, acrobatic freestyle, and empowering friendly team battles.',
    rhythmBpm: 112,
    hotspots: [
      {
        id: 'hotspot-mod-1',
        xPercent: 52,
        yPercent: 40,
        titleRw: 'Afro-beat & Amapiano Choreo',
        titleEn: 'Afrobeat & Contemporary Steps',
        descRw: 'Guhuza ingufu z’ubu n’umuco w’abana i Nyakaliro.',
        descEn: 'Youthful fusion of modern African global pop rhythms with local storytelling.',
        badgeRw: 'Urubyiruko',
        badgeEn: 'Youth',
      },
    ],
  },
];

export function InteractiveKidsShowcase() {
  const { t, isRw } = useLanguage();
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({
    'dance-heritage': 148,
    'drums-rhythm': 234,
    'modern-afro': 189,
  });
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const showcase = SHOWCASES[activeShowcaseIndex];

  // Synthesize rhythmic drum pattern using Web Audio API
  const playTraditionalDrumAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const tempo = 60 / showcase.rhythmBpm;
      const totalBeats = 16;

      for (let i = 0; i < totalBeats; i++) {
        const time = audioCtx.currentTime + i * tempo * 0.5;

        // Bass drum kick (low frequency sweep)
        if (i % 4 === 0 || i === 6 || i === 10 || i === 14) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.frequency.setValueAtTime(140, time);
          osc.frequency.exponentialRampToValueAtTime(38, time + 0.18);
          gain.gain.setValueAtTime(0.7, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

          osc.start(time);
          osc.stop(time + 0.25);
        }

        // Mid/high wooden rim click / rattle
        if (i % 2 === 1 || i % 4 === 2) {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(480 + (i % 3) * 60, time);
          gain2.gain.setValueAtTime(0.3, time);
          gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

          osc2.start(time);
          osc2.stop(time + 0.08);
        }
      }

      setTimeout(() => {
        setIsPlayingAudio(false);
      }, totalBeats * tempo * 500);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const toggleLike = (id: string) => {
    setUserLiked((prev) => {
      const current = !!prev[id];
      const next = !current;
      setLikesCount((lc) => ({
        ...lc,
        [id]: (lc[id] || 100) + (next ? 1 : -1),
      }));
      return { ...prev, [id]: next };
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.cultureSectionEyebrow}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-2">
            {t.cultureSectionTitle}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1">
            {t.cultureSectionSubtitle}
          </p>
        </div>

        {/* Audio Drum Rhythm Trigger */}
        <button
          type="button"
          onClick={playTraditionalDrumAudio}
          className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 ${
            isPlayingAudio
              ? 'bg-orange-600 text-white animate-pulse'
              : 'bg-stone-900 hover:bg-orange-600 text-white'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>{t.drumSoundPlaying}</span>
            </>
          ) : (
            <>
              <Music className="w-4 h-4" />
              <span>{t.drumSoundBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SHOWCASES.map((item, idx) => {
          const isActive = idx === activeShowcaseIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveShowcaseIndex(idx);
                setActiveHotspot(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <span>{isRw ? item.categoryRw : item.categoryEn}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Interactive Image Frame with Hotspots */}
          <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] bg-stone-900 overflow-hidden group">
            <img
              src={showcase.imageSrc}
              alt={isRw ? showcase.titleRw : showcase.titleEn}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30 pointer-events-none" />

            {/* Instruction helper tag */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.interactiveHotspotInstruction}</span>
              </div>
            </div>

            {/* Zoom / Fullscreen Button */}
            <button
              type="button"
              onClick={() => setZoomModalOpen(true)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-lg transition-transform hover:scale-110"
              title="Inspect Details"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Interactive Hotspots Pins */}
            {showcase.hotspots.map((hs) => {
              const isSelected = activeHotspot?.id === hs.id;
              return (
                <div
                  key={hs.id}
                  style={{ top: `${hs.yPercent}%`, left: `${hs.xPercent}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                >
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(isSelected ? null : hs)}
                    className="relative flex items-center justify-center group/pin focus:outline-none"
                    aria-label={isRw ? hs.titleRw : hs.titleEn}
                  >
                    {/* Glowing pulsating radar ring */}
                    <span className="absolute w-8 h-8 rounded-full bg-orange-500/50 animate-ping" />
                    {/* Core Button */}
                    <span
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-xl border-2 transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white border-white scale-125 ring-4 ring-orange-500/40'
                          : 'bg-stone-900/90 hover:bg-orange-600 text-white border-orange-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Desktop Floating Tooltip Card */}
                  {isSelected && (
                    <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-stone-900/95 border border-orange-500/40 text-white shadow-2xl backdrop-blur-md z-30 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-600 text-white">
                          {isRw ? hs.badgeRw : hs.badgeEn}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveHotspot(null)}
                          className="text-stone-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-extrabold text-xs text-white">
                        {isRw ? hs.titleRw : hs.titleEn}
                      </h4>
                      <p className="text-[11px] text-stone-300 mt-1 leading-snug">
                        {isRw ? hs.descRw : hs.descEn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Title Bar overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 block">
                  {isRw ? showcase.categoryRw : showcase.categoryEn}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white line-clamp-1">
                  {isRw ? showcase.titleRw : showcase.titleEn}
                </h3>
              </div>

              {/* Like / Heart Counter */}
              <button
                type="button"
                onClick={() => toggleLike(showcase.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-bold transition-all ${
                  userLiked[showcase.id]
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${userLiked[showcase.id] ? 'fill-red-400 text-red-400' : ''}`}
                />
                <span>{likesCount[showcase.id]}</span>
              </button>
            </div>
          </div>

          {/* Side Info & Hotspot Breakdown Panel */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-white bg-stone-900/90 border-t lg:border-t-0 lg:border-l border-stone-800">
            <div className="space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-600/20 text-orange-400 text-[11px] font-bold uppercase mb-2">
                  <Award className="w-3 h-3" />
                  <span>Nyakaliro Cultural Pillar</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {isRw ? showcase.titleRw : showcase.titleEn}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {isRw ? showcase.descriptionRw : showcase.descriptionEn}
              </p>

              {/* Hotspots Interactive Selection List */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-400 block">
                  {isRw ? 'Ibikoresho byatunganyijwe' : 'Discovered Cultural Elements'}
                </span>
                <div className="space-y-2">
                  {showcase.hotspots.map((hs) => {
                    const isSelected = activeHotspot?.id === hs.id;
                    return (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() => setActiveHotspot(isSelected ? null : hs)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-orange-600/20 border-orange-500 text-orange-300 ring-1 ring-orange-500'
                            : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:border-stone-600'
                        }`}
                      >
                        <div>
                          <span className="font-black text-white block">
                            {isRw ? hs.titleRw : hs.titleEn}
                          </span>
                          <span className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                            {isRw ? hs.descRw : hs.descEn}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-700 text-stone-300 shrink-0">
                          {isRw ? hs.badgeRw : hs.badgeEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Ticket Action */}
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <Link
                to="/checkout"
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
              >
                <span>{t.eventBuyPass} (1,000 RWF)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.heroTrustQr} • MoMo / USSD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Resolution Zoom Modal */}
      {zoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-in fade-in"
          onClick={() => setZoomModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800 text-white">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {isRw ? showcase.titleRw : showcase.titleEn}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setZoomModalOpen(false)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <img
                src={showcase.imageSrc}
                alt={isRw ? showcase.titleRw : showcase.titleEn}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
