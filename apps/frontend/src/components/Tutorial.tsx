import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, SkipForward, BookOpen, Star, Users, Settings, Home } from 'lucide-react'
import { useUserStore } from '../stores/userStore'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to BookNerdSociety!',
    description: 'Let\'s take a quick tour to help you get started with your new reading journey.',
    icon: <BookOpen className="h-8 w-8 text-primary-600" />
  },
  {
    id: 'home',
    title: 'Discover Amazing Books',
    description: 'Start here to explore our vast collection of books. Use the "Explore Now" button to browse our library.',
    icon: <Home className="h-8 w-8 text-primary-600" />,
    target: 'home-section'
  },
  {
    id: 'books',
    title: 'Search & Filter Books',
    description: 'Use the search bar to find specific books, or try our filters: All Genres, Top Rated, and New Releases.',
    icon: <BookOpen className="h-8 w-8 text-primary-600" />,
    target: 'books-section'
  },
  {
    id: 'my-books',
    title: 'Manage Your Library',
    description: 'Track your reading progress, rate books, and organize your personal library in "My Books".',
    icon: <Star className="h-8 w-8 text-primary-600" />,
    target: 'my-books-section'
  },
  {
    id: 'clubs',
    title: 'Join Book Clubs',
    description: 'Connect with fellow readers by joining book clubs and participating in discussions.',
    icon: <Users className="h-8 w-8 text-primary-600" />,
    target: 'clubs-section'
  },
  {
    id: 'profile',
    title: 'Customize Your Profile',
    description: 'Personalize your profile, manage your reading stats, and adjust your privacy settings.',
    icon: <Settings className="h-8 w-8 text-primary-600" />,
    target: 'profile-section'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You now know the basics! Start exploring books, join clubs, and build your reading community.',
    icon: <Star className="h-8 w-8 text-primary-600" />
  }
]

interface TutorialProps {
  isVisible: boolean
  onComplete: () => void
  onSkip: () => void
}

export default function Tutorial({ isVisible, onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isHighlighting, setIsHighlighting] = useState(false)
  const { completeTutorial } = useUserStore()

  const currentStepData = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  const nextStep = () => {
    if (isLastStep) {
      completeTutorial()
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    completeTutorial()
    onSkip()
  }

  useEffect(() => {
    if (currentStepData.target) {
      setIsHighlighting(true)
      const targetElement = document.querySelector(`[data-tutorial="${currentStepData.target}"]`)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentStepData.target])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        {/* Highlight Overlay */}
        {isHighlighting && currentStepData.target && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div 
              className="absolute border-4 border-primary-500 rounded-lg animate-pulse"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                height: '200px'
              }}
            />
          </div>
        )}

        {/* Tutorial Modal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="glass-effect max-w-md w-full rounded-2xl p-6 relative"
        >
          {/* Skip Button */}
          <button
            onClick={skipTutorial}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Step Content */}
          <div className="text-center mb-6">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              {currentStepData.icon}
            </motion.div>
            
            <h3 className="text-xl font-bold mb-2">{currentStepData.title}</h3>
            <p className="text-gray-600 mb-4">{currentStepData.description}</p>
            
            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mb-4">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <motion.button
                onClick={prevStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </motion.button>
            )}
            
            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ArrowRight className="h-4 w-4" />}
            </motion.button>
          </div>

          {/* Skip Tutorial Button */}
          <div className="mt-4 text-center">
            <button
              onClick={skipTutorial}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto transition-colors"
            >
              <SkipForward className="h-4 w-4" />
              Skip Tutorial
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
