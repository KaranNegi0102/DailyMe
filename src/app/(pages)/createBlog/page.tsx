"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const defaultImages = [
    "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/backiee-74266-landscape_nqln5e.jpg",
    "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/168847-anime-anime_girl-anime_art-cartoon-anime_friends_brazil-3840x2160_f2qkzu.jpg",
    "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/anime-girl-and-dog-bound-by-loyalty-and-oath-8f-1920x1080_r9a0ue.jpg",
    "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/an-anime-girl-serene-fall-sh-1400x900_vvfgbx.jpg",
    "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986604/IMAGE_b3xgnj.png",
  ];

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  }

  async function uploadImageToBackend() {
    if (!image) return null;
    const formData = new FormData();
    formData.append("file", image);
    try {
      const res = await axios.post(
        "http://localhost:8000/upload_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.image_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userData) return;

    let uploadImageUrl = null;

    if (image) {
      uploadImageUrl = await uploadImageToBackend();
      if (!uploadImageUrl) {
        setBlogs("Failed to upload image.");
        return;
      }
    } else {
      // Pick a random image from the defaultImages array
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      uploadImageUrl = defaultImages[randomIndex];
    }

    try {
      await axios.post(
        `http://localhost:8000/createBlogs?user_id=${userData.id}`,
        {
          title,
          content,
          image_url: uploadImageUrl,
        }
      );
      setBlogs("Blog created successfully!");
      setTitle("");
      setContent("");
      setImage(null);
      router.push("/myBlog");
    } catch {
      setBlogs("Failed to create blog.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6 flex">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow delius-swash-caps-regular transition-colors duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 container mx-auto px-6 ">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl p-2 font-bold text-gray-900 animate-pulse bg-clip-text delius-swash-caps-regular mb-4">
              DailyME
            </h1>
            <h2 className="text-3xl font-bold delius-swash-caps-mix text-black mb-2 text-center">
              Create a New Blog
            </h2>
            <p className="text-xl text-gray-600 delius-swash-caps-regular max-w-2xl mx-auto">
              Share your thoughts with the world!
            </p>
          </div>
        </div>
      </div>
      {/* Card Section */}
      <div className="container mx-auto px-6 pb-16 flex justify-center">
        <div className="w-full max-w-7xl h-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
          {/* Left: Blog Form */}
          <form className="w-full md:w-8/6" onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold bg-transparent delius-swash-caps-regular text-gray-900 outline-none mb-8 py-2 px-2 placeholder-gray-400 min-h-[48px] w-full"
              placeholder="Add a title..."
              aria-label="Blog Title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-lg bg-transparent outline-none delius-swash-caps-mix text-gray-900 border-b-2 border-gray-300 mb-8 py-4 px-2 placeholder-gray-400 min-h-[200px] w-full resize-none"
              placeholder="Start writing your story..."
              aria-label="Blog Content"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200"
            >
              Create Blog
            </button>
            {blogs && (
              <div className="mt-6 text-center text-green-600 font-semibold">
                {blogs}
              </div>
            )}
          </form>
          {/* Right: Image Selector */}
          <div className="w-full md:w-1/2 flex flex-col items-center bg-[#090808] text-white rounded-lg shadow-md p-9">
            <label className="block text-lg font-semibold mb-4">
              Select an Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md border overflow-hidden">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-contain h-full w-full"
                />
              ) : (
                <span className="text-gray-400">No image preview</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
