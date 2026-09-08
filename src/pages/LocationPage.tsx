import { MapPin, Navigation, Bus, Car, Shield, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LocationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
          <MapPin className="w-3.5 h-3.5" />
          <span>Event Grounds & Arrival Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Find Us in Nyakaliro, Rwanda
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          All IWACU Kids cultural events, dance competitions, and vacation programs take place in welcoming community venues in Nyakaliro.
        </p>
      </div>

      {/* Main Location Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Nyakaliro Cultural & Youth Grounds
            </h2>
            <p className="text-sm text-stone-500 mt-1">Nyakaliro Sector, Eastern Province, Rwanda</p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure Family Campus</span>
          </div>
        </div>

        {/* Visual Map Graphic */}
        <div className="aspect-[16/9] sm:aspect-[21/9] rounded-2xl bg-stone-900 border border-stone-800 text-white relative overflow-hidden flex items-center justify-center p-6 text-center">
          <div className="space-y-2 max-w-md z-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-600/40 animate-bounce">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg sm:text-xl">IWACU Kids Main Arena</h3>
            <p className="text-stone-300 text-xs sm:text-sm">
              Coordinates & Gate Entry: Nyakaliro Community Center Gate A
            </p>
          </div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-20 rwandan-pattern-line pointer-events-none" />
        </div>

        {/* Transportation & Directions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Bus className="w-4 h-4 text-orange-600" />
              <span>By Public Transport</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Regular buses and local minibuses connect Kigali and surrounding centers to the Nyakaliro commercial stop. From the main junction, the event grounds are a 3-minute safe walk.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Car className="w-4 h-4 text-orange-600" />
              <span>By Car / Family Drop-Off</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dedicated, monitored parking available for families with children. Marked passenger drop-off zones right beside the primary ticket verification gate.
            </p>
          </div>
        </div>

        {/* Contact placeholder */}
        <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 text-xs text-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-semibold">
            Need directions on event day? Contact our gate coordination desk.
          </span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-orange-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> +250 788 000 000 (Editable)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
