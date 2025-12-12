import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/reviews')
      setReviews([...res.data].reverse())
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reviewText) return
    setLoading(true)
    setError(null)
    try {
      await axios.post('http://127.0.0.1:8000/api/analyze-review', { text: reviewText })
      setReviewText('')
      fetchReviews()
    } catch (err) {
      setError('Gagal menganalisis. Pastikan backend aktif.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    // PERBAIKAN: width: '100%' dan minHeight: '100vh' memastikan tidak terpotong
    <div style={{ backgroundColor: '#e6f2ff', minHeight: '100vh', width: '100%', margin: 0, padding: 0, position: 'absolute', top: 0, left: 0 }}>
      
      {/* Container utama dengan padding atas-bawah */}
      <div className="container-fluid py-4" style={{ maxWidth: '1200px' }}> {/* Container lebih lebar */}
        
        <div className="text-center mb-5 mt-3">
          <h1 className="display-4 fw-bold" style={{ color: '#003366' }}>Product Review Analyzer</h1>
          <p className="lead text-secondary">Create by Awi Septian Prasetyo (123140201)</p>
        </div>

        <div className="row g-4 justify-content-center">
          
          {/* Form Input */}
          <div className="col-md-5 col-12">
            <div className="card shadow-sm border-0">
               <div className="card-header text-white" style={{ backgroundColor: '#0056b3' }}>
                  <h5 className="card-title mb-0">Analyze New Review</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Masukkan review produk di sini (Bisa Bahasa Indonesia atau Inggris)..."
                      rows="6"
                      required
                      style={{ backgroundColor: '#f8fbff' }}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn w-100 text-white py-2" 
                    disabled={loading}
                    style={{ backgroundColor: '#002244', borderColor: '#002244' }} 
                  >
                    {loading ? 'Analyzing...' : 'Analyze Review'}
                  </button>
                </form>
                {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
              </div>
            </div>
          </div>

          {/* Hasil Review */}
          <div className="col-md-7 col-12">
             <h3 className="mb-3 border-bottom pb-2" style={{ color: '#003366' }}>Review History</h3>
            {reviews.length === 0 ? (
              <div className="alert alert-light text-center shadow-sm" style={{ color: '#0056b3' }}>
                Belum ada review.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="card shadow-sm border-0">
                    <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom">
                      <small className="text-muted">ID: {rev.id}</small>
                      <span className={`badge rounded-pill px-3 py-2 ${rev.sentiment === 'POSITIVE' ? 'bg-success' : 'bg-danger'}`}>
                        {rev.sentiment}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="card-text fst-italic p-3 rounded" style={{ backgroundColor: '#f0f7ff' }}>"{rev.text}"</p>
                      <h6 className="card-subtitle mb-2 fw-bold" style={{ color: '#0056b3' }}>Gemini Key Points:</h6>
                      <div className="p-3 rounded border" style={{ backgroundColor: '#eef2f6' }}>
                          <pre style={{ whiteSpace: 'pre-wrap', marginBottom: 0, fontFamily: 'inherit', fontSize: '0.9rem', color: '#333' }}>
                              {rev.key_points}
                          </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App