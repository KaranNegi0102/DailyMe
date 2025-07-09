"use client";
import React, { useEffect } from "react";
import Navbar from "./../components/navbar";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <div className="h-full bg-[#f7ebeb]">
      <Navbar />

      <div className="text-black mt-9 mb-9 ">
        <h3 className="text-2xl text-center delius-swash-caps-mix ">
          A Blog Verse Where
        </h3>
        <h3 className="text-4xl mt-2 text-center delius-swash-caps-regular">
          Every Thought Deserves a Page
        </h3>
      </div>
      <div className="mt-6 mb-8 relative flex justify-center items-center">
        <Image
          src="https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/anime-girl-and-dog-bound-by-loyalty-and-oath-8f-1920x1080_r9a0ue.jpg"
          alt="Blogging Inspiration"
          width={800}
          height={256}
          className="shadow-lg w-full h-90 object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isLoggedIn ? (
            <a
              href="/blogingPage"
              className="bg-[#efb9b9] delius-swash-caps-regular text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Let&apos;s Explore
            </a>
          ) : (
            <div className="flex gap-6">
              <a
                href="/register"
                className="delius-swash-caps-regular text-white border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="delius-swash-caps-regular text-gray-800 border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
