import Link from "next/link";
import { getBlogPosts } from "@/app/_lib/blog.server";

export default async function ThoughtsPage() {
  const posts = await getBlogPosts();

  return (
    <main className="blog-index-page">
      <p className="eyebrow">Thoughts / Writing</p>
      <h1>Some thoughts.</h1>
      <div className="post-list" aria-label="Blog posts, newest first">
        {posts.map((post) => (
          <Link
            className="post-card"
            href={`/thoughts/${encodeURIComponent(post.slug)}/`}
            key={post.slug}
          >
            <p>
              <time dateTime={post.createdDate}>Created: {post.createdDate}</time>
              {" · "}
              <time dateTime={post.updatedDate}>Updated: {post.updatedDate}</time>
            </p>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
