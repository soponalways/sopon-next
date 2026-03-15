import { redis } from "@/lib/redis";

export async function POST(req: Request) {
    const { slug } = await req.json();

    await redis.incr(`blog:views:${slug}`);

    return Response.json({ success: true });
}