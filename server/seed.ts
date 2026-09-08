import {
  EventCategory,
  Event,
  TicketOrder,
  Ticket,
  PaymentTransaction,
  CheckInRecord,
  GalleryItem,
  Program,
  ContentSettings,
  AdminUser,
  AuditLog,
  USSDSettings,
  DatabaseSeed,
} from './types.js';

function now(): string {
  return new Date().toISOString();
}

export function getInitialSeed(): DatabaseSeed {
  const categories: EventCategory[] = [
    { id: 'cat-trad', name: 'Traditional Dance', slug: 'traditional-dance', description: 'Authentic Rwandan cultural rhythms, drumming, and traditional choreography.', icon: 'Drum' },
    { id: 'cat-mod', name: 'Modern Dance', slug: 'modern-dance', description: 'Contemporary afro-fusion, hip-hop, and creative youth choreography.', icon: 'Music' },
    { id: 'cat-summer', name: 'Summer Events', slug: 'summer-events', description: 'Sun-filled outdoor festivals, games, and creative celebrations.', icon: 'Sun' },
    { id: 'cat-vacation', name: 'Vacation Programs', slug: 'vacation-programs', description: 'Holiday training camps, mentorship, and creative arts workshops.', icon: 'Sparkles' },
    { id: 'cat-special', name: 'Special Events', slug: 'special-events', description: 'Annual cultural showcases, gala days, and community festivals.', icon: 'Award' },
  ];

  const events: Event[] = [
    {
      id: 'evt-trad-dance-2026',
      title: 'Traditional Dance Festival & Drum Showcase',
      slug: 'traditional-dance-festival',
      categoryId: 'cat-trad',
      categoryName: 'Traditional Dance',
      shortDescription: 'The premier youth cultural dance gathering featuring traditional drumming, Umushayayo, and Amaraba in Nyakaliro.',
      description: 'Join IWACU Kids for an electrifying cultural celebration where youth artists honor Rwandan heritage. Featuring energetic Intore warrior leaps, grace-filled Amaraba dance, and live Ingoma drumming.',
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      ],
      eventDate: '2026-09-12',
      startTime: '13:00',
      endTime: '17:30',
      location: 'Nyakaliro, Rwanda',
      venue: 'IWACU Cultural Amphitheatre, Nyakaliro Center',
      capacity: 500,
      status: 'PUBLISHED',
      featured: true,
      ageRange: 'All Ages (Kids, Youth & Families)',
      whatsIncluded: ['Entry to the main dance & drumming arena', 'Live cultural performances and storytelling', 'Secure on-site family grounds'],
      faqs: [
        { question: 'Can I pay with MTN MoMo or Airtel Money?', answer: 'Yes! Use MTN MoMo (*182#), Airtel Money (*500#), or a recommendation code at checkout.' },
        { question: 'Do children need their own ticket?', answer: 'Children under 3 enter free when accompanied by a ticket-holding adult.' },
      ],
      ticketTypes: [
        { id: 'tt-trad-standard', eventId: 'evt-trad-dance-2026', name: 'Standard Ticket', price: 1000, totalQuantity: 300, soldQuantity: 0, description: 'Standard event access with general lawn seating.', benefits: ['Full event access', 'Lawn seating'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
        { id: 'tt-trad-premium', eventId: 'evt-trad-dance-2026', name: 'Premium Ticket', price: 2000, totalQuantity: 150, soldQuantity: 0, description: 'Front circle amphitheatre seating with fast-track entry.', benefits: ['Priority entrance', 'Front circle seating'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
        { id: 'tt-trad-vip', eventId: 'evt-trad-dance-2026', name: 'VIP Experience', price: 3000, totalQuantity: 50, soldQuantity: 0, description: 'Exclusive hospitality tent with meet & greet.', benefits: ['VIP hospitality lounge', 'Meet & greet with Coopstar'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'evt-modern-dance-2026',
      title: 'Modern Kids Dance & Afro-Beats Showcase',
      slug: 'modern-kids-dance-show',
      categoryId: 'cat-mod',
      categoryName: 'Modern Dance',
      shortDescription: 'High-energy youth afro-fusion, choreography battles, and modern street dance in Nyakaliro.',
      description: 'Witness the boundless creativity of our young dancers as they blend traditional Rwandan rhythmic flair with modern choreography.',
      coverImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80'],
      eventDate: '2026-09-19',
      startTime: '14:00',
      endTime: '18:00',
      location: 'Nyakaliro, Rwanda',
      venue: 'Nyakaliro Youth Innovation Hall',
      capacity: 350,
      status: 'PUBLISHED',
      featured: true,
      ageRange: 'Ages 4 to 18 + Family Supporters',
      whatsIncluded: ['Entry to the modern dance main hall', 'Participation in open freestyle cypher', 'Live DJ sets'],
      faqs: [],
      ticketTypes: [
        { id: 'tt-mod-standard', eventId: 'evt-modern-dance-2026', name: 'Standard Ticket', price: 1000, totalQuantity: 200, soldQuantity: 0, description: 'Access to general viewing floor.', benefits: ['Auditorium entrance', 'Public dance sessions'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
        { id: 'tt-mod-premium', eventId: 'evt-modern-dance-2026', name: 'Premium Pass', price: 2000, totalQuantity: 100, soldQuantity: 0, description: 'Reserved tiered bleacher seating.', benefits: ['Tiered premium seats', 'Warm-up access'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
        { id: 'tt-mod-vip', eventId: 'evt-modern-dance-2026', name: 'VIP Backstage Supporter', price: 3000, totalQuantity: 50, soldQuantity: 0, description: 'Front stage box and official crew badge.', benefits: ['Front stage lounge', 'Complimentary refreshments'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'evt-summer-fest-2026',
      title: 'IWACU Summer Kids Cultural Carnival',
      slug: 'iwacu-summer-celebration',
      categoryId: 'cat-summer',
      categoryName: 'Summer Events',
      shortDescription: 'Full day of fun, outdoor games, traditional craft workshops, music, and talent competitions.',
      description: 'The ultimate vacation holiday celebration packed with outdoor cultural games, face painting, clay pottery, and kid-friendly obstacle races.',
      coverImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80'],
      eventDate: '2026-10-03',
      startTime: '10:00',
      endTime: '17:00',
      location: 'Nyakaliro, Rwanda',
      venue: 'Nyakaliro Community Sports & Cultural Park',
      capacity: 600,
      status: 'PUBLISHED',
      featured: true,
      ageRange: 'Ages 3 to 16 & Parents',
      whatsIncluded: ['Full day festival access', 'All game zones and craft materials', 'Kids talent stage auditions'],
      faqs: [],
      ticketTypes: [
        { id: 'tt-summer-standard', eventId: 'evt-summer-fest-2026', name: 'Standard Ticket', price: 1000, totalQuantity: 350, soldQuantity: 0, description: 'All-day festival entry.', benefits: ['Festival access', 'Field games'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
        { id: 'tt-summer-premium', eventId: 'evt-summer-fest-2026', name: 'Premium Explorer', price: 2000, totalQuantity: 180, soldQuantity: 0, description: 'Includes craft kit and face painting.', benefits: ['Craft materials', 'Face painting'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
        { id: 'tt-summer-vip', eventId: 'evt-summer-fest-2026', name: 'VIP Family Pass', price: 3000, totalQuantity: 70, soldQuantity: 0, description: 'Shaded VIP canopy and lunch voucher.', benefits: ['Canopy lounge', 'Lunch included'], status: 'ACTIVE', createdAt: now(), updatedAt: now() },
      ],
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const gallery: GalleryItem[] = [
    { id: 'gal-1', title: 'Youth Ingoma Drum Ensemble', category: 'Dance', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', caption: 'Young drummers maintaining the sacred pulse of Rwandan rhythm.', order: 1, isPublic: true, createdAt: now() },
    { id: 'gal-2', title: 'Amaraba Traditional Grace', category: 'Dance', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80', caption: 'Graceful choreography celebrating Rwandan elegance.', order: 2, isPublic: true, createdAt: now() },
    { id: 'gal-3', title: 'Afro-Beats Modern Battle', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80', caption: 'Youth crews displaying explosive agility.', order: 3, isPublic: true, createdAt: now() },
    { id: 'gal-4', title: 'Summer Camp Joy', category: 'Summer', imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80', caption: 'Friendships formed through collaborative art and games.', order: 4, isPublic: true, createdAt: now() },
  ];

  const programs: Program[] = [
    { id: 'prog-trad-dance', title: 'Traditional Rwandan Dance & Drumming', category: 'Cultural Dance', description: 'Weekly instruction in Umushayayo, Amaraba, and Ingoma drumming.', ageRange: 'Ages 5 to 17', schedule: 'Every Saturday & Sunday, 14:00 - 17:00', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', highlights: ['Authentic master instructors', 'Ingoma drum training'], active: true, createdAt: now() },
    { id: 'prog-mod-dance', title: 'Modern Dance & Afro-Fusion Academy', category: 'Creative Dance', description: 'Dynamic movement training bridging contemporary styles.', ageRange: 'Ages 6 to 18', schedule: 'Wednesdays & Fridays, 16:30 - 18:30', imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80', highlights: ['Choreography battles', 'Body confidence'], active: true, createdAt: now() },
    { id: 'prog-summer-camp', title: 'IWACU Summer Vacation Programs', category: 'Holiday Camps', description: 'School vacation day camps featuring sports, theater, pottery, and storytelling.', ageRange: 'Ages 4 to 16', schedule: 'School Holiday Breaks', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80', highlights: ['Full day supervision', 'Healthy meals'], active: true, createdAt: now() },
  ];

  const settings: ContentSettings = {
    heroTitle: 'WHERE CULTURE COMES ALIVE.',
    heroSubtitle: 'CULTURE • CREATIVITY • TALENT • FUN • COMMUNITY',
    heroDescription: 'Discover dance, youth festivals, vacation programs, and authentic cultural experiences in Nyakaliro, Rwanda. Secure digital tickets instantly via MTN MoMo and Airtel Money.',
    primaryLocation: 'Nyakaliro, Rwanda',
    ceoName: 'Coopstar',
    ceoTitle: 'CEO, IWACU Kids',
    ceoBio: 'Under the leadership of Coopstar, IWACU Kids champions youth empowerment, cultural preservation, and creative expression across Rwanda.',
    contactPhone: '+250 788 000 000',
    contactEmail: 'info@iwacukids.rw',
    instagramHandle: '@iwacukids_rwanda',
    currency: 'RWF',
  };

  const ussdSettings: USSDSettings = {
    mtnMerchantCode: '*182*8*1*654321#',
    mtnReceiverPhone: '0788200300',
    mtnReceiverName: 'IWACU KIDS NYAKALIRO',
    airtelMerchantCode: '*500*4*2*654321#',
    airtelReceiverPhone: '0738200300',
    instructionsEn: 'Dial MoMoPay code *182*8*1*654321# or send directly to 0788200300 (IWACU KIDS). Enter your PIN, then paste your SMS transaction ID below.',
    instructionsRw: 'Kanda kode ya MoMoPay *182*8*1*654321# cyangwa ohereza kuri 0788200300 (IWACU KIDS). Shyiramo PIN, maze wandike nimero ya SMS (TxId) yakugezeho hano hasi.',
  };

  const users: AdminUser[] = [
    {
      id: 'usr-admin-1',
      email: 'admin@iwacukids.rw',
      name: 'Coopstar (Admin)',
      phone: '+250788000000',
      role: 'SUPER_ADMIN',
      isApprovedToScan: true,
      clearedBy: 'SYSTEM_SUPER_ADMIN',
      clearedAt: now(),
      passwordHash: 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec',
      active: true,
      isDefaultPassword: true,
      mustChangePassword: true,
    },
    {
      id: 'usr-staff-1',
      email: 'staff@iwacukids.rw',
      name: 'Nyakaliro Entrance Staff (Gate Lead)',
      phone: '+250788111222',
      role: 'STAFF',
      isApprovedToScan: true,
      clearedBy: 'Coopstar (Admin)',
      clearedAt: now(),
      passwordHash: '12d1b54a2a7b8e5c8e76a666e138a0dcab36dbe12f913d3170e5b7c7b8d80f5899d45e54d3e5519f7292df6881c039fbcf90533ec53372c3b28b7e0573e04746',
      active: true,
    },
  ];

  return {
    categories,
    events,
    orders: [] as TicketOrder[],
    tickets: [] as Ticket[],
    payments: [] as PaymentTransaction[],
    checkIns: [] as CheckInRecord[],
    gallery,
    programs,
    settings,
    ussdSettings,
    users,
    auditLogs: [
      {
        id: 'log-001',
        action: 'SYSTEM_INITIALIZATION',
        actor: 'SYSTEM',
        details: 'Ishconn/iwacukids seeded with culture, events, and ticket types.',
        timestamp: now(),
      },
    ] as AuditLog[],
  };
}