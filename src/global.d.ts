import type { MessageReactive } from "naive-ui";

declare global{
  interface Window {
  $message: {
    loading: (
      message: string,
      config?: { duration: number; closable?: boolean },
    ) => MessageReactive;
    success: (
      message: string,
      config?: { duration: number; closable?: boolean },
    ) => MessageReactive;
    warning: (
      message: string,
      config?: { duration: number; closable?: boolean },
    ) => MessageReactive;
    error: (
      message: string,
      config?: { duration: number; closable?: boolean },
    ) => MessageReactive;
    info: (
      message: string,
      config?: { duration: number; closable?: boolean },
    ) => MessageReactive;
    destroyAll: () => void;
  };
  $getPath: (path: string) => string;
  $parse: (text: string | string[], isInline?: boolean) => string; // for test only
}

}

