import { BookOpen } from 'lucide-react';

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-gray-800 snap-start">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Blog</h2>
          <p className="text-xl text-gray-300">
            Thoughts, tutorials, and probably some rambling about technology
          </p>
        </div>

        <div className="text-center">
          <div className="bg-gray-900 rounded-lg p-12 max-w-2xl mx-auto">
            <div className="text-gray-400 mb-6">
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Coming Soon</h3>
            <p className="text-gray-300 mb-6">
              I'm working on some blog posts about technology, software development, and maybe some thoughts on the intersection of chemistry and code.
            </p>
            <p className="text-gray-400 text-sm">
              Check back later, or just ask the AI assistant about any of these topics. It probably knows more than I do anyway.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 