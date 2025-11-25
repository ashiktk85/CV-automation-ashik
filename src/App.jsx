import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ShopifyApplications from './components/ShopifyApplications'
import GCMSApplications from './components/GCMSApplications'
import RejectedCVs from './components/RejectedCVs'
import SavedApplications from './components/SavedApplications'
import Login from './pages/Login'
import { FiMenu, FiX } from 'react-icons/fi'
import axiosInstance from './api/axiosInstance'
import socket from './utils/socket'
import { toast } from 'sonner'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const CACHE_TTL = 60 * 1000 // 1 minute cache

function App() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  )
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  const [cvData, setCvData] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCVAdded, setNewCVAdded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [minScore, setMinScore] = useState(null)
  const [sortBy, setSortBy] = useState('score')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const cacheRef = useRef({})

  const invalidateCache = useCallback(() => {
    cacheRef.current = {}
  }, [])

  const fetchCVData = useCallback((view, search = '', score = null, sort = 'score', order = 'desc', page = 1) => {
    const cacheKey = JSON.stringify({ view, search, score, sort, order, page })
    const cachedEntry = cacheRef.current[cacheKey]

    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
      setCvData(cachedEntry.data)
      setPagination(cachedEntry.pagination)
      setLoading(false)
      return Promise.resolve()
    }

    // Only set loading when explicitly fetching from backend (not for star/delete operations)
    setLoading(true)
    
    // Determine which endpoint to call based on view
    let endpoint = '/api/cv/list'
    if (view === 'dashboard') {
      endpoint = '/api/cv/accepted'
    } else if (view === 'shopify') {
      endpoint = '/api/cv/shopify'
    } else if (view === 'gcms') {
      endpoint = '/api/cv/gcms'
    } else if (view === 'rejected') {
      endpoint = '/api/cv/rejected'
    } else if (view === 'starred') {
      endpoint = '/api/cv/starred'
    }
    
    // Build query parameters
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (score !== null) params.append('minScore', score)
    if (sort) params.append('sortBy', sort)
    if (order) params.append('sortOrder', order)
    params.append('page', page)
    params.append('limit', 12)
    
    const queryString = params.toString()
    const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return axiosInstance.get(fullUrl)
      .then(response => {
        const data = response.data
        if (data.success) {
          const normalizedData = data.data || []
          const normalizedPagination = data.pagination || null

          setCvData(normalizedData)
          setPagination(normalizedPagination)

          cacheRef.current[cacheKey] = {
            data: normalizedData,
            pagination: normalizedPagination,
            timestamp: Date.now()
          }
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching CV data:', err)
        setLoading(false)
      })
  }, [])

  // Reset filters when view changes
  useEffect(() => {
    setSearchQuery('')
    setSearchInput('')
    setMinScore(null)
    setSortBy('score')
    setSortOrder('desc')
    setCurrentPage(1)
  }, [activeView])

  // Reset to page 1 when search, sort, or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, minScore, sortBy, sortOrder])
  const handleSearchSubmit = useCallback((value) => {
    setSearchInput(value)
    setSearchQuery(value)
  }, [])

  // Fetch data when view, search, sort, filter, or page changes
  useEffect(() => {
    fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
  }, [activeView, searchQuery, minScore, sortBy, sortOrder, currentPage, fetchCVData])

  useEffect(() => {
    // Set up socket listeners for real-time updates
    socket.on('connect', () => {
      console.log('Connected to server via Socket.io')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    // Listen for new CV uploads
    socket.on('newCVUploaded', (eventData) => {
      if (eventData.success && eventData.data) {
        console.log('New CV received via socket:', eventData.data)
        
        // Determine if the new CV should be shown in current view
        const cv = eventData.data
        let shouldShow = false
        
        if (activeView === 'dashboard') {
          // Show if score >= 50
          shouldShow = cv.score !== null && cv.score !== undefined && cv.score >= 50
        } else if (activeView === 'shopify') {
          // Show if has scoring data
          shouldShow = cv.score !== null && cv.score !== undefined
        } else if (activeView === 'rejected') {
          // Show if rejected (score < 50 or no score)
          shouldShow = (cv.score !== null && cv.score !== undefined && cv.score < 50) ||
                      (cv.score === null || cv.score === undefined)
        } else if (activeView === 'gcms') {
          shouldShow =
            cv.jobCategory === 'GCMS' ||
            (!!cv.jobTitle && /(gc[\s-]*ms|gc\/ms|lab specialist|chromatography)/i.test(cv.jobTitle))
        } else if (activeView === 'starred') {
          shouldShow = cv.starred === true
        }
        
        if (shouldShow) {
          invalidateCache()
          // Add the new CV to the existing list
          setCvData(prevData => {
            // Check if CV already exists (prevent duplicates) - MongoDB uses _id
            const cvId = cv._id || cv.id
            const exists = prevData.some(c => (c._id || c.id) === cvId)
            if (exists) {
              console.log('CV already exists, skipping duplicate')
              return prevData
            }
            // Add new CV at the beginning of the list
            return [cv, ...prevData]
          })
          // Mark that a new CV was added via socket
          setNewCVAdded(true)
          // Clear the flag after a short delay
          setTimeout(() => setNewCVAdded(false), 3000)
        } else {
          // CV doesn't match current view filter, refresh to get updated data
          invalidateCache()
          fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
        }
      }
    })

    // Cleanup on unmount
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('newCVUploaded')
    }
  }, [activeView, fetchCVData, invalidateCache])

  const handleToggleStar = useCallback((id, starred) => {
    // Don't update parent state - let Maintable handle it locally
    // Just make the API call
    axiosInstance.patch(`/api/cv/${id}/starred`, { starred })
      .then(() => {
        toast.success(starred ? 'Added to saved' : 'Removed from saved')
        invalidateCache()
      })
      .catch(err => {
        console.error('Error updating starred status:', err)
        toast.error('Failed to update saved status')
        // On error, refresh to get correct state
        fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
      })
  }, [activeView, searchQuery, minScore, sortBy, sortOrder, currentPage, fetchCVData, invalidateCache])

  const handleDeleteCv = useCallback((id) => {
    // Don't update parent state - let Maintable handle it locally
    // Just make the API call
    axiosInstance.delete(`/api/cv/${id}`)
      .then(() => {
        toast.success('CV deleted')
        invalidateCache()
      })
      .catch(err => {
        console.error('Error deleting CV:', err)
        toast.error('Failed to delete CV')
        // On error, refresh to get correct state
        fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
      })
  }, [activeView, searchQuery, minScore, sortBy, sortOrder, currentPage, fetchCVData, invalidateCache])

  const handleBulkDelete = useCallback((ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      return Promise.resolve()
    }

    const normalizedIds = ids.map(id => id.toString())

    setCvData(prev => prev.filter(cv => !normalizedIds.includes((cv._id || cv.id)?.toString())))

    return axiosInstance.delete('/api/cv/bulk', { data: { ids } })
      .then(() => {
        toast.success(`Deleted ${ids.length} CV(s)`)
        invalidateCache()
      })
      .catch(err => {
        console.error('Error bulk deleting CVs:', err)
        toast.error('Failed to delete selected CVs')
        fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
      })
  }, [activeView, searchQuery, minScore, sortBy, sortOrder, currentPage, fetchCVData, invalidateCache])

  const handleDeleteAllRejected = useCallback(() => {
    return axiosInstance.delete('/api/cv/rejected/all')
      .then(response => {
        const deletedCount = response?.data?.deleted || 0
        toast.success(deletedCount ? `Deleted ${deletedCount} rejected CV(s)` : 'No rejected CVs to delete')
        invalidateCache()
        if (activeView === 'rejected') {
          fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
        }
      })
      .catch(err => {
        console.error('Error deleting rejected CVs:', err)
        toast.error('Failed to delete rejected CVs')
      })
  }, [activeView, searchQuery, minScore, sortBy, sortOrder, currentPage, fetchCVData, invalidateCache])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
    navigate('/login')
  }, [navigate])

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true'
      setIsAuthenticated(authStatus)
    }

    checkAuth()
    // Listen for storage changes (e.g., from other tabs)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Main App Layout Component
  const AppLayout = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          <div className="p-4 lg:p-8">
            {activeView === 'dashboard' && (
              <Dashboard 
                cvData={cvData} 
                loading={loading} 
                onRefresh={() => fetchCVData('dashboard', searchQuery, minScore, sortBy, sortOrder, currentPage)} 
                newCVAdded={newCVAdded}
                onToggleStar={handleToggleStar}
                onDelete={handleDeleteCv}
                onBulkDelete={handleBulkDelete}
                onSearch={handleSearchSubmit}
                searchQuery={searchInput}
                onSortChange={(sort, order) => { setSortBy(sort); setSortOrder(order); }}
                onFilterChange={(score) => setMinScore(score)}
                minScore={minScore}
                sortBy={sortBy}
                sortOrder={sortOrder}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
            {activeView === 'shopify' && (
              <ShopifyApplications 
                cvData={cvData} 
                loading={loading} 
                onRefresh={() => fetchCVData('shopify', searchQuery, minScore, sortBy, sortOrder, currentPage)} 
                newCVAdded={newCVAdded}
                onToggleStar={handleToggleStar}
                onDelete={handleDeleteCv}
                onBulkDelete={handleBulkDelete}
                onSearch={handleSearchSubmit}
                searchQuery={searchInput}
                onSortChange={(sort, order) => { setSortBy(sort); setSortOrder(order); }}
                onFilterChange={(score) => setMinScore(score)}
                minScore={minScore}
                sortBy={sortBy}
                sortOrder={sortOrder}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
            {activeView === 'gcms' && (
              <GCMSApplications 
                cvData={cvData} 
                loading={loading} 
                onRefresh={() => fetchCVData('gcms', searchQuery, minScore, sortBy, sortOrder, currentPage)} 
                newCVAdded={newCVAdded}
                onToggleStar={handleToggleStar}
                onDelete={handleDeleteCv}
                onBulkDelete={handleBulkDelete}
                onSearch={handleSearchSubmit}
                searchQuery={searchInput}
                onSortChange={(sort, order) => { setSortBy(sort); setSortOrder(order); }}
                onFilterChange={(score) => setMinScore(score)}
                minScore={minScore}
                sortBy={sortBy}
                sortOrder={sortOrder}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
            {activeView === 'rejected' && (
              <RejectedCVs 
                cvData={cvData} 
                loading={loading} 
                onRefresh={() => fetchCVData('rejected', searchQuery, minScore, sortBy, sortOrder, currentPage)} 
                newCVAdded={newCVAdded}
                onToggleStar={handleToggleStar}
                onDelete={handleDeleteCv}
                onBulkDelete={handleBulkDelete}
                onDeleteAll={handleDeleteAllRejected}
                onSearch={handleSearchSubmit}
                searchQuery={searchInput}
                onSortChange={(sort, order) => { setSortBy(sort); setSortOrder(order); }}
                onFilterChange={(score) => setMinScore(score)}
                minScore={minScore}
                sortBy={sortBy}
                sortOrder={sortOrder}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
            {activeView === 'starred' && (
              <SavedApplications 
                cvData={cvData} 
                loading={loading} 
                onRefresh={() => fetchCVData('starred', searchQuery, minScore, sortBy, sortOrder, currentPage)} 
                newCVAdded={newCVAdded}
                onToggleStar={handleToggleStar}
                onDelete={handleDeleteCv}
                onBulkDelete={handleBulkDelete}
                onSearch={handleSearchSubmit}
                searchQuery={searchInput}
                onSortChange={(sort, order) => { setSortBy(sort); setSortOrder(order); }}
                onFilterChange={(score) => setMinScore(score)}
                minScore={minScore}
                sortBy={sortBy}
                sortOrder={sortOrder}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
