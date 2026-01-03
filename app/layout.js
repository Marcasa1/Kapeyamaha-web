export const metadata = {
  title: 'Kapeyamaha - Official Website',
  description: 'Official website of Kapeyamaha',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body style={{ 
        margin: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f5f7fa',
        color: '#333'
      }}>
        <header style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
              <i className="fas fa-motorcycle" style={{ marginRight: '10px' }}></i>
              Kapeyamaha
            </h1>
            <nav>
              <a href="/" style={{ color: 'white', marginLeft: '1rem', textDecoration: 'none' }}>Home</a>
              <a href="/about" style={{ color: 'white', marginLeft: '1rem', textDecoration: 'none' }}>About</a>
              <a href="/services" style={{ color: 'white', marginLeft: '1rem', textDecoration: 'none' }}>Services</a>
              <a href="/contact" style={{ color: 'white', marginLeft: '1rem', textDecoration: 'none' }}>Contact</a>
            </nav>
          </div>
        </header>
        
        <main style={{ minHeight: '70vh', padding: '2rem' }}>
          {children}
        </main>
        
        <footer style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p>© {new Date().getFullYear()} Kapeyamaha. All rights reserved.</p>
            <div style={{ marginTop: '1rem' }}>
              <a href="#" style={{ color: 'white', margin: '0 10px' }}><i className="fab fa-facebook"></i></a>
              <a href="#" style={{ color: 'white', margin: '0 10px' }}><i className="fab fa-twitter"></i></a>
              <a href="#" style={{ color: 'white', margin: '0 10px' }}><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
