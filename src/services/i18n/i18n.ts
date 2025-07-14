import zh from "./zh";
import en from "./en";
import { createI18n } from "vue-i18n";

const datetimeFormats = {
  'Chinese': {
    time: {
      hour: 'numeric' as const,  
      minute: 'numeric' as const,
      hour12: false
    },
    monthDay: {
      month: 'numeric' as const,
      day: 'numeric' as const,
      hour: 'numeric' as const,  
      minute: 'numeric' as const,
      hour12: false
    },
    yearMonthDay: {
      year: 'numeric' as const,
      month: 'numeric' as const,
      day: 'numeric' as const,
      hour: 'numeric' as const,  
      minute: 'numeric' as const,
      hour12: false
    }
  }
};

const messages = {
  Chinese: zh,
  English: en,
};

const i18n = createI18n({
  legacy: false,
  locale: "Chinese",
  fallbackLocale: "Chinese",
  datetimeFormats,
  messages,
});

export default i18n;
// 没有与此调用匹配的重载。
//   第 1 个重载(共 2 个)，“(options: I18nOptions<{ message: LocaleMessage<VueMessageType>; datetime: DateTimeFormat; number: NumberFormat; }, string, ComposerOptions<{ ...; }, ... 9 more ..., NumberFormats<...>> | VueI18nOptions<...>>): I18n<...>”，出现以下错误。
//     不能将类型“{ Chinese: { time: { hour: string; minute: string; hour12: boolean; }; monthDay: { month: string; day: string; }; yearMonthDay: { year: string; month: string; day: string; }; }; }”分配给类型“{ [x: string]: DateTimeFormat; }”。
//       属性“'Chinese'”与索引签名不兼容。
//         不能将类型“{ time: { hour: string; minute: string; hour12: boolean; }; monthDay: { month: string; day: string; }; yearMonthDay: { year: string; month: string; day: string; }; }”分配给类型“DateTimeFormat”。
//           属性“time”与索引签名不兼容。
//             不能将类型“{ hour: string; minute: string; hour12: boolean; }”分配给类型“DateTimeFormatOptions”。
//               不能将类型“{ hour: string; minute: string; hour12: boolean; }”分配给类型“SpecificDateTimeFormatOptions”。
//                 属性“hour”的类型不兼容。
//                   不能将类型“string”分配给类型“DateTimeDigital | undefined”。

