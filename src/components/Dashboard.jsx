import { useState, useEffect } from 'react'
import { FiRefreshCw, FiFileText, FiEye, FiCalendar, FiUser, FiMail, FiBriefcase, FiCheckCircle, FiDownload } from 'react-icons/fi'
import PDFPreviewModal from './PDFPreviewModal'

function Dashboard({ cvData, loading, onRefresh, newCVAdded }) {
  const [newCVNotification, setNewCVNotification] = useState(null)
  const [previewModal, setPreviewModal] = useState({ isOpen: false, filePath: null, fileName: null })

  useEffect(() => {
    // Show notification only when a new CV is added via socket
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">View and manage all CV submissions</p>
          <p className="text-sm text-green-600 mt-1 flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Real-time updates enabled</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {newCVNotification && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-fade-in">
              <FiCheckCircle size={18} />
              <span className="text-sm font-medium">{newCVNotification}</span>
            </div>
          )}
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <FiRefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total CVs</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{cvData.length}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FiFileText className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Processed</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{cvData.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiFileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Storage Used</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {cvData.reduce((sum, cv) => {
                  const size = parseFloat(cv.file.fileSize) || 0
                  return sum + size
                }, 0).toFixed(1)} kB
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiDownload className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">CV Submissions</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading CV data...</p>
          </div>
        ) : cvData.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="mx-auto text-gray-400" size={48} />
            <p className="mt-4 text-gray-600">No CV submissions yet</p>
            <p className="text-sm text-gray-500">CVs will appear here when uploaded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <FiUser size={16} />
                      <span>Full Name</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <FiMail size={16} />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <FiBriefcase size={16} />
                      <span>Job Title</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <FiCalendar size={16} />
                      <span>Timestamp</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cvData.map((cv) => (
                  <tr key={cv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cv.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{cv.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{cv.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{formatDate(cv.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{cv.file.fileName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {cv.file.fileSize} • {cv.file.fileExtension.toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handlePreview(cv.file.filePath, cv.file.fileName)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                        title="Preview PDF"
                      >
                        <FiEye size={14} />
                        <span>Preview</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

