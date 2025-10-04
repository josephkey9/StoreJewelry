import { useRef, useEffect } from 'react'
import ProductCard from './ProductCard'
import '../App.css'

const Carousel = ({ products }) => {
  const containerRef = useRef(null)

  const scrollBy = (delta) => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }
  
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let isDown = false
    let startX = 0
    let scrollLeft = 0

    const onDown = (e) => {
      isDown = true
      startX = e.touches ? e.touches[0].pageX : e.pageX
      scrollLeft = el.scrollLeft
    }
    const onMove = (e) => {
      if (!isDown) return
      const x = e.touches ? e.touches[0].pageX : e.pageX
      const walk = startX - x
      el.scrollLeft = scrollLeft + walk
    }
    const onUp = () => {
      isDown = false
    }

    el.addEventListener('mousedown', onDown)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseup', onUp)
    el.addEventListener('mouseleave', onUp)
    el.addEventListener('touchstart', onDown, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: true })
    el.addEventListener('touchend', onUp)

    return () => {
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseup', onUp)
      el.removeEventListener('mouseleave', onUp)
      el.removeEventListener('touchstart', onDown)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <div className="carousel">
      <button
        className="nav left"
        onClick={() => scrollBy(-400)}
        aria-label="Prev"
      >
        ‹
      </button>
      <div className="list" ref={containerRef}>
        {products.map((p, index) => (
          <ProductCard key={p.id || index} product={p} />
        ))}
      </div>
      <button
        className="nav right"
        onClick={() => scrollBy(400)}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  )
}

export default Carousel
