import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import UploadCV from './components/UploadCV'
import { FiMenu, FiX } from 'react-icons/fi'
import axiosInstance from './api/axiosInstance'
import socket from './utils/socket'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  const [cvData, setCvData] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCVAdded, setNewCVAdded] = useState(false)

  const fetchCVData = () => {
    setLoading(true)
    axiosInstance.get('/api/cv/list')
      .then(response => {
        const data = response.data
        if (data.success) {
          setCvData(data.data || [])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching CV data:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    // Initial data fetch
    fetchCVData()

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
        // Add the new CV to the existing list
        setCvData(prevData => {
          // Check if CV already exists (prevent duplicates)
          const exists = prevData.some(cv => cv.id === eventData.data.id)
          if (exists) {
            return prevData
          }
          // Mark that a new CV was added via socket
          setNewCVAdded(true)
          // Clear the flag after a short delay
          setTimeout(() => setNewCVAdded(false), 3000)
          // Add new CV at the beginning of the list
          return [eventData.data, ...prevData]
        })
      }
    })

    // Cleanup on unmount
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('newCVUploaded')
    }
  }, [])

  const handleCVUploaded = () => {
    // No need to manually refresh anymore - socket will handle it
    // But we can still keep this for immediate feedback if needed
  }

  return (
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
        />

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          <div className="p-4 lg:p-8">
            {activeView === 'dashboard' && (
              <Dashboard cvData={cvData} loading={loading} onRefresh={fetchCVData} newCVAdded={newCVAdded} />
            )}
            {activeView === 'upload' && (
              <UploadCV onUploadSuccess={handleCVUploaded} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
