"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isLoggedIn , userData } = useAppSelector((state) => state.auth);

  console.log("this is islogged in navbar", isLoggedIn);
  console.log("this is userData in navbar", userData);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <div className="text-2xl font-bold text-indigo-600">BlogHub</div>
      <div className="space-x-6">
        {isLoggedIn ? (
          <>
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              // onClick={handleLogout} // implement logout if needed
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
