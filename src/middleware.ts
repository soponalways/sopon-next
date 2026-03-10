import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Admin route protection is handled client-side with useSession
  // This middleware handles additional routing logic
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
