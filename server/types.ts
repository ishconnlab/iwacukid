export type EventCategorySlug =
  | 'traditional-dance'
  | 'modern-dance'
  | 'summer-events'
  | 'vacation-programs'
  | 'special-events'
  | 'community';

export interface EventCategory {
  id: string;
  name: string;
  slug: EventCategorySlug;
  description: string;
  icon: string;
}

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD_OUT' | 'CANCELLED' | 'COMPLETED';

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: number; // in RWF (e.g., 1000, 2000, 3000)
  totalQuantity: number;
  soldQuantity: number;
  description: string;
  benefits: string[];
  status: 'ACTIVE' | 'SOLD_OUT' | 'PAUSED';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  galleryImages: string[];
  eventDate: string; // ISO date e.g. "2026-09-12"
  startTime: string; // e.g. "14:00"
  endTime: string; // e.g. "18:00"
  location: string; // e.g. "Nyakaliro Cultural Grounds, Rwanda"
  venue: string;
  capacity: number;
  status: EventStatus;
  featured: boolean;
  ticketTypes: TicketType[];
  whatsIncluded: string[];
  ageRange: string;
  faqs: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export type PaymentProviderType = 'MTN_MOMO' | 'AIRTEL_MONEY' | 'MANUAL_USSD';

export type TicketStatus = 'VALID' | 'USED' | 'CANCELLED' | 'EXPIRED';

export interface Ticket {
  id: string;
  ticketCode: string; // e.g. IWK-8F29A-01
  orderId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventVenue?: string;
  companyPhone?: string;
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  attendeeName: string;
  attendeePhone: string;
  status: TicketStatus;
  qrPayload: string; // secure verification token
  ticketNumber?: number; // sequential attendee position per event (1, 2, 3, ...) assigned at purchase
  checkInNumber?: number; // sequential attendee number per event assigned at gate check-in
  customerUserId?: string;
  checkedInAt?: string;
  checkedInBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketOrder {
  id: string;
  orderNumber: string; // e.g. IWK-8F29A
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerUserId?: string;
  recommendationCode?: string;
  discountAmount?: number;
  eventId: string;
  eventTitle: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string; // "RWF"
  paymentMethod: PaymentProviderType;
  paymentStatus: PaymentStatus;
  paymentTransactionRef?: string;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: PaymentProviderType;
  amount: number;
  currency: string;
  phoneNumber: string;
  transactionRef: string;
  providerTxId?: string;
  status: PaymentStatus;
  mode: 'LIVE' | 'DEMO';
  errorMessage?: string;
  rawWebhookData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInRecord {
  id: string;
  ticketId: string;
  ticketCode: string;
  eventId: string;
  attendeeName: string;
  ticketTypeName: string;
  scannedAt: string;
  scannedBy: string;
  device?: string;
  status: 'SUCCESS' | 'DUPLICATE_ATTEMPT' | 'INVALID';
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Dance' | 'Kids' | 'Summer' | 'Behind the Scenes';
  imageUrl: string;
  caption: string;
  eventId?: string;
  order: number;
  isPublic: boolean;
  createdAt: string;
}

export interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  ageRange: string;
  schedule: string;
  imageUrl: string;
  highlights: string[];
  active: boolean;
  createdAt: string;
}

export interface ContentSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryLocation: string;
  ceoName: string;
  ceoTitle: string;
  ceoBio: string;
  contactPhone: string;
  contactEmail: string;
  instagramHandle: string;
  currency: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: AdminRole;
  passwordHash: string;
  active: boolean;
  isApprovedToScan?: boolean;
  clearedBy?: string;
  clearedAt?: string;
  lastLogin?: string;
  mustChangePassword?: boolean;
  isDefaultPassword?: boolean;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  passwordHash: string;
  recommendationCode?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface USSDSettings {
  mtnMerchantCode: string;
  mtnReceiverPhone: string;
  mtnReceiverName: string;
  airtelMerchantCode: string;
  airtelReceiverPhone: string;
  instructionsEn: string;
  instructionsRw: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DatabaseSeed {
  categories: EventCategory[];
  events: Event[];
  orders: TicketOrder[];
  tickets: Ticket[];
  payments: PaymentTransaction[];
  checkIns: CheckInRecord[];
  gallery: GalleryItem[];
  programs: Program[];
  settings: ContentSettings;
  ussdSettings: USSDSettings;
  users: AdminUser[];
  auditLogs: AuditLog[];
}
