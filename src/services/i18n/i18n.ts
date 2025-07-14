import zh from "./zh";
import en from "./en";
import { createI18n } from "vue-i18n";

const datetimeFormats = {
  Chinese: {
    time: {
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    },
    monthDay: {
      month: "numeric" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    },
    yearMonthDay: {
      year: "numeric" as const,
      month: "numeric" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    },
  },
  English: {
    time: {
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    },
    monthDay: {
      month: "short" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    },
    yearMonthDay: {
      year: "numeric" as const,
      month: "short" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: true,
    },
  },
};

const messages = {
  Chinese: zh,
  English: en,
};

const i18n = createI18n({
  legacy: false,
  locale: "English",
  fallbackLocale: "Chinese",
  datetimeFormats,
  messages,
});

export default i18n;
