'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const admin = localStorage.getItem('ctf_admin')
    setIsAdmin(!!admin)
  }, [])

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Logo Image Container */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              {/* Placeholder for logo - replace with actual logo */}
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl">
                CV
              </div>
              {/* Uncomment below and add your logo image */}
              {/* <Image
                src="/logo.png"
                alt="CyberVanguard Logo"
                fill
                className="object-contain"
                priority
              /> */}
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent leading-tight">
                CVCTF
              </span>
              <span className="text-gray-400 text-xs md:text-sm hidden sm:inline leading-tight">
                CyberVanguard CTF
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors px-2 py-1"
            >
              Home
            </Link>
            <Link
              href="/play"
              className="text-gray-300 hover:text-white transition-colors px-2 py-1"
            >
              Play CTF
            </Link>
            <Link
              href="/scoreboard"
              className="text-gray-300 hover:text-white transition-colors px-2 py-1"
            >
              Scoreboard
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-300 hover:text-white transition-colors px-2 py-1"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Login
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                Home
              </Link>
              <Link
                href="/play"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                Play CTF
              </Link>
              <Link
                href="/scoreboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                Scoreboard
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-white transition-colors px-2 py-2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-white transition-colors px-2 py-2"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg transition-colors text-center mt-2"
                >
                  Login
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg transition-colors text-center"
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
