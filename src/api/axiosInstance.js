import axios from 'axios'

const baseURL = 'https://cv-automation-backend-ifrv.onrender.com'
const localBaseURL = 'http://localhost:3001'

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})


axiosInstance.interceptors.request.use(
  (config) => {

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (isAuthenticated) {

    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userEmail')
 
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)


axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {

    if (error.response) {

      console.error('API Error:', error.response.data)
    } else if (error.request) {

      console.error('Network Error:', error.request)
    } else {

      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

