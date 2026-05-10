import type { ReferenceSource, StockCardData, StockCategory, PriceMove, Tone } from "../types";
import type { QuoteSnapshot } from "../services/marketData";

type RiskProfile = {
  status: string;
  statusTone: Tone;
  temperature: string;
  temperatureTone: Tone;
  riskWord: string;
};

type InsightProfile = {
  focus: string;
  up: string;
  down: string;
  flat: string;
  watch: string;
  baseRisk: number;
  sources?: ReferenceSource[];
};

const defaultSources: ReferenceSource[] = [
  {
    name: "TWSE",
    title: "台灣證券交易所即時報價"
  }
];

const categoryProfiles: Record<StockCategory, InsightProfile> = {
  tech: {
    focus: "科技成長故事的買盤強度",
    up: "買盤偏向成長股，投資人願意先相信後面的需求還在。",
    down: "前面期待拉得比較高，今天有人先把獲利收回來。",
    flat: "買賣雙方力道接近，訂單、營收或財報還沒有給出新方向。",
    watch: "接下來看訂單、毛利率、客戶需求有沒有跟上股價期待。",
    baseRisk: 58
  },
  etf: {
    focus: "成分股對 ETF 的支撐力",
    up: "主要成分股表現較穩，所以整包 ETF 跟著受到支撐。",
    down: "成分股走弱或市場氣氛轉保守，ETF 也被一起拖累。",
    flat: "成分股有漲有跌，整體互相抵消，方向不明顯。",
    watch: "接下來看它主要持有哪些股票，別只看 ETF 名稱以為一定分散。",
    baseRisk: 42
  },
  finance: {
    focus: "利率、股利和金融業獲利的支撐力",
    up: "投資人今天比較願意買穩定現金流和股利題材。",
    down: "市場擔心景氣或利率變化會壓到金融業表現。",
    flat: "金融股今天沒有明確新方向，買盤和賣壓都不強。",
    watch: "接下來看股利政策、放款動能、壽險投資收益是否穩住。",
    baseRisk: 35
  },
  defensive: {
    focus: "資金對穩定型股票的需求",
    up: "市場想找波動較低的標的，穩定現金流受到支撐。",
    down: "資金暫時去追更有題材的股票，穩定型標的被放慢。",
    flat: "市場沒有特別恐慌，也沒有特別追逐防禦股。",
    watch: "接下來看現金流、股利和本業是否維持穩定。",
    baseRisk: 28
  },
  cyclical: {
    focus: "景氣循環復甦力道",
    up: "投資人期待景氣慢慢回溫，所以循環股買氣變好。",
    down: "市場擔心景氣復甦不夠快，短線先保守看待。",
    flat: "景氣方向還不明確，今天比較像等待下一個訊號。",
    watch: "接下來看報價、庫存、運價或外銷需求是否改善。",
    baseRisk: 48
  }
};

const stockProfiles: Record<string, Partial<InsightProfile>> = {
  "2330": {
    focus: "AI 晶片需求、先進製程和海外設廠成本",
    up: "市場願意相信 AI 晶片需求仍強，台積電的故事還有支撐。",
    down: "投資人擔心期待已經太高，先看毛利率和海外成本會不會壓力變大。",
    flat: "買賣雙方都在等更明確的法說、營收或 AI 需求訊號。",
    watch: "接下來看 AI 需求、毛利率、資本支出和海外設廠成本。",
    baseRisk: 64,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "營收、法說會與重大訊息" },
      { name: "經濟日報", title: "台積電與 AI 半導體產業追蹤" }
    ]
  },
  "0050": {
    focus: "台股大型權值股今天是否撐住大盤",
    up: "台股大型股表現較穩，所以 0050 跟著受支撐。",
    down: "大型權值股走弱，0050 很難自己逆勢表現。",
    flat: "權值股有漲有跌，0050 今天比較像整理。",
    watch: "接下來看台積電、金融股和大型電子股是否同時轉強。",
    baseRisk: 38,
    sources: [
      ...defaultSources,
      { name: "投信官網", title: "ETF 成分股與淨值資料" },
      { name: "證交所", title: "台股大盤與權值股行情" }
    ]
  },
  "00646": {
    focus: "美股大型企業和美元資產氣氛",
    up: "美股大型企業氣氛較好，讓這檔美股 ETF 受到支撐。",
    down: "美股或匯率氣氛轉弱，ETF 今天被壓住。",
    flat: "美股方向不明，ETF 今天比較像等待下一個線索。",
    watch: "接下來看美股大型企業財報、美元走勢和市場風險胃口。",
    baseRisk: 44,
    sources: [
      ...defaultSources,
      { name: "投信官網", title: "ETF 淨值與持股資料" },
      { name: "Reuters", title: "美股大型企業與國際市場新聞" }
    ]
  },
  "009810": {
    focus: "主題型 ETF 的成分股是否真的跟上題材",
    up: "主題成分股今天比較有買盤，ETF 因此受到支撐。",
    down: "主題股降溫時，這類 ETF 容易一起被拖下來。",
    flat: "題材還在，但市場今天沒有明顯追價。",
    watch: "接下來先看成分股，不要只看 ETF 名稱判斷風險。",
    baseRisk: 62,
    sources: [
      ...defaultSources,
      { name: "投信官網", title: "ETF 成分股與主題配置" },
      { name: "公開資訊觀測站", title: "主要成分股公告與營收" }
    ]
  },
  "3017": {
    focus: "NVIDIA 新平台散熱規格疑慮、法人籌碼和 AI 伺服器散熱需求",
    up: "市場重新相信 AI 伺服器水冷散熱需求還在，覺得前面的疑慮可能被放大，所以買盤回來。",
    down: "市場把 NVIDIA 新平台散熱規格疑慮，解讀成奇鋐接單想像可能降溫；如果法人或短線資金跟著賣，股價壓力就會被放大。",
    flat: "大家還在等 NVIDIA 新平台規格、奇鋐接單狀況和法人籌碼變化，暫時不敢把方向看太死。",
    watch: "接下來看 NVIDIA 新平台散熱設計是否確定、奇鋐水冷散熱出貨、法人買賣超和營收是否跟上。",
    baseRisk: 78,
    sources: [
      ...defaultSources,
      {
        name: "聯合新聞網",
        title: "奇鋐與 NVIDIA 新平台散熱規格疑慮",
        url: "https://udn.com/news/story/7253/9444557"
      },
      {
        name: "工商時報",
        title: "奇鋐、富世達水冷散熱與市場疑慮",
        url: "https://www.chinatimes.com/newspapers/20250908000305-260206"
      },
      {
        name: "CMoney",
        title: "奇鋐股價、法人籌碼與 AI 散熱題材整理",
        url: "https://cmnews.com.tw/article/marketwatcher-6ee38030-491d-11f1-9cb6-11e2473fc8eb"
      }
    ]
  },
  "2382": {
    focus: "AI 伺服器訂單是否延續，以及客戶拉貨節奏",
    up: "市場覺得 AI 伺服器出貨仍有支撐，廣達作為代工廠容易被資金重新關注。",
    down: "如果市場擔心 AI 伺服器拉貨放慢，代工股會先被賣壓測試。",
    flat: "大家在等 AI 伺服器出貨和客戶訂單是否更明確。",
    watch: "接下來看 AI 伺服器營收占比、毛利率和主要客戶拉貨節奏。",
    baseRisk: 66,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "廣達營收與重大訊息" },
      { name: "經濟日報", title: "AI 伺服器供應鏈新聞" }
    ]
  },
  "3231": {
    focus: "AI 伺服器代工題材和短線籌碼是否過熱",
    up: "市場仍把緯創看成 AI 伺服器受惠股，買盤願意回到題材股。",
    down: "AI 伺服器股漲多後，只要資金轉保守，緯創容易先被獲利了結。",
    flat: "市場在等 AI 伺服器出貨能不能繼續支撐營收。",
    watch: "接下來看伺服器出貨、營收成長和法人籌碼是否穩定。",
    baseRisk: 70,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "緯創營收與重大訊息" },
      { name: "工商時報", title: "AI 伺服器代工供應鏈新聞" }
    ]
  },
  "2308": {
    focus: "資料中心電源、散熱和電動車需求",
    up: "市場看好資料中心電源與 AI 基礎建設需求，台達電因此受到支撐。",
    down: "如果市場擔心股價已反映太多 AI 電源題材，短線賣壓會變明顯。",
    flat: "大家在等電源、散熱和電動車業務哪一塊能接棒成長。",
    watch: "接下來看資料中心電源訂單、毛利率和電動車需求。",
    baseRisk: 62,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "台達電營收與重大訊息" },
      { name: "經濟日報", title: "資料中心電源與 AI 基建新聞" }
    ]
  },
  "2454": {
    focus: "手機晶片需求、AI 手機題材和毛利率",
    up: "市場期待手機晶片需求回穩，加上 AI 手機題材帶來想像空間。",
    down: "如果手機需求或毛利率疑慮升高，聯發科會被市場先降一點期待。",
    flat: "投資人還在等新品銷售、客戶拉貨和毛利率訊號。",
    watch: "接下來看手機晶片出貨、AI 手機滲透率和毛利率。",
    baseRisk: 52,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "聯發科營收與法說資料" },
      { name: "工商時報", title: "手機晶片與 AI 手機新聞" }
    ]
  },
  "2881": {
    focus: "壽險投資收益和股利期待",
    up: "市場對金融股股利與投資收益比較有信心。",
    down: "投資人擔心利率或市場波動影響壽險投資表現。",
    flat: "今天金融股方向不明，主要仍在等利率和股利線索。",
    watch: "接下來看股利政策、利率走勢和壽險投資收益。",
    baseRisk: 36,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "富邦金公告與財務資訊" },
      { name: "金管會", title: "金融業監理與市場資訊" }
    ]
  },
  "2603": {
    focus: "貨櫃航運報價和運量變化",
    up: "市場期待運價或需求改善，航運股買盤回來。",
    down: "投資人擔心運價支撐不夠，航運股先承壓。",
    flat: "運價和需求方向還不夠明確，今天偏整理。",
    watch: "接下來看運價、船班供給和全球貿易需求。",
    baseRisk: 68,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "長榮營收與重大訊息" },
      { name: "工商時報", title: "貨櫃航運與運價新聞" }
    ]
  }
};

function hashText(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function getProfile(stock: StockCardData): InsightProfile {
  return {
    ...categoryProfiles[stock.category],
    ...stockProfiles[stock.symbol]
  };
}

function getMoveLabel(priceMove: PriceMove) {
  if (priceMove === "up") {
    return "上漲";
  }

  if (priceMove === "down") {
    return "下跌";
  }

  return "震盪";
}

function getMoveReason(profile: InsightProfile, priceMove: PriceMove) {
  if (priceMove === "up") {
    return profile.up;
  }

  if (priceMove === "down") {
    return profile.down;
  }

  return profile.flat;
}

function getRiskProfile(stock: StockCardData, profile: InsightProfile, priceMove: PriceMove): RiskProfile {
  const moveHeat = priceMove === "up" ? 10 : priceMove === "down" ? 16 : 4;
  const stockHeat = stock.temperatureTone === "red" ? 12 : stock.temperatureTone === "orange" ? 8 : 0;
  const score = profile.baseRisk + moveHeat + stockHeat + (hashText(stock.symbol) % 7);

  if (score >= 86) {
    return {
      status: "🔴 風險升高",
      statusTone: "red",
      temperature: "🔴 高溫",
      temperatureTone: "red",
      riskWord: "明顯升溫"
    };
  }

  if (score >= 64) {
    return {
      status: "🟡 觀察中",
      statusTone: "yellow",
      temperature: "🟠 偏熱",
      temperatureTone: "orange",
      riskWord: "偏熱"
    };
  }

  return {
    status: "🟢 穩定偏強",
    statusTone: "green",
    temperature: "🟡 中溫",
    temperatureTone: "yellow",
    riskWord: "中溫"
  };
}

function getFallbackMove(stock: StockCardData, date: Date): PriceMove {
  const score = hashText(`${stock.symbol}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`) % 100;

  if (score >= 68) {
    return "up";
  }

  if (score <= 30) {
    return "down";
  }

  return "flat";
}

export function applyDailyInsight(
  stock: StockCardData,
  date = new Date(),
  quote?: QuoteSnapshot
): StockCardData {
  const profile = getProfile(stock);
  const priceMove = quote?.priceMove ?? getFallbackMove(stock, date);
  const moveLabel = getMoveLabel(priceMove);
  const moveReason = getMoveReason(profile, priceMove);
  const risk = getRiskProfile(stock, profile, priceMove);
  const minute = String(10 + (hashText(stock.symbol) % 45)).padStart(2, "0");
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
  const hasVerifiedQuote = Boolean(quote);
  const referenceSources = profile.sources ?? defaultSources;

  return {
    ...stock,
    ...risk,
    priceMove,
    priceChangePercent: 0,
    dataSource: hasVerifiedQuote ? "twse" : "demo",
    quoteTime: quote?.quoteTime,
    quoteVolume: quote?.volume,
    reason: `${stock.name}今天${moveLabel}。核心原因是：${profile.focus}。`,
    reminder: profile.watch,
    aiNews: hasVerifiedQuote
      ? `股市重點：今天${moveLabel}。${moveReason}`
      : `股市重點：目前缺少今日報價，既有判斷是 ${profile.focus} 主導這檔股票。`,
    referenceSources,
    updatedAt: quote?.quoteTime ?? `${dateLabel} 08:${minute}`
  };
}
