import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Star, Filter, X, Calendar, User, Globe, RefreshCw, Loader } from 'lucide-react'
import { enhancedBooksService } from '../services/enhancedBooksService'
import { Book } from '../types'
import { useBooksStore } from '../stores/booksStore'

type FilterType = 'browse' | 'bestsellers' | 'new-releases' | 'highly-rated'

export default function BooksInfinite() {
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>('browse')
  const [hasMore, setHasMore] = useState(true)
  const [startIndex, setStartIndex] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [addedToWishlist, setAddedToWishlist] = useState<Set<string>>(new Set())
  const [addedToReadingList, setAddedToReadingList] = useState<Set<string>>(new Set())
  
  const { addToWishlist, addToReadingList } = useBooksStore()
  const observerTarget = useRef<HTMLDivElement>(null)

  // Load initial books
  const loadInitialBooks = async (filter: FilterType = 'browse') => {
    setLoading(true)
    setStartIndex(0)
    setBooks([])
    
    try {
      let result
      
      switch (filter) {
        case 'bestsellers':
          result = await enhancedBooksService.getBestsellers(0, 40)
          break
        case 'new-releases':
          result = await enhancedBooksService.getNewReleases(0, 40)
          break
        case 'highly-rated':
          result = await enhancedBooksService.getHighlyRated(0, 40)
          break
        case 'browse':
        default:
          result = await enhancedBooksService.browseBySubject('fiction', 0, 40)
          break
      }
      
      setBooks(result.books)
      setHasMore(result.hasMore)
      setStartIndex(result.nextStartIndex)
      setTotalItems(result.totalItems)
    } catch (error) {
      console.error('Error loading initial books:', error)
      setBooks([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Load more books (infinite scroll)
  const loadMoreBooks = async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    
    try {
      let result
      
      if (isSearchMode && searchQuery.trim()) {
        result = await enhancedBooksService.searchBooks(searchQuery, startIndex, 40)
      } else {
        switch (activeFilter) {
          case 'bestsellers':
            result = await enhancedBooksService.getBestsellers(startIndex, 40)
            break
          case 'new-releases':
            result = await enhancedBooksService.getNewReleases(startIndex, 40)
            break
          case 'highly-rated':
            result = await enhancedBooksService.getHighlyRated(startIndex, 40)
            break
          case 'browse':
          default:
            result = await enhancedBooksService.browseBySubject('fiction', startIndex, 40)
            break
        }
      }
      
      setBooks(prev => [...prev, ...result.books])
      setHasMore(result.hasMore)
      setStartIndex(result.nextStartIndex)
    } catch (error) {
      console.error('Error loading more books:', error)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearchMode(false)
      loadInitialBooks(activeFilter)
      return
    }
    
    setLoading(true)
    setIsSearchMode(true)
    setStartIndex(0)
    setBooks([])
    
    try {
      const result = await enhancedBooksService.searchBooks(searchQuery, 0, 40)
      setBooks(result.books)
      setHasMore(result.hasMore)
      setStartIndex(result.nextStartIndex)
      setTotalItems(result.totalItems)
    } catch (error) {
      console.error('Search error:', error)
      setBooks([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Handle filter change
  const applyFilter = async (filter: FilterType) => {
    setActiveFilter(filter)
    setIsSearchMode(false)
    setSearchQuery('')
    await loadInitialBooks(filter)
  }

  // Refresh
  const handleRefresh = () => {
    setSearchQuery('')
    setIsSearchMode(false)
    loadInitialBooks(activeFilter)
  }

  // Initial load
  useEffect(() => {
    loadInitialBooks('browse')
  }, [])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreBooks()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loadingMore, loading, startIndex, activeFilter, isSearchMode, searchQuery])

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBook(null)
  }

  const handleAddToWishlist = async (book: Book) => {
    try {
      await addToWishlist(book)
      setAddedToWishlist(prev => new Set([...prev, book.id]))
      setTimeout(() => {
        setAddedToWishlist(prev => {
          const newSet = new Set(prev)
          newSet.delete(book.id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }

  const handleAddToReadingList = async (book: Book) => {
    try {
      await addToReadingList(book)
      setAddedToReadingList(prev => new Set([...prev, book.id]))
      setTimeout(() => {
        setAddedToReadingList(prev => {
          const newSet = new Set(prev)
          newSet.delete(book.id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Error adding to reading list:', error)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
              Discover Books
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            {totalItems > 0 ? `${totalItems.toLocaleString()} books available` : 'Explore millions of books'}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by title, author, or ISBN..."
              className="w-full px-6 py-4 pr-32 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              {searchQuery && (
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <button
            onClick={() => applyFilter('browse')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeFilter === 'browse' && !isSearchMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <BookOpen className="inline h-5 w-5 mr-2" />
            Browse All
          </button>
          <button
            onClick={() => applyFilter('bestsellers')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeFilter === 'bestsellers' && !isSearchMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <Star className="inline h-5 w-5 mr-2" />
            Bestsellers
          </button>
          <button
            onClick={() => applyFilter('new-releases')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeFilter === 'new-releases' && !isSearchMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <Calendar className="inline h-5 w-5 mr-2" />
            New Releases
          </button>
          <button
            onClick={() => applyFilter('highly-rated')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeFilter === 'highly-rated' && !isSearchMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <Star className="inline h-5 w-5 mr-2 fill-current" />
            Highly Rated
          </button>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 rounded-xl font-medium bg-white text-gray-700 hover:shadow-md transition-all"
          >
            <RefreshCw className="inline h-5 w-5" />
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {books.map((book, index) => (
              <motion.div
                key={`${book.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleBookClick(book)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-72">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-book.jpg'
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{book.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 truncate">{book.author}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{book.genre}</span>
                    <span>{book.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Indicator */}
        {loadingMore && (
          <div className="flex justify-center items-center py-10">
            <Loader className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">Loading more books...</span>
          </div>
        )}

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-10" />

        {/* No More Results */}
        {!loading && !loadingMore && !hasMore && books.length > 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">
              You've reached the end! ({books.length} books loaded)
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && books.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No books found</p>
            <p className="text-gray-500 mt-2">Try a different search or filter</p>
          </div>
        )}

        {/* Book Details Modal */}
        {showModal && selectedBook && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex gap-6 mb-4">
                  <img
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    className="w-48 h-72 object-cover rounded-xl shadow-lg"
                  />
                  <div>
                    <p className="text-gray-600 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      {selectedBook.author}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {selectedBook.year}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <BookOpen className="inline h-4 w-4 mr-1" />
                      {selectedBook.genre}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <Star className="inline h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      {selectedBook.rating.toFixed(1)} / 5.0
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToWishlist(selectedBook)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          addedToWishlist.has(selectedBook.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {addedToWishlist.has(selectedBook.id) ? '✓ Added' : '+ Wishlist'}
                      </button>
                      <button
                        onClick={() => handleAddToReadingList(selectedBook)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          addedToReadingList.has(selectedBook.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-pink-600 text-white hover:bg-pink-700'
                        }`}
                      >
                        {addedToReadingList.has(selectedBook.id) ? '✓ Added' : '+ Reading List'}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedBook.description || 'No description available.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

