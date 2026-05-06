export default async function handler(request, response) {
  const symbols = String(request.query.symbols || "")
    .split(",")
    .map((symbol) => symbol.trim())
    .filter(Boolean);

  if (symbols.length === 0) {
    response.status(400).json({ error: "Missing symbols" });
    return;
  }

  const channels = symbols
    .flatMap((symbol) => [`tse_${symbol}.tw`, `otc_${symbol}.tw`])
    .join("|");
  const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${encodeURIComponent(
    channels
  )}&json=1&delay=0&_=${Date.now()}`;

  try {
    const twseResponse = await fetch(url, {
      headers: {
        Referer: "https://mis.twse.com.tw/stock/index.jsp",
        "User-Agent": "FinPilot-Web-Demo"
      }
    });

    if (!twseResponse.ok) {
      response.status(502).json({ error: "TWSE request failed" });
      return;
    }

    const data = await twseResponse.json();
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: "Quote proxy failed" });
  }
}
