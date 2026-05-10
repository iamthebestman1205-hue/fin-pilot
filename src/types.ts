export type Tone = "green" | "yellow" | "orange" | "red";
export type StockCategory = "tech" | "etf" | "finance" | "defensive" | "cyclical";
export type PriceMove = "up" | "down" | "flat";
export type ExplanationLevel = "simple" | "standard" | "detailed";

export type ReferenceSource = {
  name: string;
  title: string;
  url?: string;
};

export type StockCardData = {
  symbol: string;
  name: string;
  status: string;
  statusTone: Tone;
  temperature: string;
  temperatureTone: Tone;
  reason: string;
  reminder: string;
  market: "TW" | "US";
  category: StockCategory;
  priceMove: PriceMove;
  priceChangePercent: number;
  dataSource: "twse" | "demo" | "unavailable";
  quoteTime?: string;
  aiNews: string;
  referenceSources: ReferenceSource[];
  updatedAt: string;
};

export type UserPreferences = {
  explanationLevel: ExplanationLevel;
  showCauseChain: boolean;
  showForecast: boolean;
  showImpactBreakdown: boolean;
  showSources: boolean;
};
