import { useEffect, useState } from 'react'
import { ShoppingCart, Shirt, Search, Star, Menu } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar({ cartCount }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shirt className="w-7 h-7 text-blue-600" />
            <span>MensWear</span>
          </div>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2 w-1/2">
          <Search className="w-5 h-5 text-gray-500" />
          <input placeholder="Search tees, jeans, jackets..." className="bg-transparent outline-none px-2 w-full" />
        </div>

        <div className="flex items-center gap-4">
          <a href="/test" className="text-sm text-gray-600 hover:text-gray-900">Test</a>
          <div className="relative">
            <ShoppingCart className="w-7 h-7" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">{cartCount}</span>
            )}
          </div>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input placeholder="Search tees, jeans, jackets..." className="bg-transparent outline-none px-2 w-full" />
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Elevate your everyday fit</h1>
          <p className="mt-4 text-gray-600 text-lg">Premium men’s basics built for comfort and style. Tees, jeans, jackets and more.</p>
          <div className="mt-6 flex gap-3">
            <a href="#products" className="bg-gray-900 text-white px-5 py-3 rounded-lg">Shop New Arrivals</a>
            <a href="#categories" className="border border-gray-300 px-5 py-3 rounded-lg">Explore Categories</a>
          </div>
        </div>
        <div className="aspect-square bg-white rounded-2xl shadow-inner p-8 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-blue-100" />
          <div className="rounded-xl bg-indigo-100" />
          <div className="rounded-xl bg-slate-100" />
          <div className="rounded-xl bg-gray-100" />
        </div>
      </div>
    </section>
  )
}

function ProductCard({ p, onAdd }) {
  return (
    <div className="group bg-white rounded-xl border hover:shadow-md transition overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 relative">
        {p.images?.[0] ? (
          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        <button onClick={() => onAdd(p)} className="absolute bottom-3 right-3 bg-gray-900 text-white text-sm px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition">Add</button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{p.title}</h3>
          <span className="font-semibold">${p.price.toFixed(2)}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.round(p.rating || 4.5) ? '' : 'text-gray-300'}`} />
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.description || 'Comfort cotton, perfect fit.'}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {(p.sizes || []).map(s => (
            <span key={s} className="text-xs border px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductsGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (p) => setCart(prev => [...prev, p])

  return (
    <section id="products" className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">New Arrivals</h2>
        <span className="text-sm text-gray-500">{products.length} products</span>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} p={p} onAdd={addToCart} />
          ))}
        </div>
      )}
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} MensWear. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Contact</a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar cartCount={cartCount} />
      <Hero />
      <div id="categories" className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {["T-Shirts", "Jeans", "Jackets", "Shoes"].map((c, i) => (
          <div key={i} className="rounded-xl p-6 border bg-gradient-to-br from-gray-50 to-white hover:shadow-sm">
            <p className="font-semibold">{c}</p>
            <p className="text-sm text-gray-500">Shop {c.toLowerCase()}</p>
          </div>
        ))}
      </div>
      <ProductsGrid />
      <Footer />
    </div>
  )
}

export default App
