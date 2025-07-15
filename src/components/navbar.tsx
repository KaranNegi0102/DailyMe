"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import { Facebook, Twitter, Instagram, LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Suspense } from "react";

function NavbarWithSuspense() {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  // console.log("this is islogged in navbar", isLoggedIn);
  // console.log("this is userData in navbar", userData);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  async function handleLogout() {
    try {
      const response = await axios.get(`/api/auth/logOut`);
      toast.success("Log Out Successful");
      console.log(response.data.message);
      localStorage.removeItem("manualVisit");
      window.location.reload();
    } catch (error) {
      toast.error("Log Out Not Successful");
      console.log(error);
    }
  }

  return (
    <nav className="bg-[#efb9b9] p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {/* Left side navigation */}
        <div className="flex items-center delius-swash-caps-regular ml-0 sm:ml-30 space-x-3 sm:space-x-6">
          <Link
            href="/?manual=true"
            className="text-white text-base sm:text-3xl  animate-bounce hover:text-gray-800 hover:underline transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-800 text-base sm:text-2xl lg:text-xl animate-bounce hover:text-white hover:underline transition-colors"
          >
            About
          </Link>
          <Link
            href="/blogingPage"
            className="text-white text-base sm:text-2xl lg:text-xl animate-bounce hover:text-gray-900 hover:underline transition-colors"
          >
            Blogs
          </Link>
          <Link
            href="/contact"
            className="text-gray-800 text-base sm:text-2xl lg:text-xl animate-bounce hover:text-white hover:underline transition-colors"
          >
            Contact
          </Link>
        </div>
        {/* Right side social icons */}
        <div className="flex items-center mr-0 sm:mr-30 space-x-2 sm:space-x-4 mt-2 sm:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hidden sm:inline"
          >
            <Facebook className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800 animate-bounce hover:text-white transition-colors" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hidden sm:inline"
          >
            <Twitter className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-bounce hover:text-black transition-colors" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden sm:inline"
          >
            <Instagram className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800 animate-bounce hover:text-white transition-colors" />
          </a>
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="p-1 rounded"
            >
              <LogOut className="w-4 h-4 sm:w-6 sm:h-6 text-white hover:text-red-900 animate-bounce cursor-pointer " />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarWithSuspense />
    </Suspense>
  );
}
