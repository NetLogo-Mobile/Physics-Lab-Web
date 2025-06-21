import zh from "./zh";
import en from "./en";
import { createI18n } from "vue-i18n";

const messages = {
  Chinese: zh,
  English: en,
};

const i18n = createI18n({
  legacy: false,
  locale: "English",
  fallbackLocale: "Chinese",
  messages,
});

export default i18n;
