export const dynamic = "force-dynamic";
export const revalidate = 0;
import BlogForm from "@/components/blog/BlogForm";

export default function CreateBlogPage() {
    return <BlogForm mode="create" />;
}