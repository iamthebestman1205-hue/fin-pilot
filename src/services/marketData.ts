import type { PriceMove } from "../types";

export type QuoteSnapshot = {
  symbol: string;
  priceMove: PriceMove;
  quoteTime: string;
  volume?: number;
};

type TwseQuote = {
  c: string;
  d?: string;
  t?: string;
  z?: string;
  oz?: string;
  pz?: string;
  y?: string;
  v?: string;
};

type TwseResponse = {
  msgArray?: TwseQuote[];
};

function getQuoteUrl(symbols: string[]) {
  const isWeb = typeof window !== "undefined";

  if (isWeb) {
    return `/api/twse-quotes?symbols=${encodeURIComponent(symbols.join(","))}`;
  }

  const channels = symbols
    .flatMap((symbol) => [`tse_${symbol}.tw`, `otc_${symbol}.tw`])
    .join("|");

  return `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${encodeURIComponent(
    channels
  )}&json=1&delay=0&_=${Date.now()}`;
}

function getMoveFromPrices(current: number, previous: number): PriceMove {
  if (current > previous) {
    return "up";
  }

  if (current < previous) {
    return "down";
  }

  return "flat";
}

function parseNumber(value?: string) {
  if (!value || value === "-" || value === "_") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function fetchTaiwanQuotes(symbols: string[]): Promise<Record<string, QuoteSnapshot>> {
  if (symbols.length === 0) {
    return {};
  }

  const url = getQuoteUrl(symbols);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("TWSE quote request failed");
  }

  const data = (await response.json()) as TwseResponse;
  const result: Record<string, QuoteSnapshot> = {};

  data.msgArray?.forEach((quote) => {
    const current = parseNumber(quote.z) ?? parseNumber(quote.oz) ?? parseNumber(quote.pz);
    const previous = parseNumber(quote.y);

    if (current === null || previous === null) {
      return;
    }

    result[quote.c] = {
      symbol: quote.c,
      priceMove: getMoveFromPrices(current, previous),
      quoteTime: quote.d && quote.t ? `${quote.d} ${quote.t}` : "TWSE",
      volume: parseNumber(quote.v) ?? undefined
    };
  });

  return result;
}
