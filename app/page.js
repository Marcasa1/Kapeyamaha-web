export default function Home() {
  return (
    <main style={{ 
      padding: '2rem', 
      fontFamily: 'sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2c3e50', fontSize: '2.5rem' }}>
        Welcome to Kapeyamaha
      </h1>
      
      <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginTop: '1rem' }}>
        Your official website is now live and fully operational!
      </p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 style={{ color: '#3498db' }}>About Kapeyamaha</h2>
        <p>Add your business description, services, or mission statement here.</p>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#3498db' }}>Contact Information</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>📧 Email: info@kapeyamaha.com</li>
          <li>📱 Phone: (123) 456-7890</li>
          <li>📍 Address: Your Business Address</li>
        </ul>
      </div>
    </main>
  )
}
