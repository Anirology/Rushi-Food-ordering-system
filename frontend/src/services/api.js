import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 8000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export const getFoods = async (params = {}) => (await api.get('/foods', { params })).data
export const getCategories = async () => (await api.get('/categories')).data
export const getFood = async (foodId) => (await api.get(`/foods/${foodId}`)).data
export const submitOrder = async (payload) => (await api.post('/orders', payload)).data
export const registerCustomer = async (payload) => (await api.post('/auth/register', payload)).data
export const loginCustomer = async (payload) => (await api.post('/auth/login', payload)).data
export const loginStaff = async (payload) => (await api.post('/auth/staff/login', payload)).data
export const getSession = async () => (await api.get('/auth/me')).data
export const logoutSession = async () => {
  try { await api.post('/auth/logout') } catch (error) {
    if (error.response?.status !== 401) throw error
    await api.post('/auth/clear-cookie')
  }
}
export const verifyEmail = async (token) => (await api.post('/auth/verify-email', { token })).data
export const requestPasswordReset = async (email) => (await api.post('/auth/forgot-password', { email })).data
export const resetPassword = async (token, password) => api.post('/auth/reset-password', { token, password })
export const updateProfile = async (payload) => (await api.patch('/auth/profile', payload)).data
export const getOrders = async () => (await api.get('/orders')).data
export const getDashboard = async () => (await api.get('/admin/dashboard')).data
export const getAdminOrders = async () => (await api.get('/admin/orders', { params: { limit: 100 } })).data
export const getAdminFoods = async () => (await api.get('/foods', { params: { page: 1, limit: 100, available_only: false } })).data
export const getAdminCategories = async () => (await api.get('/categories')).data
export const getAdminCustomers = async () => (await api.get('/admin/customers', { params: { limit: 100 } })).data
export const setOrderStatus = async (id, status) => (await api.patch(`/admin/orders/${id}/status`, { status })).data
export const saveAdminFood = async (food) => food.id
  ? (await api.patch(`/admin/foods/${food.id}`, food)).data
  : (await api.post('/admin/foods', food)).data
export const createAdminCategory = async (category) => (await api.post('/admin/categories', category)).data
export const deleteAdminCategory = async (id) => api.delete(`/admin/categories/${id}`)
