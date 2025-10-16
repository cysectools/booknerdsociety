import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, BookMarked, PenTool, Quote, Star, Heart } from 'lucide-react'
import FloatingBookPages from './FloatingBookPages'
import FloatingLetters from './FloatingLetters'

interface FloatingElement {
  id: string
  type: 'letter' | 'book' | 'quote' | 'star' | 'heart'
  content: string
  x: number
  y: number
  size: number
  rotation: number
  duration: number
  delay: number
}

const AnimatedBackground: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([])

  // Book-related content for floating elements
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
      const newElements: FloatingElement[] = []
      
      // Generate floating letters
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: `letter-${i}`,
          type: 'letter',
          content: bookLetters[Math.floor(Math.random() * bookLetters.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          rotation: Math.random() * 360,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5
        })
      }

      // Generate floating book words
      for (let i = 0; i < 8; i++) {
        newElements.push({
          id: `word-${i}`,
          type: 'book',
          content: bookWords[Math.floor(Math.random() * bookWords.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 15 + 8,
          rotation: Math.random() * 360,
          duration: Math.random() * 25 + 20,
          delay: Math.random() * 8
        })
      }

      // Generate floating quotes
      for (let i = 0; i < 3; i++) {
        newElements.push({
          id: `quote-${i}`,
          type: 'quote',
          content: bookQuotes[Math.floor(Math.random() * bookQuotes.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 6,
          rotation: Math.random() * 360,
          duration: Math.random() * 30 + 25,
          delay: Math.random() * 10
        })
      }

      // Generate floating stars
      for (let i = 0; i < 12; i++) {
        newElements.push({
          id: `star-${i}`,
          type: 'star',
          content: '★',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          duration: Math.random() * 18 + 12,
          delay: Math.random() * 6
        })
      }

      // Generate floating hearts
      for (let i = 0; i < 6; i++) {
        newElements.push({
          id: `heart-${i}`,
          type: 'heart',
          content: '♥',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 6,
          rotation: Math.random() * 360,
          duration: Math.random() * 22 + 16,
          delay: Math.random() * 7
        })
      }

      setElements(newElements)
    }

    generateElements()
    
    // Regenerate elements every 60 seconds for variety
    const interval = setInterval(generateElements, 60000)
    return () => clearInterval(interval)
  }, [])

  const getElementStyle = (element: FloatingElement) => {
    // Dynamic styles that can't be converted to Tailwind classes
    return {
      left: `${element.x}%`,
      top: `${element.y}%`,
      fontSize: `${element.size}px`,
      transform: `rotate(${element.rotation}deg)`,
    }
  }

  const getElementClasses = (element: FloatingElement) => {
    const baseClasses = "absolute pointer-events-none select-none"
    
    switch (element.type) {
      case 'letter':
        return `${baseClasses} text-primary-600/10 font-bold font-serif`
      case 'book':
        return `${baseClasses} text-amber-800/8 font-bold font-serif`
      case 'quote':
        return `${baseClasses} text-gray-600/6 italic font-serif max-w-[200px] text-center`
      case 'star':
        return `${baseClasses} text-yellow-400/15`
      case 'heart':
        return `${baseClasses} text-red-500/12`
      default:
        return baseClasses
    }
  }

  const getAnimationVariants = (_element: FloatingElement) => ({
    initial: {
      opacity: 0,
      scale: 0.5,
      y: 100,
      x: -50,
    },
    animate: {
      opacity: [0, 0.3, 0.1, 0.3, 0],
      scale: [0.5, 1, 0.8, 1.2, 0.5],
      y: [100, -100, 50, -150, 200],
      x: [-50, 50, -30, 80, -100],
      rotate: [0, 180, 360, 540, 720],
    }
  })

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-primary-100/20" />
      
      {/* Floating book pages */}
      <FloatingBookPages />
      
      {/* Floating letters */}
      <FloatingLetters />
      
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
          {element.type === 'letter' && <span>{element.content}</span>}
          {element.type === 'book' && element.content}
          {element.type === 'quote' && element.content}
        </motion.div>
      ))}

      {/* Additional decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-6xl text-primary-200/10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BookOpen />
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/4 text-4xl text-primary-300/10"
        animate={{
          rotate: [360, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BookMarked />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/3 text-5xl text-primary-400/10"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <PenTool />
      </motion.div>
    </div>
  )
}

export default AnimatedBackground
