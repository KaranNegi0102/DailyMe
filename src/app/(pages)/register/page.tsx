"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

interface RegisterForm {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    console.log(data);

    try {
      const response = await axios.post("http://127.0.0.1:8000/register", data);
      console.log(response);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg text-black shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <div className="mt-1 text-red-500 text-sm">
              {errors.username.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <div className="mt-1 text-red-500 text-sm">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <div className="mt-1 text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="number">
            Phone Number
          </label>
          <input
            id="number"
            type="tel"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: "Invalid phone number",
              },
            })}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <div className="mt-1 text-red-500 text-sm">
              {errors.phone.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
