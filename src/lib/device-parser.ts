export interface DeviceInfo {
    device: "mobile" | "tablet" | "desktop";
    browser: string;
    os: string;
}

export function parseUserAgent(ua: string): DeviceInfo {
    const isMobile = /mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua);
    const isTablet = /tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(ua);

    let device: "mobile" | "tablet" | "desktop" = "desktop";
    if (isTablet) device = "tablet";
    else if (isMobile) device = "mobile";

    let browser = "Unknown";
    if (/edg/i.test(ua)) browser = "Edge";
    else if (/chrome/i.test(ua)) browser = "Chrome";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/opera|opr/i.test(ua)) browser = "Opera";
    else if (/msie|trident/i.test(ua)) browser = "IE";

    let os = "Unknown";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/ios|iphone|ipad/i.test(ua)) os = "iOS";

    return { device, browser, os };
}

export function getDeviceIcon(device: string): string {
    if (device === "mobile") return "📱";
    if (device === "tablet") return "📟";
    return "💻";
}