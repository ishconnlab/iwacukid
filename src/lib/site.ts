// Centralized IWACU KIDS site configuration.
// NOTE: update SUPPORT_PHONE / WHATSAPP_NUMBER / EMAIL with the real
// organization contacts before going live.

export const SITE = {
  name: 'IWACU KIDS',
  shortName: 'IWACU KIDS',
  tagline: 'Umuco, Ubuhanga n’Impano by’abana',
  email: 'info@iwacukids.rw',
  // International format, digits only (no '+'). Replace placeholders with real numbers.
  supportPhoneDigits: '250788000000',
  supportPhoneDisplay: '+250 788 000 000',
  location: 'Nyakaliro, Rwamagana — Rwanda',
  region: 'Nyakaliro, Rwamagana District, Eastern Province, Rwanda',
  // Nyakaliro locality, Rwamagana District (approximate venue center)
  latitude: -2.05054,
  longitude: 30.25535,
  ussdCode: '*182*8*1#',
  ceoName: 'Coopstar',
  ceoRole: 'CEO, IWACU Kids',
  // Official social handles — replace the placeholder destinations below
  // with the real IWACU KIDS accounts before launch.
  socials: {
    youtube: 'https://www.youtube.com/results?search_query=IWACU+KIDS+Rwanda',
    tiktok: 'https://www.tiktok.com/search?q=IWACU%20KIDS%20Rwanda',
    instagram: 'https://www.instagram.com/',
    spotify: 'https://open.spotify.com/',
    facebook: 'https://www.facebook.com/',
  },
  // Partner organisations — replace the placeholder URL with the real site.
  partners: {
    ishconnect: {
      name: 'IshConnect',
      url: 'https://ishconnect.rw',
    },
  },
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.supportPhoneDigits}?text=${encodeURIComponent(message)}`;
}

export function directionsLink(label: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${SITE.latitude},${SITE.longitude}&travelmode=driving&destination_place_id=${encodeURIComponent(label)}`;
}

export function mapsPinLink(label: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${label} ${SITE.location}`)}`;
}