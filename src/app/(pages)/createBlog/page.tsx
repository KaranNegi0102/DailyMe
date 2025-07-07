"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import axios from "axios";

interface Blog {
  title: string;
  content: string;
}

export default function CreateBlogPage() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState("");

  console.log("this is my userdata", userData);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userData) return;
    try {
      await axios.post("http://localhost:8000/createBlogs", {
        title,
        content,
        user_id: userData.id,
      });
      setBlogs("Blog created successfully!");
      setTitle("");
      setContent("");
    } catch {
      setBlogs("Failed to create blog.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6ebeb] text-black flex flex-col p-8">
      <h1 className="text-4xl font-bold playfair-display text-[#e08c8c] text-center mb-6">
        BlogHub
      </h1>
      <h2 className="text-3xl font-bold playfair-display text-black mb-2 text-center">
        Create a New Blog
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Share your thoughts with the world!
      </p>
      <form className="w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold bg-transparent playfair-display text-gray-900 outline-none  mb-8 py-2 px-2 placeholder-gray-400 min-h-[48px] w-full"
          placeholder="Add a title..."
          aria-label="Blog Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-lg bg-transparent outline-none border-b-2 border-gray-300 mb-8 py-4 px-2   placeholder-gray-400 min-h-[200px] w-full resize-none"
          placeholder="Start writing your story..."
          aria-label="Blog Content"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200"
        >
          Create Blog
        </button>
        {blogs && (
          <div className="mt-6 text-center text-green-600 font-semibold">
            {blogs}
          </div>
        )}
      </form>
    </div>
  );
}
