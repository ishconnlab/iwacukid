import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  Phone,
  QrCode,
  Quote,
  ShieldCheck,
  Smartphone,
  Ticket,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login fields (phone or email)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regPhone, setRegPhone] = useState('+250');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

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
      setError(err instanceof Error ? err.message : 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !regPhone.trim() || !regPassword) {
      setError(t.registerFieldMissing);
      return;
    }
    if (regPassword.length < 6) {
      setError(t.registerPasswordHint);
      return;
    }
    if (regPassword !== confirmPassword) {
      setError(t.registerPasswordMismatch);
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
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full pl-9 pr-10 py-3 rounded-2xl border border-stone-200 bg-white text-sm font-semibold text-stone-900 placeholder-stone-400 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 outline-none';

  const inputIcon = 'w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2';

  const benefitList = [
    { text: t.registerBenefitQr, icon: QrCode },
    { text: t.registerBenefitCode, icon: Ticket },
    { text: t.registerBenefitInstant, icon: Smartphone },
  ];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-gradient-to-b from-orange-50 via-[#FAF8F5] to-[#FAF8F5]">
      {/* Decorative floating orbs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange-300/30 blur-3xl animate-aurora" />
      <div className="pointer-events-none absolute bottom-10 -left-28 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl animate-aurora" style={{ animationDelay: '1.4s' }} />
      <div className="pointer-events-none absolute top-1/3 left-1/2 w-40 h-40 rounded-full bg-stone-300/20 blur-2xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ---------- LEFT BRAND PANEL ---------- */}
          <div className="hidden lg:flex flex-col relative overflow-hidden rounded-3xl bg-stone-900 text-white p-8 border border-stone-800 shadow-2xl min-h-[640px] animate-fade-up">
            {/* Aurora + cultural pattern */}
            <div className="absolute inset-0 opacity-10 rwandan-pattern-line pointer-events-none" />
            <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-orange-600/20 blur-3xl animate-aurora pointer-events-none" />
            <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-aurora pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Panel header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-600/30 shrink-0">
                  IK
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-black text-base tracking-tight text-white">
                    IWACU <span className="text-orange-500">KIDS</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">
                    Nyakaliro • Rwanda
                  </span>
                </div>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-stone-700/80 text-stone-300 hover:text-orange-400 hover:border-orange-500/60 text-[11px] font-bold transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.loginBackHome}</span>
              </Link>
            </div>

            {/* Panel content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
              <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 text-[10px] font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ring" />
                {t.loginLiveBadge}
              </div>

              <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight">
                {t.loginSideTitle}
              </h2>
              <div className="h-1 w-24 cultural-divider" />
              <p className="text-stone-400 text-sm leading-relaxed max-w-md">
                {t.loginSideDesc}
              </p>

              {/* Benefits checklist */}
              <ul className="space-y-3">
                {benefitList.map((b) => (
                  <li
                    key={b.text}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-stone-700/60 hover:border-orange-500/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                      <b.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white leading-relaxed block">
                        {b.text}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-1" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: payment badges + testimonial */}
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-stone-300">
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-stone-700/60">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  {t.heroTrustMtn}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-stone-700/60">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  {t.heroTrustAirtel}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-stone-700/60">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  {t.heroTrustUssd}
                </span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-stone-800/70 border border-stone-700/60 animate-drift">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-orange-600/30 border-2 border-orange-500 flex items-center justify-center font-black text-orange-400 text-sm shrink-0">
                    N
                  </div>
                  <div className="min-w-0">
                    <Quote className="w-3.5 h-3.5 text-orange-400 mb-0.5" />
                    <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-2">
                      {t.loginTestimonial}
                    </p>
                    <span className="text-[10px] font-bold text-stone-500 block mt-1">
                      {t.loginTestimonialName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT FORM COLUMN ---------- */}
          <div className="animate-scale-in space-y-6">
            {/* Mobile brand + back */}
            <div className="flex lg:hidden items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-600/30 shrink-0">
                  IK
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-black text-base tracking-tight text-stone-900">
                    IWACU <span className="text-orange-600">KIDS</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">
                    Nyakaliro • Rwanda
                  </span>
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-orange-600 hover:border-orange-300 text-[11px] font-bold transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.loginBackHome}</span>
              </Link>
            </div>

            {/* Heading */}
            <div className="text-center lg:text-left space-y-2 lg:pt-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/15 border border-orange-500/30 text-orange-700 text-[10px] font-black uppercase tracking-wider">
                <Ticket className="w-3.5 h-3.5" />
                <span>{t.loginBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {t.loginTitle}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 lg:max-w-sm leading-relaxed">
                {t.loginSubtitle}
              </p>
            </div>

            {/* Auth Card */}
            <div className="rounded-3xl bg-white/90 backdrop-blur border border-stone-200 shadow-xl shadow-stone-900/5 p-5 sm:p-7">
              {/* Mode Tabs */}
              <div className="relative flex rounded-2xl bg-stone-100 p-1 border border-stone-200 mb-6">
                <span
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm border border-stone-200 transition-transform duration-300 ease-out"
                  style={{ transform: mode === 'REGISTER' ? 'translateX(100%)' : 'translateX(0)', left: '4px' }}
                />
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className={`relative flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-colors z-10 ${
                    mode === 'LOGIN' ? 'text-stone-900' : 'text-stone-500'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-orange-600" />
                  {t.loginTabSignIn}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('REGISTER')}
                  className={`relative flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-colors z-10 ${
                    mode === 'REGISTER' ? 'text-stone-900' : 'text-stone-500'
                  }`}
                >
                  <User className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-orange-600" />
                  {t.loginTabRegister}
                </button>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div key={mode} className="animate-scale-in">
                {mode === 'LOGIN' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-identifier" className="text-xs font-bold text-stone-700 block mb-1.5">
                        {t.loginIdentifierLabel}
                      </label>
                      <div className="relative">
                        <Phone className={inputIcon} />
                        <input
                          id="login-identifier"
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder={t.loginIdentifierPlaceholder}
                          className={inputBase}
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-password" className="text-xs font-bold text-stone-700 block mb-1.5">
                        {t.loginPasswordLabel}
                      </label>
                      <div className="relative">
                        <Lock className={inputIcon} />
                        <input
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.loginPasswordPlaceholder}
                          className={inputBase}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((v) => !v)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                          title={showLoginPassword ? t.passwordHide : t.passwordShow}
                          aria-label={showLoginPassword ? t.passwordHide : t.passwordShow}
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-500 mt-1.5 block leading-relaxed">
                        {t.loginHint}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 active:scale-[0.98] text-white rounded-2xl font-black text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <LogIn className="w-4 h-4" />
                      )}
                      <span>{loading ? t.loginSigningIn : t.loginSignInBtn}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label htmlFor="reg-name" className="text-xs font-bold text-stone-700 block mb-1.5">
                        {t.registerFullNameLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className={inputIcon} />
                        <input
                          id="reg-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t.registerFullNamePlaceholder}
                          className={inputBase}
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-phone" className="text-xs font-bold text-stone-700 block mb-1.5">
                        {t.registerPhoneLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className={inputIcon} />
                        <input
                          id="reg-phone"
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRegPhone(val.startsWith('+250') ? val : '+250');
                          }}
                          placeholder={t.registerPhonePlaceholder}
                          className={`${inputBase} font-mono`}
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-email" className="text-xs font-bold text-stone-700 block mb-1.5">
                        {t.registerEmailLabel}
                      </label>
                      <div className="relative">
                        <Mail className={inputIcon} />
                        <input
                          id="reg-email"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder={t.registerEmailPlaceholder}
                          className={inputBase}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-password" className="text-xs font-bold text-stone-700 block mb-1.5">
                          {t.registerPasswordLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <KeyRound className={inputIcon} />
                          <input
                            id="reg-password"
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder={t.registerPasswordHint}
                            className={inputBase}
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="reg-confirm" className="text-xs font-bold text-stone-700 block mb-1.5">
                          {t.registerConfirmLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className={inputIcon} />
                          <input
                            id="reg-confirm"
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t.registerConfirmPlaceholder}
                            className={inputBase}
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowRegPassword((v) => !v)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-500 hover:text-orange-600 transition-colors -mt-1 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showRegPassword ? t.passwordHide : t.passwordShow}
                    </button>

                    <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/70 space-y-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5" />
                        {t.registerBenefitTitle}
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-orange-950/90 font-semibold leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-600" />
                          <span>{t.registerBenefitQr}</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-600" />
                          <span>{t.registerBenefitCode}</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-600" />
                          <span>{t.registerBenefitInstant}</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 active:scale-[0.98] text-white rounded-2xl font-black text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span>{loading ? t.registerCreating : t.registerBtn}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Admin & Helper verification note (verification only on gate/admin pages) */}
            <div className="rounded-2xl bg-stone-900 text-white border border-stone-800 p-5 space-y-3 animate-fade-up">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 block">
                    {t.staffAccessTitle}
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">{t.staffAccessDesc}</p>
                </div>
              </div>
              <Link
                to="/check-in"
                className="w-full py-2.5 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-stone-900 hover:bg-orange-500 hover:text-white text-xs font-black transition-all"
              >
                <LogIn className="w-4 h-4" />
                {t.staffAccessBtn}
              </Link>
              <p className="text-[10px] text-stone-500 leading-relaxed flex items-start gap-1.5">
                <ShieldCheck className="w-3 h-3 shrink-0 mt-0.5" />
                <span>{t.staffAccessNote}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}