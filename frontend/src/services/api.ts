import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({ baseURL: BASE_URL })

export function apiAuth() {
  const instance = axios.create({ baseURL: BASE_URL })
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return instance
}

