import FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function getVisitorId() {
  const fp = await FingerprintJS.load();
  const re = await fp.get();
  return re.visitorId;
}

/**
 * 获取增浏览器和设备信息 / Get browser & device info
 * @returns {string} 格式: "ua|浏览器@系统|屏幕(色深)|视口|触控" / Format: "ua|Browser@OS|Screen(bits)|Viewport|Touch"
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent;
  const os = /Windows/.test(ua)
    ? "Win"
    : /Mac/.test(ua)
      ? "Mac"
      : /Linux/.test(ua)
        ? "Linux"
        : /Android/.test(ua)
          ? "Android"
          : /iOS|iPhone/i.test(ua)
            ? "iOS"
            : "Other";
  const screenInfo = `${window.screen.width}x${window.screen.height}(${window.screen.colorDepth}bit)`;
  const viewport = `${window.innerWidth}x${window.innerHeight}`;
  const touch = "ontouchstart" in window ? "Touch" : "NoTouch";

  return `${ua}@${os}|${screenInfo}|${viewport}|${touch}`;
}
