import React from "react";
import Link from "next/link";

const Footer = () => (
  <footer className="w-full bg-[#efb9b9]  text-black py-6 delius-swash-caps-regular mt-12">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
      <div className="text-center md:text-left mb-2 md:mb-0">
        &copy; {new Date().getFullYear()} BlogVerse. All rights reserved.
      </div>
      <div className="flex justify-center gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Contact
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
