export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { trackingNumber } = req.body;
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key configuration missing on server.' });
    }

    try {
        const response = await fetch('https://api.trackingmore.com/v4/trackings/realtime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Tracking-Api-Key': apiKey
            },
            body: JSON.stringify({
                tracking_number: trackingNumber,
                courier_code: 'india-post'
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('TrackingMore Error:', error);
        return res.status(500).json({ error: 'Failed to synchronize with network node.' });
    }
}