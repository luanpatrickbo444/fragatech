import './globals.css'

export const metadata = {
  title: 'FragaTech - Sistema de Gestão Operacional',
  description: 'Laboratório Prático de Gestão Operacional SENAI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}