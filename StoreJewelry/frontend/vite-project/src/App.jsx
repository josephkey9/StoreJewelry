import { useState, useEffect } from 'react'
import Carousel from './components/Carousel.jsx'
import './App.css'

// Production ve development için API URL
const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [data, setData] = useState({ products: [], goldPricePerGramUSD: 0 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minPopularity, setMinPopularity] = useState('')

  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPopularity: ''
  })

  useEffect(() => {
    loadProducts()
  }, [appliedFilters])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const query = new URLSearchParams({
        ...(appliedFilters.minPrice && { minPrice: appliedFilters.minPrice }),
        ...(appliedFilters.maxPrice && { maxPrice: appliedFilters.maxPrice }),
        ...(appliedFilters.minPopularity && { minPopularity: appliedFilters.minPopularity })
      }).toString()

      const url = `${API_URL}/api/gold-price?${query}`
      const resp = await fetch(url)
      
      if (!resp.ok) throw new Error("API error")
      const json = await resp.json()
      setData(json)
    } catch (e) {
      setError('Failed to load products')
      console.error('Load error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      minPrice,
      maxPrice,
      minPopularity
    })
  }

  const handleClearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setMinPopularity('')
    setAppliedFilters({
      minPrice: '',
      maxPrice: '',
      minPopularity: ''
    })
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Rings</h1>
      </header>

      <div className="filters">
        <div>
          <label>Min Price:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label>Max Price:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="10000"
            min="0"
          />
        </div>
        <div>
          <label>Min Popularity:</label>
          <input
            type="number"
            step="0.1"
            value={minPopularity}
            onChange={(e) => setMinPopularity(e.target.value)}
            placeholder="0-5"
            min="0"
            max="5"
          />
        </div>
        <button className="filter-btn apply" onClick={handleApplyFilters}>
          Apply Filters
        </button>
        <button className="filter-btn clear" onClick={handleClearFilters}>
          Clear
        </button>
      </div>

      {loading && <div className="status">Loading…</div>}
      {error && <div className="status error">{error}</div>}
      {!loading && !error && (
        <Carousel products={data.products} />
      )}
    </div>
  )
}

export default App