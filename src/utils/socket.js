import { io } from 'socket.io-client'
import axiosInstance from '../api/axiosInstance'

// Get the base URL from axios instance and convert to socket.io URL
const getSocketURL = () => {
  const baseURL = axiosInstance.defaults.baseURL
  // Remove trailing slash if present
  return baseURL.replace(/\/$/, '')
}

const socket = io(getSocketURL(), {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
})

export default socket

