'use client'

import { useEffect, useState } from 'react'

interface Arbitrage {
  id: string
  homeTeam: string
  awayTeam: string
  backBookmaker: string
  backOdds: number
  layBookmaker: string
  layOdds: number
  profit: number
  rating: number
  kickoffTime: string
}

export default function Home() {
  const [arbitrages, setArbitrages] = useState<Arbitrage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArbitrages = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/api/arbitrages`)
        const data = await response.json()
        
        if (data.arbitrages) {
          setArbitrages(data.arbitrages)
        }
        setError(null)
      } catch (err) {
        console.error('Error fetching arbitrages:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchArbitrages()
    const interval = setInterval(fetchArbitrages, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', padding: '3rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
            🎯 Oddsmatcher Pro
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
            Comparador de cuotas en tiempo real - 30 casas españolas
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #334155' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Arbitrajes</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fff' }}>{arbitrages.length}</div>
          </div>
          <div style={{ background: '#1e293b', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #334155' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Ganancia Promedio</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#22c55e' }}>
              €{(arbitrages.reduce((sum, a) => sum + a.profit, 0) / (arbitrages.length || 1)).toFixed(2)}
            </div>
          </div>
          <div style={{ background: '#1e293b', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #334155' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Rating Promedio</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {(arbitrages.reduce((sum, a) => sum + a.rating, 0) / (arbitrages.length || 1)).toFixed(1)}%
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ background: '#1e293b', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', border: '1px solid #334155' }}>
            <p style={{ color: '#cbd5e1' }}>Cargando arbitrajes...</p>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(127, 29, 29, 0.2)', border: '1px solid #b91c1c', borderRadius: '0.5rem', padding: '1.5rem', color: '#f87171' }}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && arbitrages.length > 0 && (
          <div style={{ overflowX: 'auto', background: '#1e293b', borderRadius: '0.5rem', border: '1px solid #334155' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', background: '#0f172a' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1' }}>Evento</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1' }}>Back</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1' }}>Lay</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1' }}>Ganancia</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {arbitrages.map((arb) => (
                  <tr key={arb.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#fff' }}>
                      <div style={{ fontWeight: '600' }}>{arb.homeTeam} vs {arb.awayTeam}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{arb.kickoffTime}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                      <div style={{ fontWeight: '600' }}>{arb.backBookmaker}</div>
                      <div style={{ color: '#60a5fa' }}>{arb.backOdds.toFixed(2)}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                      <div style={{ fontWeight: '600' }}>{arb.layBookmaker}</div>
                      <div style={{ color: '#f87171' }}>{arb.layOdds.toFixed(2)}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#4ade80', fontWeight: '600' }}>
                      €{arb.profit.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: arb.rating >= 100 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                        color: arb.rating >= 100 ? '#86efac' : '#fca5a5'
                      }}>
                        {arb.rating.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && arbitrages.length === 0 && (
          <div style={{ background: '#1e293b', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', border: '1px solid #334155' }}>
            <p style={{ color: '#94a3b8' }}>No hay arbitrajes disponibles en este momento</p>
          </div>
        )}
      </div>
    </main>
  )
}
