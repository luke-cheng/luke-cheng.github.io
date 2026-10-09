import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "@/app/_components/BlogPostPage";
import { getBlogPost, getBlogPosts } from "@/app/_lib/blog.server";
import { renderMarkdown, stripFrontMatter } from "@/app/_lib/markdown";

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.length > 0 ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "__empty__" }];
}

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Luke Cheng`,
    description: post.description,
  };
}

export default async function ThoughtsPostRoute({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const initialArticleHtml = renderMarkdown(stripFrontMatter(post.draft));
  return <BlogPostPage post={post} draft={post.draft} initialArticleHtml={initialArticleHtml} />;
}
