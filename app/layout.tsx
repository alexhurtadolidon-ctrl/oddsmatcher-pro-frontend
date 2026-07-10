import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Oddsmatcher Pro - Comparador de Cuotas',
  description: 'Comparador profesional de cuotas de apuestas españolas en tiempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
