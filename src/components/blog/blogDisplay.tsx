"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  content: string;
  owner_id: number;
  created_at: string;
  image_url: string;
}

export default function BlogDisplay() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/blogs")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blogs");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-[#faf5f5] flex flex-col">
      <h1 className="text-3xl font-bold delius-swash-caps-regular  text-left text-gray-900 mt-8 ml-8">
        Welcome To The World Where Pixels Meet Poetry
       
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 p-6">
        {blogs.map((blog, idx) => (
          <div
            key={blog.id}
            className={`bg-[#faf5f5] overflow-hidden gap-4 flex ${
              idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <Image
              src={blog.image_url}
              alt="Blog"
              width={400}
              height={400}
              className="w-1/2  h-90 object-cover"
            />
            <div className="p-4 flex flex-col bg-[#ddddcb] flex-1 items-center">
              <h2 className="text-xl indie-flower-regular text-gray-500 tracking-wide">
                {blog.created_at}
              </h2>
              <h2 className="text-3xl  delius-swash-caps-regular mt-5 text-black tracking-wide">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4 delius-swash-caps-mix mt-3 text-center">
                {blog.content.length > 120
                  ? blog.content.slice(0, 520) + "..."
                  : blog.content}
              </p>
              <a
                href={`/blogInfo/${blog.id}`}
                className="mt-auto inline-block text-black indie-flower-regular  underline font-semibold tracking-wide"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
