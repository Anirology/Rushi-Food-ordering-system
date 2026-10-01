import { Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import FoodCard from '../components/FoodCard.jsx'
import { menuCategories, sampleFoods } from '../data/menu.js'
import { getFoods } from '../services/api.js'

export default function MenuPage() {
  const [category, setCategory] = useState('All dishes')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [foods, setFoods] = useState(sampleFoods)
  const [page, setPage] = useState(1)

  useEffect(() => {
    getFoods({ page, limit: 20, available_only: true }).then((data) => {
      if (data?.length) setFoods(data.map((food) => ({ ...food, category: food.category?.name || sampleFoods.find((item) => item.category_id === food.category_id)?.category || 'Kitchen' })))
    }).catch(() => {})
  }, [page])

  const visibleFoods = useMemo(() => {
    const filtered = foods.filter((food) => (category === 'All dishes' || food.category === category) && `${food.name} ${food.description}`.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price)
    if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
    return filtered
  }, [foods, category, search, sort])

  return (
    <div className="menu-page page-shell">
      <div className="menu-title-row"><div><span className="eyebrow"><i /> Our kitchen, today</span><h1>Something good<br /><em>is on the table.</em></h1></div><p>Familiar favourites and traditional dishes,<br />prepared fresh in our kitchen.</p></div>
      <div className="menu-toolbar"><div className="category-tabs" role="tablist" aria-label="Food categories">{menuCategories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="menu-controls"><label className="search-field"><Search size={17} /><input aria-label="Search dishes" placeholder="Find a dish…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label className="sort-field"><SlidersHorizontal size={15} /><select aria-label="Sort food" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Our favourites</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div></div>
      <div className="menu-result-line"><span>{visibleFoods.length} dishes to choose from</span><span>All made fresh in our kitchen</span></div>
      <div className="food-grid menu-food-grid">{visibleFoods.map((food, index) => <FoodCard key={food.id} food={food} index={index} />)}</div>
      {!visibleFoods.length && <div className="empty-state"><span className="empty-symbol">ற</span><h2>Nothing on the table just yet.</h2><p>Try another search or choose a different category.</p></div>}
    </div>
  )
}
