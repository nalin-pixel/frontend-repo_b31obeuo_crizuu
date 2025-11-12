import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function HotelCard({ hotel, onBook }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {hotel.image ? (
        <img src={hotel.image} alt={hotel.name} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-gradient-to-br from-indigo-100 to-purple-100" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
            <p className="text-sm text-gray-500">{hotel.city}, {hotel.country}</p>
          </div>
          <div className="text-yellow-500 font-semibold">⭐ {hotel.rating?.toFixed?.(1) || hotel.rating}</div>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-indigo-600 font-bold">${hotel.price_per_night}/night</span>
          <button onClick={() => onBook(hotel)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Book</button>
        </div>
      </div>
    </div>
  )
}

function AuthSection({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const url = isLogin ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`
      const body = isLogin ? { email, password } : { name, email, password }
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Auth failed')
      onAuth({ token: data.token || data.id, name: data.name, email: data.email })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{isLogin ? 'Login' : 'Create account'}</h2>
        <button className="text-sm text-indigo-600" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account?' : 'Have an account?'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border rounded-md px-3 py-2" required />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full border rounded-md px-3 py-2" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border rounded-md px-3 py-2" required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700">{isLogin ? 'Login' : 'Sign up'}</button>
      </form>
    </div>
  )
}

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) setSent(true)
  }
  if (sent) return <div className="p-6 bg-green-50 border border-green-200 rounded-xl">Thanks! We'll be in touch.</div>
  return (
    <form onSubmit={submit} className="space-y-3 bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold">Contact us</h3>
      <input className="w-full border rounded-md px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} required />
      <input className="w-full border rounded-md px-3 py-2" placeholder="Email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} type="email" required />
      <input className="w-full border rounded-md px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e)=>setForm(f=>({...f,phone:e.target.value}))} />
      <textarea className="w-full border rounded-md px-3 py-2" placeholder="Message" rows={3} value={form.message} onChange={(e)=>setForm(f=>({...f,message:e.target.value}))} required />
      <button className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700">Send</button>
    </form>
  )
}

export default function App() {
  const [hotels, setHotels] = useState([])
  const [user, setUser] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/hotels`)
        const data = await res.json()
        setHotels(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchHotels()
  }, [])

  const seedHotels = async () => {
    const presets = [
      { name: 'Grand Aurora Palace', city: 'Paris', country: 'France', price_per_night: 420, rating: 4.8, image: '', description: 'Iconic luxury near the Seine with Michelin dining.', amenities: ['Spa','Pool','Butler'], phone: '+33 1 23 45 67 89', email: 'paris@aurora.com' },
      { name: 'Celestial Bay Resort', city: 'Maldives', country: 'Maldives', price_per_night: 680, rating: 4.9, image: '', description: 'Overwater villas with private decks and turquoise lagoons.', amenities: ['Private Villa','Snorkeling','Sunset Cruise'], phone: '+960 123-4567', email: 'stay@celestialbay.mv' },
      { name: 'Imperial Crown Hotel', city: 'Tokyo', country: 'Japan', price_per_night: 390, rating: 4.7, image: '', description: 'Skyline views in the heart of Marunouchi.', amenities: ['Onsen','Sky Bar','Tea Ceremony'], phone: '+81 3-0000-0000', email: 'hello@imperialcrown.jp' },
      { name: 'Elysium Heights', city: 'New York', country: 'USA', price_per_night: 450, rating: 4.8, image: '', description: 'Steps from Central Park with a world-class spa.', amenities: ['Spa','Gym','Concierge'], phone: '+1 (212) 555-0189', email: 'book@elysiumheights.com' },
      { name: 'Azure Dunes Retreat', city: 'Dubai', country: 'UAE', price_per_night: 520, rating: 4.9, image: '', description: 'Beachfront opulence with desert excursions.', amenities: ['Private Beach','Desert Safari','Infinity Pool'], phone: '+971 4 123 4567', email: 'stay@azuredunes.ae' },
    ]
    for (const h of presets) {
      await fetch(`${API_BASE}/api/hotels`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(h) })
    }
    const res = await fetch(`${API_BASE}/api/hotels`)
    setHotels(await res.json())
  }

  const book = async (hotel) => {
    setSelected(hotel)
  }

  const makeBooking = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      user_id: user.token,
      hotel_id: selected.id,
      check_in: form.get('check_in'),
      check_out: form.get('check_out'),
      guests: Number(form.get('guests')),
      phone: form.get('phone')
    }
    const res = await fetch(`${API_BASE}/api/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      alert('Booking request received!')
      setSelected(null)
    } else {
      const data = await res.json().catch(()=>({ detail: 'Error'}))
      alert(data.detail || 'Error creating booking')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-700">LuxStay</div>
          <nav className="flex items-center gap-4">
            <a className="text-sm text-gray-600 hover:text-indigo-600" href="#hotels">Hotels</a>
            <a className="text-sm text-gray-600 hover:text-indigo-600" href="#contact">Contact</a>
          </nav>
          <div>
            {user ? (
              <div className="text-sm">Hi, {user.name || user.email}</div>
            ) : (
              <span className="text-sm text-gray-600">Guest</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 id="hotels" className="text-2xl font-semibold">Top 5-star hotels</h2>
              <button onClick={seedHotels} className="text-sm px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-50">Load sample hotels</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {hotels.map(h => <HotelCard key={h.id} hotel={h} onBook={book} />)}
              {hotels.length === 0 && (
                <div className="col-span-full p-6 bg-white rounded-xl shadow text-center text-gray-600">No hotels yet. Click "Load sample hotels".</div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            {!user && <AuthSection onAuth={setUser} />}
            <ContactSection />
          </div>
        </section>

        {selected && user && (
          <section className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Book {selected.name}</h3>
                <button onClick={()=>setSelected(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={makeBooking} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Check-in</label>
                    <input name="check_in" type="date" className="w-full border rounded-md px-3 py-2" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Check-out</label>
                    <input name="check_out" type="date" className="w-full border rounded-md px-3 py-2" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Guests</label>
                    <input name="guests" type="number" min="1" defaultValue={2} className="w-full border rounded-md px-3 py-2" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Phone</label>
                    <input name="phone" type="tel" className="w-full border rounded-md px-3 py-2" />
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700">Confirm booking</button>
              </form>
            </div>
          </section>
        )}

        {selected && !user && (
          <section className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-lg text-center space-y-3">
              <h3 className="text-lg font-semibold">Login required</h3>
              <p className="text-gray-600">Please login or create an account to book.</p>
              <button onClick={()=>setSelected(null)} className="px-4 py-2 rounded-md border">Close</button>
            </div>
          </section>
        )}
      </main>

      <footer id="contact" className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} LuxStay. All rights reserved.
      </footer>
    </div>
  )
}
