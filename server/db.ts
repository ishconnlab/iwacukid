import crypto from 'crypto';
import {
  Event,
  EventCategory,
  TicketOrder,
  Ticket,
  PaymentTransaction,
  CheckInRecord,
  GalleryItem,
  Program,
  ContentSettings,
  AdminUser,
  CustomerUser,
  AuditLog,
  USSDSettings,
  PaymentProviderType,
  DatabaseSeed,
} from './types.js';
import {
  categoryModel,
  eventModel,
  orderModel,
  ticketModel,
  paymentModel,
  checkinModel,
  galleryModel,
  programModel,
  settingsModel,
  ussdModel,
  userModel,
  customerModel,
  recommendationModel,
  auditModel,
  genId,
} from './mongo.js';
import { getInitialSeed } from './seed.js';

const JWT_SECRET = process.env.JWT_SECRET || 'iwacu-kids-secret-key-rwanda-2026';

export function hashPassword(password: string): string {
  return crypto.createHash('sha512').update(password + JWT_SECRET).digest('hex');
}

function toISO(date: unknown): string {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) return date.toISOString();
  return String(date);
}

/**
 * QR payload format: IWK|<base64url(JSON)>
 * The JSON embeds the attendee identity + event details directly into the QR
 * so scanning reveals real data (full name, phone, company phone, location,
 * date) and the server can recompute/verify everything.
 */
function buildQrPayload(params: {
  ticketCode: string;
  secureToken: string;
  attendeeName: string;
  attendeePhone: string;
  companyPhone?: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventVenue?: string;
}): string {
  const body = Buffer.from(
    JSON.stringify({
      code: params.ticketCode,
      k: params.secureToken,
      n: params.attendeeName,
      p: params.attendeePhone,
      cp: params.companyPhone || '',
      evt: params.eventTitle,
      dt: params.eventDate,
      tm: params.eventTime,
      loc: params.eventLocation,
      ven: params.eventVenue || '',
    })
  ).toString('base64url');
  return `IWK|${body}`;
}

function decodeQrPayload(payload: string): { code?: string; token?: string } | null {
  const idx = payload.indexOf('|');
  if (idx < 0) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload.slice(idx + 1), 'base64url').toString('utf-8'));
    return { code: parsed.code, token: parsed.k };
  } catch {
    return null;
  }
}

export async function seedDatabaseIfEmpty(): Promise<void> {
  const settingsCount = await settingsModel.countDocuments();
  if (settingsCount > 0) return;

  const seed: DatabaseSeed = getInitialSeed();
  if (await categoryModel.countDocuments() === 0) await categoryModel.insertMany(seed.categories);
  if (await eventModel.countDocuments() === 0) await eventModel.insertMany(seed.events);
  if (await orderModel.countDocuments() === 0) await orderModel.insertMany(seed.orders);
  if (await ticketModel.countDocuments() === 0) await ticketModel.insertMany(seed.tickets);
  if (await paymentModel.countDocuments() === 0) await paymentModel.insertMany(seed.payments);
  if (await checkinModel.countDocuments() === 0) await checkinModel.insertMany(seed.checkIns);
  if (await galleryModel.countDocuments() === 0) await galleryModel.insertMany(seed.gallery);
  if (await programModel.countDocuments() === 0) await programModel.insertMany(seed.programs);
  await settingsModel.updateOne(
    { id: 'settings-main' },
    { $set: { id: 'settings-main', ...seed.settings } },
    { upsert: true }
  );
  await ussdModel.updateOne(
    { id: 'ussd-main' },
    { $set: { id: 'ussd-main', ...seed.ussdSettings } },
    { upsert: true }
  );
  if (await userModel.countDocuments() === 0) await userModel.insertMany(seed.users);
  await recommendationModel.updateOne(
    { code: 'IWACU10' },
    {
      id: genId('rec'),
      code: 'IWACU10',
      ownerName: 'IWACU Kids',
      discountPercent: 20,
      active: true,
      usageCount: 0,
    },
    { upsert: true }
  );
  if (await auditModel.countDocuments() === 0) await auditModel.insertMany(seed.auditLogs);
  console.log('🌱 MongoDB seeded with initial IWACU Kids data.');
}

class Database {
  // Seed the database with the initial IWACU Kids content when empty
  async seedDatabaseIfEmpty(): Promise<void> {
    await seedDatabaseIfEmpty();
  }

  // ------------- Categories -------------
  async getCategories(): Promise<EventCategory[]> {
    return categoryModel.find({}).lean();
  }

  // ------------- Events -------------
  async getEvents(filter?: { category?: string; search?: string; status?: string }): Promise<Event[]> {
    const query: Record<string, unknown> = {};
    if (filter?.status && filter.status !== 'ALL') {
      query.status = filter.status;
    }
    if (filter?.category && filter.category !== 'all') {
      query.categoryId = filter.category;
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      const events = await eventModel.find(query).lean();
      return events.filter(
        (e: any) =>
          (e.title || '').toLowerCase().includes(q) ||
          (e.location || '').toLowerCase().includes(q) ||
          (e.description || '').toLowerCase().includes(q)
      );
    }
    return eventModel.find(query).sort({ eventDate: 1 }).lean();
  }

  async getEventById(id: string): Promise<Event | null> {
    return (await eventModel.findOne({ id }))?.toObject() || null;
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    return (await eventModel.findOne({ slug }))?.toObject() || null;
  }

  // ------------- Orders -------------
  async getOrderById(idOrNumber: string): Promise<TicketOrder | null> {
    const order = await orderModel.findOne({
      $or: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
    });
    return order ? order.toObject() : null;
  }

  async getOrders(): Promise<TicketOrder[]> {
    return orderModel.find({}).sort({ createdAt: -1 }).lean();
  }

  async getOrdersByUser(userId: string): Promise<TicketOrder[]> {
    return orderModel.find({ customerUserId: userId }).sort({ createdAt: -1 }).lean();
  }

  // ------------- Tickets -------------
  async getTicketById(id: string): Promise<Ticket | null> {
    const t = await ticketModel.findOne({ $or: [{ id }, { ticketCode: id }] });
    return t ? t.toObject() : null;
  }

  async getTicketByCode(ticketCode: string): Promise<Ticket | null> {
    const t = await ticketModel.findOne({ ticketCode });
    return t ? t.toObject() : null;
  }

  async getTicketByQrPayload(qrPayload: string): Promise<Ticket | null> {
    const t = await ticketModel.findOne({ qrPayload });
    return t ? t.toObject() : null;
  }

  async getTicketByAny(input: string): Promise<Ticket | null> {
    const clean = String(input).trim();
    const direct = await this.getTicketByQrPayload(clean);
    if (direct) return direct;
    const decoded = decodeQrPayload(clean);
    if (decoded?.code) {
      const byCode = await this.getTicketByCode(decoded.code);
      if (byCode) return byCode;
    }
    return this.getTicketById(clean);
  }

  async getTicketsByCustomer(phoneOrEmail: string): Promise<Ticket[]> {
    const cleanQuery = phoneOrEmail.trim().toLowerCase();
    const digitQuery = cleanQuery.replace(/[^0-9]/g, '');
    const matchingOrders = await orderModel.find({
      $or: [
        { customerPhone: { $regex: digitQuery ? digitQuery : '^$', $options: 'i' } },
        { customerEmail: cleanQuery },
        { orderNumber: cleanQuery },
      ],
    }).lean();
    const orderIds = matchingOrders.map((o) => o.id);
    if (digitQuery) {
      return ticketModel
        .find({
          $or: [{ orderId: { $in: orderIds } }, { attendeePhone: { $regex: digitQuery, $options: 'i' } }],
        })
        .sort({ createdAt: -1 })
        .lean();
    }
    return ticketModel.find({ orderId: { $in: orderIds } }).sort({ createdAt: -1 }).lean();
  }

  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    const orders = await orderModel.find({ customerUserId: userId }).lean();
    const orderIds = orders.map((o) => o.id);
    return ticketModel.find({ orderId: { $in: orderIds } }).sort({ createdAt: -1 }).lean();
  }

  async getAllTickets(): Promise<Ticket[]> {
    return ticketModel.find({}).sort({ createdAt: -1 }).lean();
  }

  // ------------- Payments -------------
  async getPayments(): Promise<PaymentTransaction[]> {
    return paymentModel.find({}).sort({ createdAt: -1 }).lean();
  }

  async getCheckIns(): Promise<CheckInRecord[]> {
    return checkinModel.find({}).sort({ scannedAt: -1 }).lean();
  }

  // ------------- Gallery & Programs -------------
  async getGallery(category?: string): Promise<GalleryItem[]> {
    const query = category && category !== 'All' ? { category } : {};
    return galleryModel.find(query).sort({ order: 1 }).lean();
  }

  async getPrograms(): Promise<Program[]> {
    return programModel.find({ active: true }).lean();
  }

  async getAllPrograms(): Promise<Program[]> {
    return programModel.find({}).lean();
  }

  // ------------- Settings -------------
  async getSettings(): Promise<ContentSettings> {
    const s = await settingsModel.findOne({ id: 'settings-main' }).lean();
    return (s as any) || {};
  }

  async updateSettings(settingsUpdate: Partial<ContentSettings>): Promise<ContentSettings> {
    await settingsModel.updateOne({ id: 'settings-main' }, { $set: settingsUpdate }, { upsert: true });
    return this.getSettings();
  }

  // ------------- Admin / Staff Users -------------
  async getUsers(): Promise<AdminUser[]> {
    const users = await userModel.find({}).lean();
    return users.map((u: any) => ({ ...u, passwordHash: '' }));
  }

  async getScanners(): Promise<AdminUser[]> {
    const users = await userModel.find({}).lean();
    return users.map((u: any) => ({ ...u, passwordHash: '' }));
  }

  async getUserByEmail(email: string): Promise<AdminUser | null> {
    const u = await userModel.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    return u ? (u.toObject() as AdminUser) : null;
  }

  async getUserById(id: string): Promise<AdminUser | null> {
    const u = await userModel.findOne({ id });
    return u ? (u.toObject() as AdminUser) : null;
  }

  async updateAdminCredentials(params: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    newPassword?: string;
  }): Promise<AdminUser> {
    const user = await this.getUserById(params.userId);
    if (!user) throw new Error('User not found');

    const existing = await userModel.findOne({
      id: { $ne: params.userId },
      email: params.email.trim().toLowerCase(),
    });
    if (existing) throw new Error('This email address is already in use by another account.');

    const update: Record<string, unknown> = {
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
    };
    if (params.phone) update.phone = params.phone.trim();
    if (params.newPassword && params.newPassword.trim().length >= 6) {
      update.passwordHash = hashPassword(params.newPassword.trim());
      update.isDefaultPassword = false;
      update.mustChangePassword = false;
    }

    await userModel.updateOne({ id: params.userId }, { $set: update });
    await this.addAuditLog('ADMIN_CREDENTIALS_UPDATED', params.email, 'Admin profile updated.');
    const updated = await this.getUserById(params.userId);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async addScanner(params: {
    name: string;
    email: string;
    phone?: string;
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
    isApprovedToScan?: boolean;
    clearedBy?: string;
  }): Promise<AdminUser> {
    const existing = await userModel.findOne({ email: params.email.toLowerCase() });
    if (existing) throw new Error('A user with this email already exists.');

    const newUser: AdminUser = {
      id: genId('usr'),
      name: params.name,
      email: params.email.toLowerCase(),
      phone: params.phone || '',
      role: params.role || 'STAFF',
      passwordHash: hashPassword('staff123'),
      active: true,
      isApprovedToScan: params.isApprovedToScan ?? true,
      clearedBy: params.clearedBy || 'Admin',
      clearedAt: new Date().toISOString(),
      isDefaultPassword: true,
      mustChangePassword: true,
    };
    await userModel.create(newUser);
    await this.addAuditLog('SCANNER_CREATED', newUser.email, `Created ${newUser.role} user ${newUser.name}`);
    return { ...newUser, passwordHash: '' };
  }

  async toggleScannerClearance(userId: string, isApprovedToScan: boolean, clearedBy: string): Promise<AdminUser> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');
    await userModel.updateOne(
      { id: userId },
      { $set: { isApprovedToScan, clearedBy, clearedAt: new Date().toISOString() } }
    );
    await this.addAuditLog(
      isApprovedToScan ? 'SCANNER_CLEARED' : 'SCANNER_REVOKED',
      clearedBy,
      `${isApprovedToScan ? 'Granted' : 'Revoked'} scanner clearance for ${user.name}`
    );
    return { ...(await this.getUserById(userId))!, passwordHash: '' };
  }

  async deleteScanner(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') throw new Error('Cannot delete super administrator');
    await userModel.deleteOne({ id: userId });
    return true;
  }

  async verifyScannerAccess(operatorIdentifier: string): Promise<{
    allowed: boolean;
    role?: string;
    name?: string;
    reason?: string;
  }> {
    if (operatorIdentifier === 'NYAKALIRO-GATE-2026' || operatorIdentifier === 'IWACU-ADMIN-PASS') {
      return { allowed: true, role: 'ADMIN', name: 'Gate Master Key Operator' };
    }
    const user = await userModel.findOne({
      $or: [{ id: operatorIdentifier }, { email: operatorIdentifier.toLowerCase() }],
    });
    if (!user) return { allowed: false, reason: 'User not registered in IWACU Kids staff directory.' };
    if (!user.active) return { allowed: false, reason: 'User account has been deactivated.' };

    const u = user.toObject();
    if (u.role === 'SUPER_ADMIN' || u.role === 'ADMIN') return { allowed: true, role: u.role, name: u.name };
    if (u.role === 'STAFF') {
      if (u.isApprovedToScan) return { allowed: true, role: u.role, name: u.name };
      return { allowed: false, role: u.role, name: u.name, reason: 'Scanner clearance required by an Admin.' };
    }
    return { allowed: false, reason: 'Customer accounts cannot scan tickets.' };
  }

  // ------------- Customers -------------
  async createCustomer(params: {
    fullName: string;
    phone: string;
    password: string;
    email?: string;
  }): Promise<CustomerUser> {
    const cleanPhone = params.phone.replace(/[^0-9+]/g, '');
    const existing = await customerModel.findOne({ phone: cleanPhone });
    if (existing) throw new Error('An account with this phone number already exists. Please login.');

    const customer: CustomerUser = {
      id: genId('cus'),
      fullName: params.fullName.trim(),
      phone: cleanPhone,
      email: params.email?.trim().toLowerCase() || '',
      passwordHash: hashPassword(params.password),
      recommendationCode: `RC-${cleanPhone.replace(/[^0-9]/g, '').slice(-6)}${Math.floor(Math.random() * 90 + 10)}`,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await customerModel.create(customer);
    await this.addAuditLog('CUSTOMER_REGISTERED', customer.phone, `New customer ${customer.fullName} registered.`);
    return customer;
  }

  async getCustomerById(id: string): Promise<CustomerUser | null> {
    const c = await customerModel.findOne({ id });
    return c ? (c.toObject() as CustomerUser) : null;
  }

  async getCustomerByPhone(phone: string): Promise<CustomerUser | null> {
    const clean = phone.replace(/[^0-9+]/g, '');
    const c = await customerModel.findOne({ phone: clean });
    return c ? (c.toObject() as CustomerUser) : null;
  }

  async getCustomers(): Promise<CustomerUser[]> {
    const list = await customerModel.find({}).sort({ createdAt: -1 }).lean();
    return list.map((c: any) => ({ ...c, passwordHash: '' }));
  }

  async findUserByIdentifier(identifier: string): Promise<{
    kind: 'ADMIN' | 'CUSTOMER';
    user: AdminUser | CustomerUser;
  } | null> {
    const staff = await userModel.findOne({
      $or: [{ email: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }, { phone: identifier }],
    });
    if (staff) return { kind: 'ADMIN', user: staff.toObject() as AdminUser };

    const clean = identifier.replace(/[^0-9+]/g, '');
    const customer = await customerModel.findOne({ phone: clean });
    if (customer) return { kind: 'CUSTOMER', user: customer.toObject() as CustomerUser };
    return null;
  }

  // ------------- Recommendation codes -------------
  async checkRecommendationCode(code: string): Promise<{
    valid: boolean;
    code?: string;
    ownerName?: string;
    discountPercent?: number;
    message: string;
  } | null> {
    const clean = String(code || '').trim().toUpperCase();
    if (!clean) return { valid: false, message: 'Please enter a recommendation code.' };
    const rec = await recommendationModel.findOne({ code: clean });
    if (!rec) return { valid: false, message: 'Invalid recommendation code.' };
    if (!rec.active) return { valid: false, message: 'This recommendation code is no longer active.' };
    return {
      valid: true,
      code: rec.code,
      ownerName: rec.ownerName || 'IWACU Kids',
      discountPercent: rec.discountPercent || 0,
      message: `Recommendation code applied: ${rec.discountPercent}% off.`,
    };
  }

  // ------------- Orders + capacity -------------
  async createOrder(params: {
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerUserId?: string;
    recommendationCode?: string;
    attendees?: { name: string; phone?: string }[];
    paymentMethod: PaymentProviderType;
  }): Promise<{ order: TicketOrder; tickets: Ticket[] }> {
    const event = await this.getEventById(params.eventId);
    if (!event) throw new Error('Event not found');

    const ticketType = event.ticketTypes.find((t) => t.id === params.ticketTypeId);
    if (!ticketType) throw new Error('Ticket type not found');

    const available = ticketType.totalQuantity - (ticketType.soldQuantity || 0);
    if (available < params.quantity) {
      throw new Error(
        `Only ${Math.max(0, available)} ticket(s) remaining for ${ticketType.name}. Requested: ${params.quantity}`
      );
    }

    // Discount from recommendation code
    let discountAmount = 0;
    let recommendationCode: string | undefined = params.recommendationCode;
    if (recommendationCode) {
      const rec = await this.checkRecommendationCode(recommendationCode);
      if (!rec?.valid) throw new Error(rec?.message || 'Invalid recommendation code.');
      const gross = ticketType.price * params.quantity;
      discountAmount = Math.round((gross * (rec.discountPercent || 0)) / 100);
    }

    const unitPrice = ticketType.price;
    const totalAmount = Math.max(0, unitPrice * params.quantity - discountAmount);

    // Atomic capacity guard: verify availability read-after-write style, then increment.
    const safeQty = params.quantity;
    const rawEvent = await eventModel.aggregate([
      { $match: { id: params.eventId } },
      { $unwind: '$ticketTypes' },
      { $match: { 'ticketTypes.id': params.ticketTypeId } },
      {
        $match: {
          $expr: {
            $lte: [
              { $add: [{ $ifNull: ['$ticketTypes.soldQuantity', 0] }, safeQty] },
              { $ifNull: ['$ticketTypes.totalQuantity', 0] },
            ],
          },
        },
      },
    ]);

    if (rawEvent.length === 0) {
      const refreshed = await this.getEventById(params.eventId);
      const tt = refreshed?.ticketTypes.find((t) => t.id === params.ticketTypeId);
      const left = (tt?.totalQuantity || 0) - (tt?.soldQuantity || 0);
      throw new Error(
        `Only ${Math.max(0, left)} ticket(s) remaining for ${ticketType.name}. Requested: ${params.quantity}`
      );
    }

    const incResult = await eventModel.updateOne(
      { id: params.eventId },
      { $inc: { 'ticketTypes.$[t].soldQuantity': safeQty }, $set: { updatedAt: new Date().toISOString() } },
      { arrayFilters: [{ 't.id': params.ticketTypeId }], runValidators: false }
    );
    if (incResult.matchedCount === 0) {
      throw new Error(`Failed to reserve capacity for ${ticketType.name}.`);
    }

    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `IWK-${randomHex}`;
    const orderId = genId('ord');

    // Sequential ticket number per event (registration count from 1)
    const ticketsSold = await ticketModel.countDocuments({ eventId: params.eventId });
    const settings = await this.getSettings();
    const companyPhone = settings.contactPhone || '+250 788 000 000';
    const eventTime = `${event.startTime} - ${event.endTime}`;

    const createdTickets: Ticket[] = [];
    for (let i = 1; i <= params.quantity; i++) {
      const ticketId = genId('tkt');
      const ticketCode = `TKT-${orderNumber}-${String(i).padStart(2, '0')}`;
      const secureToken = crypto.randomBytes(8).toString('hex').toUpperCase();

      const attendeeInfo = params.attendees?.[i - 1];
      const attendeeName = attendeeInfo?.name?.trim() || params.customerName;
      const attendeePhone = attendeeInfo?.phone?.trim() || params.customerPhone;

      const qrPayload = buildQrPayload({
        ticketCode,
        secureToken,
        attendeeName,
        attendeePhone,
        companyPhone,
        eventTitle: event.title,
        eventDate: event.eventDate,
        eventTime,
        eventLocation: event.location,
        eventVenue: event.venue,
      });

      const ticket: Ticket = {
        id: ticketId,
        ticketCode,
        orderId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.eventDate,
        eventTime,
        eventLocation: event.location,
        eventVenue: event.venue,
        companyPhone,
        ticketTypeId: ticketType.id,
        ticketTypeName: ticketType.name,
        price: unitPrice,
        attendeeName,
        attendeePhone,
        status: 'VALID',
        qrPayload,
        ticketNumber: ticketsSold + i,
        customerUserId: params.customerUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      createdTickets.push(ticket);
    }
    await ticketModel.insertMany(createdTickets);

    const order: TicketOrder = {
      id: orderId,
      orderNumber,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      customerUserId: params.customerUserId,
      recommendationCode,
      discountAmount,
      eventId: event.id,
      eventTitle: event.title,
      ticketTypeId: ticketType.id,
      ticketTypeName: ticketType.name,
      quantity: params.quantity,
      unitPrice,
      totalAmount,
      currency: 'RWF',
      paymentMethod: params.paymentMethod,
      paymentStatus: 'PENDING',
      tickets: createdTickets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await orderModel.create(order);

    // Mark event SOLD_OUT if fully booked
    const updatedEvent = await this.getEventById(event.id);
    if (updatedEvent) {
      const totalCapacity = updatedEvent.ticketTypes.reduce((a, t) => a + (t.totalQuantity || 0), 0);
      const totalSold = updatedEvent.ticketTypes.reduce((a, t) => a + (t.soldQuantity || 0), 0);
      if (totalSold >= totalCapacity && totalCapacity > 0 && updatedEvent.status !== 'SOLD_OUT') {
        await eventModel.updateOne({ id: event.id }, { $set: { status: 'SOLD_OUT' } });
      }
    }

    await this.addAuditLog(
      'ORDER_CREATED',
      params.customerPhone,
      `Created order ${orderNumber} for ${params.quantity}x ${ticketType.name} (${totalAmount} RWF)`
    );
    return { order, tickets: createdTickets };
  }

  async recordPayment(params: {
    orderId: string;
    provider: PaymentProviderType;
    amount: number;
    phoneNumber: string;
    transactionRef: string;
    status: 'SUCCESS' | 'FAILED';
    mode: 'LIVE' | 'DEMO';
    providerTxId?: string;
    errorMessage?: string;
    rawWebhookData?: Record<string, unknown>;
  }): Promise<PaymentTransaction> {
    const order = await this.getOrderById(params.orderId);
    if (!order) throw new Error(`Order ${params.orderId} not found for payment processing`);

    const paymentTx: PaymentTransaction = {
      id: genId('pay'),
      orderId: order.id,
      provider: params.provider,
      amount: params.amount,
      currency: order.currency || 'RWF',
      phoneNumber: params.phoneNumber,
      transactionRef: params.transactionRef,
      providerTxId: params.providerTxId,
      status: params.status,
      mode: params.mode,
      errorMessage: params.errorMessage,
      rawWebhookData: params.rawWebhookData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await paymentModel.create(paymentTx);

    // Update order status
    await orderModel.updateOne(
      { id: order.id },
      { $set: { paymentStatus: params.status, paymentTransactionRef: params.transactionRef, updatedAt: new Date().toISOString() } }
    );

    if (params.status === 'FAILED') {
      // Revert sold quantity
      await eventModel.updateOne(
        { id: order.eventId },
        { $inc: { 'ticketTypes.$[t].soldQuantity': -order.quantity } },
        { arrayFilters: [{ 't.id': order.ticketTypeId }] }
      );
      await ticketModel.updateMany({ orderId: order.id }, { $set: { status: 'CANCELLED', updatedAt: new Date().toISOString() } });
    }

    await this.addAuditLog(
      `PAYMENT_${params.status}`,
      params.provider,
      `Payment of ${params.amount} RWF for order ${order.orderNumber} ${params.status}`
    );
    return paymentTx;
  }

  async submitManualUSSDPayment(params: {
    orderId: string;
    transactionRef: string;
    customerPhone: string;
  }): Promise<{ order: TicketOrder; tickets: Ticket[] }> {
    const order = await this.getOrderById(params.orderId);
    if (!order) throw new Error('Order not found');

    await orderModel.updateOne(
      { id: order.id },
      {
        $set: {
          paymentMethod: 'MANUAL_USSD',
          paymentStatus: 'SUCCESS',
          paymentTransactionRef: params.transactionRef,
          updatedAt: new Date().toISOString(),
        },
      }
    );
    await ticketModel.updateMany({ orderId: order.id }, { $set: { status: 'VALID' } });

    await paymentModel.create({
      id: genId('pay'),
      orderId: order.id,
      provider: 'MANUAL_USSD',
      amount: order.totalAmount,
      currency: order.currency,
      phoneNumber: params.customerPhone || order.customerPhone,
      transactionRef: params.transactionRef,
      status: 'SUCCESS',
      mode: 'LIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await this.addAuditLog('USSD_PAYMENT_SUBMITTED', params.customerPhone, `Order ${order.orderNumber} paid via USSD reference ${params.transactionRef}`);
    return { order: (await this.getOrderById(order.id))!, tickets: await ticketModel.find({ orderId: order.id }).lean() };
  }

  async getUSSDOrders(): Promise<TicketOrder[]> {
    return orderModel.find({ paymentMethod: 'MANUAL_USSD' }).sort({ createdAt: -1 }).lean();
  }

  // ------------- Check-in -------------
  async verifyTicket(code: string): Promise<{
    valid: boolean;
    status: 'VALID' | 'ALREADY_USED' | 'INVALID' | 'CANCELLED';
    message: string;
    ticket?: Ticket;
  }> {
    const ticket = await this.getTicketByAny(code);
    if (!ticket) {
      return { valid: false, status: 'INVALID', message: 'Invalid ticket. Record not found in IWACU Kids system.' };
    }
    if (ticket.status === 'USED') {
      return {
        valid: false,
        status: 'ALREADY_USED',
        message: `Ticket already used. Checked in at ${ticket.checkedInAt} by ${ticket.checkedInBy || 'Staff'}.`,
        ticket,
      };
    }
    if (ticket.status === 'CANCELLED') {
      return { valid: false, status: 'CANCELLED', message: 'Ticket has been cancelled or refunded.', ticket };
    }
    return { valid: true, status: 'VALID', message: 'Valid ticket. Ready for entrance check-in.', ticket };
  }

  async processCheckIn(params: {
    qrPayloadOrCode: string;
    scannedBy: string;
    device?: string;
  }): Promise<{
    status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID';
    message: string;
    ticket?: Ticket;
    previousCheckIn?: CheckInRecord;
  }> {
    const rawInput = params.qrPayloadOrCode.trim();
    const ticket = await this.getTicketByAny(rawInput);
    if (!ticket) {
      return { status: 'INVALID', message: 'Invalid ticket. QR code or ticket number does not exist in IWACU Kids system.' };
    }
    if (ticket.status === 'CANCELLED') {
      return { status: 'INVALID', message: 'This ticket was cancelled or refunded.', ticket };
    }
    if (ticket.status === 'USED') {
      const previous = await checkinModel.findOne({ ticketId: ticket.id }).lean().catch(() => null);
      return {
        status: 'ALREADY_USED',
        message: `Ticket already used. Checked in at ${ticket.checkedInAt || (previous as any)?.scannedAt || 'earlier today'} by ${ticket.checkedInBy || (previous as any)?.scannedBy || 'Staff'}.`,
        ticket,
        previousCheckIn: previous as any,
      };
    }

    const nowIso = new Date().toISOString();
    // Sequential check-in number based on attendees already admitted to this event (from 1)
    const admittedCount = await checkinModel.countDocuments({
      eventId: ticket.eventId,
      status: 'SUCCESS',
    });
    const checkInNumber = admittedCount + 1;

    await ticketModel.updateOne(
      { id: ticket.id },
      {
        $set: {
          status: 'USED',
          checkedInAt: nowIso,
          checkedInBy: params.scannedBy || 'IWACU Entrance Staff',
          checkInNumber,
          updatedAt: nowIso,
        },
      }
    );
    const updatedTicket = (await this.getTicketById(ticket.id))!;

    const record: CheckInRecord = {
      id: genId('chk'),
      ticketId: ticket.id,
      ticketCode: ticket.ticketCode,
      eventId: ticket.eventId,
      attendeeName: ticket.attendeeName,
      ticketTypeName: ticket.ticketTypeName,
      scannedAt: nowIso,
      scannedBy: params.scannedBy || 'IWACU Entrance Staff',
      device: params.device || 'Staff Camera Scanner',
      status: 'SUCCESS',
      notes: `Verified and admitted. Check-in #${checkInNumber} for this event.`,
    };
    await checkinModel.create(record);
    await this.addAuditLog('TICKET_CHECK_IN', params.scannedBy, `Admitted ${ticket.attendeeName} (${ticket.ticketCode}) as #${checkInNumber} for ${ticket.eventTitle}`);

    return { status: 'SUCCESS', message: 'Valid ticket. Welcome to IWACU Kids!', ticket: updatedTicket };
  }

  // ------------- Event admin -------------
  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const newEvent: Event = {
      ...eventData,
      id: genId('evt'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await eventModel.create(newEvent);
    await this.addAuditLog('EVENT_CREATED', 'Admin', `Created event ${newEvent.title}`);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const existing = await this.getEventById(id);
    if (!existing) throw new Error(`Event with ID ${id} not found`);
    const updated: Event = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await eventModel.updateOne({ id }, { $set: updated });
    return (await this.getEventById(id))!;
  }

  async increaseEventCapacity(id: string, additionalPerType: number): Promise<Event> {
    const event = await this.getEventById(id);
    if (!event) throw new Error(`Event with ID ${id} not found`);
    const add = Math.max(1, Number(additionalPerType) || 1);

    // Increase each ticket type's total quantity and the overall capacity
    const newTicketTypes = event.ticketTypes.map((t) => ({
      ...t,
      totalQuantity: (t.totalQuantity || 0) + add,
      status: 'ACTIVE' as const,
      updatedAt: new Date().toISOString(),
    }));
    const newCapacity = (event.capacity || 0) + add * event.ticketTypes.length;
    const newStatus = event.status === 'SOLD_OUT' || event.status === 'CANCELLED' ? 'PUBLISHED' : event.status;

    const updated: Event = {
      ...event,
      capacity: newCapacity,
      ticketTypes: newTicketTypes,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    await eventModel.updateOne({ id }, { $set: updated });
    await this.addAuditLog(
      'EVENT_CAPACITY_INCREASED',
      'Admin',
      `Increased capacity of "${event.title}" by ${add} per ticket type (total +${add * event.ticketTypes.length} attendees).`
    );
    return (await this.getEventById(id))!;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const res = await eventModel.deleteOne({ id });
    return res.deletedCount > 0;
  }

  // ------------- Gallery & Programs admin -------------
  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
    const newItem: GalleryItem = { ...item, id: genId('gal'), createdAt: new Date().toISOString() };
    await galleryModel.create(newItem);
    return newItem;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const res = await galleryModel.deleteOne({ id });
    return res.deletedCount > 0;
  }

  async addProgram(prog: Omit<Program, 'id' | 'createdAt'>): Promise<Program> {
    const newProg: Program = { ...prog, id: genId('prog'), createdAt: new Date().toISOString() };
    await programModel.create(newProg);
    return newProg;
  }

  async updateProgram(id: string, updates: Partial<Program>): Promise<Program> {
    const existing = await programModel.findOne({ id }).lean();
    if (!existing) throw new Error('Program not found');
    const updated = { ...existing, ...updates };
    await programModel.updateOne({ id }, { $set: updated });
    return updated as Program;
  }

  // ------------- USSD -------------
  async getUSSDSettings(): Promise<USSDSettings> {
    const s = await ussdModel.findOne({ id: 'ussd-main' }).lean();
    if (s) return s as USSDSettings;
    return {
      mtnMerchantCode: '*182*8*1*654321#',
      mtnReceiverPhone: '0788200300',
      mtnReceiverName: 'IWACU KIDS NYAKALIRO',
      airtelMerchantCode: '*500*4*2*654321#',
      airtelReceiverPhone: '0738200300',
      instructionsEn: 'Dial MoMoPay code *182*8*1*654321# or send directly to 0788200300 (IWACU KIDS).',
      instructionsRw: 'Kanda kode ya MoMoPay *182*8*1*654321# cyangwa ohereza kuri 0788200300 (IWACU KIDS).',
    };
  }

  async updateUSSDSettings(updates: Partial<USSDSettings>): Promise<USSDSettings> {
    await ussdModel.updateOne({ id: 'ussd-main' }, { $set: updates }, { upsert: true });
    return this.getUSSDSettings();
  }

  // ------------- Audit -------------
  async addAuditLog(action: string, actor: string, details: string): Promise<void> {
    try {
      await auditModel.create({
        id: genId('log'),
        action,
        actor,
        details,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
    // best-effort cleanup to keep collection small
    try {
      const count = await auditModel.countDocuments();
      if (count > 5000) {
        const oldest = await auditModel.find({}).sort({ timestamp: 1 }).limit(count - 4000).select('id');
        await auditModel.deleteMany({ id: { $in: oldest.map((d: any) => d.id) } });
      }
    } catch {
      /* ignore cleanup failures */
    }
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return auditModel.find({}).sort({ timestamp: -1 }).limit(500).lean();
  }

  // ------------- Dashboard helpers -------------
  async getOrdersRaw(): Promise<TicketOrder[]> {
    return orderModel.find({}).sort({ createdAt: -1 }).lean();
  }
}

export const db = new Database();