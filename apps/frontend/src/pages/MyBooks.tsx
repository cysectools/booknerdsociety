import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Plus, Search, Heart, Bookmark, Edit3, X, Calendar } from 'lucide-react'
import { useBooksStore } from '../stores/booksStore'

export default function MyBooks() {
  const [activeTab, setActiveTab] = useState('reading')
  const [searchQuery, setSearchQuery] = useState('')
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [newProgress, setNewProgress] = useState(0)
  const [newRating, setNewRating] = useState(0)
  const [review, setReview] = useState('')
  
  const { 
    reading, 
    read, 
    wishlist, 
    updateProgress, 
    markAsRead, 
    toggleFavorite, 
    toggleBookmark,
    moveBook,
    rateBook
  } = useBooksStore()

  const tabs = [
    { id: 'reading', label: 'Currently Reading', count: reading.length },
    { id: 'read', label: 'Read', count: read.length },
    { id: 'wishlist', label: 'Wishlist', count: wishlist.length }
  ]

  const getCurrentBooks = () => {
    switch (activeTab) {
      case 'reading': return reading
      case 'read': return read
      case 'wishlist': return wishlist
      default: return []
    }
  }

  const currentBooks = getCurrentBooks()
  const filteredBooks = currentBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpdateProgress = (book: any) => {
    setSelectedBook(book)
    setNewProgress(book.progress)
    setShowProgressModal(true)
  }

  const handleSaveProgress = () => {
    if (selectedBook) {
      updateProgress(selectedBook.id, newProgress)
      if (newProgress >= 100) {
        markAsRead(selectedBook.id)
      }
    }
    setShowProgressModal(false)
    setSelectedBook(null)
  }

  const handleStartReading = (book: any) => {
    moveBook(book.id, 'wishlist', 'reading')
  }

  // const handleMarkAsRead = (book: any) => {
  //   markAsRead(book.id, book.rating)
  // }

  const handleRateBook = (book: any) => {
    setSelectedBook(book)
    setNewRating(book.userRating || 0)
    setReview('')
    setShowRatingModal(true)
  }

  const handleSaveRating = () => {
    if (selectedBook && newRating > 0) {
      rateBook(selectedBook.id, newRating, review)
    }
    setShowRatingModal(false)
    setSelectedBook(null)
    setNewRating(0)
    setReview('')
  }

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My <span className="gradient-text">Books</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your reading progress and manage your personal library
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'glass-effect hover:scale-105'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </motion.div>

        {/* Search and Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Book
            </button>
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBooks.map((book, index) => (
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
              <p className="text-sm text-gray-500 mb-4">{book.genre}</p>

              {/* Progress Bar */}
              {activeTab === 'reading' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Rating */}
              {activeTab === 'read' && book.rating > 0 && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < book.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {activeTab === 'reading' && (
                  <motion.button 
                    onClick={() => handleUpdateProgress(book)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Update Progress
                  </motion.button>
                )}
                {activeTab === 'read' && (
                  <motion.button 
                    onClick={() => handleRateBook(book)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Rate Book
                  </motion.button>
                )}
                {activeTab === 'wishlist' && (
                  <motion.button 
                    onClick={() => handleStartReading(book)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Start Reading
                  </motion.button>
                )}
                <motion.button 
                  onClick={() => toggleFavorite(book.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    book.isFavorite 
                      ? 'bg-red-100 text-red-500' 
                      : 'glass-effect hover:scale-105'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${book.isFavorite ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button 
                  onClick={() => toggleBookmark(book.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    book.isBookmarked 
                      ? 'bg-blue-100 text-blue-500' 
                      : 'glass-effect hover:scale-105'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${book.isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {activeTab === 'reading' && 'No books currently reading'}
              {activeTab === 'read' && 'No books read yet'}
              {activeTab === 'wishlist' && 'No books in wishlist'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'reading' && 'Start reading a book to see it here'}
              {activeTab === 'read' && 'Finish reading a book to see it here'}
              {activeTab === 'wishlist' && 'Add books to your wishlist to see them here'}
            </p>
            <button className="btn-primary">
              <Plus className="inline h-4 w-4 mr-2" />
              Add Your First Book
            </button>
          </motion.div>
        )}

        {/* Progress Update Modal */}
        {showProgressModal && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowProgressModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-effect max-w-md w-full rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Update Reading Progress</h3>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">{selectedBook.title}</h4>
                <p className="text-gray-600 mb-4">by {selectedBook.author}</p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress: {newProgress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newProgress}
                    onChange={(e) => setNewProgress(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowProgressModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveProgress}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 btn-primary"
                >
                  Save Progress
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Rating Modal */}
        {showRatingModal && selectedBook && (
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
              className="glass-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowRatingModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <img
                    src={selectedBook.cover || '/placeholder-book.jpg'}
                    alt={selectedBook.title}
                    className="w-48 h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>

                {/* Book Details and Rating */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                  <p className="text-lg text-gray-600 mb-4">{selectedBook.author}</p>

                  {/* Current Rating Display */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Your Rating</h3>
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i < (selectedBook.userRating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-lg font-semibold ml-2">
                        {selectedBook.userRating || 0}/5
                      </span>
                    </div>
                  </div>

                  {/* Rating Input */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Rate This Book</h3>
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          onClick={() => setNewRating(rating)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            rating <= newRating
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <Star className="h-6 w-6" />
                        </motion.button>
                      ))}
                      <span className="text-lg font-semibold ml-2">
                        {newRating}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Write a Review (Optional)
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your thoughts about this book..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Rating History */}
                  {selectedBook.ratingHistory && selectedBook.ratingHistory.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Rating History</h3>
                      <div className="space-y-3">
                        {selectedBook.ratingHistory.map((entry: any, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < entry.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                              </div>
                              {entry.review && (
                                <p className="text-sm text-gray-700">{entry.review}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setShowRatingModal(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveRating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-primary"
                      disabled={newRating === 0}
                    >
                      Save Rating
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
