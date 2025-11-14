'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Sponsor {
  id: number
  name: string
  logo_url: string
  website_url: string | null
}

export default function Footer() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    loadSponsors()
  }, [])

  const loadSponsors = async () => {
    try {
      const response = await fetch('/api/sponsors.php?action=list')
      const data = await response.json()
      setSponsors(data.sponsors || [])
    } catch (e) {
      console.error('Error loading sponsors:', e)
    }
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Sponsors Section */}
        {sponsors.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Our Sponsors
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="h-16 w-auto object-contain max-w-48"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Links Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/play" className="text-gray-400 hover:text-white transition-colors">
                  Play CTF
                </Link>
              </li>
              <li>
                <Link href="/scoreboard" className="text-gray-400 hover:text-white transition-colors">
                  Scoreboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Flag Format: cvctf{`{...}`}</span>
              </li>
              <li>
                <span className="text-gray-400">CyberVanguard CTF Platform</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Cyber Vanguard</span>
              </li>
              <li>
                <span className="text-gray-400">Cyber Club @AAU</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CyberVanguard CTF Platform. Built with ❤️ for the cybersecurity community.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Cyber Vanguard - Cyber Club @AAU
          </p>
        </div>
      </div>
    </footer>
  )
}

