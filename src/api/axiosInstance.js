import axios from 'axios'

const baseURL = 'https://cv-automation-backend-ifrv.onrender.com'
const localBaseURL = 'http://localhost:3001'

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

