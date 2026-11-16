"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SitePreferences = {
  isDark: boolean;
  reduceMotion: boolean;
  isReady: boolean;
  setIsDark: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
};

const PreferencesContext = createContext<SitePreferences | null>(null);
const STORAGE_KEY = "next-pizza-preferences";

type PreferenceValues = Pick<SitePreferences, "isDark" | "reduceMotion">;

function applyPreferences(preferences: PreferenceValues) {
  document.documentElement.classList.toggle("dark", preferences.isDark);
  document.documentElement.classList.toggle(
    "reduce-motion",
    preferences.reduceMotion,
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Не удалось сохранить настройки сайта:", error);
  }
}

export function SitePreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const preferencesRef = useRef<PreferenceValues>({
    isDark: false,
    reduceMotion: false,
  });

  useEffect(() => {
    let isMounted = true;
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const preferences: unknown = JSON.parse(saved);
          if (typeof preferences === "object" && preferences !== null) {
            const loaded = { ...preferencesRef.current };
            if (
              "isDark" in preferences &&
              typeof preferences.isDark === "boolean"
            ) {
              loaded.isDark = preferences.isDark;
            }
            if (
              "reduceMotion" in preferences &&
              typeof preferences.reduceMotion === "boolean"
            ) {
              loaded.reduceMotion = preferences.reduceMotion;
            }
            preferencesRef.current = loaded;
            setIsDark(loaded.isDark);
            setReduceMotion(loaded.reduceMotion);
          }
        }
      } catch (error) {
        console.error("Не удалось загрузить настройки сайта:", error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [isDark, isReady, reduceMotion]);

  const updateIsDark = useCallback((enabled: boolean) => {
    const next = { ...preferencesRef.current, isDark: enabled };
    preferencesRef.current = next;
    setIsDark(enabled);
    applyPreferences(next);
  }, []);

  const updateReduceMotion = useCallback((enabled: boolean) => {
    const next = { ...preferencesRef.current, reduceMotion: enabled };
    preferencesRef.current = next;
    setReduceMotion(enabled);
    applyPreferences(next);
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      reduceMotion,
      isReady,
      setIsDark: updateIsDark,
      setReduceMotion: updateReduceMotion,
    }),
    [isDark, isReady, reduceMotion, updateIsDark, updateReduceMotion],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  const preferences = useContext(PreferencesContext);
  if (!preferences) {
    throw new Error(
      "useSitePreferences must be used within SitePreferencesProvider",
    );
  }
  return preferences;
}
