import { useState } from 'react';
import { Download, X, Check, Smartphone, Share } from 'lucide-react';
import { useInstallPWA } from '../../hooks/useInstallPWA';
import { useLanguage } from '../../context/LanguageContext';

interface InstallPWAButtonProps {
  variant?: 'compact' | 'full';
}

export function InstallPWAButton({ variant = 'compact' }: InstallPWAButtonProps) {
  const { t } = useLanguage();
  const { canInstall, isIOS, promptInstall, dismiss } = useInstallPWA();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  if (!canInstall) return null;

  const handleConfirm = async () => {
    if (isIOS) {
      setDone(true);
      return;
    }
    const accepted = await promptInstall();
    setOpen(false);
    if (accepted) setDone(false);
  };

  return (
    <>
      <button
        type="button"
        id="install-pwa-btn"
        onClick={() => setOpen(true)}
        className={
          variant === 'full'
            ? 'inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-700 text-white text-xs font-extrabold rounded-xl border border-stone-700 transition-all active:scale-95 cursor-pointer'
            : 'hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-[11px] font-extrabold transition-all active:scale-95 cursor-pointer'
        }
        aria-label={t.pwaInstall}
      >
        <Download className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        <span className="whitespace-nowrap">{t.pwaInstall}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.pwaInstall}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !done) setOpen(false);
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-scale-in">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                    IK
                  </div>
                  <span className="font-black text-base text-stone-900 tracking-tight">
                    IWACU <span className="text-orange-600">KIDS</span>
                  </span>
                </div>
                {!done && (
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={t.close}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isIOS && !done ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/15 border border-orange-500/30 text-orange-700 text-[10px] font-black uppercase tracking-wider">
                    <Smartphone className="w-3.5 h-3.5" />
                    iOS / Safari
                  </div>
                  <h3 className="text-lg font-black text-stone-900 leading-tight">{t.pwaIosTitle}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{t.pwaIosDesc}</p>
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] font-bold text-stone-700">
                    <Share className="w-4 h-4 text-stone-500 shrink-0" />
                    {t.pwaIosStep}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        {t.close}
                      </span>
                    </button>
                  </div>
                </div>
              ) : done ? (
                <div className="space-y-3 text-center py-2">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <Check className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-black text-stone-900">{t.pwaIosDone}</h3>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                  >
                    {t.close}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-stone-900 leading-tight">{t.pwaAskTitle}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{t.pwaAskDesc}</p>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    {t.pwaNoData} — no sensitive data is stored on your device.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        dismiss();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      {t.pwaCancel}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                    >
                      {t.pwaInstallNow}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}