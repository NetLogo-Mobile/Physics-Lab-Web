import Emitter from "./eventEmitter";
import { ref } from "vue";
import storageManager from "./storage";

interface ErrorLog {
  timestamp: number;
  type: string;
  message: any;
  stack?: string;
  component?: string;
  url: string;
}

class ErrorLogger {
  private logs = ref<ErrorLog[]>([]);
  private maxLogs = 1000;

  constructor(app: any) {
    if (
      storageManager.getObj("userConfig").value?.debugger == "on" ||
      storageManager.getObj("userConfig").value?.debugger == "export"
    ) {
      this.logs = localStorage.getItem("error_logs")
        ? ref(JSON.parse(localStorage.getItem("error_logs") as string))
        : ref([]);
    }
    this.setupGlobalHandlers(app);
  }

  private setupGlobalHandlers(app: any) {
    // Vue error handler
    app.config.errorHandler = (err: any, _vm: any, info: any) => {
      this.captureError(err, {
        type: "vue",
        component: info,
      });
    };

    // Window error handler
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError(error || new Error(message as string), {
        type: "window",
        source,
        lineno,
        colno,
      });
    };

    // Unhandled promise rejection
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError(event.reason, {
        type: "promise",
      });
    });
  }

  captureError(error: Error, context: any) {
    if (this.logs.value.length >= this.maxLogs) {
      this.logs.value.shift();
    }

    this.logs.value.push({
      timestamp: Date.now(),
      // type: context.type,
      message: error.message,
      stack: error.stack,
      component: context.component,
      url: window.location.href,
      ...context,
    });

    Emitter.emit("error", error.message, 0, error);
  }

  exportToTxt(): void {
    const content = this.logs.value
      .map(
        (
          log,
        ) => `[${new Date(log.timestamp).toISOString()}] ${log.type.toUpperCase()}: ${log.message}
      Component: ${log.component || "N/A"}
      URL: ${log.url}
      Stack: ${log.stack || "N/A"}
      `,
      )
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `error_logs_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getLogs() {
    return this.logs.value;
  }

  writeLog(message: any) {
    if (storageManager.getObj("userConfig").value?.debugger !== "on") return;
    if (this.logs.value.length >= this.maxLogs) {
      this.logs.value.shift();
    }

    this.logs.value.push({
      timestamp: Date.now(),
      type: "custom",
      message: typeof message === "string" ? message : JSON.stringify(message),
      url: window.location.href,
    });

    localStorage.setItem("error_logs", JSON.stringify(this.logs.value));
  }
}

export default ErrorLogger;
