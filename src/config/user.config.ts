import i18n from "../services/i18n/i18n";
import Emitter from "../services/eventEmitter";
import storageManager from "../services/storage";

export const settingsConfig = [
  {
    title: "general",
    items: [
      {
        key: "language",
        label: "界面语言",
        type: "link",
        value: "Chinese",
        options: [
          { label: "简体中文", value: "Chinese" },
          { label: "English", value: "English" },
        ],
        callBack: (newValue: string) => {
          i18n.global.locale.value = newValue as "English" | "Chinese";
          Emitter.emit("nWarning", {
            title: i18n.global.t("login.reLogin"),
            content: i18n.global.t("login.reLoginContent"),
            positiveText: i18n.global.t("login.confirm"),
            onPositiveClick: async () => {
              storageManager.remove("userInfo");
              window.$Logger.logEvent({
                category: "Account",
                action: "Switch-Language",
                label: "newValue",
                timestamp: Date.now(),
              });
              Emitter.emit("loginRequired");
            },
          });
        },
      },
      // {
      //   key: "",
      //   label: "如题",
      //   type: "toggle",
      //   value: false,
      // },
    ],
  },
];
