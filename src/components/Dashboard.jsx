import { useState, useEffect } from 'react'
import { FiRefreshCw, FiFileText, FiEye, FiCalendar, FiUser, FiMail, FiBriefcase, FiCheckCircle, FiDownload } from 'react-icons/fi'
import PDFPreviewModal from './PDFPreviewModal'
import { BiSort } from "react-icons/bi";
import Statcard from './Statcard'
import Maintable from './Maintable'
import SearchBar from './Search'

function Dashboard({ cvData, loading, onRefresh, newCVAdded }) {
  const [newCVNotification, setNewCVNotification] = useState(null)
  const [previewModal, setPreviewModal] = useState({ isOpen: false, filePath: null, fileName: null })

  useEffect(() => {
    if (newCVAdded) {
      setNewCVNotification('New CV received!')
      const timer = setTimeout(() => {
        setNewCVNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [newCVAdded])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePreview = (filePath, fileName) => {
    setPreviewModal({ isOpen: true, filePath, fileName })
  }

  const handleClosePreview = () => {
    setPreviewModal({ isOpen: false, filePath: null, fileName: null })
  }

  return (
    <div className="space-y-6 px-8 py-4">
      {/* Header */}
      <div className="flex  sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">View and manage all CV submissions</p>
         
          
        </div>
        <div>
          <p className="text-md text-green-600 mt-1 flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Real-time updates enabled</span>
          </p>
          </div>
        
      </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Statcard heading="Total CVs " value="1005" description="This is the total number of CVs that have been processed so far" smallStats="+20 today · Last hour" badgeBg="bg-blue-100" badgeText="text-blue-700" accentColor="bg-blue-100" bgColor="bg-white" />
          <Statcard heading="Total CVs Today" value="34" description="This is the total number of CVs that have been processed so far" smallStats="+20 today · Last hour" badgeBg="bg-green-100" badgeText="text-green-700" accentColor="bg-green-100" bgColor="bg-white" />
          <Statcard heading="Total CVs this week" value="112" description="This is the total number of CVs that have been processed so far" smallStats="+20 today · Last hour" badgeBg="bg-orange-100" badgeText="text-orange-700" accentColor="bg-orange-100" bgColor="bg-white" />
          <Statcard heading="Total CVs this month" value="234" description="This is the total number of CVs that have been processed so far" smallStats="+20 today · Last hour" badgeBg="bg-violet-100" badgeText="text-violet-700" accentColor="bg-violet-100" bgColor="bg-white" />
          </div>


          <div className='flex items-center justify-between'>
          <SearchBar />
          <div className="flex items-center space-x-3">
          {newCVNotification && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-fade-in">
              <FiCheckCircle size={18} />
              <span className="text-sm font-medium">{newCVNotification}</span>
            </div>
          )}
            <button 
          className="flex items-center space-x-2 px-6 py-1 bg-white border border-black/40 text-black rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
           <BiSort size={18} />
            <span className='text-black font-bold'>Filter</span>
          </button>

          <button 
          className="flex items-center space-x-2 px-6 py-1 bg-white border border-black/40 text-black rounded-lg hover:bg-gray-100 transition-colors shadow-md"
          >
           <BiSort size={18} />
            <span className='text-black font-bold'>Sort</span>
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-6 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
          >
            <FiRefreshCw size={18} />
            <span className='font-bold'>Refresh</span>
          </button>

        </div>
          </div>
       
      {/* Table */}
      <Maintable />

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        filePath={previewModal.filePath}
        fileName={previewModal.fileName}
      />
    </div>
  )
}

export default Dashboard

