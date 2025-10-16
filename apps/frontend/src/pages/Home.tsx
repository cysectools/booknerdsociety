import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Star, Flame, BookOpen, Users, MessageCircle } from 'lucide-react'
import BookSearch from '../components/BookSearch'
import RecommendedBooks from '../components/RecommendedBooks'
import TrendingClubs from '../components/TrendingClubs'
import HomeAnimatedBackground from '../components/HomeAnimatedBackground'

export default function Home() {
  const navigate = useNavigate()

  const handleExploreClick = () => {
    navigate('/books')
  }

  return (
    <div className="min-h-screen relative">
      <HomeAnimatedBackground />
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover the Best Books{' '}
              <span className="gradient-text">For You</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join book clubs, find trending reads, and connect with fellow book lovers. 
              Your literary journey starts here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ 
                scale: 0.95,
                rotateY: 5,
                transition: { duration: 0.1 }
              }}
              onClick={handleExploreClick}
              className="btn-primary text-lg px-8 py-4 relative overflow-hidden group"
            >
              <motion.div
                className="flex items-center"
                whileTap={{
                  rotateY: 10,
                  transition: { duration: 0.2 }
                }}
              >
                <BookOpen className="inline h-5 w-5 mr-2" />
                Explore Now
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileTap={{ x: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Book Search Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Search className="h-8 w-8 text-primary-600" />
              Search for Books
            </h2>
            <p className="text-gray-600 text-lg">
              Find your next favorite read from millions of books
            </p>
          </motion.div>
          
          <BookSearch />
        </div>
      </section>

      {/* Recommended Books Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Star className="h-8 w-8 text-primary-600" />
              Recommended For You
            </h2>
            <p className="text-gray-600 text-lg">
              Personalized book recommendations based on your interests
            </p>
          </motion.div>
          
          <RecommendedBooks />
        </div>
      </section>

      {/* Trending Clubs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Flame className="h-8 w-8 text-primary-600" />
              Trending Book Clubs
            </h2>
            <p className="text-gray-600 text-lg">
              Join the most active and engaging book clubs
            </p>
          </motion.div>
          
          <TrendingClubs />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose BookNerdSociety?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the future of book discovery and social reading
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Discover Books</h3>
              <p className="text-gray-600">
                Find your next favorite read with our intelligent recommendation engine
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Join Clubs</h3>
              <p className="text-gray-600">
                Connect with like-minded readers in vibrant book clubs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share Thoughts</h3>
              <p className="text-gray-600">
                Discuss books, share reviews, and build lasting friendships
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
