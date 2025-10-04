import { useState } from 'react'
import Rating from './Rating'
import '../App.css'

const COLORS = [
  { key: 'yellow', label: 'Yellow Gold', hex: '#e3c24f' },
  { key: 'rose', label: 'Rose Gold', hex: '#e6a29e' },
  { key: 'white', label: 'White Gold', hex: '#cfd4d7' }
]

const ProductCard = ({ product }) => {
  const [color, setColor] = useState('yellow')

  const currentImg =
    product.images?.[color] || Object.values(product.images || {})[0] || ''

  return (
    <div className="product-card">
      <div className="image-wrap">
        <img src={currentImg} alt={product.name || 'Jewelry'} />
      </div>
      <div className="meta">
        <div className="title">{product.name}</div>
        <div className="price">
          ${product.priceUsd?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) ?? '–'} USD
        </div>
        <div className="color-picker">
          {COLORS.map((c) => (
            <button
              key={c.key}
              aria-label={c.label}
              className={`swatch ${color === c.key ? 'active' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => setColor(c.key)}
            />
          ))}
        </div>
        <Rating value={product.popularity} />
      </div>
    </div>
  )
}

export default ProductCard
