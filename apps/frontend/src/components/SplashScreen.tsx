import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Star, Sparkles } from 'lucide-react'
import SplashAnimatedBackground from './SplashAnimatedBackground'

interface SplashScreenProps {
  isVisible: boolean
}

export default function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 relative"
        >
          <SplashAnimatedBackground />
          {/* Background Book Pages */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ x: '-100%', rotateY: -90 }}
              animate={{ x: '0%', rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-primary-200 to-primary-300"
              style={{ transformOrigin: 'right center' }}
            />
            <motion.div
              initial={{ x: '100%', rotateY: 90 }}
              animate={{ x: '0%', rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-200 to-primary-300"
              style={{ transformOrigin: 'left center' }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Book Icon with Opening Animation */}
            <motion.div
              initial={{ scale: 0.5, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.div
                animate={{ 
                  rotateY: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="relative"
              >
                <BookOpen className="h-24 w-24 text-primary-600 mx-auto" />
                
                {/* Floating Sparkles */}
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    rotate: [360, 180, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -bottom-2 -left-2"
                >
                  <Star className="h-5 w-5 text-primary-400" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* App Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              <span className="gradient-text">BookNerdSociety</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-lg md:text-xl text-gray-600 mb-8"
            >
              Your Literary Journey Awaits
            </motion.p>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="w-3 h-3 bg-primary-600 rounded-full"
                />
              ))}
            </motion.div>

            {/* Page Flip Effect Overlay */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 2,
                delay: 2,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-white/30"
              style={{ 
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)'
              }}
            />
          </div>

          {/* Floating Book Pages */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  rotate: Math.random() * 360
                }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  y: [0, -100],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute w-8 h-12 bg-gradient-to-b from-primary-200 to-primary-300 rounded-sm shadow-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
