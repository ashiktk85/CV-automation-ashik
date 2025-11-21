import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import UploadCV from './components/UploadCV'
import { FiMenu, FiX } from 'react-icons/fi'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  const [cvData, setCvData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCVData = () => {
    setLoading(true)
    fetch('/api/cv/list')
      .then(res => res.json())
      .then(data => {
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
    fetchCVData()
  }, [])

  const handleCVUploaded = () => {
    fetchCVData()
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
              <Dashboard cvData={cvData} loading={loading} onRefresh={fetchCVData} />
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
