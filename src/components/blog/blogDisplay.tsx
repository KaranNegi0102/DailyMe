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
  author: string;
  likes: number;
}

export default function BlogDisplay() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRandom, setShowRandom] = useState(false);
  const [randomBlog, setRandomBlog] = useState<Blog | null>(null);
  const [showMostLikes, setShowMostLikes] = useState(false);
  const [sortedBlogs, setSortedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/blogs")
      .then((res) => {
        console.log(res.data);
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blogs");
        setLoading(false);
      });
  }, []);

  const handleShowRandom = () => {
    if (blogs.length > 0) {
      const idx = Math.floor(Math.random() * blogs.length);
      setRandomBlog(blogs[idx]);
      setShowRandom(true);
    }
  };

  const handleShowAll = () => {
    setShowRandom(false);
    setRandomBlog(null);
    setShowMostLikes(false);
    setSortedBlogs([]);
  };

  const handleShowMostLikes = () => {
    const sorted = [...blogs].sort((a, b) => b.likes - a.likes);
    setSortedBlogs(sorted);
    setShowMostLikes(true);
    setShowRandom(false);
    setRandomBlog(null);
  };

  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-[#faf5f5] flex flex-col">
      <h1 className="text-3xl font-bold delius-swash-caps-regular  text-left text-gray-900 mt-8 ml-8">
        Welcome To The World Where Pixels Meet Poetry
      </h1>
      <div className="flex gap-4 ml-8 mt-4">
        <button
          onClick={handleShowRandom}
          className="px-4 py-2 bg-gray-900 cursor-pointer text-white rounded hover:bg-gray-700"
        >
          Random Blog
        </button>
        <button
          onClick={handleShowMostLikes}
          className="px-4 py-2 bg-pink-700 cursor-pointer text-white rounded hover:bg-pink-900"
        >
          Most Likes
        </button>
        {(showRandom || showMostLikes) && (
          <button
            onClick={handleShowAll}
            className="px-4 py-2 bg-gray-400 cursor-pointer text-white rounded hover:bg-gray-600"
          >
            Show All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-1 gap-8 p-6">
        {showRandom && randomBlog ? (
          <div
            key={randomBlog.id}
            className={`bg-[#faf5f5] overflow-hidden gap-4 flex flex-row`}
          >
            <Image
              src={randomBlog.image_url}
              alt="Blog"
              width={400}
              height={400}
              className="w-1/2 rounded-xl  h-90 object-cover"
            />
            <div className="p-4 flex flex-col bg-[#ddddcb] rounded-xl flex-1 items-center">
              <h2 className="text-xl indie-flower-regular text-gray-500 tracking-wide">
                {randomBlog.created_at}
              </h2>
              <h2 className="text-3xl  delius-swash-caps-regular mt-5 text-black tracking-wide">
                {randomBlog.title}
              </h2>
              <p className="text-gray-600 mb-4 delius-swash-caps-mix mt-3 text-center">
                {randomBlog.content.length > 120
                  ? randomBlog.content.slice(0, 520) + "..."
                  : randomBlog.content}
              </p>
              <div className="w-full flex justify-between items-center mt-auto pt-2">
                <a
                  href={`/blogInfo/${randomBlog.id}`}
                  className="inline-block text-black indie-flower-regular underline font-semibold tracking-wide"
                >
                  Read More
                </a>
                <span className="text-sm text-red-600 font-bold">
                  ❤️ {randomBlog.likes} Likes
                </span>
                <h3 className="text-md text-gray-700 delius-swash-caps-regular">
                  by {randomBlog.author}
                </h3>
              </div>
            </div>
          </div>
        ) : showMostLikes ? (
          sortedBlogs.map((blog, idx) => (
            <div
              key={blog.id}
              className={`bg-[#faf5f5] overflow-hidden  gap-4 flex ${
                idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <Image
                src={blog.image_url}
                alt="Blog"
                width={400}
                height={400}
                className="w-1/2 rounded-xl h-90 object-cover"
              />
              <div className="p-4 flex flex-col bg-[#ddddcb] rounded-xl flex-1 items-center">
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
                <div className="w-full flex justify-between items-center mt-auto pt-2">
                  <a
                    href={`/blogInfo/${blog.id}`}
                    className="inline-block text-black indie-flower-regular underline font-semibold tracking-wide"
                  >
                    Read More
                  </a>
                  <span className="text-sm text-red-600 font-bold">
                    ❤️ {blog.likes} Likes
                  </span>
                  <h3 className="text-md text-gray-700 delius-swash-caps-regular">
                    by {blog.author}
                  </h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          blogs.map((blog, idx) => (
            <div
              key={blog.id}
              className={`bg-[#faf5f5]  overflow-hidden gap-4 flex ${
                idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <Image
                src={blog.image_url}
                alt="Blog"
                width={400}
                height={400}
                className="w-1/2 rounded-xl  h-90 object-cover"
              />
              <div className="p-4 flex flex-col bg-[#ddddcb] rounded-xl flex-1 items-center">
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
                <div className="w-full flex justify-between items-center mt-auto pt-2">
                  <a
                    href={`/blogInfo/${blog.id}`}
                    className="inline-block text-black indie-flower-regular underline font-semibold tracking-wide"
                  >
                    Read More
                  </a>
                  <span className="text-sm text-red-600 font-bold">
                    ❤️ {blog.likes} Likes
                  </span>
                  <h3 className="text-md text-gray-700 delius-swash-caps-regular">
                    by {blog.author}
                  </h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
