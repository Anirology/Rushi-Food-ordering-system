import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

export const getFoods = async (params = {}) => (await api.get('/foods', { params })).data
export const getCategories = async () => (await api.get('/categories')).data
export const submitOrder = async (payload) => (await api.post('/orders', payload)).data
export const getOrders = async (email) => (await api.get('/orders', { params: { email } })).data
export const getDashboard = async () => (await api.get('/admin/dashboard')).data
export const getAdminOrders = async () => (await api.get('/admin/orders')).data
export const setOrderStatus = async (id, status) => (await api.patch(`/admin/orders/${id}/status`, { status })).data
