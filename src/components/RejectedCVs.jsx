import { useState, useEffect, useMemo } from 'react'
import { FiRefreshCw, FiCheckCircle, FiTrash2 } from 'react-icons/fi'
import { BiSort } from "react-icons/bi";
import { motion } from 'framer-motion'
import Statcard from './Statcard'
import Maintable from './Maintable'
import SearchBar from './Search'
import PDFPreviewModal from './PDFPreviewModal'
import Pagination from './Pagination'
import axiosInstance from '../api/axiosInstance'
import { useLanguage } from '../i18n/LanguageProvider'

function RejectedCVs({ 
  cvData, 
  loading, 
  onRefresh, 
  newCVAdded,
  onToggleStar,
  onDelete,
  onBulkDelete = () => Promise.resolve(),
  onDeleteAll = () => Promise.resolve(),
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
  const { t } = useLanguage()
  const [newCVNotification, setNewCVNotification] = useState(null)
  const [previewModal, setPreviewModal] = useState({ isOpen: false, googleDriveLink: null, fileName: null })
  const [analytics, setAnalytics] = useState({ total: 0, today: 0, week: 0, month: 0 })
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false)
  const [deleteAllLoading, setDeleteAllLoading] = useState(false)

  const rejectedCVs = cvData
  const rowStartIndex = ((pagination?.page || 1) - 1) * (pagination?.limit || rejectedCVs.length || 12)

  useEffect(() => {
    if (newCVAdded) {
      setNewCVNotification(t('common.newCv'))
      const timer = setTimeout(() => {
        setNewCVNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [newCVAdded, t])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const response = await axiosInstance.get('/api/cv/analytics/rejected')
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

  const stats = useMemo(() => [
    {
      heading: t('rejected.stats.totalHeading'),
      value: analyticsLoading ? '...' : analytics.total.toString(),
      description: t('rejected.stats.totalDesc'),
      small: analyticsLoading ? '...' : t('rejected.stats.totalSmall', { today: analytics.today, week: analytics.week }),
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
      accentColor: 'bg-red-100'
    },
    {
      heading: t('rejected.stats.todayHeading'),
      value: analyticsLoading ? '...' : analytics.today.toString(),
      description: t('rejected.stats.todayDesc'),
      small: t('rejected.stats.todaySmall'),
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-700',
      accentColor: 'bg-orange-100'
    },
    {
      heading: t('rejected.stats.weekHeading'),
      value: analyticsLoading ? '...' : analytics.week.toString(),
      description: t('rejected.stats.weekDesc'),
      small: t('rejected.stats.weekSmall'),
      badgeBg: 'bg-gray-100',
      badgeText: 'text-gray-700',
      accentColor: 'bg-gray-100'
    },
    {
      heading: t('rejected.stats.monthHeading'),
      value: analyticsLoading ? '...' : analytics.month.toString(),
      description: t('rejected.stats.monthDesc'),
      small: t('rejected.stats.monthSmall'),
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-700',
      accentColor: 'bg-yellow-100'
    }
  ], [analytics, analyticsLoading, t])

  const handleDeleteAllClick = () => {
    setDeleteAllModalOpen(true)
  }

  const handleConfirmDeleteAll = () => {
    setDeleteAllLoading(true)
    onDeleteAll()
      .then(() => {
        setDeleteAllModalOpen(false)
        fetchAnalytics()
      })
      .catch(() => {})
      .finally(() => setDeleteAllLoading(false))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-8 py-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('rejected.title')}</h1>
          <p className="text-gray-600 mt-1">{t('rejected.subtitle')}</p>
        </div>
        <div>
          <p className="text-md text-red-600 mt-1 flex items-center space-x-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>{t('common.realTime')}</span>
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((card, idx) => (
          <Statcard
            key={card.heading}
            index={idx}
            heading={card.heading}
            value={card.value}
            description={card.description}
            smallStats={card.small}
            badgeBg={card.badgeBg}
            badgeText={card.badgeText}
            accentColor={card.accentColor}
            bgColor="bg-white"
          />
        ))}
      </div>

      {/* Search and Actions */}
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
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-fade-in">
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
              <span className='text-black font-bold'>{t('common.filter')}</span>
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1">{t('common.minScore')}</div>
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
                      {t('common.clearFilter')}
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
                {t('common.sort')} {sortBy === 'score' ? t('maintable.columns.score') : t('common.date')} {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            </button>
            {showSort && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">{t('common.sortBy')}</div>
                  <button
                    onClick={() => {
                      onSortChange('score', sortBy === 'score' && sortOrder === 'desc' ? 'asc' : 'desc')
                      setShowSort(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                      sortBy === 'score' ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                    }`}
                  >
                    {t('maintable.columns.score')} {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                    {t('common.date')} {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onRefresh()
                fetchAnalytics()
              }}
              className="flex items-center space-x-2 px-6 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
            >
              <FiRefreshCw size={18} />
            <span className='font-bold'>{t('common.refresh')}</span>
            </button>
            <button
              onClick={handleDeleteAllClick}
              className="flex items-center space-x-2 px-6 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <FiTrash2 size={18} />
              <span className='font-bold'>{t('rejected.deleteAll')}</span>
            </button>
          </div>
        </div>
      </motion.div>

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
     
      {/* Table */}
      <Maintable 
        cvData={rejectedCVs} 
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

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        googleDriveLink={previewModal.googleDriveLink}
        fileName={previewModal.fileName}
      />

      {deleteAllModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{t('rejected.deleteModal.title')}</h3>
              <p className="text-gray-600">
                {t('rejected.deleteModal.body')}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteAllModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={deleteAllLoading}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleConfirmDeleteAll}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleteAllLoading}
                >
                  {deleteAllLoading ? t('common.loading') : t('rejected.deleteAll')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default RejectedCVs
