import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'rushi-cart-v1'
const MAX_ITEM_QUANTITY = 50

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved.filter((item) => item && Number.isFinite(Number(item.id)) && Number.isFinite(Number(item.price)) && Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0).map((item) => ({ ...item, quantity: Math.min(MAX_ITEM_QUANTITY, Math.floor(Number(item.quantity))) })) : []
  } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    return readCart()
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* Cart remains usable if browser storage is unavailable. */ }
  }, [items])

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    add: (food) => setItems((current) => {
      const exists = current.find((item) => item.id === food.id)
      return exists ? current.map((item) => item.id === food.id ? { ...item, quantity: Math.min(MAX_ITEM_QUANTITY, item.quantity + 1) } : item) : [...current, { ...food, quantity: 1 }]
    }),
    setQuantity: (id, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity: Math.min(MAX_ITEM_QUANTITY, Math.floor(quantity)) } : item)),
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
