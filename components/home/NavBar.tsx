"use client";
import { useState } from "react";
import Link from "next/link";
import HamburgerMenu from "./general/Hamburger";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <Link href="/" className="text-xl font-bold tracking-tight text-black">
          MicroSaaS
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block px-4 py-1.5 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800"
          >
            Log in
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <HamburgerMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
