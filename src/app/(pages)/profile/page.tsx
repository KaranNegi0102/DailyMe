"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, userData } = useAppSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
    }
  }, [userData]);

  const handleEdit = () => {
    setEditMode(true);
    setErrors({});
  };

  const handleCancel = () => {
    setEditMode(false);
    if (userData) {
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
    }
    setErrors({});
  };

  const validate = () => {
    const newErrors: { username?: string; email?: string; phone?: string } = {};
    if (!username || username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      newErrors.email = "Invalid email address";
    if (!phone || !/^[\+]?[1-9][\d]{0,15}$/.test(phone))
      newErrors.phone = "Invalid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!userData) return;
    if (!validate()) return;
    setIsSaving(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      await axios.put(
        `${BASE_URL}/update-profile?user_id=${userData.id}`,
        { username, email, phone },
        { withCredentials: true }
      );
      toast.success("Profile Updated Successfully")
      setEditMode(false);
      dispatch(fetchUserData());
    } catch (error) {
      toast.error("Profile Update Not Successful")
      console.error("Update failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  async function handleLogout() {
    try {
      const response = await axios.get(
        `/api/auth/logOut`,
      );
      toast.success("Log Out Successful")
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      toast.error("Log Out Not Successful");
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 px-4 py-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="fixed top-6 left-6 flex cursor-pointer items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow delius-swash-caps-regular transition-colors duration-200 z-50"
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
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl p-10 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-4xl font-bold text-indigo-700 shadow-md mb-4">
            {userData?.username ? userData.username[0].toUpperCase() : "?"}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 delius-swash-caps-regular mb-1">
            {userData?.username || "User"}
          </h2>
          <p className="text-gray-500 text-sm">Profile Overview</p>
        </div>
        <hr className="mb-6 border-gray-200" />
        {isLoggedIn && userData ? (
          <div className="space-y-5 text-gray-700">
            {/* Username */}
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                Username
              </span>
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-base"
                  />
                  {errors.username && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </>
              ) : (
                <span className="font-medium text-base">
                  {userData.username || "-"}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                Email
              </span>
              {editMode ? (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-base"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </>
              ) : (
                <span className="font-medium text-base">
                  {userData.email || "-"}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                Phone
              </span>
              {editMode ? (
                <>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-base"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                </>
              ) : (
                <span className="font-medium text-base">
                  {userData.phone || "-"}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {editMode ? (
                <>
                  <button
                    className="w-1/2 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow"
                    onClick={handleSave}
                    type="button"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="w-1/2 bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition-all duration-200 shadow"
                    onClick={handleCancel}
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-1/2 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow"
                    onClick={handleEdit}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="w-1/2 bg-gray-900 cursor-pointer hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow"
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg py-8">
            Please log in to view your profile.
          </div>
        )}
      </div>
    </div>
  );
}
