"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./../components/navbar";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { fetchUserData } from "@/app/redux/slices/authSlice";
import Footer from "@/components/footer";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";


function HomePageWithSuspense() {
  const dispatch = useAppDispatch();
  const { userData, isLoggedIn } = useAppSelector((state) => state.auth);
  // console.log("yeh token check krha hu ",token)
  const router = useRouter();
  const searchParams = useSearchParams();
  const [manualVisit, setManualVisit] = useState(false);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

// 1. Detect ?manual=true in URL and store in localStorage
useEffect(() => {
  if (typeof window !== "undefined") {
    const isManual = searchParams.get("manual") === "true";

    if (isManual) {
      localStorage.setItem("manualVisit", "true");
      setManualVisit(true);

      // Remove ?manual=true from URL for clean look
      const url = new URL(window.location.href);
      url.searchParams.delete("manual");
      window.history.replaceState({}, "", url.pathname);
    } else {
      const saved = localStorage.getItem("manualVisit") === "true";
      setManualVisit(saved);
    }
  }
}, [searchParams]);

useEffect(() => {
  if (typeof window !== "undefined") {
    console.log("this is manula visit flag",manualVisit)
    if (!manualVisit && isLoggedIn && userData) {
      router.push("/blogingPage");
    }
    else{
      router.push("/");
    }
  }
}, [manualVisit, isLoggedIn, userData, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header Text */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block ">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-700 bg-clip-text  delius-swash-caps-regular leading-tight">
                DailyMe
              </h1>
              <div className="h-1 w-full bg-gray-900 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 mt-6 max-w-2xl animate-pulse mx-auto delius-swash-caps-mix">
              Where Every Thought Deserves a Page
            </p>
            <p className="text-lg text-gray-600 mt-4 max-w-xl delius-swash-caps-mix mx-auto">
              Join thousands of writers sharing their stories, insights, and
              creativity in our vibrant blogging community.
            </p>
          </div>

          {/* Hero Image Section */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-red-400  rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

              {/* Main image container */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-2 shadow-2xl">
                <Image
                  src="https://res.cloudinary.com/dyia5zkkd/image/upload/v1751986603/anime-girl-and-dog-bound-by-loyalty-and-oath-8f-1920x1080_r9a0ue.jpg"
                  alt="Blogging Inspiration"
                  width={1200}
                  height={600}
                  className="w-full h-96 md:h-[500px] object-cover rounded-2xl"
                />

                {/* Overlay with CTA */}
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
                  <div className="text-center transform hover:scale-105 transition-transform duration-300">
                    {isLoggedIn ? (
                      <a
                        href="/blogingPage"
                        className="group relative inline-flex  items-center justify-center hover:bg-gray-900 px-8 py-4 text-lg font-semibold text-white  rounded-full shadow-lg hover:shadow-xl transition-all duration-300 delius-swash-caps-regular"
                      >
                        <span className="relative z-10">
                          Let&apos;s Explore
                        </span>
                        <div className="absolute inset-0 border-white border-2 bg-gray-900 text-white sm:bg-transparent sm:text-white hover:bg-gray-900 rounded-full  group-hover:opacity-100 transition-opacity duration-300"></div>
                      </a>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <a
                          href="/register"
                          className="group relative inline-flex items-center animate-float justify-center px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 delius-swash-caps-regular bg-gray-900 text-white sm:bg-transparent sm:text-white hover:bg-gray-900"
                        >
                          <span className="relative z-10">Get Started</span>
                          <div className="absolute inset-0 border-white border-2 hover:bg-gray-900 rounded-full  group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                        <a
                          href="/login"
                          className="group relative inline-flex items-center animate-float justify-center px-8 py-4 border-white border-2 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 delius-swash-caps-regular bg-gray-900 text-white sm:bg-transparent sm:text-white hover:bg-gray-900"
                        >
                          Login
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-block bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 delius-swash-caps-regular">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-600 mb-6 max-w-md delius-swash-caps-regular mx-auto">
                Join thousands of writers who have already discovered the power
                of sharing their stories.
              </p>
              {!isLoggedIn && (
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gray-900 hover:bg-[#593636] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 delius-swash-caps-regular"
                >
                  Start Writing Today
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-300 rounded-md opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-float"></div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(255, 255, 255, 0.3) 1px,
            transparent 0
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomePageWithSuspense />
    </Suspense>
  );
}
