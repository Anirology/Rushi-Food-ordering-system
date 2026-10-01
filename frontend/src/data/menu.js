export const menuCategories = ['All dishes', 'Meals', 'Dosa', 'Hoppers', 'Sides', 'Sweets']

export const sampleFoods = [
  { id: 1, name: 'Jaffna banana leaf meal', category: 'Meals', category_id: 1, price: 1450, description: 'Rice, seasonal curries, a crisp papadum and our daily sambol.', image_url: '/assets/food/banana-leaf-meal.png', is_available: true, tag: 'Kitchen favourite' },
  { id: 2, name: 'Masala dosa', category: 'Dosa', category_id: 2, price: 850, description: 'Golden rice and lentil crepe with spiced potato and coconut chutney.', image_url: '/assets/food/masala-dosa.png', is_available: true, tag: 'Made to order' },
  { id: 3, name: 'String hoppers & sothi', category: 'Hoppers', category_id: 3, price: 950, description: 'Soft steamed rice nests served with gentle coconut milk sothi.', image_url: '/assets/food/string-hoppers.png', is_available: true, tag: 'A Jaffna classic' },
  { id: 4, name: 'Medu vadai', category: 'Sides', category_id: 4, price: 450, description: 'Crisp lentil fritters with curry leaves, served with coconut chutney.', image_url: '/assets/food/medu-vadai.png', is_available: true, tag: 'Freshly fried' },
  { id: 5, name: 'Jaffna jackfruit curry', category: 'Meals', category_id: 1, price: 780, description: 'Young jackfruit simmered slowly with roasted spices and curry leaves.', image_url: '/assets/food/jackfruit-curry.png', is_available: true, tag: 'Slow cooked' },
]

export const foodImage = (food) => food.image_url?.startsWith('http') ? food.image_url : food.image_url?.startsWith('/') ? food.image_url : '/assets/food/banana-leaf-meal.png'
