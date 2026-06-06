import axios from 'axios'
import { getUserId } from '../utils/userId'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  config.headers['X-User-ID'] = getUserId()
  return config
})

export interface CreatePlaneData {
  content: string
  nickname?: string
  color: string
}

export interface PaperPlane {
  id: string
  content: string
  nickname?: string
  color: string
  likes: number
  reports: number
  status: string
  createdAt: string
  isFavorited?: boolean
}

export interface Stats {
  totalPlanes: number
  totalUsers: number
  todayPlanes: number
}

export const createPlane = (data: CreatePlaneData) =>
  api.post('/paper-planes', data)

export const getRandomPlane = () =>
  api.get<PaperPlane>('/paper-planes/random')

export const getStats = () =>
  api.get<Stats>('/paper-planes/stats')

export const likePlane = (id: string) =>
  api.post(`/paper-planes/${id}/like`)

export const favoritePlane = (id: string) =>
  api.post(`/paper-planes/${id}/favorite`)

export const unfavoritePlane = (id: string) =>
  api.delete(`/paper-planes/${id}/favorite`)

export const getFavorites = () =>
  api.get<PaperPlane[]>('/favorites')

export const reportPlane = (id: string, reason: string) =>
  api.post(`/paper-planes/${id}/report`, { reason })

export const adminGetPlanes = (params?: { status?: string; search?: string; page?: number }) =>
  api.get<{ planes: PaperPlane[]; total: number }>('/admin/planes', { params })

export const adminDeletePlane = (id: string) =>
  api.delete(`/admin/planes/${id}`)

export const adminRestorePlane = (id: string) =>
  api.post(`/admin/planes/${id}/restore`)

export const adminGetStats = () =>
  api.get<Stats & { reportedPlanes: number }>('/admin/stats')

export const adminLogin = (key: string) =>
  api.post('/admin/login', { key })

export default api
