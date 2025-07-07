"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  content: string;
  owner_id: number;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 p-9">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="bg-[#f3f3eb]  overflow-hidden flex flex-col"
        >
          <Image
            src="https://images.squarespace-cdn.com/content/v1/624b3c6d692bd24ce26121ca/1651581695546-6RVXQ1JLNPEH4WS36GG7/07_20160720S1_WEATHERBY_ANGLERS_048.jpg?format=2500w"
            alt="Blog"
            width={400}
            height={400}
            className="w-full h-68 object-cover"
          />
          <div className="p-4 flex flex-col flex-1 items-center">
            <h2 className="text-3xl lato mt-6  text-black tracking-wide">
              {blog.title}
            </h2>
            <p className="text-gray-600 mb-4 lato-regular-italic mt-4 text-center">
              {blog.content.length > 120
                ? blog.content.slice(0, 70) + "..."
                : blog.content}
            </p>
            <a
              href={`/blog/${blog.id}`}
              className="mt-auto inline-block text-black lato-bold  underline font-semibold tracking-wide"
            >
              Read More
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
