import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, RefreshCw, BookOpen, X, Calendar, User, Globe } from 'lucide-react'
import { booksService } from '../services/booksService'
import { Book } from '../types'

export default function RecommendedBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showModal, setShowModal] = useState(false)

  const loadBooks = async () => {
    setLoading(true)
    try {
      const recommendedBooks = await booksService.getRecommendedBooks(8)
      setBooks(recommendedBooks)
    } catch (error) {
      console.error('Error loading books:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBook(null)
  }

  useEffect(() => {
    loadBooks()
  }, [])

  return (
    <div className="relative">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Star className="h-6 w-6 text-primary-600" />
          Recommended For You
        </h2>
        <button
          onClick={loadBooks}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Recommendations
        </button>
      </div>

      {/* Books Container */}
      <div className="relative overflow-hidden">
        <div className="flex gap-6 animate-scroll hover:pause-animation">
          {loading ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recommendations available</p>
                <p className="text-sm text-gray-400">Try refreshing to get new recommendations</p>
              </div>
            </div>
          ) : (
            [...books, ...books].map((book, index) => (
              <motion.div
                key={`${book.id || index}-${Math.floor(index / books.length)}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="book-card min-w-[200px] max-w-[200px] cursor-pointer"
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
                <p className="text-gray-600 mb-2 text-sm">{book.author}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{book.rating || '4.5'}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Book Details Modal */}
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
            className="glass-effect max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
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

              {/* Book Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{selectedBook.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{selectedBook.rating || 'N/A'}</span>
                  <span className="text-gray-500">({selectedBook.rating ? 'Rating' : 'No rating available'})</span>
                </div>

                {/* Book Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Published: {selectedBook.year || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedBook.pages || 'Unknown'} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Genre: {selectedBook.genre || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Language: {selectedBook.language || 'Unknown'}</span>
                  </div>
                </div>

                {/* Description */}
                {selectedBook.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedBook.description.length > 300 
                        ? `${selectedBook.description.substring(0, 300)}...` 
                        : selectedBook.description
                      }
                    </p>
                  </div>
                )}

                {/* Publisher */}
                {selectedBook.publisher && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Publisher</h3>
                    <p className="text-gray-700">{selectedBook.publisher}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="btn-primary flex-1">
                    Add to Wishlist
                  </button>
                  <button className="btn-secondary flex-1">
                    Add to Reading List
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
