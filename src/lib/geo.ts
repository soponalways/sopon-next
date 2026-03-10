// Free IP geolocation — no API key required
export async function getGeoFromIP(ip: string): Promise<{ country: string; city: string } | null> {
    try {
        // Skip local/private IPs
        if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
            return { country: "Local", city: "Localhost" };
        }

        const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`, {
            next: { revalidate: 86400 }, // cache 24h
        });

        if (!res.ok) return null;
        const data = await res.json();

        if (data.status !== "success") return null;
        return { country: data.country || "Unknown", city: data.city || "Unknown" };
    } catch {
        return null;
    }
}