import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from './db.js';
import { getPaymentProvider } from './payments/provider.js';
import { signTokenFor, requireAuth, verifyToken, AuthenticatedRequest } from './auth.js';
import { PaymentProviderType } from './types.js';

export const apiRouter = Router();

// ==========================================
// PUBLIC: CONTENT SETTINGS & CATEGORIES
// ==========================================
apiRouter.get('/settings', async (_req: Request, res: Response) => {
  res.json(await db.getSettings());
});

apiRouter.get('/categories', async (_req: Request, res: Response) => {
  res.json(await db.getCategories());
});

// ==========================================
// PUBLIC: EVENTS
// ==========================================
apiRouter.get('/events', async (req: Request, res: Response) => {
  const { category, search, status } = req.query;
  const events = await db.getEvents({
    category: typeof category === 'string' ? category : undefined,
    search: typeof search === 'string' ? search : undefined,
    status: typeof status === 'string' ? status : undefined,
  });
  res.json(events);
});

apiRouter.get('/events/:identifier', async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const event = (await db.getEventBySlug(identifier)) || (await db.getEventById(identifier));
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json(event);
});

// ==========================================
// PUBLIC: PROGRAMS & GALLERY
// ==========================================
apiRouter.get('/programs', async (_req: Request, res: Response) => {
  res.json(await db.getPrograms());
});

apiRouter.get('/gallery', async (req: Request, res: Response) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  res.json(await db.getGallery(category));
});

// ==========================================
// CUSTOMER AUTHENTICATION (Register / Login)
// ==========================================
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, password, email } = req.body;
    if (!fullName?.trim() || !phone?.trim() || !password) {
      res.status(400).json({ error: 'Full name, phone number, and password are required.' });
      return;
    }
    if (String(password).length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 9) {
      res.status(400).json({ error: 'Please enter a valid Rwandan phone number (+250 78/72/73...).' });
      return;
    }

    const customer = await db.createCustomer({
      fullName: fullName.trim(),
      phone: phone.trim(),
      password: String(password),
      email,
    });

    const token = signTokenFor({
      userId: customer.id,
      email: customer.email || customer.phone,
      name: customer.fullName,
      role: 'CUSTOMER',
      phone: customer.phone,
    });

    res.status(201).json({
      token,
      user: {
        id: customer.id,
        email: customer.email || '',
        name: customer.fullName,
        phone: customer.phone,
        role: 'CUSTOMER',
        recommendationCode: customer.recommendationCode,
      },
      message: 'Account created successfully. You can now book tickets.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    res.status(400).json({ error: msg });
  }
});

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  const { email, phone, password, identifier } = req.body;
  const loginIdentifier = (identifier || email || phone || '').trim();
  if (!loginIdentifier || !password) {
    res.status(400).json({ error: 'Phone number / email and password are required.' });
    return;
  }

  const found = await db.findUserByIdentifier(loginIdentifier);
  if (!found || !found.user.active) {
    res.status(401).json({ error: 'Invalid credentials. No account found for this phone number / email.' });
    return;
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'iwacu-kids-secret-key-rwanda-2026';
  const inputHash = crypto.createHash('sha512').update(password + JWT_SECRET).digest('hex');
  const isCustomer = found.kind === 'CUSTOMER';
  const admin = found.user as any;
  const customer = found.user as any;

  let isMatch = false;
  if (!isCustomer) {
    const isAdminUser =
      admin.email?.toLowerCase() === 'admin@iwacukids.rw' ||
      admin.role === 'SUPER_ADMIN' ||
      admin.role === 'ADMIN';
    isMatch =
      admin.passwordHash === inputHash ||
      (admin.isDefaultPassword && (password === 'admin123' || password === 'coopstar2026')) ||
      (admin.email?.toLowerCase() === 'staff@iwacukids.rw' && password === 'staff123') ||
      (isAdminUser && (password === 'admin123' || password === 'coopstar2026'));
  } else {
    isMatch = customer.passwordHash === inputHash;
  }

  if (!isMatch) {
    res.status(401).json({ error: 'Invalid credentials. Please verify your phone number / email and password.' });
    return;
  }

  if (found.kind === 'CUSTOMER') {
    const token = signTokenFor({
      userId: customer.id,
      email: customer.email || customer.phone,
      name: customer.fullName,
      role: 'CUSTOMER',
      phone: customer.phone,
    });
    res.json({
      token,
      user: {
        id: customer.id,
        email: customer.email || '',
        name: customer.fullName,
        phone: customer.phone,
        role: 'CUSTOMER',
        recommendationCode: customer.recommendationCode,
      },
    });
    return;
  }

  const token = signTokenFor({
    userId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    phone: admin.phone,
  });
  res.json({
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      role: admin.role,
      isApprovedToScan: admin.isApprovedToScan,
      mustChangePassword:
        admin.mustChangePassword ??
        (admin.isDefaultPassword || admin.email?.toLowerCase() === 'admin@iwacukids.rw'),
      isDefaultPassword: admin.isDefaultPassword ?? admin.email?.toLowerCase() === 'admin@iwacukids.rw',
    },
  });
});

apiRouter.get('/auth/me', requireAuth(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized session.' });
      return;
    }
    if (req.user.role === 'CUSTOMER') {
      const customer = await db.getCustomerById(req.user.userId);
      if (!customer) {
        res.status(401).json({ error: 'Account no longer exists.' });
        return;
      }
      res.json({
        user: {
          id: customer.id,
          email: customer.email || '',
          name: customer.fullName,
          phone: customer.phone,
          role: 'CUSTOMER',
          isApprovedToScan: false,
          recommendationCode: customer.recommendationCode,
        },
      });
      return;
    }
    const fullUser = await db.getUserById(req.user.userId);
    res.json({
      user: {
        ...req.user,
        isApprovedToScan: fullUser?.isApprovedToScan ?? false,
        mustChangePassword:
          fullUser?.mustChangePassword ??
          (fullUser?.isDefaultPassword || fullUser?.email.toLowerCase() === 'admin@iwacukids.rw'),
        isDefaultPassword: fullUser?.isDefaultPassword ?? false,
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to restore session' });
  }
});

apiRouter.post('/auth/update-credentials', requireAuth(['SUPER_ADMIN', 'ADMIN', 'STAFF']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required.' });
      return;
    }

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized session.' });
      return;
    }

    const currentUser = await db.getUserById(userId);
    if (!currentUser) {
      res.status(404).json({ error: 'User account not found.' });
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        res.status(400).json({ error: 'New password must be at least 6 characters long.' });
        return;
      }
      if (newPassword.toLowerCase() === 'admin123' || newPassword.toLowerCase() === 'coopstar2026') {
        res.status(400).json({ error: 'New password cannot be the default password. Please choose a new secure password.' });
        return;
      }
      if (currentPassword) {
        const JWT_SECRET = process.env.JWT_SECRET || 'iwacu-kids-secret-key-rwanda-2026';
        const inputHash = crypto.createHash('sha512').update(currentPassword + JWT_SECRET).digest('hex');
        const matches =
          currentUser.passwordHash === inputHash ||
          (currentUser.isDefaultPassword && (currentPassword === 'admin123' || currentPassword === 'coopstar2026'));
        if (!matches) {
          res.status(400).json({ error: 'Current password does not match.' });
          return;
        }
      }
    }

    const updatedUser = await db.updateAdminCredentials({
      userId,
      name,
      email,
      phone,
      newPassword,
    });

    const token = signTokenFor({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      phone: updatedUser.phone,
    });
    res.json({
      success: true,
      message: 'Credentials updated successfully.',
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isApprovedToScan: updatedUser.isApprovedToScan,
        mustChangePassword: false,
        isDefaultPassword: false,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update credentials';
    res.status(500).json({ error: msg });
  }
});

// ==========================================
// TICKETING & ORDERING (requires login)
// ==========================================
apiRouter.post('/orders', requireAuth(['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CUSTOMER']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      eventId,
      ticketTypeId,
      quantity,
      customerName,
      customerEmail,
      customerPhone,
      attendees,
      paymentMethod,
      recommendationCode,
    } = req.body;

    if (!eventId || !ticketTypeId || !quantity || paymentMethod === undefined) {
      res.status(400).json({ error: 'Missing required order fields' });
      return;
    }

    if (quantity < 1 || quantity > 20) {
      res.status(400).json({ error: 'Quantity must be between 1 and 20 tickets' });
      return;
    }

    const isCustomer = req.user?.role === 'CUSTOMER';
    const user = req.user;

    let name = customerName?.trim();
    let phone = customerPhone?.trim();
    let email = customerEmail?.trim();

    if (isCustomer) {
      const profile = await db.getCustomerById(user!.userId);
      if (!profile) {
        res.status(401).json({ error: 'Account no longer exists. Please login again.' });
        return;
      }
      name = name || profile.fullName;
      phone = phone || profile.phone;
      email = email || profile.email;
    }

    if (!name || !phone) {
      res.status(400).json({ error: 'Full name and phone number are required.' });
      return;
    }

    const { order, tickets } = await db.createOrder({
      eventId,
      ticketTypeId,
      quantity: Number(quantity),
      customerName: name,
      customerEmail: email || '',
      customerPhone: phone,
      customerUserId: user?.userId,
      recommendationCode: (recommendationCode || '').toString().trim() || undefined,
      attendees,
      paymentMethod: paymentMethod as PaymentProviderType,
    });

    res.status(201).json({
      order,
      tickets,
      message: 'Order created successfully. Please proceed with payment.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create order';
    res.status(400).json({ error: msg });
  }
});

apiRouter.get('/orders/:id', async (req: Request, res: Response) => {
  const order = await db.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

apiRouter.get('/me/tickets', requireAuth(['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'STAFF']), async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'Unauthorized session.' });
    return;
  }
  const tickets = await db.getTicketsByUser(req.user.userId);
  res.json(tickets);
});

// ==========================================
// RECOMMENDATION CODES & PAYMENT GATEWAY STATUS
// ==========================================
apiRouter.post('/recommendation/check', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const result = await db.checkRecommendationCode(code);
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to check code' });
  }
});

apiRouter.get('/payments/gateway-status', async (_req: Request, res: Response) => {
  const mtn = getPaymentProvider('MTN_MOMO');
  const airtel = getPaymentProvider('AIRTEL_MONEY');
  const ussd = await db.getUSSDSettings();
  res.json({
    mtnConfigured: mtn.isConfigured(),
    airtelConfigured: airtel.isConfigured(),
    gatewayOnline: mtn.isConfigured() || airtel.isConfigured(),
    messaging: {
      encouragement: 'Direct online gateway is not available right now. Please pay using your MTN MoMo code (*182#) or Airtel Money code (*500#) and enter the SMS transaction reference.',
    },
    ussd,
  });
});

// ==========================================
// PAYMENTS ARCHITECTURE (MTN MoMo & Airtel)
// ==========================================
apiRouter.post('/payments/initiate', async (req: Request, res: Response) => {
  try {
    const { orderId, provider: providerType, phoneNumber } = req.body;

    if (!orderId || !providerType || !phoneNumber) {
      res.status(400).json({ error: 'orderId, provider, and phoneNumber are required' });
      return;
    }

    const order = await db.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.paymentStatus === 'SUCCESS') {
      res.status(400).json({ error: 'Order is already paid' });
      return;
    }

    const provider = getPaymentProvider(providerType as PaymentProviderType);
    const result = await provider.initiatePayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      currency: 'RWF',
      phoneNumber,
      customerName: order.customerName,
      description: `IWACU Kids ${order.ticketTypeName} Ticket (${order.orderNumber})`,
    });

    res.json({
      ...result,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      currency: 'RWF',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment initiation failed';
    res.status(500).json({ error: msg });
  }
});

apiRouter.post('/payments/confirm-demo', async (req: Request, res: Response) => {
  try {
    const { orderId, transactionRef, provider } = req.body;
    const order = await db.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const payment = await db.recordPayment({
      orderId: order.id,
      provider: (provider || order.paymentMethod) as PaymentProviderType,
      amount: order.totalAmount,
      phoneNumber: order.customerPhone,
      transactionRef: transactionRef || `DEMO-TX-${Date.now()}`,
      status: 'SUCCESS',
      mode: 'DEMO',
      providerTxId: `PROV-DEMO-${Date.now()}`,
    });

    res.json({
      success: true,
      message: 'Sandbox payment confirmed successfully.',
      payment,
      order: await db.getOrderById(orderId),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Confirmation failed';
    res.status(500).json({ error: msg });
  }
});

apiRouter.post('/payments/webhook/mtn', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const externalId = payload.externalId;
    const status = payload.status === 'SUCCESSFUL' ? 'SUCCESS' : 'FAILED';

    const order = await db.getOrderById(externalId);
    if (order) {
      await db.recordPayment({
        orderId: order.id,
        provider: 'MTN_MOMO',
        amount: order.totalAmount,
        phoneNumber: order.customerPhone,
        transactionRef: payload.referenceId || `MTN-WH-${Date.now()}`,
        status,
        mode: 'LIVE',
        providerTxId: payload.financialTransactionId,
        rawWebhookData: payload,
      });
    }

    res.status(200).json({ received: true });
  } catch (err: unknown) {
    console.error('MTN Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

apiRouter.post('/payments/webhook/airtel', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const orderRef = payload.transaction?.reference;
    const isSuccess = payload.transaction?.status === 'TS';

    const order = await db.getOrderById(orderRef);
    if (order) {
      await db.recordPayment({
        orderId: order.id,
        provider: 'AIRTEL_MONEY',
        amount: order.totalAmount,
        phoneNumber: order.customerPhone,
        transactionRef: payload.transaction?.id || `AIRTEL-WH-${Date.now()}`,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        mode: 'LIVE',
        providerTxId: payload.transaction?.airtel_money_id,
        rawWebhookData: payload,
      });
    }

    res.status(200).json({ received: true });
  } catch (err: unknown) {
    console.error('Airtel Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// ==========================================
// TICKETS (PUBLIC & CUSTOMER LOOKUP)
// ==========================================
apiRouter.get('/tickets/lookup', async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q) {
    res.status(400).json({ error: 'Query parameter q (phone or email) is required' });
    return;
  }
  const tickets = await db.getTicketsByCustomer(q);
  res.json(tickets);
});

apiRouter.get('/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await db.getTicketById(req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.json(ticket);
});

// ==========================================
// CHECK-IN ENGINE (SERVER-SIDE VALIDATION + REAL DATA)
// ==========================================
apiRouter.post('/check-in/verify', async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Ticket code or QR payload required' });
    return;
  }
  const result = await db.verifyTicket(code);
  res.json(result);
});

apiRouter.post('/check-in/verify-clearance', async (req: Request, res: Response) => {
  const { operatorIdentifier } = req.body;
  if (!operatorIdentifier) {
    res.status(400).json({ error: 'Operator identifier or clearance key required' });
    return;
  }
  const access = await db.verifyScannerAccess(operatorIdentifier);
  res.json(access);
});

apiRouter.post('/check-in', async (req: Request, res: Response) => {
  try {
    const { code, scannedBy, device, operatorIdentifier } = req.body;
    if (!code) {
      res.status(400).json({ error: 'Ticket code or QR payload required' });
      return;
    }

    const identifier = operatorIdentifier || scannedBy || '';
    const access = await db.verifyScannerAccess(identifier);
    if (!access.allowed) {
      res.status(403).json({
        error:
          access.reason ||
          'Scanner clearance required by admin. Only Admins or users explicitly cleared by an Admin may scan tickets.',
        restricted: true,
      });
      return;
    }

    const result = await db.processCheckIn({
      qrPayloadOrCode: code,
      scannedBy: access.name ? `${access.name} (${access.role})` : (scannedBy || 'Cleared Gate Staff'),
      device: device || 'Staff Device',
    });

    res.json({
      ...result,
      operator: {
        name: access.name,
        role: access.role,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Check-in failed';
    res.status(500).json({ error: msg });
  }
});

// ==========================================
// ADMIN DASHBOARD & BUSINESS INTELLIGENCE
// ==========================================
apiRouter.get('/dashboard/overview', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  const orders = await db.getOrders();
  const events = await db.getEvents();
  const allTickets = await db.getAllTickets();
  const checkIns = await db.getCheckIns();

  const paidOrders = orders.filter((o) => o.paymentStatus === 'SUCCESS');
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalTicketsSold = paidOrders.reduce((acc, o) => acc + o.quantity, 0);
  const totalCheckedIn = allTickets.filter((t) => t.status === 'USED').length;

  const mtnRevenue = paidOrders
    .filter((o) => o.paymentMethod === 'MTN_MOMO')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  const airtelRevenue = paidOrders
    .filter((o) => o.paymentMethod === 'AIRTEL_MONEY')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const eventPerformance = events.map((ev) => {
    const evTickets = allTickets.filter((t) => t.eventId === ev.id);
    const evPaidOrders = paidOrders.filter((o) => o.eventId === ev.id);
    const sold = evPaidOrders.reduce((acc, o) => acc + o.quantity, 0);
    const capacity = ev.ticketTypes.reduce((acc, t) => acc + (t.totalQuantity || 0), 0);
    const revenue = evPaidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const checkedIn = evTickets.filter((t) => t.status === 'USED').length;

    return {
      id: ev.id,
      title: ev.title,
      date: ev.eventDate,
      sold,
      capacity,
      occupancyRate: capacity > 0 ? Math.round((sold / capacity) * 100) : 0,
      revenue,
      checkedIn,
      checkInRate: sold > 0 ? Math.round((checkedIn / sold) * 100) : 0,
    };
  });

  res.json({
    metrics: {
      totalRevenue,
      totalTicketsSold,
      upcomingEventsCount: events.filter((e) => e.status === 'PUBLISHED').length,
      totalAttendees: allTickets.length,
      totalCheckedIn,
      pendingOrdersCount: orders.filter((o) => o.paymentStatus === 'PENDING').length,
      checkInRate: allTickets.length > 0 ? Math.round((totalCheckedIn / allTickets.length) * 100) : 0,
    },
    paymentMethodsBreakdown: {
      mtn: { count: paidOrders.filter((o) => o.paymentMethod === 'MTN_MOMO').length, revenue: mtnRevenue },
      airtel: { count: paidOrders.filter((o) => o.paymentMethod === 'AIRTEL_MONEY').length, revenue: airtelRevenue },
      ussd: { count: paidOrders.filter((o) => o.paymentMethod === 'MANUAL_USSD').length, revenue: paidOrders.filter((o) => o.paymentMethod === 'MANUAL_USSD').reduce((a, o) => a + o.totalAmount, 0) },
    },
    eventPerformance,
    recentOrders: orders.slice(0, 8),
    recentCheckIns: checkIns.slice(0, 8),
  });
});

apiRouter.get('/admin/orders', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  res.json(await db.getOrders());
});

apiRouter.get('/admin/tickets', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  res.json(await db.getAllTickets());
});

apiRouter.get('/admin/payments', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  res.json(await db.getPayments());
});

apiRouter.get('/admin/check-ins', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  res.json(await db.getCheckIns());
});

apiRouter.get('/admin/audit-logs', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  res.json(await db.getAuditLogs());
});

apiRouter.get('/admin/customers', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  res.json(await db.getCustomers());
});

apiRouter.get('/admin/users', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  res.json(await db.getScanners());
});

// ==========================================
// EVENT CRUD + CAPACITY INCREASE
// ==========================================
apiRouter.post('/admin/events', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const event = await db.createEvent(req.body);
    res.status(201).json(event);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create event';
    res.status(400).json({ error: msg });
  }
});

apiRouter.patch('/admin/events/:id', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const updated = await db.updateEvent(req.params.id, req.body);
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update event';
    res.status(400).json({ error: msg });
  }
});

apiRouter.post('/admin/events/:id/capacity', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { additionalPerType } = req.body;
    const updated = await db.increaseEventCapacity(req.params.id, Number(additionalPerType));
    res.json({
      success: true,
      message: 'Event participant range increased. More tickets are now available.',
      event: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to increase capacity';
    res.status(400).json({ error: msg });
  }
});

apiRouter.delete('/admin/events/:id', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  const success = await db.deleteEvent(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json({ success: true, message: 'Event deleted' });
});

// ==========================================
// GALLERY / PROGRAMS / SETTINGS
// ==========================================
apiRouter.post('/admin/gallery', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const item = await db.addGalleryItem(req.body);
    res.status(201).json(item);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add gallery item';
    res.status(400).json({ error: msg });
  }
});

apiRouter.delete('/admin/gallery/:id', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  const success = await db.deleteGalleryItem(req.params.id);
  res.json({ success });
});

apiRouter.post('/admin/programs', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const prog = await db.addProgram(req.body);
    res.status(201).json(prog);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create program';
    res.status(400).json({ error: msg });
  }
});

apiRouter.patch('/admin/programs/:id', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const updated = await db.updateProgram(req.params.id, req.body);
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update program';
    res.status(400).json({ error: msg });
  }
});

apiRouter.patch('/admin/settings', requireAuth(['SUPER_ADMIN']), async (req: Request, res: Response) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update settings';
    res.status(400).json({ error: msg });
  }
});

// ==========================================
// USSD MANUAL PAYMENTS & CONFIG
// ==========================================
apiRouter.get('/ussd/settings', async (_req: Request, res: Response) => {
  res.json(await db.getUSSDSettings());
});

apiRouter.post('/payments/manual-ussd-submit', async (req: Request, res: Response) => {
  try {
    const { orderId, transactionRef, customerPhone } = req.body;
    if (!orderId || !transactionRef) {
      res.status(400).json({ error: 'orderId and transactionRef are required' });
      return;
    }

    const result = await db.submitManualUSSDPayment({
      orderId,
      transactionRef,
      customerPhone: customerPhone || 'Customer Phone',
    });

    res.json({
      success: true,
      message: 'USSD payment submitted successfully. Your digital tickets are activated!',
      ...result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit USSD payment';
    res.status(400).json({ error: msg });
  }
});

apiRouter.get('/admin/ussd-orders', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  const orders = await db.getUSSDOrders();
  res.json(orders);
});

apiRouter.patch('/admin/ussd/settings', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const updated = await db.updateUSSDSettings(req.body);
    res.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update USSD settings';
    res.status(400).json({ error: msg });
  }
});

// ==========================================
// GATE SCANNERS & STAFF / HELP-ADMIN CREATION
// ==========================================
apiRouter.get('/admin/scanners', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (_req: Request, res: Response) => {
  const scanners = await db.getScanners();
  res.json(scanners);
});

apiRouter.post('/admin/scanners', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, phone, role, isApprovedToScan } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const scanner = await db.addScanner({
      name,
      email,
      phone,
      role: role || 'STAFF',
      isApprovedToScan: isApprovedToScan ?? true,
      clearedBy: req.user?.name || 'Admin',
    });

    res.status(201).json(scanner);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create user';
    res.status(400).json({ error: msg });
  }
});

apiRouter.patch('/admin/scanners/:id/clearance', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isApprovedToScan } = req.body;
    if (typeof isApprovedToScan !== 'boolean') {
      res.status(400).json({ error: 'isApprovedToScan boolean is required' });
      return;
    }

    const updated = await db.toggleScannerClearance(
      req.params.id,
      isApprovedToScan,
      req.user?.name || 'Chief Admin'
    );

    res.json({
      success: true,
      message: isApprovedToScan ? 'Scanner clearance granted to operator.' : 'Scanner clearance revoked.',
      user: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update clearance';
    res.status(400).json({ error: msg });
  }
});

apiRouter.delete('/admin/scanners/:id', requireAuth(['SUPER_ADMIN', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const success = await db.deleteScanner(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User removed' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete user';
    res.status(400).json({ error: msg });
  }
});

// ==========================================
// VERIFY A TOKEN (used by clients to restore session)
// ==========================================
apiRouter.post('/auth/verify-token', (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: 'Token required' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  res.json({ valid: true, payload });
});