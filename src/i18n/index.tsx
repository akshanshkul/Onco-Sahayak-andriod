import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STRINGS, type Lang, type StringKey } from "./strings";

export type { Lang, StringKey };

export const LANGUAGES: { code: Lang; labelKey: StringKey }[] = [
  { code: "en", labelKey: "lang.en" },
  { code: "hi", labelKey: "lang.hi" },
  { code: "pa", labelKey: "lang.pa" },
  { code: "bn", labelKey: "lang.bn" },
  { code: "gu", labelKey: "lang.gu" },
  { code: "mr", labelKey: "lang.mr" },
  { code: "ta", labelKey: "lang.ta" },
  { code: "te", labelKey: "lang.te" },
  { code: "kn", labelKey: "lang.kn" },
  { code: "ml", labelKey: "lang.ml" },
  { code: "or", labelKey: "lang.or" },
  { code: "ur", labelKey: "lang.ur" },
  { code: "as", labelKey: "lang.as" },
];

export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  pa: "ਪੰਜਾਬੀ",
  bn: "বাংলা",
  gu: "ગુજરાતી",
  mr: "मराठी",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  or: "ଓଡ଼ିଆ",
  ur: "اردو",
  as: "অসমীয়া",
};

type Ctx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: StringKey) => string;
};

const I18nContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (key) => STRINGS[key].en,
});

export function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(() => {
    // React Native / Expo
    // Replace this with AsyncStorage later if you want persistence.
    return "en";
  });

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
  }, []);

  const t = useCallback(
    (key: StringKey) => {
      return STRINGS[key][lang] || STRINGS[key].en;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;