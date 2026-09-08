import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function NotFoundPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `404 — ${t.brandName}`;
  }, [t.brandName]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-5 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center">
        <FileQuestion className="w-8 h-8 text-orange-600" />
      </div>
      <span className="text-4xl font-black text-stone-900">404</span>
      <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">{t.notFoundTitle}</h1>
      <p className="text-sm text-stone-500 leading-relaxed">{t.notFoundDesc}</p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition-all inline-flex items-center gap-2 justify-center"
        >
          <Home className="w-4 h-4" />
          {t.backHomeBtn}
        </Link>
        <Link
          to="/events"
          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-xs font-black transition-all inline-flex items-center gap-2 justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.navEvents}
        </Link>
      </div>
    </div>
  );
}