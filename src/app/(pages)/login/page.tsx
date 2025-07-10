"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  axios.defaults.withCredentials = true;

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.post(`${BASE_URL}/login`, data);
      console.log(response);
      router.push("/blogingPage");
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10 relative "
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/anime-girl-and-dog-bound-by-loyalty-and-oath-8f-1920x1080_r9a0ue.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0   z-0" />
      <div className="max-w-md w-full bg-white/70 backdrop-blur-sm border border-gray-200 shadow-xl rounded-3xl p-8 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 delius-swash-caps-regular mb-2">
            DailyME
          </h1>
          <p className="text-gray-600 delius-swash-caps-mix">
            Welcome back, writer!
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 text-gray-700 delius-swash-caps-regular"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center cursor-pointer space-x-2">
              <input
                type="checkbox"
                className="text-indigo-600 cursor-pointer border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 cursor-pointer hover:bg-gray-800 text-white font-semibold py-3 rounded-full shadow hover:shadow-lg transition-all duration-200 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center  text-sm delius-swash-caps-regular text-gray-600">
          New to DailyME?{" "}
          <Link
            href="/register"
            className="text-gray-900 delius-swash-caps-regular font-medium hover:underline"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-4 text-center text-xs delius-swash-caps-regular text-gray-600">
          By signing in, you agree to our{" "}
          <Link
            href="#"
            className="text-gray-900 delius-swash-caps-regular hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-gray-900 delius-swash-caps-regular hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
