"use client";
import React, { useEffect, useState } from "react";
import BlogCard from "../blog/BlogCard";
import axios from "axios"

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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  useEffect(() => {
    axios
      .get(`${BASE_URL}/blogs`,{
        withCredentials: true,
      })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 delius-swash-caps-regular">Loading amazing stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-xl text-gray-700 delius-swash-caps-regular">{error}</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative z-10 container mx-auto px-6 ">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl  p-2 font-bold text-gray-900 animate-pulse bg-clip-text  delius-swash-caps-regular mb-4">
              DailyMe
            </h1>
            <p className="text-xl  text-gray-600 delius-swash-caps-mix max-w-2xl mx-auto">
              Where Pixels Meet Poetry - Discover Amazing Stories from Our Community
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={handleShowRandom}
              className="group relative cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Random Discovery</span>
            </button>
            
            <button
              onClick={handleShowMostLikes}
              className="group relative inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Most Loved</span>
            </button>
            
            {(showRandom || showMostLikes) && (
              <button
                onClick={handleShowAll}
                className="group relative inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Show All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-6 pb-16">
        {showRandom && randomBlog ? (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 delius-swash-caps-regular mb-2">
                ✨ Your Random Discovery
              </h2>
              <p className="text-gray-600">Here&apos;s something special we picked just for you</p>
            </div>
            <BlogCard blog={randomBlog} index={0} isSpecial={true} />
          </div>
        ) : showMostLikes ? (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 delius-swash-caps-regular mb-2">
                🏆 Most Loved Stories
              </h2>
              <p className="text-gray-600">The community&apos;s favorite reads</p>
            </div>
            {sortedBlogs.map((blog, idx) => (
              <BlogCard key={blog.id} blog={blog} index={idx} />
            ))}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 delius-swash-caps-regular mb-2">
                📚 All Stories
              </h2>
              <p className="text-gray-600">Explore our entire collection of amazing stories</p>
            </div>
            {blogs.map((blog, idx) => (
              <BlogCard key={blog.id} blog={blog} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}