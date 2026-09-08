import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Phone,
  User,
  Mail,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronLeft,
  Copy,
  Hash,
  Smartphone,
  CheckCircle2,
  LogIn,
  BadgePercent,
} from 'lucide-react';
import { Event, TicketType, PaymentProviderType } from '../types';
import { api } from '../api/client';
import { useTicketWallet } from '../context/TicketWalletContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function CheckoutPage() {
  const { t, isRw } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { saveTickets } = useTicketWallet();
  const { user, token } = useAuth();

  const state = (location.state || {}) as {
    eventId?: string;
    ticketTypeId?: string;
    quantity?: number;
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(state.eventId || '');
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>(state.ticketTypeId || '');
  const [quantity, setQuantity] = useState<number>(state.quantity || 1);

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState(user?.name || user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+250 ');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');

  // Recommendation code
  const [recCode, setRecCode] = useState('');
  const [appliedRec, setAppliedRec] = useState<{
    code: string;
    ownerName: string;
    discountPercent: number;
  } | null>(null);
  const [recError, setRecError] = useState('');
  const [recChecking, setRecChecking] = useState(false);

  // Payment Selection: MTN_MOMO | AIRTEL_MONEY | MANUAL_USSD
  const [gatewayOnline, setGatewayOnline] = useState<boolean | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<'MTN_MOMO' | 'AIRTEL_MONEY' | 'MANUAL_USSD'>('MANUAL_USSD');

  // Manual USSD Details
  const [ussdSettings, setUssdSettings] = useState<{
    mtnMerchantCode: string;
    mtnReceiverPhone: string;
    mtnReceiverName: string;
    airtelMerchantCode: string;
    airtelReceiverPhone: string;
    instructionsEn: string;
    instructionsRw: string;
  } | null>(null);

  const [manualTxId, setManualTxId] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAirtelCode, setCopiedAirtelCode] = useState(false);

  // Flow State
  const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: Payment Auth / USSD Submit
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load events, USSD settings and gateway status
  useEffect(() => {
    async function load() {
      try {
        const [eventsData, ussdData, gateway] = await Promise.all([
          api.getEvents(),
          api.getUSSDSettings().catch(() => null),
          api.getGatewayStatus().catch(() => null),
        ]);
        setEvents(eventsData);
        if (ussdData) setUssdSettings(ussdData);
        if (gateway) {
          setGatewayOnline(gateway.gatewayOnline);
          // When the online gateway is unavailable, encourage USSD codes by default
          if (!gateway.gatewayOnline) {
            setPaymentProvider('MANUAL_USSD');
          }
        }
        if (!selectedEventId && eventsData.length > 0) {
          setSelectedEventId(eventsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load checkout data:', err);
      }
    }
    load();
  }, [selectedEventId]);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const ticketTypes = currentEvent?.ticketTypes || [];
  const currentTicketType =
    ticketTypes.find((t) => t.id === selectedTicketTypeId) || ticketTypes[0];

  const grossAmount = currentTicketType ? currentTicketType.price * quantity : 0;
  const discountAmount = appliedRec ? Math.round((grossAmount * appliedRec.discountPercent) / 100) : 0;
  const totalAmount = Math.max(0, grossAmount - discountAmount);

  const handlePhoneChange = (val: string) => {
    if (!val.startsWith('+250')) {
      setCustomerPhone('+250 ');
    } else {
      setCustomerPhone(val);
    }
  };

  const applyRecommendationCode = async () => {
    if (!recCode.trim()) {
      setRecError(isRw ? 'Andika kode yawe yo kwishyurirwa.' : 'Please enter your recommendation code.');
      return;
    }
    setRecChecking(true);
    setRecError('');
    try {
      const res = await api.checkRecommendationCode(recCode.trim());
      if (res.valid && res.discountPercent) {
        setAppliedRec({
          code: res.code || recCode.trim().toUpperCase(),
          ownerName: res.ownerName || 'IWACU Kids',
          discountPercent: res.discountPercent,
        });
      } else {
        setAppliedRec(null);
        setRecError(res.message || 'Invalid recommendation code.');
      }
    } catch (err: unknown) {
      setAppliedRec(null);
      setRecError(err instanceof Error ? err.message : 'Could not verify code.');
    } finally {
      setRecChecking(false);
    }
  };

  const validateDetails = () => {
    if (!customerName.trim()) {
      setErrorMessage(
        isRw
          ? 'Nyamuneka andika amazina yose y’umwana cyangwa umubyeyi.'
          : 'Please enter the attendee or guardian full name.'
      );
      return false;
    }
    const cleanPhone = customerPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 12) {
      setErrorMessage(
        isRw
          ? 'Nyamuneka andika nimero nyayo yo mu Rwanda (+250 78/72/73...).'
          : 'Please enter a valid Rwandan phone number (+250 78/72/73...).'
      );
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleInitiateOrder = async () => {
    if (!token) {
      setErrorMessage(isRw ? 'Banza winjire kugira ngo ugure itike.' : 'Please login to your account before booking tickets.');
      return;
    }
    if (!validateDetails()) return;
    if (!currentEvent || !currentTicketType) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Create order on server (auth required)
      const { order } = await api.createOrder({
        eventId: currentEvent.id,
        ticketTypeId: currentTicketType.id,
        quantity,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim(),
        paymentMethod: paymentProvider,
        recommendationCode: appliedRec?.code || undefined,
      });

      setCreatedOrderId(order.id);

      // If MANUAL_USSD, proceed directly to USSD confirmation step
      if (paymentProvider === 'MANUAL_USSD') {
        setStep(2);
        setSubmitting(false);
        return;
      }

      // 2. Initiate payment via gateway
      const paymentRes = await api.initiatePayment({
        orderId: order.id,
        provider: paymentProvider as PaymentProviderType,
        phoneNumber: customerPhone.trim(),
      });

      setIsDemoMode(paymentRes.mode === 'DEMO');
      setPaymentInstructions(paymentRes.promptInstructions);
      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order initiation failed';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Authorize gateway payment (Sandbox / Demo / Instant PIN)
  const handleAuthorizePayment = async () => {
    if (!createdOrderId) return;
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.confirmDemoPayment({
        orderId: createdOrderId,
        provider: paymentProvider,
      });

      if (res.success && res.order) {
        saveTickets(res.order.tickets);
        navigate(`/tickets/success/${res.order.id}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment confirmation failed';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Manual USSD Transaction
  const handleSubmitManualUSSD = async () => {
    if (!createdOrderId) return;
    if (!manualTxId.trim()) {
      setErrorMessage(
        isRw
          ? 'Nyamuneka andika nimero ya transakisiyo (TxId / Reference) wakiriye muri SMS.'
          : 'Please enter the SMS transaction reference ID received from your mobile money provider.'
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.submitManualUSSD({
        orderId: createdOrderId,
        transactionRef: manualTxId.trim(),
        customerPhone: customerPhone.trim(),
      });

      if (res.success && res.tickets) {
        saveTickets(res.tickets);
        navigate(`/tickets/success/${res.order.id}`);
      } else {
        setErrorMessage(res.message || 'Verification failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'USSD verification failed';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Format the USSD strings
  const mtnMerchant = ussdSettings?.mtnMerchantCode || '654321';
  const airtelMerchant = ussdSettings?.airtelMerchantCode || '654321';
  const mtnUssdDialString = `*182*8*1*${mtnMerchant}#`;
  const airtelUssdDialString = `*500*4*2*${airtelMerchant}#`;
  const copyUssdCode = (code: string, key: 'mtn' | 'airtel') => {
    navigator.clipboard.writeText(code);
    if (key === 'mtn') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } else {
      setCopiedAirtelCode(true);
      setTimeout(() => setCopiedAirtelCode(false), 2500);
    }
  };

  // Require login gate for booking
  if (!token || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 sm:py-16 pb-28">
        <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-stone-900">Login required to buy tickets</h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {isRw
              ? 'Kugira ngo ugure itike kuri IWACU Kids, banza winjire cyangwa ukore konte ukoresheje nimero yawe ya telefone, amazina yose n’ijambobanga.'
              : 'To purchase tickets, please create an account or sign in with your phone number, full name and password. Your tickets will be saved to your personal QR wallet.'}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-black shadow-lg shadow-orange-600/30"
          >
            <LogIn className="w-4 h-4" />
            Login / Create Account
          </Link>
          <Link to="/events" className="block text-xs font-bold text-stone-400 hover:text-stone-700">
            {isRw ? 'Banza urebe ibirori' : 'Browse events first'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-10 space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 shadow-sm hover:bg-stone-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-stone-900">{t.checkoutTitle}</h1>
          <span className="text-xs text-stone-500">{t.checkoutSubtitle}</span>
        </div>
      </div>

      {/* Signed in as banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
            <User className="w-4 h-4" />
          </span>
          <div>
            <span className="font-black block uppercase text-[10px] text-emerald-700">
              {user.role === 'CUSTOMER' ? 'Customer Account' : 'Staff Account'}
            </span>
            <span className="font-extrabold">
              {user.name || user.fullName} <span className="text-emerald-700 font-mono">({user.phone || user.email})</span>
            </span>
          </div>
        </div>
        {user.recommendationCode && (
          <span className="text-[10px] font-black px-2 py-1 rounded-full bg-emerald-200 text-emerald-900 whitespace-nowrap"
            title="Your personal recommendation code — share it to earn discounts"
          >
            {user.recommendationCode}
          </span>
        )}
      </div>

      {/* Progress Pills */}
      <div className="flex items-center gap-2 text-xs font-bold">
        <div
          className={`flex-1 py-1.5 px-3 rounded-lg text-center ${
            step >= 1 ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-600'
          }`}
        >
          {t.checkoutStep1}
        </div>
        <div
          className={`flex-1 py-1.5 px-3 rounded-lg text-center ${
            step >= 2 ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-600'
          }`}
        >
          {t.checkoutStep2}
        </div>
        <div className="flex-1 py-1.5 px-3 rounded-lg text-center bg-stone-200 text-stone-600">
          {t.checkoutStep3}
        </div>
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: EVENT SELECTION & ATTENDEE DETAILS */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Order Summary Box */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              {isRw ? 'Ibirori Byatoranyijwe' : 'Selected Celebration'}
            </h3>

            {currentEvent && (
              <div className="space-y-1.5 pb-3 border-b border-stone-100">
                <h2 className="text-lg font-black text-stone-900">{currentEvent.title}</h2>
                <div className="text-xs text-stone-500 flex items-center gap-2">
                  <span>{currentEvent.eventDate}</span>
                  <span>•</span>
                  <span>{currentEvent.location}</span>
                </div>
              </div>
            )}

            {/* Ticket Tier Pill Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">{t.checkoutTier}</label>
              <div className="grid grid-cols-3 gap-2">
                {ticketTypes.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTicketTypeId(tier.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      (selectedTicketTypeId || ticketTypes[0]?.id) === tier.id
                        ? 'bg-orange-50/50 border-orange-500 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-xs block font-bold">{tier.name}</span>
                    <span className="text-[11px] font-black text-orange-600 block mt-0.5">
                      {tier.price.toLocaleString()} RWF
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-stone-700">{t.checkoutQuantity}</span>
              <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 disabled:opacity-40 font-bold"
                >
                  -
                </button>
                <span className="font-extrabold text-sm w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Recommendation Code */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <label className="text-xs font-bold text-stone-700 block flex items-center gap-1.5">
                <BadgePercent className="w-3.5 h-3.5 text-orange-600" />
                {isRw ? 'Kode ya Recommendation (Kugabanirwa ho)' : 'Recommendation Code (Discount)'}
              </label>

              {appliedRec ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-emerald-900">
                      {appliedRec.code} • {appliedRec.discountPercent}% off
                    </span>
                    <span className="text-emerald-700 text-[10px]">by {appliedRec.ownerName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedRec(null);
                      setRecCode('');
                    }}
                    className="text-stone-400 hover:text-stone-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recCode}
                    onChange={(e) => setRecCode(e.target.value.toUpperCase())}
                    placeholder="e.g. IWACU10"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-sm font-mono uppercase focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <button
                    type="button"
                    onClick={applyRecommendationCode}
                    disabled={recChecking || !recCode.trim()}
                    className="px-4 py-2 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {recChecking ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {recError && <p className="text-[11px] text-red-600 font-medium">{recError}</p>}
              {appliedRec && (
                <p className="text-[11px] text-emerald-700 font-bold">
                  {isRw
                    ? `Wabonetse kugabanirwa ho ${appliedRec.discountPercent}% (${(discountAmount).toLocaleString()} RWF).`
                    : `You saved ${discountAmount.toLocaleString()} RWF (${appliedRec.discountPercent}% discount applied).`}
                </p>
              )}
            </div>

            {/* Price Total Calc */}
            <div className="pt-3 border-t border-stone-100 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>{isRw ? 'Igiciro cyose' : 'Subtotal'}</span>
                <span>{grossAmount.toLocaleString()} RWF</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>{isRw ? 'Kugabanirwa' : 'Discount'}</span>
                  <span>-{discountAmount.toLocaleString()} RWF</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-semibold">{t.checkoutTotalAmount}</span>
                <div className="text-xl font-black text-stone-900">
                  {totalAmount.toLocaleString()} <span className="text-xs font-bold text-stone-500">RWF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendee Details Form */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              {isRw ? 'Amakuru y’Umuguzi n’Umwana' : 'Attendee Contact Details'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.checkoutAttendeeName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={t.checkoutAttendeeNamePlaceholder}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.checkoutPhone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+250 788 123 456"
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  {t.checkoutPhoneHint}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t.checkoutEmail}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="parent@example.rw"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector (with gateway-aware USSD encouragement) */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                {t.checkoutSelectPayment}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                Rwanda MoMo & USSD
              </span>
            </div>

            {gatewayOnline === false && (
              <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-1.5 animate-in zoom-in-95">
                <span className="font-black block uppercase text-[10px] tracking-wider">
                  {isRw ? 'BANZA WISHYURE UKORESHEJE KODE YA USSD' : 'PAY USING USSD CODES'}
                </span>
                <p>
                  {isRw
                    ? 'Ikigo cy’ubwishyu muri gatwe nticyo gihari ubu. Banza ukande ku kode ya MTN MoMo (*182#) cyangwa Airtel Money (*500#), ubone Transakiyo reference, maze uyandike hasi.'
                    : 'The online payment gateway is not available right now. Please pay using your MTN MoMo code (*182#) or Airtel Money code (*500#), then enter the SMS transaction reference below.'}
                </p>
              </div>
            )}

            <div className="space-y-2.5">
              {/* Manual USSD (No gateway fallback) — recommended when offline */}
              <button
                type="button"
                onClick={() => setPaymentProvider('MANUAL_USSD')}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  paymentProvider === 'MANUAL_USSD'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center text-white">
                    <Hash className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-stone-900">{t.checkoutPayUssd}</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-200 text-orange-800">
                        {isRw ? 'Icyemezo cya SMS' : 'SMS Reference'}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500">{t.checkoutPayUssdSub}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-orange-600 underline">
                  {isRw ? 'MoMoPay kode' : '*182# / *500#'}
                </span>
              </button>

              {/* MTN MoMo (online gateway) */}
              <button
                type="button"
                onClick={() => setPaymentProvider('MTN_MOMO')}
                disabled={gatewayOnline === false}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  gatewayOnline === false ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  paymentProvider === 'MTN_MOMO'
                    ? 'border-yellow-500 bg-yellow-50/40 ring-2 ring-yellow-400/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#FFCC00] flex items-center justify-center font-black text-[10px] text-black">
                    M
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-stone-900">{t.checkoutPayMoMo}</h4>
                    <span className="text-[11px] text-stone-500">{t.checkoutPayMoMoSub}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-400 font-mono">*182#</span>
              </button>

              {/* Airtel Money (online gateway) */}
              <button
                type="button"
                onClick={() => setPaymentProvider('AIRTEL_MONEY')}
                disabled={gatewayOnline === false}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  gatewayOnline === false ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  paymentProvider === 'AIRTEL_MONEY'
                    ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E60000] flex items-center justify-center font-black text-[10px] text-white">
                    A
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-stone-900">{t.checkoutPayAirtel}</h4>
                    <span className="text-[11px] text-stone-500">{t.checkoutPayAirtelSub}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-400 font-mono">*500#</span>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleInitiateOrder}
            disabled={submitting}
            className="w-full py-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            {submitting ? (
              <span>{t.loading}</span>
            ) : (
              <>
                <span>
                  {t.checkoutProceedBtn} ({totalAmount.toLocaleString()} RWF)
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 2: PAYMENT VERIFICATION (USSD OR GATEWAY) */}
      {step === 2 && (
        <div className="space-y-6">
          {paymentProvider === 'MANUAL_USSD' ? (
            /* ================= MANUAL USSD PAYMENT FLOW ================= */
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-stone-900">{t.checkoutUssdTitle}</h2>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  {t.checkoutUssdNotice}
                </p>
              </div>

              {/* MTN Dialing Code Box */}
              <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  {isRw ? 'MTN MoMo (kode ya mbere)' : 'MTN MoMo (primary code)'}
                </span>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-stone-800">
                  <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                    {mtnUssdDialString}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyUssdCode(mtnUssdDialString, 'mtn')}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 flex items-center gap-1.5 transition-all"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.checkoutUssdCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.checkoutUssdCopyBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-stone-300 pt-1">
                  <div>
                    <span className="text-stone-500 text-[10px] block">{isRw ? 'Umugenerwabikorwa:' : 'Merchant:'}</span>
                    <span className="font-bold">{ussdSettings?.mtnReceiverName || 'IWACU KIDS / COOPSTAR'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">{isRw ? 'Amafaranga yose:' : 'Amount:'}</span>
                    <span className="font-black text-orange-400">{totalAmount.toLocaleString()} RWF</span>
                  </div>
                </div>

                <a
                  href={`tel:${encodeURIComponent(mtnUssdDialString)}`}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{t.checkoutUssdDialBtn} (*182#)</span>
                </a>
              </div>

              {/* Airtel Dialing Code Box */}
              <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block">
                  {isRw ? 'Airtel Money (kode ya kabiri)' : 'Airtel Money (alternate code)'}
                </span>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-stone-800">
                  <span className="font-mono text-xl sm:text-2xl font-black text-red-300 tracking-wider">
                    {airtelUssdDialString}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyUssdCode(airtelUssdDialString, 'airtel')}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 flex items-center gap-1.5 transition-all"
                  >
                    {copiedAirtelCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.checkoutUssdCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.checkoutUssdCopyBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-stone-300 pt-1">
                  <div>
                    <span className="text-stone-500 text-[10px] block">{isRw ? 'Umugenerwabikorwa:' : 'Merchant:'}</span>
                    <span className="font-bold">{ussdSettings?.airtelReceiverName || 'IWACU KIDS / COOPSTAR'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px] block">{isRw ? 'Amafaranga yose:' : 'Amount:'}</span>
                    <span className="font-black text-red-400">{totalAmount.toLocaleString()} RWF</span>
                  </div>
                </div>

                <a
                  href={`tel:${encodeURIComponent(airtelUssdDialString)}`}
                  className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{t.checkoutUssdDialBtn} (*500#)</span>
                </a>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                {isRw
                  ? `${ussdSettings?.instructionsRw || `Kanda kode ya MoMoPay ${mtnUssdDialString} cyangwa ${airtelUssdDialString}. Emefa barefe (amount) ${totalAmount.toLocaleString()} RWF, ukihereza SMS reference.`}`
                  : `${ussdSettings?.instructionsEn || `Dial MoMoPay code ${mtnUssdDialString} (or ${airtelUssdDialString}) and pay ${totalAmount.toLocaleString()} RWF to IWACU KIDS.`}`}
              </p>

              {/* Transaction ID Input Form */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-800 block">
                  {t.checkoutUssdTxIdLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={t.checkoutUssdTxIdPlaceholder}
                    value={manualTxId}
                    onChange={(e) => setManualTxId(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-stone-300 text-sm font-mono font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  {isRw
                    ? 'Reba ubutumwa bwa SMS wakiriye buvuye kuri 182 cyangwa MTN/Airtel, wandike numero ya transakisiyo (urugero: MP260905.1234.H56789 cyangwa nimero ya telefone).'
                    : 'Check your SMS confirmation received from 182 or MTN/Airtel and paste the reference ID to instantly issue your ticket.'}
                </p>
              </div>

              {/* Submit USSD Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSubmitManualUSSD}
                  disabled={submitting || !manualTxId.trim()}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-[52px]"
                >
                  {submitting ? (
                    <span>{t.loading}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.checkoutUssdSubmitBtn}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold text-center block"
                >
                  {t.back}
                </button>
              </div>
            </div>
          ) : (
            /* ================= ONLINE GATEWAY (MOMO / AIRTEL) FLOW ================= */
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 animate-spin" />
                </div>
                <h2 className="text-xl font-black text-stone-900">{isRw ? 'Kwishyura biratunganywa' : 'Authorizing Payment'}</h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                  {paymentInstructions ||
                    (isRw
                      ? `Reba kuri telefone yawe (${customerPhone}) ubutumwa bwo kwemeza PIN yo kwishyura.`
                      : `Check your mobile phone (${customerPhone}) for the ${paymentProvider} push prompt to authorize.`)}
                </p>
              </div>

              {/* Demo Mode Badge */}
              {isDemoMode && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-900 text-xs space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-[10px]">
                    {isRw ? 'ICYICIRO CYO GUSUZUMA (SANDBOX)' : 'SANDBOX / DEVELOPMENT MODE'}
                  </span>
                  <p>
                    {isRw
                      ? 'Kanda kuri buto yo munsi kugira ngo wemeze ako kanya ubone itike yawe ya QR Code.'
                      : 'This environment is operating on simulated Rwandan carrier credentials. Click below to instantly simulate carrier PIN authorization and issue your digital ticket with QR code.'}
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <div className="p-4 rounded-2xl bg-stone-50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">{isRw ? 'Kode y’Icyifuzo:' : 'Order Ref:'}</span>
                  <span className="font-mono font-bold text-stone-900">{createdOrderId.slice(0, 16)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{isRw ? 'Telefone:' : 'Phone:'}</span>
                  <span className="font-bold text-stone-900">{customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{isRw ? 'Amafaranga yo kwishyura:' : 'Amount Due:'}</span>
                  <span className="font-black text-orange-600 text-sm">{totalAmount.toLocaleString()} RWF</span>
                </div>
              </div>

              {/* Fallback to Manual USSD notice if gateway takes long */}
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 flex items-center justify-between">
                <div>
                  <span className="font-bold block">
                    {isRw ? 'Nta butumwa bwa PIN buje?' : 'No prompt on your screen?'}
                  </span>
                  <span className="text-[11px] text-stone-600">
                    {isRw ? 'Koresha kode ya USSD ya MoMoPay (*182#) cyangwa Airtel (*500#)' : 'Switch to manual USSD payment (*182# or *500#)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentProvider('MANUAL_USSD')}
                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] shrink-0"
                >
                  {isRw ? 'Koresha USSD' : 'Use USSD'}
                </button>
              </div>

              {/* Confirm Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleAuthorizePayment}
                  disabled={submitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>{t.loading}</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.checkoutAuthorizeBtn}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold text-center block"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}