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
  { symbol: "2330", name: "台積電", theme: "AI 晶片與先進製程", category: "tech", risk: "hot" },
  { symbol: "0050", name: "元大台灣50", theme: "台股大型權值股", category: "etf" },
  { symbol: "00646", name: "元大S&P500", theme: "美股大型企業 ETF", category: "etf" },
  { symbol: "009810", name: "台股主題ETF", theme: "主題型 ETF", category: "etf", risk: "hot" },
  { symbol: "006208", name: "富邦台50", theme: "台股大型權值股", category: "etf" },
  { symbol: "00878", name: "國泰永續高股息", theme: "高股息 ETF", category: "etf" },
  { symbol: "00919", name: "群益台灣精選高息", theme: "高股息 ETF", category: "etf", risk: "hot" },
  { symbol: "00713", name: "元大台灣高息低波", theme: "低波高股息 ETF", category: "etf" },
  { symbol: "0056", name: "元大高股息", theme: "高股息 ETF", category: "etf" },
  { symbol: "00929", name: "復華台灣科技優息", theme: "科技高股息 ETF", category: "etf", risk: "hot" },
  { symbol: "00940", name: "元大台灣價值高息", theme: "價值高股息 ETF", category: "etf" },
  { symbol: "00915", name: "凱基優選高股息30", theme: "高股息 ETF", category: "etf" },
  { symbol: "00692", name: "富邦公司治理", theme: "台股治理 ETF", category: "etf" },
  { symbol: "00881", name: "國泰台灣5G+", theme: "5G 與半導體 ETF", category: "etf", risk: "hot" },
  { symbol: "00830", name: "國泰費城半導體", theme: "美國半導體 ETF", category: "etf", risk: "hot" },
  { symbol: "00757", name: "統一FANG+", theme: "美股科技 ETF", category: "etf", risk: "hot" },
  { symbol: "00679B", name: "元大美債20年", theme: "長天期美債 ETF", category: "defensive" },
  { symbol: "00687B", name: "國泰20年美債", theme: "長天期美債 ETF", category: "defensive" },
  { symbol: "2317", name: "鴻海", theme: "AI 伺服器與電子代工", category: "tech" },
  { symbol: "2454", name: "聯發科", theme: "手機晶片與邊緣 AI", category: "tech" },
  { symbol: "2308", name: "台達電", theme: "電源、資料中心與 AI 供應鏈", category: "tech", risk: "hot" },
  { symbol: "3017", name: "奇鋐", theme: "散熱與 AI 伺服器零組件", category: "tech", risk: "high" },
  { symbol: "1590", name: "亞德客-KY", theme: "自動化設備與景氣循環", category: "cyclical" },
  { symbol: "4938", name: "和碩", theme: "電子代工與消費性電子", category: "tech" },
  { symbol: "8046", name: "南電", theme: "ABF 載板與半導體材料", category: "tech", risk: "hot" },
  { symbol: "6239", name: "力成", theme: "記憶體封測", category: "tech" },
  { symbol: "6409", name: "旭隼", theme: "不斷電系統與電源設備", category: "tech" },
  { symbol: "9914", name: "美利達", theme: "自行車與消費景氣", category: "cyclical" },
  { symbol: "1101", name: "台泥", theme: "水泥、能源與景氣循環", category: "cyclical" },
  { symbol: "1102", name: "亞泥", theme: "水泥與景氣循環", category: "cyclical" },
  { symbol: "5876", name: "上海商銀", theme: "銀行與股利穩定度", category: "finance" },
  { symbol: "5880", name: "合庫金", theme: "金融與防禦型股利", category: "finance" },
  { symbol: "2105", name: "正新", theme: "輪胎與外銷需求", category: "cyclical" },
  { symbol: "9904", name: "寶成", theme: "鞋業代工與消費景氣", category: "cyclical" },
  { symbol: "2357", name: "華碩", theme: "PC、電競與消費性電子", category: "tech" },
  { symbol: "2412", name: "中華電", theme: "電信與穩定現金流", category: "defensive" },
  { symbol: "2881", name: "富邦金", theme: "金融與壽險", category: "finance" },
  { symbol: "2882", name: "國泰金", theme: "金融與壽險", category: "finance" },
  { symbol: "2891", name: "中信金", theme: "金融與銀行", category: "finance" },
  { symbol: "2886", name: "兆豐金", theme: "金融與銀行", category: "finance" },
  { symbol: "2892", name: "第一金", theme: "金融與銀行", category: "finance" },
  { symbol: "1301", name: "台塑", theme: "塑化與景氣循環", category: "cyclical" },
  { symbol: "1303", name: "南亞", theme: "塑化與電子材料", category: "cyclical" },
  { symbol: "2002", name: "中鋼", theme: "鋼鐵與景氣循環", category: "cyclical" },
  { symbol: "1216", name: "統一", theme: "民生消費與食品", category: "defensive" },
  { symbol: "2912", name: "統一超", theme: "零售與民生消費", category: "defensive" },
  { symbol: "3008", name: "大立光", theme: "手機鏡頭與光學", category: "tech" },
  { symbol: "2382", name: "廣達", theme: "AI 伺服器", category: "tech", risk: "hot" },
  { symbol: "3231", name: "緯創", theme: "AI 伺服器", category: "tech", risk: "hot" },
  { symbol: "2356", name: "英業達", theme: "伺服器與代工", category: "tech" },
  { symbol: "2324", name: "仁寶", theme: "電子代工", category: "tech" },
  { symbol: "2379", name: "瑞昱", theme: "IC 設計", category: "tech" },
  { symbol: "3711", name: "日月光投控", theme: "半導體封測", category: "tech" },
  { symbol: "3034", name: "聯詠", theme: "IC 設計與面板驅動", category: "tech" },
  { symbol: "3661", name: "世芯-KY", theme: "ASIC 與 AI 晶片", category: "tech", risk: "high" },
  { symbol: "3443", name: "創意", theme: "ASIC 與半導體設計服務", category: "tech", risk: "hot" },
  { symbol: "6488", name: "環球晶", theme: "矽晶圓", category: "tech" },
  { symbol: "5871", name: "中租-KY", theme: "租賃金融", category: "finance" },
  { symbol: "2603", name: "長榮", theme: "航運與景氣循環", category: "cyclical", risk: "hot" },
  { symbol: "2615", name: "萬海", theme: "航運與景氣循環", category: "cyclical", risk: "hot" },
  { symbol: "2207", name: "和泰車", theme: "汽車與消費", category: "cyclical" },
  { symbol: "9910", name: "豐泰", theme: "運動鞋代工", category: "cyclical" }
];

function makeStock(seed: StockSeed, index: number): StockCardData {
  const isHigh = seed.risk === "high";
  const isHot = seed.risk === "hot" || isHigh;
  const isEtf = seed.name.includes("ETF") || seed.symbol.startsWith("00");
  const status = isHigh ? "🔴 風險升高" : isHot ? "🟡 觀察中" : "🟢 穩定偏強";
  const temperature = isHigh ? "🔴 高溫" : isHot ? "🟠 偏熱" : "🟡 中溫";
  const updatedMinute = String(Math.max(5, 40 - (index % 30))).padStart(2, "0");

  return {
    symbol: seed.symbol,
    name: seed.name,
    market: "TW",
    category: seed.category,
    priceMove: "flat",
    priceChangePercent: 0,
    dataSource: "demo",
    status,
    statusTone: isHigh ? "red" : isHot ? "yellow" : "green",
    temperature,
    temperatureTone: isHigh ? "red" : isHot ? "orange" : "yellow",
    reason: isEtf
      ? `${seed.theme} 受到成分股、匯率、配息與市場風格影響。`
      : `${seed.theme} 是目前市場觀察主軸，股價容易跟著產業消息與資金情緒變化。`,
    reminder: isHot
      ? "題材熱度較高，追蹤消息比盲目追高更重要。"
      : "狀態相對穩定，但仍要留意大盤與產業消息變化。",
    aiNews: `股市重點：這檔目前先看 ${seed.theme}，等今日資料更新後會整理主要原因。`,
    referenceSources: [],
    updatedAt: `今日 08:${updatedMinute}`
  };
}

export const taiwanStocks: StockCardData[] = seeds.map(makeStock);

export const defaultTrackedSymbols = ["2330", "0050", "00646", "009810"];
