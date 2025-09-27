import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, BookMarked, PenTool, Quote, Star, Heart, Sparkles, Library } from 'lucide-react'

interface HomeElement {
  id: string
  type: 'letter' | 'book' | 'quote' | 'star' | 'heart' | 'sparkle' | 'library'
  content: string
  x: number
  y: number
  size: number
  rotation: number
  duration: number
  delay: number
}

const HomeAnimatedBackground: React.FC = () => {
  const [elements, setElements] = useState<HomeElement[]>([])

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
      const newElements: HomeElement[] = []
      
      // Generate floating letters
      for (let i = 0; i < 25; i++) {
        newElements.push({
          id: `letter-${i}`,
          type: 'letter',
          content: bookLetters[Math.floor(Math.random() * bookLetters.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 12,
          rotation: Math.random() * 360,
          duration: Math.random() * 18 + 12,
          delay: Math.random() * 6
        })
      }

      // Generate floating book words
      for (let i = 0; i < 12; i++) {
        newElements.push({
          id: `word-${i}`,
          type: 'book',
          content: bookWords[Math.floor(Math.random() * bookWords.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 16 + 10,
          rotation: Math.random() * 360,
          duration: Math.random() * 22 + 18,
          delay: Math.random() * 8
        })
      }

      // Generate floating quotes
      for (let i = 0; i < 5; i++) {
        newElements.push({
          id: `quote-${i}`,
          type: 'quote',
          content: bookQuotes[Math.floor(Math.random() * bookQuotes.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 8,
          rotation: Math.random() * 360,
          duration: Math.random() * 28 + 22,
          delay: Math.random() * 10
        })
      }

      // Generate floating stars
      for (let i = 0; i < 18; i++) {
        newElements.push({
          id: `star-${i}`,
          type: 'star',
          content: '★',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 6,
          rotation: Math.random() * 360,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * 5
        })
      }

      // Generate floating hearts
      for (let i = 0; i < 10; i++) {
        newElements.push({
          id: `heart-${i}`,
          type: 'heart',
          content: '♥',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 8,
          rotation: Math.random() * 360,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 7
        })
      }

      // Generate floating sparkles
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: `sparkle-${i}`,
          type: 'sparkle',
          content: '✨',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 5,
          rotation: Math.random() * 360,
          duration: Math.random() * 12 + 8,
          delay: Math.random() * 4
        })
      }

      // Generate floating library icons
      for (let i = 0; i < 6; i++) {
        newElements.push({
          id: `library-${i}`,
          type: 'library',
          content: '📚',
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 14 + 10,
          rotation: Math.random() * 360,
          duration: Math.random() * 25 + 20,
          delay: Math.random() * 9
        })
      }

      setElements(newElements)
    }

    generateElements()
    
    // Regenerate elements every 40 seconds for variety
    const interval = setInterval(generateElements, 40000)
    return () => clearInterval(interval)
  }, [])

  const getElementStyle = (element: HomeElement) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      fontSize: `${element.size}px`,
      transform: `rotate(${element.rotation}deg)`,
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
    }

    switch (element.type) {
      case 'letter':
        return {
          ...baseStyle,
          color: 'rgba(91, 33, 182, 0.03)',
          fontWeight: 'bold',
          fontFamily: 'serif',
        }
      case 'book':
        return {
          ...baseStyle,
          color: 'rgba(139, 69, 19, 0.02)',
          fontWeight: 'bold',
          fontFamily: 'serif',
        }
      case 'quote':
        return {
          ...baseStyle,
          color: 'rgba(75, 85, 99, 0.02)',
          fontStyle: 'italic',
          fontFamily: 'serif',
          maxWidth: '180px',
          textAlign: 'center' as const,
        }
      case 'star':
        return {
          ...baseStyle,
          color: 'rgba(251, 191, 36, 0.04)',
        }
      case 'heart':
        return {
          ...baseStyle,
          color: 'rgba(239, 68, 68, 0.03)',
        }
      case 'sparkle':
        return {
          ...baseStyle,
          color: 'rgba(59, 130, 246, 0.04)',
        }
      case 'library':
        return {
          ...baseStyle,
          color: 'rgba(34, 197, 94, 0.03)',
        }
      default:
        return baseStyle
    }
  }

  const getAnimationVariants = (_element: HomeElement) => ({
    initial: {
      opacity: 0,
      scale: 0.4,
      y: 80,
      x: -40,
    },
    animate: {
      opacity: [0, 0.4, 0.2, 0.3, 0],
      scale: [0.4, 1.1, 0.9, 1.3, 0.4],
      y: [80, -80, 40, -120, 160],
      x: [-40, 40, -25, 60, -80],
      rotate: [0, 180, 360, 540, 720],
    }
  })

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-primary-100/15" />
      
      {/* Floating elements */}
      {elements.map((element) => (
        <motion.div
          key={element.id}
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
          {element.type === 'library' && <Library className="w-full h-full" />}
          {element.type === 'letter' && <span>{element.content}</span>}
          {element.type === 'book' && element.content}
          {element.type === 'quote' && element.content}
        </motion.div>
      ))}

      {/* Decorative elements - much more subtle */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-5xl text-primary-200/2"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BookOpen />
      </motion.div>

      <motion.div
        className="absolute top-3/4 right-1/4 text-4xl text-primary-300/2"
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BookMarked />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/3 text-6xl text-primary-400/2"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <PenTool />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/2 text-4xl text-primary-500/1"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Library />
      </motion.div>
    </div>
  )
}

export default HomeAnimatedBackground
