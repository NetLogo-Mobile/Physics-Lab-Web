import FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function getVisitorId() {
  const fp = await FingerprintJS.load();
  const re = await fp.get();
  return re.visitorId;
}

/**
 * 获取增浏览器和设备信息 / Get browser & device info*/
export function getDeviceInfo(): Record<string, any> {
  return {
    Platform: navigator.platform,
    Model: (navigator as any).deviceModel,
    System: navigator.userAgent,
    CPU: (navigator as any).hardwareConcurrency,
    GPU: (navigator as any).gpu?.brand,
    SystemMemory: (navigator as any).deviceMemory * 1024,
    GraphicMemory: (navigator as any).gpu?.memory,
    ScreenWidth: screen.width,
    ScreenHeight: screen.height,
    ScreenDPI: (window as any).devicePixelRatio * 96,
    ScreenSize: Math.round(
      Math.sqrt(screen.width ** 2 + screen.height ** 2) /
        ((window as any).devicePixelRatio * 96),
    ),
    Timezone: -new Date().getTimezoneOffset() / 60,
    Language: navigator.language,
  };
}
