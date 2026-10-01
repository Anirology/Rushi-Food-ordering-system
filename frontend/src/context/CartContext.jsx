import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'rushi-cart-v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items])

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    add: (food) => setItems((current) => {
      const exists = current.find((item) => item.id === food.id)
      return exists ? current.map((item) => item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...food, quantity: 1 }]
    }),
    setQuantity: (id, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item)),
    remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clear: () => setItems([]),
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
