// This is the secure server proxy that fixes the CORS issue
export default async function handler(req, res) {
  // Allow your frontend to talk to this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Grab all the settings from the frontend
    const qs = new URLSearchParams(req.query).toString();
    const targetUrl = `https://api.omegatech.app/api/ai/Aiflux?${qs}`;

    // Fetch from Omegatech
    const upstream = await fetch(targetUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    const data = await upstream.text();
    
    // Send the result back to your website
    res.status(upstream.status).setHeader("Content-Type", "application/json");
    return res.send(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ success: false, message: "Server proxy failed" });
  }
}
