// app/api/test/route.js
export async function GET(request) {
  console.log('Test endpoint called at:', new Date().toISOString());
  return Response.json({
    status: 'ok',
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
}

// If you need to handle other methods
export async function POST(request) {
  const body = await request.json();
  return Response.json({
    status: 'ok',
    message: 'POST received',
    data: body,
    timestamp: new Date().toISOString()
  });
}