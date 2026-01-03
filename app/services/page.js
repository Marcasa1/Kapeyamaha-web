export default function Services() {
  const services = [
    { title: 'Service 1', description: 'Description of service 1' },
    { title: 'Service 2', description: 'Description of service 2' },
    { title: 'Service 3', description: 'Description of service 3' },
  ]
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Our Services</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {services.map((service, index) => (
          <div key={index} style={{ 
            padding: '1.5rem', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
