"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Types
interface BlogFormData {
  title: string;
  content: string;
  image_url: string | null;
}

interface SubmissionState {
  isSubmitting: boolean;
  message: string;
  type: "success" | "error" | "info" | "";
}

// Constants
const DEFAULT_IMAGES = [
  "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/backiee-74266-landscape_nqln5e.jpg",
  "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/168847-anime-anime_girl-anime_art-cartoon-anime_friends_brazil-3840x2160_f2qkzu.jpg",
  "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/anime-girl-and-dog-bound-by-loyalty-and-oath-8f-1920x1080_r9a0ue.jpg",
  "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/an-anime-girl-serene-fall-sh-1400x900_vvfgbx.jpg",
  "https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986604/IMAGE_b3xgnj.png",
] as const;

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateBlogPage() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth.userData);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    image_url: null,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isSubmitting: false,
    message: "",
    type: "",
  });

  // Keywords state
  const [keywords, setKeywords] = useState<string | null>(null);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [keywordTimeout, setKeywordTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Initialize user data
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // Validation functions
  const validateForm = useCallback((): string | null => {
    if (!formData.title.trim()) return "Title is required";
    if (formData.title.length > MAX_TITLE_LENGTH)
      return `Title must be less than ${MAX_TITLE_LENGTH} characters`;
    if (!formData.content.trim()) return "Content is required";
    if (formData.content.length > MAX_CONTENT_LENGTH)
      return `Content must be less than ${MAX_CONTENT_LENGTH} characters`;
    if (!userData) return "User authentication required";
    return null;
  }, [formData, userData]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) return "File size must be less than 5MB";
    if (!file.type.startsWith("image/"))
      return "Please select a valid image file";
    return null;
  };

  // Handlers
  const handleInputChange = (field: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmissionState((prev) => ({ ...prev, message: "", type: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      e.target.value = ""; // Reset file input
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Debounced keyword fetching
  const fetchKeywords = useCallback(async (title: string) => {
    if (!title.trim() || title.length < 3) {
      setKeywords(null);
      return;
    }

    setLoadingKeywords(true);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.post(`${BASE_URL}/chat`, {
        message: `get keywords for "${title}"`,
      });
      console.log(response)
      setKeywords(response.data.message);
    } catch (error) {
      console.error("Keyword fetch error:", error);
      // Don't show error toast for keywords as it's not critical
    } finally {
      setLoadingKeywords(false);
    }
  }, []);

  const handleTitleChange = (value: string) => {
    handleInputChange("title", value);

    // Clear existing timeout
    if (keywordTimeout) {
      clearTimeout(keywordTimeout);
    }

    // Set new timeout for debounced keyword fetching
    const timeout = setTimeout(() => {
      fetchKeywords(value);
    }, 1000);

    setKeywordTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (keywordTimeout) {
        clearTimeout(keywordTimeout);
      }
    };
  }, [keywordTimeout]);

  const uploadImageToBackend = async (): Promise<string | null> => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.post(`${BASE_URL}/upload_image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000, // 30 second timeout
      });

      return response.data.image_url;
    } catch (error) {
      console.error("Image upload failed:", error);

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          throw new Error("Upload timeout. Please try again.");
        } else if (error.response?.status === 413) {
          throw new Error("Image file is too large.");
        }
      }

      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const getRandomDefaultImage = (): string => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setSubmissionState({
        isSubmitting: false,
        message: validationError,
        type: "error",
      });
      toast.error(validationError);
      return;
    }

    setSubmissionState({
      isSubmitting: true,
      message: "Creating your blog...",
      type: "info",
    });

    try {
      let imageUrl: string;

      if (image) {
        const uploadedUrl = await uploadImageToBackend();
        if (!uploadedUrl) {
          throw new Error("Failed to upload image");
        }
        imageUrl = uploadedUrl;
      } else {
        imageUrl = getRandomDefaultImage();
      }

      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      await axios.post(
        `${BASE_URL}/createBlogs?user_id=${userData!.id}`,
        {
          title: formData.title.trim(),
          content: formData.content.trim(),
          image_url: imageUrl,
        },
        { timeout: 15000 } // 15 second timeout
      );

      setSubmissionState({
        isSubmitting: false,
        message: "Blog created successfully!",
        type: "success",
      });

      toast.success("Blog created successfully!");

      // Reset form
      setFormData({ title: "", content: "", image_url: null });
      setImage(null);
      setImagePreview(null);
      setKeywords(null);

      // Navigate to blog list
      setTimeout(() => {
        router.push("/myBlog");
      }, 1500);
    } catch (error) {
      console.error("Blog creation failed:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create blog. Please try again.";

      setSubmissionState({
        isSubmitting: false,
        message: errorMessage,
        type: "error",
      });

      toast.error(errorMessage);
    }
  };

  const handleBack = () => {
    if (formData.title || formData.content || image) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    router.back();
  };

  return (
    <div className="min-h-screen delius-swash-caps-mix bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 font-medium"
              aria-label="Go back"
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
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Blog
              </h1>
            </div>
            <div className="w-20" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Content Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  {/* Title Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Blog Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full text-2xl font-bold bg-transparent text-gray-900 border-0 border-b-2 border-gray-200 focus:border-indigo-500 outline-none py-3 px-0 placeholder-gray-400 transition-colors"
                      placeholder="Enter your blog title..."
                      maxLength={MAX_TITLE_LENGTH}
                      required
                      aria-describedby="title-help"
                    />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span id="title-help">
                        A compelling title helps readers find your content
                      </span>
                      <span>
                        {formData.title.length}/{MAX_TITLE_LENGTH}
                      </span>
                    </div>
                  </div>

                  {/* Keywords Section */}
                  {(loadingKeywords || keywords) && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                      {loadingKeywords ? (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                          Generating SEO keywords...
                        </div>
                      ) : (
                        keywords && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">
                              Suggested Keywords:
                            </span>
                            <p className="text-gray-600 mt-1">{keywords}</p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Content Input */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Blog Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      className="w-full h-80 text-lg bg-transparent text-gray-900 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none p-4 placeholder-gray-400 transition-colors resize-none"
                      placeholder="Start writing your story..."
                      maxLength={MAX_CONTENT_LENGTH}
                      required
                      aria-describedby="content-help"
                    />
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span id="content-help">
                        Share your thoughts, experiences, or expertise
                      </span>
                      <span>
                        {formData.content.length}/{MAX_CONTENT_LENGTH}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Featured Image
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 text-center">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          aria-label="Upload image"
                        />
                      </label>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                          aria-label="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {!imagePreview && (
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                        <p className="font-medium mb-1">No image selected</p>
                        <p>
                          A random default image will be used if none is
                          uploaded.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Publish
                  </h3>

                  {submissionState.message && (
                    <div
                      className={`p-3 rounded-lg mb-4 text-sm ${
                        submissionState.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : submissionState.type === "error"
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {submissionState.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submissionState.isSubmitting}
                    className={`w-full font-semibold py-3 cursor-pointer px-4 rounded-lg transition-all duration-200 ${
                      submissionState.isSubmitting
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gray-900 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    {submissionState.isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Publishing...
                      </div>
                    ) : (
                      "Publish Blog"
                    )}
                  </button>

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Your blog will be published immediately
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
