import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 400 });
        }

        const imgbbKey = process.env.IMGBB_API_KEY;
        if (!imgbbKey) {
            return NextResponse.json({ error: "ImgBB API key not configured" }, { status: 500 });
        }

        // Convert to base64
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");

        const imgbbForm = new FormData();
        imgbbForm.append("image", base64);
        imgbbForm.append("key", imgbbKey);

        const response = await fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: imgbbForm,
        });

        const result = await response.json();

        if (!result.success) {
            return NextResponse.json({ error: "Upload failed" }, { status: 500 });
        }

        return NextResponse.json({
            url: result.data.url,
            displayUrl: result.data.display_url,
            deleteUrl: result.data.delete_url,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}