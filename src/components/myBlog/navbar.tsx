import Link from "next/link";

export default function MyBlogNavbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-8 bg-[#f6ebeb] mb-8">
      {/* Left: Home and Blogs links */}
      <div className="flex gap-6">
        <Link href="/">
          <span className="text-lg font-semibold delius-swash-caps-regular hover:text-gray-900 text-gray-700 hover:underline cursor-pointer">
            Home
          </span>
        </Link>
        <Link href="/blogingPage">
          <span className="text-lg font-semibold delius-swash-caps-regular  hover:text-gray-900 text-gray-700 hover:underline cursor-pointer">
            Blogs
          </span>
        </Link>
      </div>
      {/* Center: DailyME heading */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-2xl font-bold delius-swash-caps-regular text-gray-900">
          DailyME
        </h1>
      </div>
      {/* Right: Profile button */}
      <div>
        <button className="bg-gray-200 hover:bg-gray-300 delius-swash-caps-regular text-gray-800 font-semibold py-2 px-5 rounded-full">
          Profile
        </button>
      </div>
    </nav>
  );
}
