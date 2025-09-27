import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface FloatingPage {
  id: string
  x: number
  y: number
  rotation: number
  scale: number
  duration: number
  delay: number
  content: string
  color: string
}

const FloatingBookPages: React.FC = () => {
  const [pages, setPages] = useState<FloatingPage[]>([])

  const bookContent = [
    "Chapter 1: The Beginning",
    "Once upon a time...",
    "In a world of books...",
    "The story unfolds...",
    "Page 1",
    "Page 2", 
    "Page 3",
    "The End",
    "To be continued...",
    "The adventure begins...",
    "A tale of wonder...",
    "The magic of reading...",
    "Words come alive...",
    "The power of stories...",
    "Books are windows...",
    "Reading is dreaming...",
    "Knowledge is power...",
    "Books are friends...",
    "Stories never end...",
    "The journey continues..."
  ]

  const pageColors = [
    'rgba(139, 69, 19, 0.08)', // Brown
    'rgba(91, 33, 182, 0.06)', // Purple
    'rgba(75, 85, 99, 0.05)', // Gray
    'rgba(251, 191, 36, 0.07)', // Gold
    'rgba(239, 68, 68, 0.06)', // Red
    'rgba(34, 197, 94, 0.05)', // Green
    'rgba(59, 130, 246, 0.06)', // Blue
  ]

  useEffect(() => {
    const generatePages = () => {
      const newPages: FloatingPage[] = []
      
      for (let i = 0; i < 12; i++) {
        newPages.push({
          id: `page-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.8 + 0.4,
          duration: Math.random() * 25 + 20,
          delay: Math.random() * 10,
          content: bookContent[Math.floor(Math.random() * bookContent.length)],
          color: pageColors[Math.floor(Math.random() * pageColors.length)]
        })
      }
      
      setPages(newPages)
    }

    generatePages()
    
    // Regenerate pages every 45 seconds
    const interval = setInterval(generatePages, 45000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {pages.map((page) => (
        <motion.div
          key={page.id}
          className="absolute"
          style={{
            left: `${page.x}%`,
            top: `${page.y}%`,
            transform: `rotate(${page.rotation}deg) scale(${page.scale})`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            rotate: [page.rotation, page.rotation + 180, page.rotation + 360, page.rotation + 540],
            scale: [page.scale, page.scale * 1.2, page.scale * 0.8, page.scale],
            opacity: [0.1, 0.3, 0.1, 0.2, 0.1],
          }}
          transition={{
            duration: page.duration,
            delay: page.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-32 h-40 rounded-lg shadow-lg border-2 border-white/20 backdrop-blur-sm"
            style={{
              backgroundColor: page.color,
              background: `linear-gradient(135deg, ${page.color}, ${page.color}dd)`,
            }}
          >
            <div className="p-3 h-full flex flex-col justify-center items-center text-center">
              <div className="text-xs font-serif text-gray-600/60 leading-relaxed">
                {page.content}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingBookPages
