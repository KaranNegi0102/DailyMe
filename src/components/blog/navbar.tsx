"use client";
import React from "react";
import Link from "next/link";
import { Twitter, Youtube, Instagram } from "lucide-react";




export default function SimpleNavbar() {

  return (
    <nav className="flex justify-between bg-gradient-to-br from-purple-50 via-purple-50 to-pink-50 items-center p-4 max-w-7xl">
      {/* Left: Navigation */}
      <div className="flex space-x-4 mt-4  ">
        <Link
          href="/myBlog"
          className="text-gray-600 hover:underline text-2xl  delius-swash-caps-regular hover:text-gray-900 transition-colors"
        >
          Your Blog&apos;s </Link>
        <Link
          href="/"
          className="text-gray-600 hover:underline  delius-swash-caps-regular hover:text-gray-900 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-gray-600 hover:underline  delius-swash-caps-regular hover:text-gray-900 transition-colors"
        >
          About
        </Link>
        
        <Link
          href="/profile"
          className="text-gray-600 hover:underline  delius-swash-caps-regular r hover:text-gray-900 transition-colors"
        >
          Profile
        </Link>
      </div>
      {/* Center: Website Name */}
      <div className="text-4xl font-bold  delius-swash-caps-regular mt-4 text-gray-900   text-center  mr-40 flex-1">
        
      </div>
      {/* Right: Social Media Icons */}
      <div className="flex space-x-4 text-2xl text-gray-600 mt-4 ">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <Twitter size={24} />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <Youtube size={24} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <Instagram size={24} />
        </a>
      </div>
    </nav>
  );
}
