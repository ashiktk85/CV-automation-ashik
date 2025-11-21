import { FiX, FiDownload } from 'react-icons/fi'
import axiosInstance from '../api/axiosInstance'

function PDFPreviewModal({ isOpen, onClose, filePath, fileName }) {
  if (!isOpen) return null

  const pdfUrl = `${axiosInstance.defaults.baseURL}${filePath}`

  const handleDownload = () => {
    window.open(pdfUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {fileName}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                title="Download PDF"
              >
                <FiDownload size={16} />
                <span>Download</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full min-h-[600px]"
              title="PDF Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFPreviewModal

