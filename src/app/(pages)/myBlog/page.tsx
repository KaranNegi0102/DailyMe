"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import Image from "next/image";
import MyBlogNavbar from "@/components/myBlog/navbar";

interface Blog {
  id: number;
  title: string;
  content: string;
  owner_id: number;
  created_at: string;
  image_url: string;
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
      .get(`http://localhost:8000/myblogs?user_id=${userData.id}`)
      .then((res) => {
        console.log("my response is ", res.data);
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
      <MyBlogNavbar/>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold delius-swash-caps-regular text-black mb-2">
            {userData ? `Welcome, ${userData.username}` : "Your Name"}
          </h1>
          <p className="text-gray-600 delius-swash-caps-regular ">Your Blogs</p>
        </div>
        <a
          href="/createBlog"
          className="bg-black hover:bg-white indie-flower-regular hover:text-black text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-[#f3f3eb] overflow-hidden flex flex-col"
            >
              <Image
                src={blog.image_url}
                alt="Blog"
                width={400}
                height={400}
                className="w-full h-68 object-cover"
              />
              <div className="p-4 flex flex-col flex-1 items-center">
                <h2 className="text-xl font-bold indie-flower-regular mt-6 mb-4 text-black tracking-wide">
                  {blog.created_at}
                </h2>
                <h2 className="text-2xl font-bold delius-swash-caps-regular mt-6 mb-4 text-black tracking-wide">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 delius-swash-caps-mix mt-4 text-center">
                  {blog.content.length > 120
                    ? blog.content.slice(0, 70) + "..."
                    : blog.content}
                </p>
                <a
                  href={`/blog/${blog.id}`}
                  className="mt-auto inline-block indie-flower-regular text-black indie-flower-regular underline font-semibold tracking-wide"
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
