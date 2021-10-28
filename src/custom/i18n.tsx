import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import new language JSON file here
import en from "locales/en.json";
import de from "locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    // set new language here
    en,
    de
  },
  fallbackLng: "en",
  debug: process.env.NODE_ENV !== "production",
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: ".", // for nested values
  interpolation: {
    escapeValue: false,
    formatSeparator: ","
  },
  react: {
    wait: true
  }
});

export default i18n;
