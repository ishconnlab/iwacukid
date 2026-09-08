import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { ExternalLink, Navigation, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { SITE, directionsLink, mapsPinLink } from '../../lib/site';
import { useLanguage } from '../../context/LanguageContext';

interface MapViewProps {
  label?: string;
  address?: string;
  className?: string;
  zoom?: number;
}

export function MapView({
  label = SITE.name,
  address = SITE.region,
  className = '',
  zoom = 15,
}: MapViewProps) {
  const { t } = useLanguage();
  const center: [number, number] = [SITE.latitude, SITE.longitude];

  return (
    <div className={`relative z-0 ${className}`}>
      <div className="relative z-0 rounded-2xl overflow-hidden border border-stone-200 shadow-md">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          className="w-full h-[300px] sm:h-[380px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker
            center={center}
            radius={14}
            pathOptions={{
              color: '#c2410c',
              weight: 3,
              fillColor: '#ea580c',
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div className="text-xs leading-snug">
                <span className="block font-black text-stone-900">{label}</span>
                <span className="text-stone-500">{address}</span>
              </div>
            </Popup>
          </CircleMarker>
        </MapContainer>

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-stone-900/5" />
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a
          href={mapsPinLink(label)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-xs font-black transition-all"
        >
          <MapPin className="w-4 h-4 text-orange-400" />
          {t.mapOpenLabel}
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
        <a
          href={directionsLink(label)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition-all"
        >
          <Navigation className="w-4 h-4" />
          {t.mapDirectionsLabel}
        </a>
      </div>
    </div>
  );
}