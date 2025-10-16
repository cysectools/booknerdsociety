import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface FloatingLetter {
  id: string
  letter: string
  x: number
  y: number
  size: number
  rotation: number
  duration: number
  delay: number
  colorClass: string
}

const FloatingLetters: React.FC = () => {
  const [letters, setLetters] = useState<FloatingLetter[]>([])

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const bookWords = ['READ', 'BOOK', 'STORY', 'PAGE', 'TALE', 'NOVEL', 'POEM', 'PROSE', 'VERSE', 'LORE', 'MYTH', 'EPIC', 'SONG', 'RHYME', 'DREAM', 'MAGIC', 'WISDOM', 'KNOWLEDGE', 'ADVENTURE', 'MYSTERY', 'ROMANCE', 'FANTASY', 'SCIENCE', 'HISTORY', 'PHILOSOPHY', 'LITERATURE']

  const letterColorClasses = [
    'text-primary-600/12', // Purple
    'text-amber-800/10', // Brown
    'text-gray-600/8', // Gray
    'text-yellow-400/11', // Gold
    'text-red-500/9', // Red
    'text-green-500/8', // Green
    'text-blue-500/10', // Blue
  ]

  useEffect(() => {
    const generateLetters = () => {
      const newLetters: FloatingLetter[] = []
      
      // Generate individual letters
      for (let i = 0; i < 20; i++) {
        newLetters.push({
          id: `letter-${i}`,
          letter: alphabet[Math.floor(Math.random() * alphabet.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 20,
          rotation: Math.random() * 360,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 8,
          colorClass: letterColorClasses[Math.floor(Math.random() * letterColorClasses.length)]
        })
      }

      // Generate word letters
      for (let i = 0; i < 5; i++) {
        const word = bookWords[Math.floor(Math.random() * bookWords.length)]
        for (let j = 0; j < word.length; j++) {
          newLetters.push({
            id: `word-${i}-${j}`,
            letter: word[j],
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 25 + 15,
            rotation: Math.random() * 360,
            duration: Math.random() * 25 + 20,
            delay: Math.random() * 10,
            colorClass: letterColorClasses[Math.floor(Math.random() * letterColorClasses.length)]
          })
        }
      }
      
      setLetters(newLetters)
    }

    generateLetters()
    
    // Regenerate letters every 50 seconds
    const interval = setInterval(generateLetters, 50000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {letters.map((letter) => (
        <motion.div
          key={letter.id}
          className={`absolute font-serif font-bold select-none ${letter.colorClass}`}
          style={{
            left: `${letter.x}%`,
            top: `${letter.y}%`,
            fontSize: `${letter.size}px`,
            transform: `rotate(${letter.rotation}deg)`,
          }}
          animate={{
            x: [0, Math.random() * 300 - 150, Math.random() * 300 - 150, 0],
            y: [0, Math.random() * 300 - 150, Math.random() * 300 - 150, 0],
            rotate: [letter.rotation, letter.rotation + 180, letter.rotation + 360, letter.rotation + 540],
            scale: [1, 1.3, 0.7, 1.1, 1],
            opacity: [0.1, 0.4, 0.2, 0.3, 0.1],
          }}
          transition={{
            duration: letter.duration,
            delay: letter.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {letter.letter}
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingLetters
