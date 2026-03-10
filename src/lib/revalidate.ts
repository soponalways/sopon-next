// src/lib/revalidate.ts
"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateBlogCache() {
    revalidateTag("blogs");
    revalidatePath("/blogs");
    revalidatePath("/");
}

export async function revalidateBlogPost(slug: string) {
    revalidateTag("blogs");
    revalidateTag(`blog-${slug}`);
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/blogs");
}