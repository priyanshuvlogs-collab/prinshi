"use client";
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { Country } from "@/lib/site";
import { type Lang, type LabelKey, t } from "@/lib/i18n";
import { getPrefs, setPrefs, subscribePrefs, type PrefState } from "@/lib/prefs-store";

interface Prefs extends PrefState {
  setLang: (l: Lang) => void;
  setCountry: (c: Country) => void;
  label: (k: LabelKey) => string;
}

const Ctx = createContext<Prefs | null>(null);

export function PrefsProvider({ initialCountry, children }: { initialCountry: Country; children: React.ReactNode }) {
  const serverSnap = useMemo<PrefState>(() => ({ lang: "en", country: initialCountry }), [initialCountry]);
  const state = useSyncExternalStore(subscribePrefs, () => getPrefs(initialCountry), () => serverSnap);

  const value = useMemo<Prefs>(
    () => ({
      ...state,
      setLang: (lang) => setPrefs({ lang }, initialCountry),
      setCountry: (country) => setPrefs({ country }, initialCountry),
      label: (k) => t(k, state.lang),
    }),
    [state, initialCountry],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(): Prefs {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePrefs must be used inside PrefsProvider");
  return v;
}
