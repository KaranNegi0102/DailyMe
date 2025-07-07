"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import Image from "next/image";
import { fetchUserData } from "@/app/redux/slices/authSlice";

interface Blog {
  id: number;
  title: string;
  content: string;
  owner_id: number;
}

export default function Page() {
  const userData = useAppSelector((state) => state.auth.userData);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  console.log("this is my userdata", userData);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (!userData) return;
    axios
      .get(`http://localhost:8000/myblogs`, {
        params: { user_id: userData.id },
      })
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch your blogs");
        setLoading(false);
      });
  }, [userData]);

  return (
    <div className="min-h-screen bg-[#f6ebeb] p-8">
      <h1 className="text-4xl font-bold playfair-display text-[#e08c8c] text-center mb-10">
        BlogHub
      </h1>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold playfair-display text-black mb-2">
            {userData ? `Welcome, ${userData.username}` : "Your Name"}
          </h1>
          <p className="text-gray-600">Your Blogs</p>
        </div>
        <a
          href="/blog/create"
          className="bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200"
        >
          Write More Blogs
        </a>
      </div>
      {loading ? (
        <div>Loading your blogs...</div>
      ) : error ? (
        <div>{error}</div>
      ) : blogs.length === 0 ? (
        <div>You have not written any blogs yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-[#f3f3eb] overflow-hidden flex flex-col"
            >
              <Image
                src="https://images.squarespace-cdn.com/content/v1/624b3c6d692bd24ce26121ca/1651581695546-6RVXQ1JLNPEH4WS36GG7/07_20160720S1_WEATHERBY_ANGLERS_048.jpg?format=2500w"
                alt="Blog"
                width={400}
                height={400}
                className="w-full h-68 object-cover"
              />
              <div className="p-4 flex flex-col flex-1 items-center">
                <h2 className="text-2xl font-bold playfair-display mt-6 mb-4 text-black tracking-wide">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 lato-regular-italic mt-4 text-center">
                  {blog.content.length > 120
                    ? blog.content.slice(0, 70) + "..."
                    : blog.content}
                </p>
                <a
                  href={`/blog/${blog.id}`}
                  className="mt-auto inline-block text-black lato-bold underline font-semibold tracking-wide"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
