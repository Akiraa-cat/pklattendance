export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }

    // Mengambil URL dari Environment Variable Vercel
    const TARGET_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

    if (!TARGET_SCRIPT_URL) {
        return res.status(500).json({ success: false, message: "Server configuration error: APPS_SCRIPT_URL not found." });
    }

    try {
        const requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        const response = await fetch(TARGET_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: requestBody
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Gagal terhubung ke server proxy.",
            error: error.message 
        });
    }
}
