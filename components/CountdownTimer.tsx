'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string // ISO date string or placeholder
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // If targetDate is a placeholder, show a default countdown
    const target = targetDate && targetDate !== 'PLACEHOLDER_DATE' 
      ? new Date(targetDate).getTime()
      : new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // Default: 30 days from now

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = target - now

      if (distance < 0) {
        setIsExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
      } else {
        setIsExpired(false)
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-red-500">CTF has started!</p>
      </div>
    )
  }

  return (
    <div className="flex gap-4 justify-center items-center">
      <div className="text-center bg-gray-800 rounded-lg p-4 min-w-[80px]">
        <div className="text-3xl font-bold text-primary-400">{timeLeft.days}</div>
        <div className="text-sm text-gray-400">Days</div>
      </div>
      <div className="text-center bg-gray-800 rounded-lg p-4 min-w-[80px]">
        <div className="text-3xl font-bold text-primary-400">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-sm text-gray-400">Hours</div>
      </div>
      <div className="text-center bg-gray-800 rounded-lg p-4 min-w-[80px]">
        <div className="text-3xl font-bold text-primary-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-sm text-gray-400">Minutes</div>
      </div>
      <div className="text-center bg-gray-800 rounded-lg p-4 min-w-[80px]">
        <div className="text-3xl font-bold text-primary-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-sm text-gray-400">Seconds</div>
      </div>
    </div>
  )
}

