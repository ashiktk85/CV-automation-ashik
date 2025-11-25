import { useState, useEffect } from 'react'
import { FiRefreshCw, FiCheckCircle, FiStar } from 'react-icons/fi'
import { BiSort } from "react-icons/bi";
import { motion } from 'framer-motion'
import Statcard from './Statcard'
import Maintable from './Maintable'
import SearchBar from './Search'
import PDFPreviewModal from './PDFPreviewModal'
import Pagination from './Pagination'
import axiosInstance from '../api/axiosInstance'

function SavedApplications({ 
  cvData, 
  loading, 
  onRefresh, 
  newCVAdded,
  onToggleStar,
  onDelete,
  onBulkDelete,
  onSearch,
  searchQuery,
  onSortChange,
  onFilterChange,
  minScore,
  sortBy,
  sortOrder,
  pagination,
  onPageChange
}) {
  const [newCVNotification, setNewCVNotification] = useState(null)
  const [previewModal, setPreviewModal] = useState({ isOpen: false, googleDriveLink: null, fileName: null })
  const [analytics, setAnalytics] = useState({ total: 0, today: 0, week: 0, month: 0 })
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [showSort, setShowSort] = useState(false)

  const savedApplicants = cvData
  const rowStartIndex = ((pagination?.page || 1) - 1) * (pagination?.limit || savedApplicants.length || 12)

  useEffect(() => {
    if (newCVAdded) {
      setNewCVNotification('Saved CVs updated!')
      const timer = setTimeout(() => {
        setNewCVNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [newCVAdded])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const response = await axiosInstance.get('/api/cv/analytics/starred')
      if (response.data.success) {
        setAnalytics(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handlePreview = (googleDriveLink, fileName) => {
    setPreviewModal({ isOpen: true, googleDriveLink, fileName })
  }

  const handleClosePreview = () => {
    setPreviewModal({ isOpen: false, googleDriveLink: null, fileName: null })
  }


  const handleFilterScore = (score) => {
    onFilterChange(score === minScore ? null : score)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-8 py-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiStar className="text-yellow-500" /> Saved Applications
          </h1>
          <p className="text-gray-600 mt-1">Review starred candidates</p>
        </div>
        <div>
          <p className="text-md text-indigo-600 mt-1 flex items-center space-x-1">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span>Starred shortlist</span>
          </p>
        </div>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Statcard 
          index={0}
          heading="Total Saved" 
          value={analyticsLoading ? "..." : analytics.total.toString()} 
          description="Total saved applications" 
          smallStats={`${analytics.today} today · ${analytics.week} this week`} 
          badgeBg="bg-yellow-100" 
          badgeText="text-yellow-700" 
          accentColor="bg-yellow-100" 
          bgColor="bg-white" 
        />
        <Statcard 
          index={1}
          heading="Today" 
          value={analyticsLoading ? "..." : analytics.today.toString()} 
          description="Saved today" 
          smallStats="Last 24 hours" 
          badgeBg="bg-purple-100" 
          badgeText="text-purple-700" 
          accentColor="bg-purple-100" 
          bgColor="bg-white" 
        />
        <Statcard 
          index={2}
          heading="This Week" 
          value={analyticsLoading ? "..." : analytics.week.toString()} 
          description="Saved this week" 
          smallStats="Last 7 days" 
          badgeBg="bg-green-100" 
          badgeText="text-green-700" 
          accentColor="bg-green-100" 
          bgColor="bg-white" 
        />
        <Statcard 
          index={3}
          heading="This Month" 
          value={analyticsLoading ? "..." : analytics.month.toString()} 
          description="Saved this month" 
          smallStats="Last 30 days" 
          badgeBg="bg-orange-100" 
          badgeText="text-orange-700" 
          accentColor="bg-orange-100" 
          bgColor="bg-white" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className='flex items-center justify-between flex-wrap gap-4'
      >
        <div className="flex-1 min-w-[300px]">
          <SearchBar onSearch={onSearch} value={searchQuery} />
        </div>
        <div className="flex items-center space-x-3">
          {newCVNotification && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 animate-fade-in">
              <FiCheckCircle size={18} />
              <span className="text-sm font-medium">{newCVNotification}</span>
            </div>
          )}
          
          {/* Filter Dropdown */}
          <div className="relative z-50">
            <button 
              onClick={() => {
                setShowFilter(!showFilter)
                setShowSort(false)
              }}
              className="flex items-center space-x-2 px-6 py-1 bg-white border border-black/40 text-black rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            >
              <BiSort size={18} />
              <span className='text-black font-bold'>Filter</span>
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1">Min Score</div>
                  {[50, 60, 70, 80, 90].map(score => (
                    <button
                      key={score}
                      onClick={() => {
                        handleFilterScore(score)
                        setShowFilter(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                        minScore === score ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                      }`}
                    >
                      {score}+
                    </button>
                  ))}
                  {minScore && (
                    <button
                      onClick={() => {
                        handleFilterScore(null)
                        setShowFilter(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 text-red-600"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative z-50">
            <button 
              onClick={() => {
                setShowSort(!showSort)
                setShowFilter(false)
              }}
              className="flex items-center space-x-2 px-6 py-1 bg-white border border-black/40 text-black rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            >
              <BiSort size={18} />
              <span className='text-black font-bold'>
                Sort {sortBy === 'score' ? 'Score' : 'Date'} {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            </button>
            {showSort && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">Sort By</div>
                  <button
                    onClick={() => {
                      onSortChange('score', sortBy === 'score' && sortOrder === 'desc' ? 'asc' : 'desc')
                      setShowSort(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                      sortBy === 'score' ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                    }`}
                  >
                    Score {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => {
                      onSortChange('createdAt', sortBy === 'createdAt' && sortOrder === 'desc' ? 'asc' : 'desc')
                      setShowSort(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                      sortBy === 'createdAt' ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                    }`}
                  >
                    Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onRefresh()
              fetchAnalytics()
            }}
            className="flex items-center space-x-2 px-6 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
          >
            <FiRefreshCw size={18} />
            <span className='font-bold'>Refresh</span>
          </button>
        </div>

        {/* Click outside to close dropdowns */}
        {(showFilter || showSort) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowFilter(false)
              setShowSort(false)
            }}
          />
        )}
      </motion.div>
     
      <Maintable 
        cvData={savedApplicants} 
        loading={loading}
        onPreview={handlePreview}
        onToggleStar={onToggleStar}
        onDelete={onDelete}
        startIndex={rowStartIndex}
        enableBulkActions
        onBulkDeleteSelected={onBulkDelete}
      />

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}

      <PDFPreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        googleDriveLink={previewModal.googleDriveLink}
        fileName={previewModal.fileName}
      />
    </motion.div>
  )
}

export default SavedApplications
