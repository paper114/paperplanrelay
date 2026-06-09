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
  id: number
  content: string
  nickname?: string
  color: string
  likeCount: number
  reportCount: number
  status: string
  createdAt: string
  isLiked?: boolean
  isFavorited?: boolean
  favoriteAt?: string
}

export interface Stats {
  totalCount: number
}

export interface AdminStats {
  totalPlanes: number
  totalLikes: number
  totalReports: number
  todayPlanes: number
  pendingPlanes: number
}

export interface AdminPlaneItem {
  id: number
  content: string
  nickname?: string
  color: string
  userId: string
  likeCount: number
  reportCount: number
  status: string
  trashReason?: string | null
  trashedAt?: string | null
  createdAt: string
  updatedAt: string
  _count: {
    likes: number
    reports: number
  }
}

export const createPlane = (data: CreatePlaneData) =>
  api.post('/paper-planes', data)

export const getRandomPlane = (excludeId?: number) =>
  api.get<PaperPlane>('/paper-planes/random', {
    params: excludeId ? { excludeId } : undefined,
  })

export const getStats = () =>
  api.get<Stats>('/paper-planes/stats')

export const likePlane = (id: number) =>
  api.post(`/paper-planes/${id}/like`)

export const unlikePlane = (id: number) =>
  api.delete(`/paper-planes/${id}/like`)

export const favoritePlane = (id: number) =>
  api.post(`/paper-planes/${id}/favorite`)

export const unfavoritePlane = (id: number) =>
  api.delete(`/paper-planes/${id}/favorite`)

export const getFavorites = () =>
  api.get<PaperPlane[]>('/favorites')

export const reportPlane = (id: number, reason: string) =>
  api.post(`/paper-planes/${id}/report`, { reason })

export const adminGetPlanes = (params?: { status?: string; search?: string; page?: number; view?: string; trashReason?: string; sort?: string }, adminKey?: string) => {
  const headers: Record<string, string> = {}
  if (adminKey) headers['X-Admin-Key'] = adminKey
  return api.get<{ items: AdminPlaneItem[]; total: number; page: number; pageSize: number; totalPages: number }>('/admin/paper-planes', { params, headers })
}

export const adminDeletePlane = (id: number, adminKey: string) =>
  api.delete(`/admin/paper-planes/${id}`, { headers: { 'X-Admin-Key': adminKey } })

export const adminApprovePlane = (id: number, adminKey: string) =>
  api.patch(`/admin/paper-planes/${id}/approve`, {}, { headers: { 'X-Admin-Key': adminKey } })

export const adminRejectPlane = (id: number, adminKey: string) =>
  api.patch(`/admin/paper-planes/${id}/reject`, {}, { headers: { 'X-Admin-Key': adminKey } })

export const adminRestorePlane = (id: number, adminKey: string) =>
  api.patch(`/admin/paper-planes/${id}/restore`, {}, { headers: { 'X-Admin-Key': adminKey } })

export const adminGetStats = (adminKey: string) =>
  api.get<AdminStats>('/admin/stats', { headers: { 'X-Admin-Key': adminKey } })

export const adminGetSettings = (adminKey: string) =>
  api.get<{ manualReviewEnabled: boolean }>('/admin/settings', { headers: { 'X-Admin-Key': adminKey } })

export const adminSetManualReview = (enabled: boolean, adminKey: string) =>
  api.patch<{ success: boolean; manualReviewEnabled: boolean }>(
    '/admin/settings/manual-review',
    { enabled },
    { headers: { 'X-Admin-Key': adminKey } },
  )

export default api
