import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ShopifyApplications from './components/ShopifyApplications'
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
  const [minScore, setMinScore] = useState(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const fetchCVData = useCallback((view, search = '', score = null, sort = 'createdAt', order = 'desc', page = 1) => {
    // Only set loading when explicitly fetching from backend (not for star/delete operations)
    setLoading(true)
    
    // Determine which endpoint to call based on view
    let endpoint = '/api/cv/list'
    if (view === 'dashboard') {
      endpoint = '/api/cv/accepted'
    } else if (view === 'shopify') {
      endpoint = '/api/cv/shopify'
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
    
    axiosInstance.get(fullUrl)
      .then(response => {
        const data = response.data
        if (data.success) {
          setCvData(data.data || [])
          setPagination(data.pagination || null)
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
    setMinScore(null)
    setSortBy('createdAt')
    setSortOrder('desc')
    setCurrentPage(1)
  }, [activeView])

  // Reset to page 1 when search, sort, or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, minScore, sortBy, sortOrder])

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
        } else if (activeView === 'starred') {
          shouldShow = cv.starred === true
        }
        
        if (shouldShow) {
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
  }, [activeView, fetchCVData])

  const handleToggleStar = useCallback((id, starred) => {
    // Don't update parent state - let Maintable handle it locally
    // Just make the API call
    axiosInstance.patch(`/api/cv/${id}/starred`, { starred })
      .then(() => {
        toast.success(starred ? 'Added to saved' : 'Removed from saved')
      })
      .catch(err => {
        console.error('Error updating starred status:', err)
        toast.error('Failed to update saved status')
        // On error, refresh to get correct state
        fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
      })
  }, [activeView, searchQuery, minScore, sortBy, sortOrder, currentPage, fetchCVData])

  const handleDeleteCv = useCallback((id) => {
    // Don't update parent state - let Maintable handle it locally
    // Just make the API call
    axiosInstance.delete(`/api/cv/${id}`)
      .then(() => {
        toast.success('CV deleted')
      })
      .catch(err => {
        console.error('Error deleting CV:', err)
        toast.error('Failed to delete CV')
        // On error, refresh to get correct state
        fetchCVData(activeView, searchQuery, minScore, sortBy, sortOrder, currentPage)
      })
  }, [activeView, searchQuery, minScore, sortBy, sortOrder, currentPage, fetchCVData])

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
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
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
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
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
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
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
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
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
