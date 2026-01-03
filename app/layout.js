export const metadata = {
  title: 'Kapeyamaha',
  description: 'Kapeyamaha Website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: '2rem', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
