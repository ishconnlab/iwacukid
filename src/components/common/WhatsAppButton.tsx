import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { whatsappLink } from '../../lib/site';

export function WhatsAppButton() {
  const { t } = useLanguage();

  return (
    <a
      href={whatsappLink(t.waPrefilled)}
      target="_blank"
      rel="noreferrer"
      id="whatsapp-floating-btn"
      className="group fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-2"
      aria-label={t.waFloatLabel}
      title={t.waFloatLabel}
    >
      <span className="hidden sm:block pointer-events-none max-w-0 overflow-hidden opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:px-3 transition-all duration-300 rounded-full bg-stone-900/90 text-white text-[11px] font-bold shadow-lg py-1.5 whitespace-nowrap">
        {t.waHelpTitle}
      </span>
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-xl shadow-emerald-600/30 transition-all group-hover:scale-110 active:scale-95">
        <MessageCircle className="w-6 h-6 fill-current" />
      </span>
    </a>
  );
}