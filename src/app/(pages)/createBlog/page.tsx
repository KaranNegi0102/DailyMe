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

  console.log("this is my userdata", userData);

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
    <div className="min-h-screen bg-[#f6ebeb] text-black flex flex-col p-8">
      <h1 className="text-4xl font-bold delius-swash-caps-regular text-gray-900 text-center mb-6">
        DailyME
      </h1>
      <h2 className="text-3xl font-bold delius-swash-caps-mix text-black mb-2 text-center">
        Create a New Blog
      </h2>
      <p className="text-gray-600 mb-8 delius-swash-caps-regular text-center">
        Share your thoughts with the world!
      </p>
      <div className="flex flex-col md:flex-row gap-8 w-full delius-swash-caps-mix max-w-5xl mx-auto">
        {/* Left: Blog Form */}
        <form className="w-full md:w-2/3" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold bg-transparent  text-gray-900 outline-none  mb-8 py-2 px-2 placeholder-gray-400 min-h-[48px] w-full"
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
  );
}
