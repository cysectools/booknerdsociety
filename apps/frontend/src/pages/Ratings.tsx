import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Star, Calendar, MessageCircle, X, Heart } from 'lucide-react'
import { realBookService } from '../services/realBookService'
import { Book } from '../types'
import { databaseService } from '../services/databaseService'
import { useBooksStore } from '../stores/booksStore'

interface UserRating {
  id: string
  userId: string
  bookId: string
  rating: number
  review?: string
  createdAt: Date
  username: string
}

export default function Ratings() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookRatings, setBookRatings] = useState<UserRating[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'low'>('all')
  const [activeTab, setActiveTab] = useState<'search' | 'rated' | 'rate'>('search')
  const [userRatedBooks, setUserRatedBooks] = useState<Book[]>([])
  const [popularBooks, setPopularBooks] = useState<Book[]>([])
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingBook, setRatingBook] = useState<Book | null>(null)
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState('')
  
  const { read } = useBooksStore()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const results = await realBookService.searchBooks(searchQuery, 20)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookClick = async (book: Book) => {
    setSelectedBook(book)
    setShowModal(true)
    
    // Load ratings for this book
    try {
      const ratings = await databaseService.getBookRatings(book.id)
      setBookRatings(ratings)
    } catch (error) {
      console.error('Error loading ratings:', error)
      setBookRatings([])
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBook(null)
    setBookRatings([])
  }

  const getFilteredRatings = () => {
    if (!selectedBook) return []
    
    switch (activeFilter) {
      case 'high':
        return bookRatings.filter(rating => rating.rating >= 4)
      case 'low':
        return bookRatings.filter(rating => rating.rating <= 2)
      case 'all':
      default:
        return bookRatings
    }
  }

  const getAverageRating = () => {
    if (bookRatings.length === 0) return 0
    const sum = bookRatings.reduce((acc, rating) => acc + rating.rating, 0)
    return Math.round((sum / bookRatings.length) * 10) / 10
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    bookRatings.forEach(rating => {
      distribution[rating.rating as keyof typeof distribution]++
    })
    return distribution
  }

  // Load user's rated books
  const loadUserRatedBooks = async () => {
    try {
      // Get books from user's read list that have ratings
      const ratedBooks = read.filter(book => (book as any).userRating && (book as any).userRating > 0)
      setUserRatedBooks(ratedBooks)
    } catch (error) {
      console.error('Error loading user rated books:', error)
    }
  }

  // Load popular books for rating
  const loadPopularBooks = async () => {
    try {
      const popular = await realBookService.getTopRatedBooks(12)
      setPopularBooks(popular)
    } catch (error) {
      console.error('Error loading popular books:', error)
    }
  }

  // Handle rating a book
  const handleRateBook = (book: Book) => {
    setRatingBook(book)
    setUserRating(0)
    setUserReview('')
    setShowRatingModal(true)
  }

  // Submit rating
  const submitRating = async () => {
    if (!ratingBook || userRating === 0) return

    try {
      // Save rating to database
      await databaseService.saveRating({
        id: `${Date.now()}`,
        userId: 'current-user', // In real app, get from auth
        bookId: ratingBook.id,
        rating: userRating,
        review: userReview,
        createdAt: new Date()
      })

      // Update local state
      setUserRatedBooks(prev => [...prev, { ...ratingBook, userRating }])
      
      // Close modal
      setShowRatingModal(false)
      setRatingBook(null)
      setUserRating(0)
      setUserReview('')
      
      console.log('Rating submitted successfully')
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadUserRatedBooks()
    loadPopularBooks()
  }, [])

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Book <span className="gradient-text">Ratings</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what other readers think about your favorite books. 
            Read reviews, see ratings, and find your next great read.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'search'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'glass-effect hover:scale-105'
            }`}
          >
            <Search className="h-4 w-4" />
            Search Books
          </button>
          <button
            onClick={() => setActiveTab('rated')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'rated'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'glass-effect hover:scale-105'
            }`}
          >
            <Heart className="h-4 w-4" />
            My Rated Books
          </button>
          <button
            onClick={() => setActiveTab('rate')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'rate'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'glass-effect hover:scale-105'
            }`}
          >
            <Star className="h-4 w-4" />
            Rate Books
          </button>
        </motion.div>

        {/* Search Section */}
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect rounded-2xl p-6 mb-8"
          >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for books to see ratings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="btn-primary px-6 py-3 flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
              Search
            </motion.button>
          </div>
          </motion.div>
        )}

        {/* Search Results */}
        {activeTab === 'search' && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="book-card cursor-pointer"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={book.cover || '/placeholder-book.jpg'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{book.rating || 'N/A'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Rated Books Section */}
        {activeTab === 'rated' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              My Rated Books ({userRatedBooks.length})
            </h2>
            {userRatedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userRatedBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="book-card"
                  >
                    <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={book.cover || '/placeholder-book.jpg'}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">Your Rating: {(book as any).userRating}/5</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Rated Books Yet</h3>
                <p className="text-gray-500 mb-4">Start rating books to see them here!</p>
                <button
                  onClick={() => setActiveTab('rate')}
                  className="btn-primary"
                >
                  Rate Books
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Rate Books Section */}
        {activeTab === 'rate' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Rate Popular Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="book-card cursor-pointer"
                  onClick={() => handleRateBook(book)}
                >
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={book.cover || '/placeholder-book.jpg'}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{book.rating || 'N/A'}</span>
                  </div>
                  <button className="w-full mt-3 btn-primary text-sm">
                    Rate This Book
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Book Ratings Modal */}
        {showModal && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-effect max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Book Info */}
                <div className="flex-shrink-0 lg:w-1/3">
                  <img
                    src={selectedBook.cover || '/placeholder-book.jpg'}
                    alt={selectedBook.title}
                    className="w-full max-w-xs mx-auto h-64 object-cover rounded-lg shadow-lg"
                  />
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                    <p className="text-lg text-gray-600 mb-4">{selectedBook.author}</p>
                    
                    {/* Average Rating */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold">{getAverageRating()}</span>
                      <span className="text-gray-500">({bookRatings.length} ratings)</span>
                    </div>

                    {/* Rating Distribution */}
                    {bookRatings.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Rating Distribution</h3>
                        {Object.entries(getRatingDistribution())
                          .reverse()
                          .map(([rating, count]) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="w-4 text-sm">{rating}★</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{ width: `${(count / bookRatings.length) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ratings List */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">User Ratings & Reviews</h3>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setActiveFilter('all')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          activeFilter === 'all'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        All
                      </motion.button>
                      <motion.button
                        onClick={() => setActiveFilter('high')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          activeFilter === 'high'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        High (4+)
                      </motion.button>
                      <motion.button
                        onClick={() => setActiveFilter('low')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          activeFilter === 'low'
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Low (≤2)
                      </motion.button>
                    </div>
                  </div>

                  {getFilteredRatings().length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No ratings found</h3>
                      <p className="text-gray-500">
                        {bookRatings.length === 0 
                          ? 'Be the first to rate this book!'
                          : 'No ratings match your current filter.'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getFilteredRatings().map((rating, index) => (
                        <motion.div
                          key={rating.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {rating.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-semibold">{rating.username}</h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < rating.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1">
                                    {rating.rating}/5
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(rating.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {rating.review && (
                            <p className="text-gray-700 leading-relaxed">{rating.review}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Rating Modal */}
        {showRatingModal && ratingBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRatingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-effect max-w-md w-full rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold">Rate This Book</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={ratingBook.cover || '/placeholder-book.jpg'}
                    alt={ratingBook.title}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold">{ratingBook.title}</h4>
                    <p className="text-gray-600">{ratingBook.author}</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= userRating
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Select a rating'}
                  </p>
                </div>

                {/* Review */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review (Optional)
                  </label>
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  disabled={userRating === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Rating
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
