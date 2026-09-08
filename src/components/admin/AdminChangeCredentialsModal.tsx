import { useState, type FormEvent } from 'react';
import {
  ShieldAlert,
  KeyRound,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

export function AdminChangeCredentialsModal({ isOpen, onClose, canDismiss = false }: Props) {
  const { user, updateCredentials } = useAuth();
  const { isRw } = useLanguage();

  const [name, setName] = useState(user?.name || 'Coopstar (Admin)');
  const [email, setEmail] = useState(user?.email || 'admin@iwacukids.rw');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError(isRw ? 'Izina rirakenewe' : 'Full name is required');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError(isRw ? 'Imeli ntabwo yemewe' : 'A valid email address is required');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError(
          isRw
            ? 'Ijambobanga rishya rigomba kuba nibura inyuguti 6'
            : 'New password must be at least 6 characters'
        );
        return;
      }
      if (
        newPassword.toLowerCase() === 'admin123' ||
        newPassword.toLowerCase() === 'coopstar2026'
      ) {
        setError(
          isRw
            ? 'Ijambobanga rishya ntirigomba kuba irya mbere (admin123). Hitamo irindi rikomeye.'
            : 'New password cannot be the default password. Please choose a new secure password.'
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(isRw ? 'Ijambobanga rishya ntabwo rihuye' : 'New passwords do not match');
        return;
      }
    } else {
      setError(
        isRw
          ? 'Ugomba gushyiramo ijambobanga rishya rihindura irya mbere'
          : 'You must set a new password to replace the default credentials'
      );
      return;
    }

    setLoading(true);
    try {
      await updateCredentials({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        currentPassword: currentPassword.trim() || 'admin123',
        newPassword: newPassword.trim(),
      });

      setSuccess(
        isRw
          ? 'Umwirondoro n’ijambobanga byahinduwe neza! Ubutaha uzakoresha imeli n’ijambobanga bishya.'
          : 'Credentials updated successfully! Use your new email and password for future logins.'
      );

      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="admin-security-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overscroll-none"
    >
      <div
        id="admin-security-modal-card"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90dvh] animate-in zoom-in-95 duration-150"
      >
        {/* MODAL HEADER - Fixed at top */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block">
                {isRw ? 'Umutekano w’Umuyobozi' : 'Admin Security Update'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {isRw ? 'Hindura Umwirondoro n’Ijambobanga' : 'Change Default Credentials'}
              </h3>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* SCROLLABLE FORM BODY - Optimized for Mobile Viewports */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3.5 text-stone-800">
            {/* Security Alert Callout */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {isRw
                  ? 'Kugira ngo urusheho kurinda umutekano w’urubuga n’amatike i Nyakaliro, shyiraho imeli nshya n’ijambobanga byawe bwite bisimbura ibya mbere (admin123).'
                  : 'For event gate safety, replace the default password (admin123) and set your private login email and personal name.'}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {/* Admin Full Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isRw ? 'Izina ry’Umuyobozi' : 'Admin Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Coopstar / Lead Admin"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none min-h-[44px]"
                />
              </div>
            </div>

            {/* Admin Email */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isRw ? 'Imeli nshya yo kwinjiriraho' : 'New Login Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@iwacukids.rw"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none min-h-[44px]"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                {isRw
                  ? 'Iyi meli niyo uzakoresha winjira ahagana hejuru.'
                  : 'This email will be used for future admin and gate sign-ins.'}
              </p>
            </div>

            {/* Current Default Password */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isRw ? 'Ijambobanga rya mbere' : 'Current Password'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  aria-label="Toggle Current Password Visibility"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                {isRw ? 'Uburyo bwa mbere: admin123' : 'Default password: admin123'}
              </p>
            </div>

            {/* New Password & Confirmation in 2 columns on tablet, single col on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isRw ? 'Ijambobanga rishya' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    required
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                    aria-label="Toggle New Password Visibility"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {isRw ? 'Emeza Ijambobanga' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className={`w-full pl-3 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-orange-500 focus:outline-none min-h-[44px] ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-stone-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                    aria-label="Toggle Confirm Password Visibility"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {newPassword && confirmPassword && newPassword === confirmPassword && (
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isRw ? 'Amagambo y’ibanga arahura neza' : 'Passwords match'}</span>
              </div>
            )}
          </div>

          {/* MODAL FOOTER - Fixed at bottom of card, always visible */}
          <div className="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5 shrink-0">
            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors min-h-[44px] cursor-pointer"
              >
                {isRw ? 'Bireke ubu' : 'Dismiss'}
              </button>
            )}
            <button
              type="submit"
              id="admin-save-credentials-submit-btn"
              disabled={loading}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs sm:text-sm font-black shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[44px]"
            >
              {loading ? (
                <span>{isRw ? 'Birahinduka...' : 'Updating...'}</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{isRw ? 'Emeza Ijambobanga Rishya' : 'Save New Credentials'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
