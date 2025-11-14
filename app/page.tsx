'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CountdownTimer from '@/components/CountdownTimer'

interface Event {
  id: number
  name: string
  description: string
  banner_url: string | null
  start_date: string
  end_date: string
  status: string
}

export default function Home() {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadActiveEvent()
  }, [])

  const loadActiveEvent = async () => {
    try {
      const response = await fetch('/api/events.php?action=active')
      const data = await response.json()
      setActiveEvent(data.event)
    } catch (e) {
      console.error('Error loading active event:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Platform Name */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            CyberVanguard CTF Platform
          </h1>

          {/* Short Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Join the ultimate cybersecurity challenge platform! Test your skills in penetration testing, 
            cryptography, reverse engineering, and more. Compete with the best and prove your expertise.
          </p>

          {/* Active Event Section */}
          {!isLoading && activeEvent && (
            <div className="bg-gray-800/50 rounded-lg p-8 mb-8 border border-primary-500/50">
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Active Event</h2>
              <h3 className="text-xl font-semibold text-primary-400 mb-2">{activeEvent.name}</h3>
              {activeEvent.description && (
                <p className="text-gray-300 mb-4">{activeEvent.description}</p>
              )}
              <div className="mb-4">
                <CountdownTimer targetDate={activeEvent.end_date} />
              </div>
              <Link
                href={`/events/${activeEvent.id}`}
                className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Join Event
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/play"
              className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Play CTF Challenges
            </Link>
            <Link
              href="/login"
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Login / Register
            </Link>
          </div>
        </div>
      </section>

      {/* Detailed Description Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            About Capture The Flag (CTF)
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Capture The Flag (CTF) competitions are cybersecurity challenges where participants 
              solve security-related tasks to find hidden "flags" - strings of text that prove you've 
              completed a challenge. Our platform uses the flag format: <code className="bg-gray-700 px-2 py-1 rounded">cvctf{`{...}`}</code>
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              CTF competitions are invaluable for:
            </p>
            <ul className="list-disc list-inside text-gray-300 text-lg space-y-2 mb-4 ml-4">
              <li><strong className="text-primary-400">Skill Development:</strong> Hands-on practice with real-world security scenarios</li>
              <li><strong className="text-primary-400">Learning:</strong> Discover new techniques, tools, and methodologies</li>
              <li><strong className="text-primary-400">Networking:</strong> Connect with like-minded cybersecurity enthusiasts</li>
              <li><strong className="text-primary-400">Career Growth:</strong> Build a portfolio and demonstrate your capabilities</li>
              <li><strong className="text-primary-400">Fun & Competition:</strong> Challenge yourself in an engaging, competitive environment</li>
            </ul>
            <p className="text-gray-300 text-lg leading-relaxed">
              Whether you're a beginner looking to learn or an experienced professional seeking to 
              test your skills, this CTF platform offers challenges for all levels. Play past challenges 
              anytime or join active events to compete in real-time!
            </p>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Competition Rules
          </h2>
          <div className="bg-gray-800/50 rounded-lg p-8 space-y-4">
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-xl font-semibold text-white mb-2">1. Fair Play</h3>
              <p className="text-gray-300">
                All participants must compete fairly. Sharing flags, solutions, or collaborating 
                in unauthorized ways is strictly prohibited.
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-xl font-semibold text-white mb-2">2. One Account Per Person</h3>
              <p className="text-gray-300">
                Each participant is allowed only one account. Multiple accounts will result in 
                disqualification.
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-xl font-semibold text-white mb-2">3. Flag Format</h3>
              <p className="text-gray-300">
                Flags follow the format: <code className="bg-gray-700 px-2 py-1 rounded">cvctf{`{...}`}</code>
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-xl font-semibold text-white mb-2">4. No Brute Force Attacks</h3>
              <p className="text-gray-300">
                Do not attempt to brute force flags or attack the platform infrastructure. 
                Focus on solving the challenges as intended.
              </p>
            </div>
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-xl font-semibold text-white mb-2">5. Respect the Platform</h3>
              <p className="text-gray-300">
                Any attempts to disrupt the platform, attack other participants, or engage in 
                malicious activities will result in immediate disqualification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Our Sponsors
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* Sponsors will be loaded from API */}
            <div className="bg-gray-700 rounded-lg p-8 w-48 h-32 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Sponsor Logo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700">
        <div className="text-center text-gray-400">
          <p>© 2025 CyberVanguard CTF Platform. Built with ❤️ for the cybersecurity community.</p>
          <p className="mt-2 text-sm">
            Cyber Vanguard - Cyber Club @AAU
          </p>
        </div>
      </footer>
    </main>
  )
}
