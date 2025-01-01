const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Enable CORS and JSON parsing
app.use(cors({
    origin: 'your-frontend-url'
}));
app.use(express.json());

app.post('/api/fortune', async (req, res) => {
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get fortune' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 