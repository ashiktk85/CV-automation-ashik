import { io } from 'socket.io-client'
import axiosInstance from '../api/axiosInstance'


const getSocketURL = () => {
  const baseURL = axiosInstance.defaults.baseURL
  return baseURL.replace(/\/$/, '')
}

const socket = io(getSocketURL(), {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
})

export default socket

