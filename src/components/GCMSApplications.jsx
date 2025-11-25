import { useState, useEffect, useMemo } from 'react'
import { FiRefreshCw, FiCheckCircle } from 'react-icons/fi'
import { BiSort } from "react-icons/bi";
import { motion } from 'framer-motion'
import Statcard from './Statcard'
import Maintable from './Maintable'
import SearchBar from './Search'
import PDFPreviewModal from './PDFPreviewModal'
import Pagination from './Pagination'
import axiosInstance from '../api/axiosInstance'
import { useLanguage } from '../i18n/LanguageProvider'

function GCMSApplications({ 
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
  const { t } = useLanguage()
  const [newCVNotification, setNewCVNotification] = useState(null)
  const [previewModal, setPreviewModal] = useState({ isOpen: false, googleDriveLink: null, fileName: null })
  const [analytics, setAnalytics] = useState({ total: 0, today: 0, week: 0, month: 0 })
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [showSort, setShowSort] = useState(false)

  const gcmsApplicants = cvData
  const rowStartIndex = ((pagination?.page || 1) - 1) * (pagination?.limit || gcmsApplicants.length || 12)

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
      const response = await axiosInstance.get('/api/cv/analytics/gcms')
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
      heading: t('gcms.stats.totalHeading'),
      value: analyticsLoading ? '...' : analytics.total.toString(),
      description: t('gcms.stats.totalDesc'),
      small: analyticsLoading ? '...' : t('gcms.stats.totalSmall', { today: analytics.today, week: analytics.week }),
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-700',
      accentColor: 'bg-indigo-100'
    },
    {
      heading: t('gcms.stats.todayHeading'),
      value: analyticsLoading ? '...' : analytics.today.toString(),
      description: t('gcms.stats.todayDesc'),
      small: t('gcms.stats.todaySmall'),
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-700',
      accentColor: 'bg-green-100'
    },
    {
      heading: t('gcms.stats.weekHeading'),
      value: analyticsLoading ? '...' : analytics.week.toString(),
      description: t('gcms.stats.weekDesc'),
      small: t('gcms.stats.weekSmall'),
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-700',
      accentColor: 'bg-orange-100'
    },
    {
      heading: t('gcms.stats.monthHeading'),
      value: analyticsLoading ? '...' : analytics.month.toString(),
      description: t('gcms.stats.monthDesc'),
      small: t('gcms.stats.monthSmall'),
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700',
      accentColor: 'bg-purple-100'
    }
  ], [analytics, analyticsLoading, t])

  const avgScore = gcmsApplicants.length > 0
    ? Math.round(gcmsApplicants.reduce((sum, cv) => sum + (cv.score || 0), 0) / gcmsApplicants.length)
    : 0

  const avgGroups = gcmsApplicants.length > 0
    ? Math.round(gcmsApplicants.reduce((sum, cv) => sum + (cv.gcmsPositiveGroupsHit || 0), 0) / gcmsApplicants.length)
    : 0

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
          <h1 className="text-3xl font-bold text-gray-800">{t('gcms.title')}</h1>
          <p className="text-gray-600 mt-1">{t('gcms.subtitle')}</p>
          <p className="text-sm text-gray-500">
            {t('gcms.avgLine', { score: avgScore || 0, groups: avgGroups || 0 })}
          </p>
        </div>
        <div>
          <p className="text-md text-green-600 mt-1 flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
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
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-fade-in">
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
        cvData={gcmsApplicants} 
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
    </motion.div>
  )
}

export default GCMSApplications


