export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { trackingNumber } = req.body;
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key configuration missing.' });
    }

    try {
        // Updated to the official TrackingMore V4 GET endpoint
        const response = await fetch(`https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Tracking-Api-Key': apiKey
            }
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Network sync failed.' });
    }
}