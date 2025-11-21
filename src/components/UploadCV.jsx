import { useState } from 'react'
import { FiUpload, FiFileText, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'

function UploadCV({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    jobTitle: '',
    timestamp: ''
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Please select a PDF file' })
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 10MB' })
        return
      }
      setFile(selectedFile)
      setMessage({ type: '', text: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a PDF file' })
      return
    }

    if (!formData.fullName || !formData.email || !formData.jobTitle) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('fullName', formData.fullName)
      uploadFormData.append('email', formData.email)
      uploadFormData.append('jobTitle', formData.jobTitle)
      uploadFormData.append('timestamp', formData.timestamp || new Date().toISOString())

      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: uploadFormData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'CV uploaded successfully!' })
        setFormData({
          fullName: '',
          email: '',
          jobTitle: '',
          timestamp: ''
        })
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById('file-input')
        if (fileInput) fileInput.value = ''
        
        // Call success callback
        if (onUploadSuccess) {
          setTimeout(() => {
            onUploadSuccess()
          }, 1000)
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed. Please try again.' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Upload CV</h1>
        <p className="text-gray-600 mt-1">Submit a new CV for processing</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Alert */}
          {message.text && (
            <div
              className={`p-4 rounded-lg flex items-center space-x-2 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <FiCheck size={20} />
              ) : (
                <FiAlertCircle size={20} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="Enter email address"
            />
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="Enter job title"
            />
          </div>

          {/* Timestamp (Optional) */}
          <div>
            <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
              Timestamp (Optional)
            </label>
            <input
              type="datetime-local"
              id="timestamp"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
              PDF File <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
              <div className="space-y-1 text-center">
                {file ? (
                  <div className="flex flex-col items-center">
                    <FiFileText className="text-indigo-600" size={48} />
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">{file.name}</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024).toFixed(2)} kB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        const fileInput = document.getElementById('file-input')
                        if (fileInput) fileInput.value = ''
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                    >
                      <FiX size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto text-gray-400" size={48} />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-input"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-input"
                          name="file"
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors shadow-md font-medium"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FiUpload size={20} />
                <span>Upload CV</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadCV

