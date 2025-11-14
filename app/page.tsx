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
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Platform Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent animate-pulse">
            CyberVanguard CTF Platform
          </h1>

          {/* Short Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-10 leading-relaxed px-4">
            Join the ultimate cybersecurity challenge platform! Test your skills in penetration testing, 
            cryptography, reverse engineering, and more. Compete with the best and prove your expertise.
          </p>

          {/* Active Event Section */}
          {!isLoading && activeEvent && (
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 md:p-8 mb-8 border-2 border-primary-500/50 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl md:text-3xl animate-bounce">🎯</span>
                <h2 className="text-xl md:text-2xl font-bold text-white">Active Event</h2>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-primary-400 mb-3">{activeEvent.name}</h3>
              {activeEvent.description && (
                <p className="text-gray-300 mb-6 text-sm md:text-base">{activeEvent.description}</p>
              )}
              <div className="mb-6">
                <CountdownTimer targetDate={activeEvent.end_date} />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link
                  href={`/events/${activeEvent.id}`}
                  className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold px-5 md:px-6 py-2.5 md:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  View Event
                </Link>
                <Link
                  href={`/events/${activeEvent.id}/play`}
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-5 md:px-6 py-2.5 md:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  Start Playing
                </Link>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center px-4">
            <Link
              href="/play"
              className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Play CTF Challenges
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center">
            Platform Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">General CTF Area</h3>
              <p className="text-gray-300 text-sm md:text-base">
                Play challenges from past events anytime. Filter by category, difficulty, and event type.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Live Events</h3>
              <p className="text-gray-300 text-sm md:text-base">
                Join active CTF events and compete in real-time. View event-specific scoreboards and rankings.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all duration-300 transform hover:scale-105 sm:col-span-2 lg:col-span-1">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-gray-300 text-sm md:text-base">
                Monitor your progress, view solved challenges, and compete on the global leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About CTF Section - Modern Design */}
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              About <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Capture The Flag</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Main Description Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 md:p-8 border border-primary-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚩</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">What is CTF?</h3>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                Capture The Flag (CTF) competitions are cybersecurity challenges where participants 
                solve security-related tasks to find hidden "flags" - strings of text that prove you've 
                completed a challenge.
              </p>
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                <p className="text-gray-400 text-xs mb-1">Flag Format</p>
                <code className="text-primary-400 font-mono text-sm md:text-base">cvctf{`{...}`}</code>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 md:p-8 border border-primary-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Why CTF?</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: '🎯', text: 'Hands-on practice with real-world security scenarios' },
                  { icon: '📚', text: 'Discover new techniques, tools, and methodologies' },
                  { icon: '🤝', text: 'Connect with like-minded cybersecurity enthusiasts' },
                  { icon: '🚀', text: 'Build a portfolio and demonstrate your capabilities' },
                  { icon: '🎮', text: 'Challenge yourself in an engaging, competitive environment' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <span className="text-gray-300 text-sm md:text-base">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-2xl p-6 md:p-8 border border-primary-500/30 text-center">
            <p className="text-gray-300 text-base md:text-lg mb-4">
              Whether you're a beginner looking to learn or an experienced professional seeking to 
              test your skills, this CTF platform offers challenges for all levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/play"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Start Playing Now
              </Link>
              <Link
                href="/register"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section - Modern Design */}
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Competition <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Rules</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4 text-sm md:text-base">
              Please read and follow these rules to ensure fair competition
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                number: '01',
                title: 'Fair Play',
                description: 'All participants must compete fairly. Sharing flags, solutions, or collaborating in unauthorized ways is strictly prohibited.',
                icon: '⚖️',
                color: 'from-blue-500/20 to-blue-600/20',
                borderColor: 'border-blue-500/50',
              },
              {
                number: '02',
                title: 'One Account Per Person',
                description: 'Each participant is allowed only one account. Multiple accounts will result in disqualification.',
                icon: '👤',
                color: 'from-green-500/20 to-green-600/20',
                borderColor: 'border-green-500/50',
              },
              {
                number: '03',
                title: 'Flag Format',
                description: 'Flags follow the format: cvctf{...}',
                icon: '🚩',
                color: 'from-yellow-500/20 to-yellow-600/20',
                borderColor: 'border-yellow-500/50',
              },
              {
                number: '04',
                title: 'No Brute Force Attacks',
                description: 'Do not attempt to brute force flags or attack the platform infrastructure. Focus on solving the challenges as intended.',
                icon: '🛡️',
                color: 'from-red-500/20 to-red-600/20',
                borderColor: 'border-red-500/50',
              },
              {
                number: '05',
                title: 'Respect the Platform',
                description: 'Any attempts to disrupt the platform, attack other participants, or engage in malicious activities will result in immediate disqualification.',
                icon: '🤝',
                color: 'from-purple-500/20 to-purple-600/20',
                borderColor: 'border-purple-500/50',
              },
            ].map((rule, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${rule.color} rounded-xl p-5 md:p-6 border-2 ${rule.borderColor} hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-900/50 rounded-lg flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform">
                      {rule.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary-400 font-bold text-lg md:text-xl">{rule.number}</span>
                      <h3 className="text-lg md:text-xl font-bold text-white">{rule.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-8 md:mt-12 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-6 md:p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-xl md:text-2xl font-bold text-yellow-400">Important Notice</h3>
            </div>
            <p className="text-gray-300 text-sm md:text-base">
              Violation of any rule may result in immediate disqualification and permanent ban from the platform.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
