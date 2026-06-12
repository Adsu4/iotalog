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
        // STEP 1: Automatically Register/Create the tracking number in your account
        await fetch('https://api.trackingmore.com/v4/trackings/create', {
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

        // Note: We don't check for a "success" response on Step 1, because if the 
        // number already exists, the API returns an error we want to ignore. 
        // We just want to ensure it is in the system.

        // STEP 2: Now that it is guaranteed to be in your account, GET the data
        const getResponse = await fetch(`https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Tracking-Api-Key': apiKey
            }
        });

        const data = await getResponse.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Network sync failed.' });
    }
}