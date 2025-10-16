import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, BookMarked, PenTool, Quote, Star, Heart, Sparkles } from 'lucide-react'

interface SplashElement {
  id: string
  type: 'letter' | 'book' | 'quote' | 'star' | 'heart' | 'sparkle'
  content: string
  x: number
  y: number
  size: number
  rotation: number
  duration: number
  delay: number
}

const SplashAnimatedBackground: React.FC = () => {
  const [elements, setElements] = useState<SplashElement[]>([])

  const bookLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  const bookWords = ['READ', 'BOOK', 'STORY', 'PAGE', 'TALE', 'NOVEL', 'POEM', 'PROSE', 'VERSE', 'LORE', 'MYTH', 'EPIC', 'SONG', 'RHYME', 'DREAM', 'MAGIC', 'WISDOM', 'KNOWLEDGE', 'ADVENTURE', 'MYSTERY', 'ROMANCE', 'FANTASY', 'SCIENCE', 'HISTORY', 'PHILOSOPHY', 'LITERATURE']
  const bookQuotes = [
    '"A room without books is like a body without a soul."',
    '"The more that you read, the more things you will know."',
    '"There is no friend as loyal as a book."',
    '"Books are a uniquely portable magic."',
    '"Reading is to the mind what exercise is to the body."',
    '"A book is a dream that you hold in your hand."',
    '"The world is a book and those who do not travel read only one page."',
    '"Books are the quietest and most constant of friends."',
    '"Reading gives us someplace to go when we have to stay where we are."',
    '"A book is a gift you can open again and again."'
  ]

  useEffect(() => {
    const generateElements = () => {
      const newElements: SplashElement[] = []
      
      // Generate floating letters
      for (let i = 0; i < 20; i++) {
        newElements.push({
          id: `letter-${i}`,
          type: 'letter',
          content: bookLetters[Math.floor(Math.random() * bookLetters.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 25 + 15,
          rotation: Math.random() * 360,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * 3
        })
      }

      // Generate floating book words
      for (let i = 0; i < 10; i++) {
        newElements.push({
          id: `word-${i}`,
          type: 'book',
          content: bookWords[Math.floor(Math.random() * bookWords.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 18 + 12,
          rotation: Math.random() * 360,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5
        })
      }

      // Generate floating quotes
      for (let i = 0; i < 4; i++) {
        newElements.push({
          id: `quote-${i}`,
          type: 'quote',
          content: bookQuotes[Math.floor(Math.random() * bookQuotes.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 14 + 8,
          rotation: Math.random() * 360,
          duration: Math.random() * 25 + 20,
          delay: Math.random() * 8
        })
      }

      // Generate floating stars
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: `star-${i}`,
          type: 'star',
          content: '★',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 8,
          rotation: Math.random() * 360,
          duration: Math.random() * 12 + 8,
          delay: Math.random() * 4
        })
      }

      // Generate floating hearts
      for (let i = 0; i < 8; i++) {
        newElements.push({
          id: `heart-${i}`,
          type: 'heart',
          content: '♥',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 15 + 10,
          rotation: Math.random() * 360,
          duration: Math.random() * 18 + 12,
          delay: Math.random() * 6
        })
      }

      // Generate floating sparkles
      for (let i = 0; i < 12; i++) {
        newElements.push({
          id: `sparkle-${i}`,
          type: 'sparkle',
          content: '✨',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 6,
          rotation: Math.random() * 360,
          duration: Math.random() * 10 + 6,
          delay: Math.random() * 2
        })
      }

      setElements(newElements)
    }

    generateElements()
    
    // Regenerate elements every 30 seconds for variety
    const interval = setInterval(generateElements, 30000)
    return () => clearInterval(interval)
  }, [])

  const getElementStyle = (element: SplashElement) => {
    // Dynamic styles that can't be converted to Tailwind classes
    return {
      left: `${element.x}%`,
      top: `${element.y}%`,
      fontSize: `${element.size}px`,
      transform: `rotate(${element.rotation}deg)`,
    }
  }

  const getElementClasses = (element: SplashElement) => {
    const baseClasses = "absolute pointer-events-none select-none"
    
    switch (element.type) {
      case 'letter':
        return `${baseClasses} text-primary-600/15 font-bold font-serif`
      case 'book':
        return `${baseClasses} text-amber-800/12 font-bold font-serif`
      case 'quote':
        return `${baseClasses} text-gray-600/8 italic font-serif max-w-[200px] text-center`
      case 'star':
        return `${baseClasses} text-yellow-400/20`
      case 'heart':
        return `${baseClasses} text-red-500/15`
      case 'sparkle':
        return `${baseClasses} text-blue-500/18`
      default:
        return baseClasses
    }
  }

  const getAnimationVariants = (_element: SplashElement) => ({
    initial: {
      opacity: 0,
      scale: 0.3,
      y: 100,
      x: -50,
    },
    animate: {
      opacity: [0, 0.6, 0.3, 0.5, 0],
      scale: [0.3, 1.2, 0.8, 1.4, 0.3],
      y: [100, -100, 50, -150, 200],
      x: [-50, 50, -30, 80, -100],
      rotate: [0, 180, 360, 540, 720],
    }
  })

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Enhanced gradient overlay for splash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-primary-100/30" />
      
      {/* Floating elements */}
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={getElementClasses(element)}
          style={getElementStyle(element)}
          variants={getAnimationVariants(element)}
          initial="initial"
          animate="animate"
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {element.type === 'star' && <Star className="w-full h-full" />}
          {element.type === 'heart' && <Heart className="w-full h-full" />}
          {element.type === 'book' && <BookOpen className="w-full h-full" />}
          {element.type === 'quote' && <Quote className="w-full h-full" />}
          {element.type === 'sparkle' && <Sparkles className="w-full h-full" />}
          {element.type === 'letter' && <span>{element.content}</span>}
          {element.type === 'book' && element.content}
          {element.type === 'quote' && element.content}
        </motion.div>
      ))}

      {/* Enhanced decorative elements for splash */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-8xl text-primary-200/15"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BookOpen />
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/4 text-6xl text-primary-300/15"
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BookMarked />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/3 text-7xl text-primary-400/15"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <PenTool />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/2 text-5xl text-primary-500/12"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Sparkles />
      </motion.div>
    </div>
  )
}

export default SplashAnimatedBackground
