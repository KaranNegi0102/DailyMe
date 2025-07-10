import React from "react";
import Image from "next/image";

// Define Blog type if not already imported
export type Blog = {
  id: string | number;
  image_url: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
};

interface BlogCardProps {
  blog: Blog;
  index: number;
  isSpecial?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  index,
  isSpecial = false,
}) => {
  return (
    <div className={`group relative ${isSpecial ? "mb-8" : "mb-12"}`}>
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      <div
        className={`relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
          isSpecial ? "border-2 border-purple-200" : ""
        }`}
      >
        <div
          className={`flex ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          } max-lg:flex-col`}
        >
          {/* Image Section */}
          <div className="lg:w-1/2 relative overflow-hidden">
            <div className="relative h-80 lg:h-96">
              <Image
                src={blog.image_url}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Floating like badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-red-500 font-bold flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {blog.likes}
              </span>
            </div>
          </div>
          {/* Content Section */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-between">
            <div>
              {/* Date */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-500 indie-flower-regular tracking-wide">
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {/* Title */}
              <h2 className="text-3xl font-bold delius-swash-caps-regular mb-4 text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                {blog.title}
              </h2>
              {/* Content Preview */}
              <p className="text-gray-600 mb-6 delius-swash-caps-mix leading-relaxed">
                {blog.content.length > 200
                  ? blog.content.slice(0, 300) + "..."
                  : blog.content}
              </p>
            </div>
            {/* Bottom Section */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-900  rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {blog.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 delius-swash-caps-regular font-medium">
                    {blog.author}
                  </p>
                  <p className="text-xs text-gray-500">Author</p>
                </div>
              </div>
              <a
                href={`/blogInfo/${blog.id}`}
                className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 indie-flower-regular font-semibold"
              >
                <span>Read More</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
