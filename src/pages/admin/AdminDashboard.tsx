import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Ticket as TicketIcon,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  LogOut,
  Plus,
  Settings,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Check,
  X,
  Smartphone,
  Hash,
  RefreshCw,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../api/client';
import { DashboardOverview, TicketOrder } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminChangeCredentialsModal } from '../../components/admin/AdminChangeCredentialsModal';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAdmin, mustChangePassword } = useAuth();
  const { t, isRw } = useLanguage();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SCANNERS' | 'USSD'>('OVERVIEW');
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // Scanner Clearance Management
  const [scanners, setScanners] = useState<any[]>([]);
  const [scannersLoading, setScannersLoading] = useState(false);
  const [showAddScannerModal, setShowAddScannerModal] = useState(false);
  const [newScannerData, setNewScannerData] = useState({
    name: '',
    email: '',
    phone: '+250 78',
    role: 'STAFF',
    isApprovedToScan: true,
  });

  // Manual USSD Orders & Settings
  const [ussdOrders, setUssdOrders] = useState<TicketOrder[]>([]);
  const [ussdOrdersLoading, setUssdOrdersLoading] = useState(false);
  const [ussdSettings, setUssdSettings] = useState({
    mtnMerchantCode: '654321',
    mtnReceiverPhone: '0788200300',
    mtnReceiverName: 'IWACU KIDS / COOPSTAR',
    airtelMerchantCode: '543210',
    airtelReceiverPhone: '0738200300',
    instructionsEn: '',
    instructionsRw: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadScanners = async () => {
    try {
      setScannersLoading(true);
      const list = await api.getScanners();
      setScanners(list);
    } catch (err) {
      console.error('Failed to load scanners:', err);
    } finally {
      setScannersLoading(false);
    }
  };

  const loadUSSDData = async () => {
    try {
      setUssdOrdersLoading(true);
      const [orders, settings] = await Promise.all([
        api.getAdminUSSDOrders().catch(() => []),
        api.getUSSDSettings().catch(() => null),
      ]);
      setUssdOrders(orders);
      if (settings) {
        setUssdSettings(settings);
      }
    } catch (err) {
      console.error('Failed to load USSD admin data:', err);
    } finally {
      setUssdOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (mustChangePassword) {
      setShowCredentialsModal(true);
    }
  }, [mustChangePassword]);

  useEffect(() => {
    if (activeTab === 'SCANNERS') {
      loadScanners();
    } else if (activeTab === 'USSD') {
      loadUSSDData();
    }
  }, [activeTab]);

  const handleToggleScannerClearance = async (id: string, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      await api.toggleScannerClearance(id, nextStatus);
      setScanners((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isApprovedToScan: nextStatus } : s))
      );
    } catch (err) {
      alert('Failed to update clearance');
    }
  };

  const handleAddScanner = async (e: FormEvent) => {
    e.preventDefault();
    if (!newScannerData.name || !newScannerData.email) return;

    try {
      await api.addScanner(newScannerData);
      setShowAddScannerModal(false);
      setNewScannerData({
        name: '',
        email: '',
        phone: '+250 78',
        role: 'STAFF',
        isApprovedToScan: true,
      });
      loadScanners();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to add scanner staff');
    }
  };

  const handleSaveUSSDSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedMessage('');
    try {
      await api.updateUSSDSettings(ussdSettings);
      setSettingsSavedMessage(
        isRw ? 'Ibyerekeye MoMoPay byabitswe neza!' : 'USSD settings updated successfully!'
      );
      setTimeout(() => setSettingsSavedMessage(''), 3000);
    } catch {
      alert('Failed to update USSD settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-stone-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalTicketsSold: 0,
    upcomingEventsCount: 0,
    totalAttendees: 0,
    totalCheckedIn: 0,
    pendingOrdersCount: 0,
    checkInRate: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-28">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-700">
              {user?.role || 'ADMIN'}
            </span>
            <span className="text-xs text-stone-500 font-semibold">{t.brandTagline}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            {t.adminTitle}
          </h1>
          <p className="text-xs text-stone-500">
            {t.adminWelcome}, <span className="font-bold text-stone-800">{user?.name || 'Director'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to="/check-in"
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>{t.navGateScanner}</span>
          </Link>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowCredentialsModal(true)}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-stone-200"
              title="Change Password & Email"
            >
              <KeyRound className="w-4 h-4 text-orange-600" />
              <span>{isRw ? 'Umutekano & Ijambobanga' : 'Security & Password'}</span>
            </button>
          )}

          {isAdmin && (
            <Link
              to="/admin/events"
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.adminManageEvents}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-red-600 shadow-sm transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECURITY NOTICE IF DEFAULT PASSWORD */}
      {mustChangePassword && (
        <div className="p-4 rounded-2xl bg-amber-500 text-stone-950 font-semibold text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-stone-950" />
            <div>
              <span className="font-black block uppercase text-[10px] tracking-wider text-stone-900">
                {isRw ? 'Umutekano urakenewe' : 'Default Admin Password Detected'}
              </span>
              <span>
                {isRw
                  ? 'Uracyakoresha ijambobanga rya mbere (admin123). Banza uhindure imeli, izina n’ijambobanga rishya.'
                  : 'Please update your login email, display name, and set a private new password to replace the default credentials.'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCredentialsModal(true)}
            className="px-4 py-2 bg-stone-950 text-white rounded-xl text-xs font-black hover:bg-stone-800 shrink-0 cursor-pointer shadow-sm"
          >
            {isRw ? 'Hindura Nonaha' : 'Change Password & Email'}
          </button>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {isRw ? 'Incamake y’Ibirori' : 'Overview & Metrics'}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SCANNERS')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'SCANNERS'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.adminGateScanners}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('USSD')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'USSD'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t.adminUssdOrders}</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* METRICS KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">{t.adminRevenue}</span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900">
                {metrics.totalRevenue.toLocaleString()}{' '}
                <span className="text-xs font-bold text-stone-500">RWF</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                MoMo, Airtel & USSD
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">{t.adminTicketsSold}</span>
                <TicketIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900">
                {metrics.totalTicketsSold.toLocaleString()}
              </div>
              <span className="text-[11px] text-stone-500 font-semibold block">
                {metrics.upcomingEventsCount} {isRw ? 'ibirori biri ku rubuga' : 'published events'}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">{t.adminCheckInRate}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900">
                {metrics.checkInRate}%
              </div>
              <span className="text-[11px] text-stone-500 font-semibold block">
                {metrics.totalCheckedIn} / {metrics.totalAttendees} {isRw ? 'bagenzuwe' : 'checked in'}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">{t.adminPendingOrders}</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900">
                {metrics.pendingOrdersCount}
              </div>
              <span className="text-[11px] text-stone-500 font-semibold block">
                {isRw ? 'Bitegereje kwemezwa' : 'Awaiting confirmation'}
              </span>
            </div>
          </div>

          {/* EVENT OCCUPANCY & PERFORMANCE TABLE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900">
                  {isRw ? 'Ibirori n’Ubushobozi bwo Kwakira' : 'Event Capacity & Sales Summary'}
                </h3>
                <p className="text-xs text-stone-500">Nyakaliro live attendance tracking</p>
              </div>
              <Link
                to="/admin/events"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
              >
                {t.adminManageEvents}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-black">
                    <th className="pb-3">Event Title</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Tickets Sold</th>
                    <th className="pb-3">Occupancy</th>
                    <th className="pb-3">Revenue (RWF)</th>
                    <th className="pb-3">Checked In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {data?.eventPerformance.map((ev) => (
                    <tr key={ev.id} className="hover:bg-stone-50/50">
                      <td className="py-3 font-bold text-stone-900">{ev.title}</td>
                      <td className="py-3 text-stone-500">{ev.date}</td>
                      <td className="py-3">
                        {ev.sold} / {ev.capacity}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-stone-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-orange-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, ev.occupancyRate)}%` }}
                            />
                          </div>
                          <span className="font-bold text-xs">{ev.occupancyRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 font-black text-stone-900">{ev.revenue.toLocaleString()} RWF</td>
                      <td className="py-3 font-bold text-emerald-700">
                        {ev.checkedIn} ({ev.checkInRate}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: GATE SCANNERS CLEARANCE ================= */}
      {activeTab === 'SCANNERS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-black text-stone-900">{t.adminGateScanners}</h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {isRw
                  ? 'Gusa umuyobozi cyangwa abakozi bahawe uburenganzira bashobora gusikana QR Code ku muryango.'
                  : 'QR codes can ONLY be scanned by Admins and staff members cleared by an Admin.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddScannerModal(true)}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.adminAddScannerHelper}</span>
            </button>
          </div>

          {scannersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {scanners.map((sc) => {
                const isApproved = sc.role === 'SUPER_ADMIN' || sc.role === 'ADMIN' || sc.isApprovedToScan;
                const canToggle = sc.role !== 'SUPER_ADMIN' && sc.role !== 'ADMIN';

                return (
                  <div
                    key={sc.id}
                    className="p-4 rounded-2xl border border-stone-200 hover:border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {sc.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-stone-900">{sc.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-stone-100 text-stone-600">
                            {sc.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5 font-mono">
                          <span>{sc.email}</span>
                          {sc.phone && <span>• {sc.phone}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1.5 ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isApproved ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.adminClearanceApproved}</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>{t.adminClearanceRevoked}</span>
                          </>
                        )}
                      </span>

                      {canToggle && (
                        <button
                          type="button"
                          onClick={() => handleToggleScannerClearance(sc.id, !!sc.isApprovedToScan)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            sc.isApprovedToScan
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {sc.isApprovedToScan ? t.adminClearanceRevoke : t.adminClearanceApprove}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: USSD ORDERS & MOMO CONFIG ================= */}
      {activeTab === 'USSD' && (
        <div className="space-y-6">
          {/* USSD Settings Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-black text-stone-900">
                  {isRw ? 'Ibyiciro bya USSD & MoMoPay y’Ibirori' : 'MoMoPay & USSD Gate Settings'}
                </h3>
              </div>
              {settingsSavedMessage && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {settingsSavedMessage}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveUSSDSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  MTN MoMoPay Merchant Code
                </label>
                <input
                  type="text"
                  value={ussdSettings.mtnMerchantCode}
                  onChange={(e) =>
                    setUssdSettings((s) => ({ ...s, mtnMerchantCode: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Dial format: *182*8*1*CODE#</span>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  MTN Receiver Phone
                </label>
                <input
                  type="text"
                  value={ussdSettings.mtnReceiverPhone}
                  onChange={(e) =>
                    setUssdSettings((s) => ({ ...s, mtnReceiverPhone: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Merchant Account Name
                </label>
                <input
                  type="text"
                  value={ussdSettings.mtnReceiverName}
                  onChange={(e) =>
                    setUssdSettings((s) => ({ ...s, mtnReceiverName: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all"
                >
                  {savingSettings ? t.loading : t.save}
                </button>
              </div>
            </form>
          </div>

          {/* USSD Orders Feed */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-stone-900">
              {isRw ? 'Amatike Yishyuwe binyuze kuri USSD' : 'Manual USSD Orders'} ({ussdOrders.length})
            </h3>

            {ussdOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-2xl">
                {isRw ? 'Nta cyemezo cya USSD kiraza' : 'No manual USSD orders submitted yet.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-black">
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Attendee</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">USSD Ref (TxId)</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                    {ussdOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/50">
                        <td className="py-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                        <td className="py-3 font-bold">{ord.customerName}</td>
                        <td className="py-3 font-mono text-stone-500">{ord.customerPhone}</td>
                        <td className="py-3 font-black text-stone-900">
                          {ord.totalAmount.toLocaleString()} RWF
                        </td>
                        <td className="py-3 font-mono font-bold text-orange-600">
                          {ord.transactionReference || 'Manual TxId'}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            {ord.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD SCANNER MODAL */}
      {showAddScannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-stone-900">
                {isRw ? 'Ongeraho Umukozi ku Muryango' : 'Grant Scanner Clearance to Helper'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddScannerModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScanner} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eric Nshimiyimana"
                  value={newScannerData.name}
                  onChange={(e) => setNewScannerData((d) => ({ ...d, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address / Operator Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="eric@iwacukids.rw"
                  value={newScannerData.email}
                  onChange={(e) => setNewScannerData((d) => ({ ...d, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+250 788 000 000"
                  value={newScannerData.phone}
                  onChange={(e) => setNewScannerData((d) => ({ ...d, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddScannerModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {t.adminClearanceApprove}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE CREDENTIALS MODAL */}
      <AdminChangeCredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
        canDismiss={!mustChangePassword}
      />
    </div>
  );
}
