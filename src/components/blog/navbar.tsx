"use client";
import React from "react";
import Link from "next/link";
import { Twitter, Youtube, Instagram } from "lucide-react";

export default function SimpleNavbar() {
  return (
    <nav className="flex justify-between items-center p-4 max-w-7xl">
      {/* Left: Navigation */}
      <div className="flex space-x-4">
        <Link
          href="/blog"
          className="text-gray-600 hover:underline  hover:text-indigo-600 transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/about"
          className="text-gray-600 hover:underline  hover:text-indigo-600 transition-colors"
        >
          About
        </Link>
        <Link
          href="/gallery"
          className="text-gray-600 hover:underline  hover:text-indigo-600 transition-colors"
        >
          Gallery
        </Link>
        <Link
          href="/contact"
          className="text-gray-600 hover:underline  hover:text-indigo-600 transition-colors"
        >
          Contact
        </Link>
      </div>
      {/* Center: Website Name */}
      <div className="text-2xl font-bold playfair-display text-[#e08c8c] text-center  mr-32 flex-1">
        BlogHub
      </div>
      {/* Right: Social Media Icons */}
      <div className="flex space-x-4 text-2xl text-gray-600">
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
