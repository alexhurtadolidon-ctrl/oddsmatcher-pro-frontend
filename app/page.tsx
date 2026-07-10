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
    // Refrescar cada 5 minutos
    const interval = setInterval(fetchArbitrages, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎯 Oddsmatcher Pro
          </h1>
          <p className="text-xl text-slate-400">
            Comparador de cuotas en tiempo real - 30 casas españolas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-2">Total Arbitrajes</div>
            <div className="text-3xl font-bold text-white">{arbitrages.length}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-2">Ganancia Promedio</div>
            <div className="text-3xl font-bold text-green-500">
              €{(arbitrages.reduce((sum, a) => sum + a.profit, 0) / (arbitrages.length || 1)).toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-slate-400 text-sm mb-2">Rating Promedio</div>
            <div className="text-3xl font-bold text-blue-500">
              {(arbitrages.reduce((sum, a) => sum + a.rating, 0) / (arbitrages.length || 1)).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full"></div>
            </div>
            <p className="text-slate-300 mt-4">Cargando arbitrajes...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-red-400">
            <p>{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && arbitrages.length > 0 && (
          <div className="overflow-x-auto bg-slate-800 rounded-lg border border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Evento</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Back</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Lay</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Ganancia</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Rating</th>
                </tr>
              </thead>
              <tbody>
                {arbitrages.map((arb) => (
                  <tr key={arb.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="px-6 py-4 text-sm text-white">
                      <div className="font-semibold">{arb.homeTeam} vs {arb.awayTeam}</div>
                      <div className="text-xs text-slate-400">{arb.kickoffTime}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div className="font-semibold">{arb.backBookmaker}</div>
                      <div className="text-blue-400">{arb.backOdds.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div className="font-semibold">{arb.layBookmaker}</div>
                      <div className="text-red-400">{arb.layOdds.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-green-400 font-semibold">
                      €{arb.profit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        arb.rating >= 100 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                      }`}>
                        {arb.rating.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && arbitrages.length === 0 && (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-400">No hay arbitrajes disponibles en este momento</p>
          </div>
        )}
      </div>
    </main>
  )
}
