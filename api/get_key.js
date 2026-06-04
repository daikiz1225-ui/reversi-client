// api/get_key.js

export default async function handler(req, res) {
    // CORS対策とレスポンスヘッダーの設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    try {
        const targetUrl = 'https://apis.kahoot.it/media-api/youtube/key';
        
        // 10秒でタイムアウト設定
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(targetUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Kahoot API error: ${response.status}`);
        const data = await response.json();

        // 取得したJSONデータをそのまま返却
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
