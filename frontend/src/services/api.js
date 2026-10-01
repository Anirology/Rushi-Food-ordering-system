import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

export const getFoods = async (params = {}) => (await api.get('/foods', { params })).data
export const getCategories = async () => (await api.get('/categories')).data
export const getFood = async (foodId) => (await api.get(`/foods/${foodId}`)).data
export const submitOrder = async (payload) => (await api.post('/orders', payload)).data
export const getOrder = async (orderNumber) => (await api.get(`/orders/${encodeURIComponent(orderNumber)}`)).data
export const getOrders = async (email) => (await api.get('/orders', { params: { email } })).data
const staffConfig = (credentials) => ({ auth: credentials })
export const getDashboard = async (credentials) => (await api.get('/admin/dashboard', staffConfig(credentials))).data
export const getAdminOrders = async (credentials) => (await api.get('/admin/orders', { ...staffConfig(credentials), params: { limit: 100 } })).data
export const getAdminFoods = async () => (await api.get('/foods', { params: { page: 1, limit: 100, available_only: false } })).data
export const getAdminCategories = async () => (await api.get('/categories')).data
export const getAdminCustomers = async (credentials) => (await api.get('/admin/customers', { ...staffConfig(credentials), params: { limit: 100 } })).data
export const setOrderStatus = async (id, status, credentials) => (await api.patch(`/admin/orders/${id}/status`, { status }, staffConfig(credentials))).data
export const saveAdminFood = async (food, credentials) => food.id
  ? (await api.patch(`/admin/foods/${food.id}`, food, staffConfig(credentials))).data
  : (await api.post('/admin/foods', food, staffConfig(credentials))).data
export const createAdminCategory = async (category, credentials) => (await api.post('/admin/categories', category, staffConfig(credentials))).data
export const deleteAdminCategory = async (id, credentials) => api.delete(`/admin/categories/${id}`, staffConfig(credentials))
