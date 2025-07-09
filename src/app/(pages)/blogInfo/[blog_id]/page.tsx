"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Shredder } from "lucide-react";

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

  // console.log("blogId is ", blogId);
  const userData = useAppSelector((state) => state.auth.userData);
  console.log("this is userdata in personal blog ", userData);
  // console.log("this is userdata in personal id ", userData.id);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/blogInfo/${blogId}`
        );
        console.log("this is response data", response.data);
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
    if (blogId) {
      axios
        .get(`http://localhost:8000/likes/${blogId}`)
        .then((res) => setLikes(res.data.likes))
        .catch((err) => console.error("error fetching like", err));
    }
  }, [blogId]);

  useEffect(() => {
    if (userData && blogId) {
      axios
        .get(`http://localhost:8000/isLiked`, {
          params: { blog_id: blogId, user_id: userData.id },
        })
        .then((res) => setLiked(res.data.liked))
        .catch((err) => console.error("error fetching isLiked", err));
    }
  }, [userData, blogId]);

  const handleLike = async () => {
    if (!userData) return;
    try {
      const userId = userData.id;

      await axios.post(`http://localhost:8000/like`, null, {
        params: { blog_id: blogId, user_id: userId },
      });

      setLikes((prev) => prev + 1);
      setLiked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!userData) return;
    if (!blog) return;
    try {
      await axios.post(`http://localhost:8000/blogDelete`, null, {
        params: { blog_id: blog.id, user_id: userData.id },
      });
      alert("Blog deleted!");
      router.push("/myBlog"); // or wherever you want to redirect
    } catch (error) {
      alert("Failed to delete blog.");
      console.error(error);
    }
  };

  if (loading) return <div>Loading blog...</div>;
  if (!blog) return <div>Blog not found hahahah .</div>;
  if (!userData) return <div>Loading user...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="p-2  hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" />
        </button>
        <h1 className="text-5xl font-bold delius-swash-caps-regular text-center flex-1">
          {blog.title}
        </h1>
        {userData.id === blog.owner_id && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="px-4 py-2 text-gray-800 cursor-pointer rounded-full hover:bg-gray-100"
            >
              <Trash2 />
            </button>
            {showDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white border rounded-md shadow z-10 min-w-[220px]">
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 cursor-pointer text-red-600 hover:bg-red-100"
                >
                  <div className="flex items-center gap-2">
                    <Shredder />
                    <span>Confirm Delete</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-center text-gray-500 indie-flower-regular mb-8">
        Published on {blog.created_at}
      </p>
      <Image
        src={blog.image_url}
        alt="Blog Image"
        width={800}
        height={400}
        className="w-full h-[400px] object-cover rounded-xl mb-6"
      />
      <p className="text-lg leading-relaxed delius-swash-caps-mix text-justify">
        {blog.content}
      </p>
      <div className="flex flex-row justify-between items-center mt-8 mb-2">
        <span className="text-1xl text-gray-600 delius-swash-caps-mix">
          published by{" "}
          <span className="font-bold text-2xl text-gray-900 underline delius-swash-caps-regular">
            {blog.author}
          </span>
        </span>
        <button
          onClick={handleLike}
          className={`bg-pink-900 text-white delius-swash-caps-regular px-4 py-2 rounded-full ml-4 ${
            liked ? "opacity-100 cursor-not-allowed" : "hover:bg-pink-600"
          }`}
          disabled={liked}
        >
          {liked ? `💖 ${likes} ` : `💖 ${likes} Likes `}
        </button>
      </div>
    </div>
  );
}
