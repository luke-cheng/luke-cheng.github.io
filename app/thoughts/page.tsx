import Link from "next/link";
import { getBlogPosts } from "../_lib/blog.server";

export default async function ThoughtsPage() {
  const posts = await getBlogPosts();

  return (
    <main className="blog-index-page">
      <p className="eyebrow">Thoughts / Writing</p>
      <h1>Just some thoughts.</h1>
      <div className="post-list" aria-label="Blog posts, newest first">
        {posts.map((post) => (
          <Link
            className="post-card"
            href={`/thoughts/${encodeURIComponent(post.slug)}/`}
            key={post.slug}
          >
            <time dateTime={post.date}>{post.date}</time>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
