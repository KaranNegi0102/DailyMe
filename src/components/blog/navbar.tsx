"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Twitter, Youtube, Instagram } from "lucide-react";

export default function SimpleNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-br from-purple-50 via-purple-50 to-pink-50 p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        {/* Hamburger menu for mobile */}
        <button
          className="sm:hidden flex items-center text-gray-900 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <span className="text-3xl">&#10005;</span> // X icon
          ) : (
            <span className="text-3xl">&#9776;</span> // Hamburger icon
          )}
        </button>
        {/* Left: Navigation */}
        <div className="hidden sm:flex space-x-4 mt-4">
          <Link
            href="/myBlog"
            className="text-gray-600 hover:underline text-2xl  delius-swash-caps-regular hover:text-gray-900 transition-colors"
          >
            Your Blog&apos;s
          </Link>
          <Link
            href="/?manual=true"
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
        {/* Center: Website Name (hidden on mobile) */}
        <div className="hidden sm:flex text-4xl font-bold  delius-swash-caps-regular mt-4 text-gray-900 text-center mr-40 flex-1"></div>
        {/* Right: Social Media Icons */}
        <div className="hidden sm:flex space-x-4 text-2xl text-gray-600 mt-4">
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
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col space-y-4 animate-fade-in">
          <Link
            href="/myBlog"
            className="text-gray-600 hover:underline text-xl delius-swash-caps-regular hover:text-gray-900 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Your Blog&apos;s
          </Link>
          <Link
            href="/?manual=true"
            className="text-gray-600 hover:underline delius-swash-caps-regular hover:text-gray-900 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:underline delius-swash-caps-regular hover:text-gray-900 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/profile"
            className="text-gray-600 hover:underline delius-swash-caps-regular hover:text-gray-900 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <div className="flex space-x-4 text-xl text-gray-600 mt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
