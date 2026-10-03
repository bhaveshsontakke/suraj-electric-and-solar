import { Star, Quote } from 'lucide-react'
import Link from 'next/link'

const reviews = [
  { name: 'Rajesh Sharma', location: 'Pune, MH', rating: 5, capacity: '5 kW Residential', text: 'My monthly electricity bill dropped from ₹4,200 to just ₹350! The installation was smooth, took only 2 days. The team was professional and explained everything clearly. Highly recommend SolarPro!', date: 'August 2026', savings: '₹46,000/year' },
  { name: 'Priya Mehta', location: 'Nashik, MH', rating: 5, capacity: '10 kW Commercial', text: 'We installed solar for our garment factory. Electricity savings are ₹85,000 per year. System is working perfectly. SolarPro handled all paperwork and net metering connection. Very impressed!', date: 'July 2026', savings: '₹85,000/year' },
  { name: 'Suresh Patil', location: 'Kolhapur, MH', rating: 5, capacity: '3 kW Residential', text: 'Excellent quality panels and inverter. SolarPro helped us get government subsidy which brought down the cost significantly. Our rooftop system generates more than enough power.', date: 'September 2026', savings: '₹28,000/year' },
  { name: 'Anita Desai', location: 'Solapur, MH', rating: 5, capacity: '7 kW Residential', text: 'The entire process was hassle-free. From site survey to final installation, SolarPro was punctual and professional. The monitoring app is very easy to use. Very happy with this investment.', date: 'June 2026', savings: '₹62,000/year' },
  { name: 'Vikram Joshi', location: 'Aurangabad, MH', rating: 5, capacity: '15 kW Commercial', text: 'We have a hotel and SolarPro installed a 15 kW rooftop system. ROI is much better than expected. The after-sales service team is responsive whenever we have questions.', date: 'May 2026', savings: '₹1,20,000/year' },
  { name: 'Meena Kulkarni', location: 'Nagpur, MH', rating: 4, capacity: '4 kW Residential', text: 'Good product and service. Installation was done cleanly. The system is performing as promised. Customer support is helpful. I would recommend SolarPro to anyone considering solar.', date: 'August 2026', savings: '₹36,000/year' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={16} color={s <= rating ? '#f5a623' : '#e2e8f0'} fill={s <= rating ? '#f5a623' : '#e2e8f0'} />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #112240)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>⭐ Customer Reviews</div>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
            What Our Customers <span className="text-solar-gradient">Say</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
            Real reviews from real customers. See why 500+ families and businesses trust SolarPro.
          </p>
        </div>
      </section>

      {/* Rating summary */}
      <section style={{ padding: '48px 24px', background: 'white', borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 64, fontWeight: 900, color: 'var(--gray-900)', lineHeight: 1 }}>{avgRating}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '8px 0' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={24} color="#f5a623" fill="#f5a623" />)}
            </div>
            <div style={{ color: 'var(--gray-500)', fontSize: 14 }}>Average Rating</div>
          </div>
          <div style={{ width: 1, height: 80, background: 'var(--gray-200)' }} />
          <div>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--gray-900)' }}>{reviews.length}+</div>
            <div style={{ color: 'var(--gray-500)', fontSize: 14 }}>Total Reviews</div>
          </div>
          <div style={{ width: 1, height: 80, background: 'var(--gray-200)' }} />
          <div>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--gray-900)' }}>99%</div>
            <div style={{ color: 'var(--gray-500)', fontSize: 14 }}>Recommend Us</div>
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section style={{ padding: '60px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {reviews.map((review, i) => (
              <div key={i} className="card" style={{ position: 'relative' }}>
                <Quote size={32} color="var(--gray-200)" style={{ position: 'absolute', top: 20, right: 20 }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: `linear-gradient(135deg, #e8751a, #f5a623)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: 'white', fontWeight: 700, flexShrink: 0,
                  }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: 15 }}>{review.name}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{review.location}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{review.capacity} • {review.date}</div>
                  </div>
                </div>
                <StarRating rating={review.rating} />
                <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.7, margin: '12px 0', fontStyle: 'italic' }}>
                  "{review.text}"
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#dcfce7', color: '#166534',
                  padding: '4px 12px', borderRadius: 50, fontSize: 13, fontWeight: 700,
                  marginTop: 4,
                }}>
                  💰 Saves {review.savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #e8751a, #f5a623)', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Join 500+ Happy Solar Customers</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32 }}>Get your free site visit and custom quotation today.</p>
        <Link href="/contact" className="btn btn-navy btn-xl">Get Free Quote →</Link>
      </section>
    </div>
  )
}
