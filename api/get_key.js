// api/get_key.js

export default async function handler(req, res) {
    // 1. 【超重要】CORS対策のヘッダーをセット
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    try {
        // 2. サーバー（Vercel等）が直接Kahootにキーを取りに行く（フィルターを回避）
        const targetUrl = 'https://apis.kahoot.it/media-api/youtube/key';
        
        // 10秒でタイムアウトするように設定
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(targetUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Kahoot API error: ${response.status}`);
        }

        const data = await response.json();

        // 3. 取得したJSONデータをそのまま返却
        return res.status(200).json(data);

    } catch (error) {
        // 何かエラーが起きた時の処理
        return res.status(500).json({ error: error.message });
    }
}
