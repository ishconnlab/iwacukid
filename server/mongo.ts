import mongoose, { Schema } from 'mongoose';

/**
 * IWACU Kids MongoDB connection + models.
 *
 * All collections intentionally use `_id: false` and a readable string `id`
 * primary key so that the existing API contract (entities carry `id`) stays
 * identical to the previous JSON-file store.
 */

export function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const baseOpts = { _id: false, strict: false } as const;
const pk = {
  id: { type: String, required: true, unique: true, index: true },
};

// All models are intentionally kept loosely typed (`as any`) because the
// schemas use `strict: false` and accept arbitrary extra fields. Strong
// typing is enforced by the domain interfaces in `server/types.ts` instead.
const flexSchema = (def: Record<string, unknown>) =>
  new Schema(def as Record<string, any>, baseOpts as any);

export const categoryModel = mongoose.model('Category', flexSchema({ ...pk })) as any;

export const ticketTypeSchema = new Schema({} as Record<string, any>, baseOpts as any);
export const eventModel = mongoose.model(
  'Event',
  new Schema(
    {
      ...pk,
      location: { type: String, default: 'Nyakaliro, Rwanda' },
      venue: { type: String, default: '' },
      status: { type: String, default: 'PUBLISHED' },
      ticketTypes: { type: [ticketTypeSchema], default: [] },
    } as Record<string, any>,
    baseOpts as any
  )
) as any;

export const ticketModel = mongoose.model(
  'Ticket',
  new Schema(
    {
      ...pk,
      ticketCode: { type: String, required: true, unique: true, index: true },
      qrPayload: { type: String, required: true, index: true },
      status: { type: String, default: 'VALID' },
      checkInNumber: { type: Number },
      orderId: { type: String, index: true },
      eventId: { type: String, index: true },
    } as Record<string, any>,
    baseOpts as any
  )
) as any;

export const orderModel = mongoose.model(
  'Order',
  new Schema(
    {
      ...pk,
      orderNumber: { type: String, required: true, unique: true, index: true },
      customerPhone: { type: String, index: true },
      paymentStatus: { type: String, default: 'PENDING' },
      customerUserId: { type: String, index: true },
      recommendationCode: { type: String },
      discountAmount: { type: Number, default: 0 },
      tickets: { type: [new Schema({} as Record<string, any>, baseOpts as any)], default: [] },
    } as Record<string, any>,
    baseOpts as any
  )
) as any;

export const paymentModel = mongoose.model('Payment', flexSchema({ ...pk })) as any;

export const checkinModel = mongoose.model(
  'CheckIn',
  new Schema(
    { ...pk, eventId: { type: String, index: true }, ticketId: { type: String, index: true } } as Record<string, any>,
    baseOpts as any
  )
) as any;

export const galleryModel = mongoose.model('Gallery', flexSchema({ ...pk })) as any;

export const programModel = mongoose.model('Program', flexSchema({ ...pk })) as any;

export const settingsModel = mongoose.model('Settings', flexSchema({ ...pk })) as any;

export const ussdModel = mongoose.model('USSDSetting', flexSchema({ ...pk })) as any;

export const userModel = mongoose.model(
  'User',
  new Schema(
    {
      ...pk,
      email: { type: String, index: true },
      phone: { type: String, index: true },
      role: { type: String, default: 'STAFF' },
    } as Record<string, any>,
    baseOpts as any
  )
) as any;

export const customerModel = mongoose.model(
  'Customer',
  new Schema(
    {
      ...pk,
      fullName: { type: String, required: true },
      phone: { type: String, required: true, unique: true, index: true },
      email: { type: String, index: true },
      passwordHash: { type: String, required: true },
      recommendationCode: { type: String, unique: true, sparse: true, index: true },
      active: { type: Boolean, default: true },
    } as Record<string, any>,
    baseOpts as any
  )
) as any;

export const recommendationModel = mongoose.model(
  'Recommendation',
  new Schema(
    {
      ...pk,
      code: { type: String, required: true, unique: true, index: true },
      ownerName: { type: String, default: '' },
      discountPercent: { type: Number, default: 10 },
      active: { type: Boolean, default: true },
      usageCount: { type: Number, default: 0 },
    } as Record<string, any>,
    baseOpts as any
  )
) as any;

export const auditModel = mongoose.model(
  'AuditLog',
  new Schema(
    { ...pk, timestamp: { type: Date, default: Date.now }, action: { type: String, index: true } } as Record<string, any>,
    baseOpts as any
  )
) as any;

let connectionPromise: Promise<typeof mongoose> | null = null;

export function connectMongo(uri: string): Promise<typeof mongoose> {
  if (connectionPromise) return connectionPromise;
  mongoose.set('strictQuery', false);
  connectionPromise = connectWithSrvFallback(uri);
  return connectionPromise;
}

async function connectWithSrvFallback(uri: string): Promise<typeof mongoose> {
  const opts = {
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    retryWrites: true,
  };
  try {
    await mongoose.connect(uri, opts);
    return mongoose;
  } catch (err) {
    // Some networks (corporate DNS / VPN) block SRV and TXT lookups that
    // `mongodb+srv://` requires, while plain A-record resolution still works.
    // When that happens, fall back to the explicit replica-set URI.
    const isSrvFailure = err instanceof Error && /querySrv|queryTxt|ENOTFOUND|EAI_AGAIN/.test(err.message);
    const mirror = process.env.MONGODB_MIRROR_URI;
    if (isSrvFailure && mirror) {
      console.warn(`⚠️ SRV DNS lookup failed (${err.message}). Retrying with MONGODB_MIRROR_URI.`);
      // Reset the cached `$initialConnection` promise or the retry would
      // just re-throw the original error.
      await mongoose.disconnect().catch(() => undefined);
      await mongoose.connect(mirror, opts);
      return mongoose;
    }
    throw err;
  }
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}

export async function isMongoConnected(): Promise<boolean> {
  return mongoose.connection.readyState === 1;
}