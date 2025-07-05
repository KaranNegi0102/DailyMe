import React from 'react'
import Link from 'next/link'


export default function Navbar ()  {
  return (
    <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-indigo-600">BlogHub</div>
        <div className="space-x-6">
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
        </div>
      </nav>
  )
}
