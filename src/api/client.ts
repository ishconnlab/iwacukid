import {
  Event,
  EventCategory,
  TicketOrder,
  Ticket,
  Program,
  GalleryItem,
  ContentSettings,
  AuthUser,
  CustomerUser,
  DashboardOverview,
  PaymentProviderType,
  GatewayStatus,
} from '../types';

// Backend API host. When the frontend is served from the backend itself
// (Render or local dev), keep same-origin `/api`. When served as a static
// bundle elsewhere (e.g. Vercel), call the Render API cross-origin.
const API_HOST = 'https://iwacukid.onrender.com';

function resolveApiBase(): string {
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const isBackendHost =
    host === 'iwacukid.onrender.com' || host === 'localhost' || host === '127.0.0.1';
  return isBackendHost ? '/api' : `${API_HOST}/api`;
}

const API_BASE = resolveApiBase();

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('iwacu_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      errorMsg = err.error || err.message || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Public
  async getSettings(): Promise<ContentSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse<ContentSettings>(res);
  },

  async getCategories(): Promise<EventCategory[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse<EventCategory[]>(res);
  },

  async getEvents(params?: { category?: string; search?: string }): Promise<Event[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${API_BASE}/events?${query.toString()}`);
    return handleResponse<Event[]>(res);
  },

  async getEvent(slugOrId: string): Promise<Event> {
    const res = await fetch(`${API_BASE}/events/${slugOrId}`);
    return handleResponse<Event>(res);
  },

  async getPrograms(): Promise<Program[]> {
    const res = await fetch(`${API_BASE}/programs`);
    return handleResponse<Program[]>(res);
  },

  async getGallery(category?: string): Promise<GalleryItem[]> {
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/gallery${q}`);
    return handleResponse<GalleryItem[]>(res);
  },

  // Orders & Ticketing
  async createOrder(data: {
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    attendees?: { name: string; phone?: string }[];
    paymentMethod: PaymentProviderType;
    recommendationCode?: string;
  }): Promise<{ order: TicketOrder; tickets: Ticket[]; message: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ order: TicketOrder; tickets: Ticket[]; message: string }>(res);
  },

  async getMyTickets(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE}/me/tickets`, {
      headers: getAuthHeader(),
    });
    return handleResponse<Ticket[]>(res);
  },

  async getOrder(orderId: string): Promise<TicketOrder> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    return handleResponse<TicketOrder>(res);
  },

  async getTicket(ticketId: string): Promise<Ticket> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}`);
    return handleResponse<Ticket>(res);
  },

  async lookupTickets(query: string): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE}/tickets/lookup?q=${encodeURIComponent(query)}`);
    return handleResponse<Ticket[]>(res);
  },

  // Payments
  async getGatewayStatus(): Promise<GatewayStatus> {
    const res = await fetch(`${API_BASE}/payments/gateway-status`);
    return handleResponse<GatewayStatus>(res);
  },

  async checkRecommendationCode(code: string): Promise<{
    valid: boolean;
    code?: string;
    ownerName?: string;
    discountPercent?: number;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/recommendation/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return handleResponse<any>(res);
  },

  async initiatePayment(data: {
    orderId: string;
    provider: PaymentProviderType;
    phoneNumber: string;
  }): Promise<{
    success: boolean;
    transactionRef: string;
    providerStatus: string;
    message: string;
    mode: 'LIVE' | 'DEMO';
    requiresCustomerAuthorization: boolean;
    promptInstructions: string;
  }> {
    const res = await fetch(`${API_BASE}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async confirmDemoPayment(data: {
    orderId: string;
    transactionRef?: string;
    provider?: string;
  }): Promise<{ success: boolean; order: TicketOrder }> {
    const res = await fetch(`${API_BASE}/payments/confirm-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Check-In Engine
  async verifyTicket(code: string): Promise<{
    valid: boolean;
    status: 'VALID' | 'ALREADY_USED' | 'INVALID' | 'CANCELLED';
    message: string;
    ticket?: Ticket;
  }> {
    const res = await fetch(`${API_BASE}/check-in/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return handleResponse<any>(res);
  },

  async executeCheckIn(data: {
    code: string;
    scannedBy?: string;
    device?: string;
    operatorIdentifier?: string;
  }): Promise<{
    status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID';
    message: string;
    ticket?: Ticket;
    operator?: { name?: string; role?: string };
  }> {
    const res = await fetch(`${API_BASE}/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async verifyScannerClearance(operatorIdentifier: string): Promise<{
    allowed: boolean;
    role?: string;
    name?: string;
    reason?: string;
  }> {
    const res = await fetch(`${API_BASE}/check-in/verify-clearance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorIdentifier }),
    });
    return handleResponse<any>(res);
  },

  // USSD Manual Payments
  async getUSSDSettings(): Promise<{
    mtnMerchantCode: string;
    mtnReceiverPhone: string;
    mtnReceiverName: string;
    airtelMerchantCode: string;
    airtelReceiverPhone: string;
    instructionsEn: string;
    instructionsRw: string;
  }> {
    const res = await fetch(`${API_BASE}/ussd/settings`);
    return handleResponse<any>(res);
  },

  async submitManualUSSD(data: {
    orderId: string;
    transactionRef: string;
    customerPhone: string;
  }): Promise<{ success: boolean; message: string; order: TicketOrder; tickets: Ticket[] }> {
    const res = await fetch(`${API_BASE}/payments/manual-ussd-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async getAdminUSSDOrders(): Promise<TicketOrder[]> {
    const res = await fetch(`${API_BASE}/admin/ussd-orders`, {
      headers: getAuthHeader(),
    });
    return handleResponse<TicketOrder[]>(res);
  },

  async updateUSSDSettings(settings: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/ussd/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(settings),
    });
    return handleResponse<any>(res);
  },

  // Scanner Clearance Staff Management
  async getScanners(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/scanners`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any[]>(res);
  },

  async addScanner(data: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
    isApprovedToScan?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/scanners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async toggleScannerClearance(id: string, isApprovedToScan: boolean): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/scanners/${id}/clearance`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ isApprovedToScan }),
    });
    return handleResponse<any>(res);
  },

  async deleteScanner(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/scanners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  // Auth
  async register(data: {
    fullName: string;
    phone: string;
    password: string;
    email?: string;
  }): Promise<{ token: string; user: AuthUser; message: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ token: string; user: AuthUser; message: string }>(res);
  },

  async login(identifier: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return handleResponse<{ token: string; user: AuthUser }>(res);
  },

  async getMe(): Promise<{ user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ user: AuthUser }>(res);
  },

  async updateCredentials(data: {
    name: string;
    email: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message: string; token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/update-credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string; token: string; user: AuthUser }>(res);
  },

  // Admin Dashboard
  async getDashboardOverview(): Promise<DashboardOverview> {
    const res = await fetch(`${API_BASE}/dashboard/overview`, {
      headers: getAuthHeader(),
    });
    return handleResponse<DashboardOverview>(res);
  },

  async getAdminOrders(): Promise<TicketOrder[]> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAuthHeader(),
    });
    return handleResponse<TicketOrder[]>(res);
  },

  async getAdminTickets(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE}/admin/tickets`, {
      headers: getAuthHeader(),
    });
    return handleResponse<Ticket[]>(res);
  },

  async getAdminPayments(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/payments`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any[]>(res);
  },

  async getAdminCheckIns(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/check-ins`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any[]>(res);
  },

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const res = await fetch(`${API_BASE}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(eventData),
    });
    return handleResponse<Event>(res);
  },

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const res = await fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<Event>(res);
  },

  async deleteEvent(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async increaseEventCapacity(
    id: string,
    additionalPerType: number
  ): Promise<{ success: boolean; message: string; event: Event }> {
    const res = await fetch(`${API_BASE}/admin/events/${id}/capacity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ additionalPerType: Number(additionalPerType) }),
    });
    return handleResponse<{ success: boolean; message: string; event: Event }>(res);
  },

  async getCustomers(): Promise<CustomerUser[]> {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: getAuthHeader(),
    });
    return handleResponse<CustomerUser[]>(res);
  },

  async updateSettings(settings: Partial<ContentSettings>): Promise<ContentSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(settings),
    });
    return handleResponse<ContentSettings>(res);
  },
};
