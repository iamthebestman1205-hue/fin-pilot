import type { StockCardData } from "../types";
import type { StockCategory } from "../types";

type StockSeed = {
  symbol: string;
  name: string;
  theme: string;
  category: StockCategory;
  risk?: "normal" | "hot" | "high";
};

const seeds: StockSeed[] = [
  // ── 台灣科技龍頭 ──────────────────────────────────
  { symbol: "2330", name: "台積電", theme: "AI 晶片與先進製程", category: "tech", risk: "hot" },
  { symbol: "2317", name: "鴻海", theme: "AI 伺服器與電子代工", category: "tech" },
  { symbol: "2454", name: "聯發科", theme: "手機晶片與邊緣 AI", category: "tech" },
  { symbol: "2308", name: "台達電", theme: "電源、資料中心與 AI 供應鏈", category: "tech", risk: "hot" },
  { symbol: "3017", name: "奇鋐", theme: "散熱與 AI 伺服器零組件", category: "tech", risk: "high" },
  { symbol: "2382", name: "廣達", theme: "AI 伺服器代工龍頭", category: "tech", risk: "hot" },
  { symbol: "3231", name: "緯創", theme: "AI 伺服器代工", category: "tech", risk: "hot" },
  { symbol: "3661", name: "世芯-KY", theme: "ASIC 與 AI 晶片設計", category: "tech", risk: "high" },
  { symbol: "3443", name: "創意", theme: "ASIC 與半導體設計服務", category: "tech", risk: "hot" },
  { symbol: "8046", name: "南電", theme: "ABF 載板與半導體材料", category: "tech", risk: "hot" },
  { symbol: "2303", name: "聯電", theme: "成熟製程晶圓代工", category: "tech" },
  { symbol: "3711", name: "日月光投控", theme: "半導體封測與先進封裝", category: "tech" },
  { symbol: "2357", name: "華碩", theme: "PC、電競與 AI PC", category: "tech" },
  { symbol: "3008", name: "大立光", theme: "手機鏡頭與光學", category: "tech" },
  { symbol: "6488", name: "環球晶", theme: "矽晶圓材料", category: "tech" },
  { symbol: "2379", name: "瑞昱", theme: "網路 IC 設計", category: "tech" },
  { symbol: "3034", name: "聯詠", theme: "IC 設計與面板驅動", category: "tech" },
  { symbol: "4938", name: "和碩", theme: "電子代工與消費性電子", category: "tech" },
  { symbol: "2356", name: "英業達", theme: "伺服器與代工", category: "tech" },
  { symbol: "2324", name: "仁寶", theme: "電子代工", category: "tech" },
  { symbol: "6239", name: "力成", theme: "記憶體封測", category: "tech" },
  { symbol: "6409", name: "旭隼", theme: "不斷電系統與電源設備", category: "tech" },
  { symbol: "5347", name: "世界先進", theme: "8吋晶圓代工與成熟製程", category: "tech" },
  { symbol: "2344", name: "華邦電", theme: "DRAM 與 Flash 記憶體", category: "tech" },

  // ── 台灣寬基 ETF ──────────────────────────────────
  { symbol: "0050", name: "元大台灣50", theme: "台股大型權值股", category: "etf" },
  { symbol: "006208", name: "富邦台50", theme: "台股大型權值股", category: "etf" },
  { symbol: "00692", name: "富邦公司治理", theme: "台股治理 ETF", category: "etf" },

  // ── 高股息 ETF ────────────────────────────────────
  { symbol: "00878", name: "國泰永續高股息", theme: "ESG 高股息 ETF", category: "etf" },
  { symbol: "00919", name: "群益台灣精選高息", theme: "高股息 ETF", category: "etf", risk: "hot" },
  { symbol: "00713", name: "元大台灣高息低波", theme: "低波高股息 ETF", category: "etf" },
  { symbol: "0056", name: "元大高股息", theme: "高股息 ETF", category: "etf" },
  { symbol: "00929", name: "復華台灣科技優息", theme: "科技高股息 ETF", category: "etf", risk: "hot" },
  { symbol: "00940", name: "元大台灣價值高息", theme: "價值高股息 ETF", category: "etf" },
  { symbol: "00915", name: "凱基優選高股息30", theme: "高股息 ETF", category: "etf" },

  // ── 科技主題 ETF ──────────────────────────────────
  { symbol: "00881", name: "國泰台灣5G+", theme: "5G 與半導體 ETF", category: "etf", risk: "hot" },
  { symbol: "00830", name: "國泰費城半導體", theme: "美國費城半導體指數 ETF", category: "etf", risk: "hot" },
  { symbol: "00757", name: "統一FANG+", theme: "美股科技巨頭 ETF", category: "etf", risk: "hot" },
  { symbol: "009810", name: "台股主題ETF", theme: "主題型 ETF", category: "etf", risk: "hot" },

  // ── 美股指數 ETF ──────────────────────────────────
  { symbol: "00646", name: "元大S&P500", theme: "美股標普500指數 ETF", category: "etf" },
  { symbol: "00662", name: "富邦NASDAQ", theme: "那斯達克100指數 ETF", category: "etf", risk: "hot" },
  { symbol: "00668", name: "國泰美國道瓊", theme: "美國道瓊指數 ETF", category: "etf" },
  { symbol: "00846", name: "大華科技英雄", theme: "全球科技龍頭 ETF", category: "etf", risk: "hot" },

  // ── 美債 ETF ──────────────────────────────────────
  { symbol: "00679B", name: "元大美債20年", theme: "長天期美債 ETF（利率敏感型）", category: "defensive" },
  { symbol: "00687B", name: "國泰20年美債", theme: "長天期美債 ETF（利率敏感型）", category: "defensive" },
  { symbol: "00696B", name: "富邦美債7-10年", theme: "中天期美債 ETF", category: "defensive" },
  { symbol: "00772B", name: "中信高評級公司債", theme: "投資級公司債 ETF", category: "defensive" },

  // ── 黃金 / 原物料 ETF ─────────────────────────────
  { symbol: "00635U", name: "元大黃金", theme: "黃金現貨追蹤 ETF（避險資產）", category: "commodity" },
  { symbol: "00654R", name: "國泰黃金", theme: "黃金現貨追蹤 ETF", category: "commodity" },
  { symbol: "00642U", name: "元大S&P石油", theme: "國際原油期貨追蹤 ETF", category: "commodity", risk: "hot" },
  { symbol: "00661", name: "元大歐洲50", theme: "歐洲藍籌股指數 ETF", category: "etf" },

  // ── 台灣金融股 ────────────────────────────────────
  { symbol: "2881", name: "富邦金", theme: "金融控股與壽險", category: "finance" },
  { symbol: "2882", name: "國泰金", theme: "金融控股與壽險", category: "finance" },
  { symbol: "2891", name: "中信金", theme: "金融控股與銀行", category: "finance" },
  { symbol: "2886", name: "兆豐金", theme: "銀行與外匯", category: "finance" },
  { symbol: "2892", name: "第一金", theme: "公股銀行與穩定配息", category: "finance" },
  { symbol: "5876", name: "上海商銀", theme: "銀行與高股利穩定度", category: "finance" },
  { symbol: "5880", name: "合庫金", theme: "公股金融與防禦型股利", category: "finance" },
  { symbol: "2888", name: "新光金", theme: "金融與壽險重整題材", category: "finance" },
  { symbol: "2890", name: "永豐金", theme: "金融控股與銀行", category: "finance" },
  { symbol: "5871", name: "中租-KY", theme: "租賃金融與東南亞擴張", category: "finance" },

  // ── 防禦 / 電信 / 民生 ────────────────────────────
  { symbol: "2412", name: "中華電", theme: "電信與穩定現金流", category: "defensive" },
  { symbol: "3045", name: "台灣大", theme: "電信與 5G 布局", category: "defensive" },
  { symbol: "4904", name: "遠傳", theme: "電信、5G 與數位服務", category: "defensive" },
  { symbol: "1216", name: "統一", theme: "民生消費與食品", category: "defensive" },
  { symbol: "2912", name: "統一超", theme: "零售通路與民生消費", category: "defensive" },

  // ── 景氣循環股 ────────────────────────────────────
  { symbol: "2603", name: "長榮", theme: "貨櫃航運與運價循環", category: "cyclical", risk: "hot" },
  { symbol: "2615", name: "萬海", theme: "貨櫃航運與景氣循環", category: "cyclical", risk: "hot" },
  { symbol: "2609", name: "陽明", theme: "貨櫃航運與景氣循環", category: "cyclical", risk: "hot" },
  { symbol: "2002", name: "中鋼", theme: "鋼鐵與景氣循環", category: "cyclical" },
  { symbol: "1301", name: "台塑", theme: "塑化與景氣循環", category: "cyclical" },
  { symbol: "1303", name: "南亞", theme: "塑化與電子材料", category: "cyclical" },
  { symbol: "1101", name: "台泥", theme: "水泥、綠能與景氣循環", category: "cyclical" },
  { symbol: "1590", name: "亞德客-KY", theme: "工業自動化與景氣循環", category: "cyclical" },
  { symbol: "2207", name: "和泰車", theme: "汽車代理與消費景氣", category: "cyclical" },
  { symbol: "1476", name: "儒鴻", theme: "機能布料與運動品牌代工", category: "cyclical" },
  { symbol: "9914", name: "美利達", theme: "自行車與消費景氣", category: "cyclical" },
  { symbol: "9904", name: "寶成", theme: "運動鞋代工與消費景氣", category: "cyclical" },
  { symbol: "2105", name: "正新", theme: "輪胎與外銷需求", category: "cyclical" },
  { symbol: "1102", name: "亞泥", theme: "水泥與景氣循環", category: "cyclical" },
  { symbol: "9910", name: "豐泰", theme: "運動鞋代工", category: "cyclical" },
];

function makeStock(seed: StockSeed, index: number): StockCardData {
  const isHigh = seed.risk === "high";
  const isHot = seed.risk === "hot" || isHigh;
  const isEtf = seed.name.includes("ETF") || seed.symbol.startsWith("00");
  const isCommodity = seed.category === "commodity";
  const status = isHigh ? "🔴 風險升高" : isHot ? "🟡 觀察中" : "🟢 穩定偏強";
  const temperature = isHigh ? "🔴 高溫" : isHot ? "🟠 偏熱" : "🟡 中溫";
  const updatedMinute = String(Math.max(5, 40 - (index % 30))).padStart(2, "0");

  const baseReason = isCommodity
    ? `${seed.theme} 主要受全球供需、美元走勢與避險情緒影響。`
    : isEtf
      ? `${seed.theme} 受到成分股、匯率、配息與市場風格影響。`
      : `${seed.theme} 是目前市場觀察主軸，股價容易跟著產業消息與資金情緒變化。`;

  return {
    symbol: seed.symbol,
    name: seed.name,
    market: "TW",
    category: seed.category,
    priceMove: "flat",
    priceChangePercent: 0,
    dataSource: "demo",
    quoteVolume: undefined,
    status,
    statusTone: isHigh ? "red" : isHot ? "yellow" : "green",
    temperature,
    temperatureTone: isHigh ? "red" : isHot ? "orange" : "yellow",
    reason: baseReason,
    reminder: isHot
      ? "題材熱度較高，追蹤消息比盲目追高更重要。"
      : "狀態相對穩定，但仍要留意大盤與產業消息變化。",
    aiNews: `等待今日資料更新。這檔目前核心主軸是：${seed.theme}。`,
    aiNewsSimple: isHot
      ? `${seed.name} 目前偏熱，先等資料更新再決定。`
      : `${seed.name} 狀態穩定，可繼續觀察。`,
    aiNewsDetailed: `【等待資料更新】核心主軸：${seed.theme}。${baseReason}`,
    referenceSources: [],
    updatedAt: `今日 08:${updatedMinute}`
  };
}

export const taiwanStocks: StockCardData[] = seeds.map(makeStock);

export const defaultTrackedSymbols = ["2330", "0050", "00646", "009810"];
