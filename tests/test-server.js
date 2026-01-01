const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    res.json({ message: 'Test successful' });
});

// This should work:
app.get('/*', (req, res) => {
    res.send('Catch-all route works');
});

app.listen(3001, () => console.log('Test server on 3001'));