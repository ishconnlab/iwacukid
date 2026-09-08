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
  price: number; // e.g. 1000, 2000, 3000
  totalQuantity: number;
  soldQuantity: number;
  description: string;
  benefits: string[];
  status: 'ACTIVE' | 'SOLD_OUT' | 'PAUSED';
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
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  venue: string;
  capacity: number;
  status: EventStatus;
  featured: boolean;
  ticketTypes: TicketType[];
  whatsIncluded: string[];
  ageRange: string;
  faqs: { question: string; answer: string }[];
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
  ticketCode: string;
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
  qrPayload: string;
  ticketNumber?: number;
  checkInNumber?: number;
  customerUserId?: string;
  checkedInAt?: string;
  checkedInBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TicketOrder {
  id: string;
  orderNumber: string;
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
  currency: string;
  paymentMethod: PaymentProviderType;
  paymentStatus: PaymentStatus;
  paymentTransactionRef?: string;
  tickets: Ticket[];
  createdAt: string;
  updatedAt?: string;
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
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Dance' | 'Kids' | 'Summer' | 'Behind the Scenes';
  imageUrl: string;
  caption: string;
  order: number;
  isPublic: boolean;
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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  fullName?: string;
  recommendationCode?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'CUSTOMER';
  isApprovedToScan?: boolean;
  clearedBy?: string;
  clearedAt?: string;
  mustChangePassword?: boolean;
  isDefaultPassword?: boolean;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  recommendationCode?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayStatus {
  mtnConfigured: boolean;
  airtelConfigured: boolean;
  gatewayOnline: boolean;
  messaging: {
    encouragement: string;
  };
  ussd: USSDSettings;
}

export interface GateScannerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  isApprovedToScan: boolean;
  clearedBy?: string;
  clearedAt?: string;
  active: boolean;
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

export interface DashboardMetrics {
  totalRevenue: number;
  totalTicketsSold: number;
  upcomingEventsCount: number;
  totalAttendees: number;
  totalCheckedIn: number;
  pendingOrdersCount: number;
  checkInRate: number;
}

export interface DashboardOverview {
  metrics: DashboardMetrics;
  paymentMethodsBreakdown: {
    mtn: { count: number; revenue: number };
    airtel: { count: number; revenue: number };
  };
  eventPerformance: {
    id: string;
    title: string;
    date: string;
    sold: number;
    capacity: number;
    occupancyRate: number;
    revenue: number;
    checkedIn: number;
    checkInRate: number;
  }[];
  recentOrders: TicketOrder[];
  recentCheckIns: any[];
}
