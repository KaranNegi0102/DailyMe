"use client";
import { useForm } from "react-hook-form";
import axios from "axios";

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      
      const response = await axios.post("http://127.0.0.1:8000/login", data);
      console.log(response);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {errors.root && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {errors.root.message}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username", { required: "Username is required" })}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <div className="mt-1 text-red-500 text-sm">
              {errors.username.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <div className="mt-1 text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
