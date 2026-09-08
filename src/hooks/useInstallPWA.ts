import { useCallback, useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  return (window.navigator as unknown as { standalone?: boolean }).standalone === true;
}

const DISMISS_KEY = 'iwacu_pwa_dismissed_until';
const DISMISS_DAYS = 7;

export function useInstallPWA() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua) && !(window as { MSStream?: unknown }).MSStream;
    setIsIOS(isIosDevice);
    setInstalled(isStandalone());

    try {
      const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
      setDismissed(until > Date.now());
    } catch {
      setDismissed(false);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!prompt) return false;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    setPrompt(null);
    setInstalled(choice.outcome === 'accepted');
    return choice.outcome === 'accepted';
  }, [prompt]);

  return {
    prompt,
    installed,
    isIOS,
    dismissed,
    dismiss,
    promptInstall,
    canInstall: !installed && !dismissed && (Boolean(prompt) || isIOS),
  };
}