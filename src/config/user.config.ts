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
      {
        key: "debugger",
        label: "错误日志",
        type: "link",
        value: "off",
        options: [
          { label: "on", value: "on" },
          { label: "export", value: "export" },
          { label: "off", value: "off" },
        ],
        callBack: (newValue: string) => {
          if (newValue === "export") {
            window.$ErrorLogger.exportToTxt();
            return;
          }
          if (newValue === "off") {
            localStorage.removeItem("error_logs");
          }
          Emitter.emit("nWarning", {
            title: i18n.global.t("login.reLogin"),
            content: i18n.global.t("login.reLoginContent"),
            positiveText: i18n.global.t("login.confirm"),
            onPositiveClick: async () => {
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
