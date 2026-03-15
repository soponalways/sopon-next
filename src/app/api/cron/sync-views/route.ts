import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const keys = await redis.keys("blog:views:*");

    for (const key of keys) {
        const slug = key.split(":")[2];

        const views = await redis.get<number>(key);

        if (!views) continue;

        await prisma.blog.update({
            where: { slug },
            data: {
                views: { increment: views },
            },
        });

        await redis.del(key);
    }

    return Response.json({ success: true });
}