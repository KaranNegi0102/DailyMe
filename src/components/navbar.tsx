"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import { Facebook, Twitter, Instagram, LogOut } from "lucide-react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, userData } = useAppSelector((state) => state.auth);

  console.log("this is islogged in navbar", isLoggedIn);
  console.log("this is userData in navbar", userData);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <nav className="flex justify-between items-center bg-[#efb9b9] p-6 max-w-7xl mx-auto">
      {/* Left side navigation */}
      <div className="flex items-center delius-swash-caps-regular ml-30 space-x-6">
        <Link
          href="/"
          className="text-white text-2xl animate-bounce hover:text-gray-800 hover:underline transition-colors "
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-gray-800 animate-bounce hover:text-white hover:underline transition-colors"
        >
          About
        </Link>
        <Link
          href="/blogingPage"
          className="text-white animate-bounce hover:text-gray-900 hover:underline transition-colors"
        >
          Blogs
        </Link>
        <Link
          href="/contact"
          className="text-gray-800 animate-bounce hover:text-white hover:underline transition-colors"
        >
          Contact
        </Link>
      </div>
      {/* Right side social icons */}
      <div className="flex items-center  mr-30 space-x-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <Facebook className="w-6 h-6 text-gray-800 animate-bounce hover:text-white transition-colors" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <Twitter className="w-6 h-6 text-white animate-bounce hover:text-black transition-colors" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <Instagram className="w-6 h-6 text-gray-800 animate-bounce hover:text-white transition-colors" />
        </a>
        {isLoggedIn && (
          <button type="button" title="Logout" className="p-1  rounded">
            <LogOut className="w-6 h-6 text-white hover:text-red-900 animate-bounce cursor-pointer " />
          </button>
        )}
      </div>
    </nav>
  );
}
