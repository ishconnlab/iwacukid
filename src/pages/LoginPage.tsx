import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Sparkles,
  User,
  Phone,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login fields (phone or email)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('+250');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const afterAuth = (role?: string) => {
    if (role === 'CUSTOMER') {
      navigate('/my-tickets');
    } else if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'STAFF') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setLoading(true);
    setError('');
    try {
      const authUser = await login(identifier.trim(), password);
      afterAuth(authUser.role);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !regPhone.trim() || !regPassword) return;
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({
        fullName: fullName.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        email: regEmail.trim() || undefined,
      });
      navigate('/my-tickets');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setMode('LOGIN');
    setIdentifier(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-6">
      {/* Brand Icon */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-orange-600/30">
          IK
        </div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          IWACU Kids Portal
        </h1>
        <p className="text-xs text-stone-500">
          Secure entrance verification, ticket bookings & gate check-in
        </p>
      </div>

      {/* Auth Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xl space-y-5">
        {/* Mode Toggle */}
        <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200">
          <button
            type="button"
            onClick={() => setMode('LOGIN')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
              mode === 'LOGIN' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('REGISTER')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
              mode === 'REGISTER' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            Create Account (Book Tickets)
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'LOGIN' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Phone Number or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="+250 788 123 456 or staff@iwacukids.rw"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Customers log in with their phone number. Staff use their work email.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alice Uwase"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRegPhone(val.startsWith('+250') ? val : '+250');
                  }}
                  placeholder="+250 788 123 456"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Email (optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="parent@example.rw"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Confirm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-orange-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-orange-600" />
              <span>
                Create your account to buy tickets, get your personal recommendation
                code, and receive QR tickets with your full name and event details.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Create Account & Get Tickets'}</span>
            </button>
          </form>
        )}

        {/* Quick Demo Credentials Preset */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block text-center">
            Demo Presets (1-Click Fill)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@iwacukids.rw', 'admin123')}
              className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200/80 text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-orange-950 block">Super Admin</span>
              <span className="text-[9px] text-orange-700 block">CEO Coopstar</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('staff@iwacukids.rw', 'staff123')}
              className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left transition-colors"
            >
              <span className="text-[11px] font-bold text-stone-900 block">Gate Staff</span>
              <span className="text-[9px] text-stone-500 block">QR Check-In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}