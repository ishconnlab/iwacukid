import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  UserCheck,
  UserX,
  Check,
  LogIn,
  Users,
  Plus,
  ArrowUpCircle,
  Mail,
  User,
  Phone,
} from 'lucide-react';
import { api } from '../../api/client';
import { Ticket } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminChangeCredentialsModal } from '../../components/admin/AdminChangeCredentialsModal';

export function AdminCheckInPage() {
  const { t, isRw } = useLanguage();
  const { user, isAdmin, login, mustChangePassword } = useAuth();

  // Active top tab for Admin
  const [activeTab, setActiveTab] = useState<'SCANNER' | 'ELEVATE_STAFF'>('SCANNER');

  // Scanner Clearance state
  const [operatorCode, setOperatorCode] = useState('');
  const [clearedOperator, setClearedOperator] = useState<{
    name: string;
    role: string;
    allowed: boolean;
  } | null>(null);

  const [clearanceChecking, setClearanceChecking] = useState(false);
  const [clearanceError, setClearanceError] = useState('');

  // Inline Admin Gate Login state
  const [loginMode, setLoginMode] = useState<'ADMIN_LOGIN' | 'STAFF_PASS'>('ADMIN_LOGIN');
  const [adminEmail, setAdminEmail] = useState('admin@iwacukids.rw');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password Modal
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // Ticket processing state
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Validation Outcome
  const [lastResult, setLastResult] = useState<{
    status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID' | null;
    message: string;
    ticket?: Ticket;
  }>({ status: null, message: '' });

  const [recentScans, setRecentScans] = useState<{
    ticketCode: string;
    name: string;
    time: string;
    status: string;
  }[]>([]);

  // Staff Elevation State
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+250 78');
  const [newStaffActionLoading, setNewStaffActionLoading] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Determine if user has clearance to scan
  const isDirectlyAuthorized =
    isAdmin || (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.isApprovedToScan));

  const hasClearance = isDirectlyAuthorized || (clearedOperator && clearedOperator.allowed);

  // Auto-prompt password change on login if using defaults
  useEffect(() => {
    if (mustChangePassword) {
      setShowCredentialsModal(true);
    }
  }, [mustChangePassword]);

  // Load staff list when admin views elevation tab
  useEffect(() => {
    if (isAdmin) {
      loadStaff();
    }
  }, [isAdmin]);

  const loadStaff = async () => {
    try {
      setStaffLoading(true);
      const list = await api.getScanners();
      setStaffList(list);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load staff list';
      setStaffError(msg);
    } finally {
      setStaffLoading(false);
    }
  };

  // Elevate or revoke staff clearance
  const handleToggleClearance = async (id: string, currentApproved: boolean) => {
    try {
      await api.toggleScannerClearance(id, !currentApproved);
      setStaffList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isApprovedToScan: !currentApproved } : s))
      );
    } catch (err) {
      console.error('Failed to update clearance:', err);
    }
  };

  // Add new staff and immediately elevate
  const handleCreateAndElevateStaff = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    setNewStaffActionLoading(true);
    try {
      await api.addScanner({
        name: newStaffName.trim(),
        email: newStaffEmail.trim().toLowerCase(),
        phone: newStaffPhone.trim(),
        role: 'STAFF',
        isApprovedToScan: true, // Elevate directly
      });
      await loadStaff();
      setNewStaffName('');
      setNewStaffEmail('');
      setShowAddStaffModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add staff';
      alert(msg);
    } finally {
      setNewStaffActionLoading(false);
    }
  };

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Handle direct Admin login from check-in page
  const handleAdminGateLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) return;

    setLoginLoading(true);
    setLoginError('');
    try {
      await login(adminEmail.trim(), adminPassword.trim());
      setAdminPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid admin login credentials';
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyClearancePass = async (e: FormEvent) => {
    e.preventDefault();
    if (!operatorCode.trim()) return;

    setClearanceChecking(true);
    setClearanceError('');

    try {
      const res = await api.verifyScannerClearance(operatorCode.trim());
      if (res.allowed) {
        setClearedOperator({
          name: res.name || 'Cleared Operator',
          role: res.role || 'STAFF',
          allowed: true,
        });
        setClearanceError('');
      } else {
        setClearanceError(
          res.reason ||
            (isRw
              ? 'Ntabwo wemerewe gusikana. Banza ubisabe umuyobozi w’ibirori (Admin).'
              : 'Access denied: You are not authorized to scan QR tickets. Request clearance from an Admin.')
        );
      }
    } catch {
      setClearanceError(
        isRw
          ? 'Ntabwo bishobotse gusuzuma uburenganzira. Gerageza nanone.'
          : 'Could not verify clearance code. Please check connection and try again.'
      );
    } finally {
      setClearanceChecking(false);
    }
  };

  const playFeedbackSound = (type: 'success' | 'warning' | 'error') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(350, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch {
      // Audio context may require user interaction
    }
  };

  const processScanCode = async (code: string) => {
    if (!code || loading || !hasClearance) return;
    setLoading(true);

    const operatorIdentifier =
      clearedOperator?.name || user?.name || operatorCode.trim() || 'Gate Operator';

    try {
      const res = await api.executeCheckIn({
        code: code.trim(),
        scannedBy: operatorIdentifier,
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Camera' : 'Gate Terminal',
        operatorIdentifier,
      });

      if (res.status === 'SUCCESS') {
        playFeedbackSound('success');
        setLastResult({
          status: 'SUCCESS',
          message: res.message || t.scannerSuccessValid,
          ticket: res.ticket,
        });
        if (res.ticket) {
          setRecentScans((prev) => [
            {
              ticketCode: res.ticket!.ticketCode,
              name: res.ticket!.attendeeName,
              time: new Date().toLocaleTimeString(),
              status: 'APPROVED',
            },
            ...prev.slice(0, 10),
          ]);
        }
      } else if (res.status === 'ALREADY_USED') {
        playFeedbackSound('warning');
        setLastResult({
          status: 'ALREADY_USED',
          message: res.message || t.scannerAlreadyUsed,
          ticket: res.ticket,
        });
      } else {
        playFeedbackSound('error');
        setLastResult({
          status: 'INVALID',
          message: res.message || t.scannerInvalid,
        });
      }
    } catch (err: unknown) {
      playFeedbackSound('error');
      const msg = err instanceof Error ? err.message : 'Check-in failed';
      setLastResult({
        status: 'INVALID',
        message: msg,
      });
    } finally {
      setLoading(false);
      setManualCode('');
    }
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      const qr = new Html5Qrcode('qr-reader-container');
      html5QrCodeRef.current = qr;

      await qr.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          processScanCode(decodedText);
        },
        () => {}
      );
      setScanning(true);
    } catch {
      setCameraError(
        isRw
          ? 'Ntibishobotse gufungura kamera. Koresha uburyo bwo kwandika kode hasi.'
          : 'Unable to open camera. You can use manual ticket code entry below.'
      );
      setScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.warn('Error stopping camera:', err);
      }
    }
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim() || !hasClearance) return;
    processScanCode(manualCode.trim());
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>{t.scannerTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            Nyakaliro Gate Check-In
          </h1>
          <p className="text-xs text-stone-500">{t.scannerSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowCredentialsModal(true)}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Change Password & Email"
            >
              <KeyRound className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">{isRw ? 'Hindura Ijambobanga' : 'Security'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setLastResult({ status: null, message: '' })}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-sm"
            title="Reset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECURITY NOTICE IF DEFAULT CREDENTIALS STILL ACTIVE */}
      {mustChangePassword && (
        <div className="p-4 rounded-2xl bg-amber-500 text-stone-950 font-semibold text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-stone-950" />
            <div>
              <span className="font-black block uppercase text-[10px] tracking-wider text-stone-900">
                {isRw ? 'Itegeko ry’Umutekano' : 'Security Action Required'}
              </span>
              <span>
                {isRw
                  ? 'Uracyakoresha ijambobanga n’imeli bya mbere (admin123). Banza ubihindure.'
                  : 'You are using default credentials. Update your name, email, and password.'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCredentialsModal(true)}
            className="px-4 py-1.5 bg-stone-950 text-white rounded-xl text-xs font-black hover:bg-stone-800 shrink-0 cursor-pointer"
          >
            {isRw ? 'Hindura Ubu' : 'Update Now'}
          </button>
        </div>
      )}

      {/* ADMIN NAVIGATION TABS (IF LOGGED IN AS ADMIN) */}
      {isAdmin && (
        <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200">
          <button
            type="button"
            onClick={() => setActiveTab('SCANNER')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'SCANNER'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-orange-600" />
            <span>{isRw ? 'Gusikana Amatike' : 'Ticket Scanner'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('ELEVATE_STAFF');
              loadStaff();
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ELEVATE_STAFF'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4 text-orange-600" />
            <span>{isRw ? 'Kuzamura Abakozi (Elevate Staff)' : 'Elevate Gate Staff'}</span>
            {staffList.filter((s) => s.isApprovedToScan).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black">
                {staffList.filter((s) => s.isApprovedToScan).length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* TAB 1: ELEVATE GATE STAFF PANEL (ADMIN ONLY) */}
      {isAdmin && activeTab === 'ELEVATE_STAFF' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                  {isRw ? 'Ubuyobozi bw’Irembo' : 'Gate Staff Authorizations'}
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  {isRw ? 'Kuzamura no Kwemeza Abakozi' : 'Elevate Staff Scanner Clearance'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isRw
                    ? 'Abakozi bazamuwe n’umuyobozi nibo bonyine bemerewe gusikana amatike ku muryango.'
                    : 'Only staff elevated by an admin are authorized to scan tickets at the entrance.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isRw ? 'Ongeramo Umukozi' : 'Add & Elevate Staff'}</span>
              </button>
            </div>

            {/* Quick Add Staff Modal / Form */}
            {showAddStaffModal && (
              <form
                onSubmit={handleCreateAndElevateStaff}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                    {isRw ? 'Ongeraho Umukozi Mushya ku Irembo' : 'Quick Register Gate Staff'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      {isRw ? 'Izina ry’Umukozi' : 'Staff Name'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Patrick Gate Lead"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      {isRw ? 'Imeli' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      placeholder="patrick@iwacukids.rw"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs font-bold"
                  >
                    {isRw ? 'Reka' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={newStaffActionLoading}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>
                      {newStaffActionLoading
                        ? isRw ? 'Birinjira...' : 'Saving...'
                        : isRw ? 'Emeza Umukozi' : 'Elevate Staff Now'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Staff list */}
            {staffLoading ? (
              <div className="py-8 text-center text-xs text-stone-500">
                {isRw ? 'Biratunganywa...' : 'Loading staff list...'}
              </div>
            ) : staffList.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">
                {isRw ? 'Nta mukozi urandikwa.' : 'No staff members found.'}
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {staffList.map((s) => (
                  <div
                    key={s.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                          s.isApprovedToScan
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-stone-900 text-xs sm:text-sm">
                            {s.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase bg-stone-100 text-stone-700">
                            {s.role}
                          </span>
                        </div>
                        <span className="text-stone-400 text-[11px] block">{s.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center self-end">
                      {s.isApprovedToScan ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{isRw ? 'Yemerewe' : 'Cleared to Scan'}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleClearance(s.id, true)}
                            className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold border border-red-200 transition-colors"
                          >
                            {isRw ? 'Kura uburenganzira' : 'Revoke'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-500">
                            <UserX className="w-3 h-3 text-stone-400" />
                            <span>{isRw ? 'Ategereje' : 'Needs Clearance'}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleClearance(s.id, false)}
                            className="px-3 py-1 text-xs bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-black flex items-center gap-1 shadow-xs transition-all"
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            <span>{isRw ? 'Kuzamura (Elevate)' : 'Elevate Staff'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2 / MAIN: CHECK-IN SCANNER */}
      {(!isAdmin || activeTab === 'SCANNER') && (
        <>
          {/* SECURITY CLEARANCE CARD (IF NOT AUTHORIZED) */}
          {!hasClearance ? (
            <div className="p-6 rounded-3xl bg-stone-900 text-white border border-stone-800 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block">
                    {t.scannerRestrictedTitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-tight">
                    {isRw
                      ? 'Gusikana bisaba kwinjira k’Umuyobozi cyangwa Umukozi wazamuwe'
                      : 'Admin Gate Login or Cleared Staff Pass Required'}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {isRw
                  ? 'Kugira ngo ugenzure amatike ku muryango, banza winjire nk’Umuyobozi (Admin) cyangwa ushyiremo kode y’umukozi wemerewe n’ubuyobozi.'
                  : 'To safeguard Nyakaliro event gates, please log in as an Admin or enter an authorized staff member clearance pass.'}
              </p>

              {/* Toggle Login Option */}
              <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
                <button
                  type="button"
                  onClick={() => setLoginMode('ADMIN_LOGIN')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    loginMode === 'ADMIN_LOGIN'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {isRw ? 'Injira nk’Umuyobozi (Admin Login)' : 'Admin Gate Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('STAFF_PASS')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    loginMode === 'STAFF_PASS'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {isRw ? 'Kode y’Umukozi (Staff Pass)' : 'Staff Pass'}
                </button>
              </div>

              {loginMode === 'ADMIN_LOGIN' ? (
                /* INLINE DIRECT ADMIN LOGIN */
                <form onSubmit={handleAdminGateLogin} className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-stone-300 block mb-1">
                      {isRw ? 'Imeli y’Umuyobozi' : 'Admin Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="admin@iwacukids.rw"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs font-semibold text-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-300 block mb-1">
                      {isRw ? 'Ijambobanga' : 'Password'}
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs font-semibold text-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-black rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{loginLoading ? t.loading : isRw ? 'Injira ku Irembo' : 'Sign In as Gate Admin'}</span>
                  </button>

                  <p className="text-[10px] text-stone-500 text-center">
                    Default demo: admin@iwacukids.rw / admin123
                  </p>
                </form>
              ) : (
                /* STAFF PASS CODE CHECK */
                <form onSubmit={handleVerifyClearancePass} className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-stone-300 block">
                    {t.scannerPinPlaceholder}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="staff@iwacukids.rw or Operator Code"
                        value={operatorCode}
                        onChange={(e) => setOperatorCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs font-mono text-white placeholder-stone-500 focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={clearanceChecking || !operatorCode.trim()}
                      className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold rounded-xl transition-all disabled:opacity-50 shrink-0"
                    >
                      {clearanceChecking ? t.loading : t.scannerVerifyPinBtn}
                    </button>
                  </div>

                  {clearanceError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{clearanceError}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          ) : (
            /* CLEARANCE ACTIVE BANNER */
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black block uppercase text-[10px] text-emerald-700">
                    {isAdmin ? t.scannerStatusAdmin : t.scannerStatusStaff}
                  </span>
                  <span className="font-extrabold text-stone-900">
                    {clearedOperator?.name || user?.name || 'Authorized Gate Operator'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Active Gate Clearance</span>
              </span>
            </div>
          )}

          {/* CAMERA SCANNER VIEWPORT */}
          {hasClearance && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                    {isRw ? 'Kamera yo Gusikana QR Code' : 'Camera QR Check-In'}
                  </span>
                </div>

                {!scanning ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t.scannerStartCamera}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold"
                  >
                    {t.scannerStopCamera}
                  </button>
                )}
              </div>

              {cameraError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  {cameraError}
                </div>
              )}

              {/* Viewport Box */}
              <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-square max-w-sm mx-auto flex items-center justify-center border border-stone-800">
                <div id="qr-reader-container" className="w-full h-full" />
                {!scanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-stone-400 space-y-3">
                    <QrCode className="w-16 h-16 text-stone-600 stroke-[1.5]" />
                    <p className="text-xs max-w-xs">{t.scannerCameraInactive}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCAN RESULT FEEDBACK MODAL / CARD */}
          {lastResult.status && (
            <div
              className={`p-5 rounded-3xl border shadow-lg animate-in zoom-in-95 duration-150 ${
                lastResult.status === 'SUCCESS'
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : lastResult.status === 'ALREADY_USED'
                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                  : 'bg-red-500 text-white border-red-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-2xl bg-white/20 shrink-0">
                  {lastResult.status === 'SUCCESS' && <CheckCircle2 className="w-8 h-8" />}
                  {lastResult.status === 'ALREADY_USED' && <AlertTriangle className="w-8 h-8" />}
                  {lastResult.status === 'INVALID' && <XCircle className="w-8 h-8" />}
                </div>

                <div className="space-y-1 flex-1">
                  <span className="text-xs font-black uppercase tracking-widest block opacity-90">
                    {lastResult.status === 'SUCCESS' && (isRw ? 'ITIKETI NI NZIMA' : 'TICKET VALID')}
                    {lastResult.status === 'ALREADY_USED' &&
                      (isRw ? 'YARANGIJE GUKORESHWA' : 'ALREADY CHECKED IN')}
                    {lastResult.status === 'INVALID' &&
                      (isRw ? 'ITIKETI NTIYEMEWE' : 'INVALID TICKET')}
                  </span>
                  <h3 className="text-xl font-black leading-snug">{lastResult.message}</h3>

                  {lastResult.ticket && (
                    <div className="pt-2 text-xs space-y-1 opacity-95">
                      <p>
                        <strong>{t.attendee}:</strong> {lastResult.ticket.attendeeName}
                      </p>
                      <p>
                        <strong>{t.ticketType}:</strong> {lastResult.ticket.ticketTypeName}
                      </p>
                      <p>
                        <strong>{t.orderCode}:</strong> {lastResult.ticket.ticketCode}
                      </p>
                      {lastResult.ticket.ticketNumber !== undefined && (
                        <p>
                          <strong>{isRw ? 'Inomero yo Kwiyandikisha:' : 'Registration No:'}</strong>{' '}
                          #{lastResult.ticket.ticketNumber}
                        </p>
                      )}
                    </div>
                  )}

                  {lastResult.status === 'SUCCESS' && lastResult.ticket?.checkInNumber !== undefined && (
                    <div className="mt-3 flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/20 border border-white/40">
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {isRw ? 'Umubare w’Injira' : 'Entrance Number'}
                      </span>
                      <span className="text-5xl font-black font-mono leading-none">
                        #{lastResult.ticket.checkInNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MANUAL CODE ENTRY */}
          {hasClearance && (
            <form
              onSubmit={handleManualSubmit}
              className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                {t.scannerManualSearchTitle}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.scannerManualSearchPlaceholder}
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 font-mono text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="submit"
                  disabled={loading || !manualCode.trim()}
                  className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? t.loading : t.scannerCheckCodeBtn}
                </button>
              </div>
            </form>
          )}

          {/* RECENT CHECK-INS FEED */}
          {recentScans.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                {t.scannerRecentScans} ({recentScans.length})
              </span>

              <div className="space-y-2">
                {recentScans.map((scan, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-extrabold text-stone-900">{scan.name}</span>
                      <span className="font-mono text-stone-400 text-[10px]">
                        ({scan.ticketCode})
                      </span>
                    </div>
                    <span className="text-stone-500 text-[11px] font-semibold">{scan.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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
