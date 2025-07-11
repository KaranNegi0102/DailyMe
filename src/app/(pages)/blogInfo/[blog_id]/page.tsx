"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { Trash2, Shredder } from "lucide-react";
import MyBlogNavbar from "@/components/myBlog/navbar";

interface Blog {
  id: number;
  title: string;
  content: string;
  owner_id: number;
  created_at: string;
  image_url: string;
  author: string;
}

export default function BlogInfoPage() {
  const params = useParams();
  const blogId = params.blog_id;
  // console.log("this is my blogid in infopage checkup", blogId);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userData, isLoggedIn } = useAppSelector((state) => state.auth);

  // console.log("this is my userdata in blog info page", userData);
  // console.log("this is my userdata in blog info page", isLoggedIn);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blogInfo/${blogId}`);
        setBlog(response.data);
      } catch (error) {
        console.log(error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (blogId) {
      axios
        .get(`${BASE_URL}/likes/${blogId}`)
        .then((res) => setLikes(res.data.likes))
        .catch(console.error);
    }
  }, [blogId]);

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (userData && blogId) {
      axios
        .get(`${BASE_URL}/isLiked`, {
          params: { blog_id: blogId, user_id: userData.id },
        })
        .then((res) => setLiked(res.data.liked))
        .catch(console.error);
    }
  }, [userData, blogId]);

  const handleLike = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!userData || liked) return;
    try {
      await axios.post(`${BASE_URL}/like`, null, {
        params: { blog_id: blogId, user_id: userData.id },
      });
      setLikes((prev) => prev + 1);
      setLiked(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!userData || !blog) return;
    try {
      await axios.post(`${BASE_URL}/blogDelete`, null, {
        params: { blog_id: blog.id, user_id: userData.id },
      });
      alert("Blog deleted!");
      router.push("/myBlog");
    } catch (error) {
      console.log(error);
      alert("Failed to delete blog.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <MyBlogNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-xl text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <MyBlogNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-xl text-gray-600">Blog not found 😢</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative">
          {/* Back & Delete Controls */}
          <div className="flex justify-between items-center  mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white/80 cursor-pointer hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow delius-swash-caps-regular transition-colors duration-200"
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

            {userData?.id === blog.owner_id && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 rounded-full hover:bg-red-100 cursor-pointer text-red-600"
                >
                  <Trash2 />
                </button>
                {showDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={handleDelete}
                      className="flex items-center cursor-pointer gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                    >
                      <Shredder />
                      Confirm Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold delius-swash-caps-regular text-gray-900 mb-4 text-center">
            {blog.title}
          </h1>
          <p className="text-center text-gray-600 mb-6 delius-swash-caps-mix">
            Published on {new Date(blog.created_at).toLocaleDateString()}
          </p>

          {/* Image */}
          <Image
            src={blog.image_url}
            alt={blog.title}
            width={1200}
            height={500}
            className="w-full h-[400px] object-cover rounded-2xl mb-6"
          />

          {/* Content */}
          <p className="text-lg text-gray-700 delius-swash-caps-mix leading-relaxed text-justify">
            {blog.content}
          </p>

          {/* Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-4">
            <span className="text-gray-600 delius-swash-caps-mix text-lg">
              Published by{" "}
              <span className="font-bold text-xl underline text-gray-900">
                {blog.author}
              </span>
            </span>

            <button
              onClick={handleLike}
              disabled={liked}
              className={`px-6 py-3 text-white font-semibold rounded-full transition-all duration-300 indie-flower-regular ${
                liked
                  ? "bg-pink-700 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {liked ? `💖 ${likes}` : `💖 ${likes} Likes`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
