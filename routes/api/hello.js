// Simple API endpoint for Kapeyamaha
export default function handler(req, res) {
  res.status(200).json({
    message: 'Kapeyamaha API is working',
    timestamp: new Date().toISOString()
  });
}
