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
    up: "買盤偏向成長股，投資人願意先相信後面的需求還在。法人買超或外資回補是重要訊號。",
    down: "前面期待拉得比較高，今天有人先把獲利收回來。要分辨是短線了結還是基本面改變。",
    flat: "買賣雙方力道接近，訂單、營收或財報還沒有給出新方向。資金在觀望。",
    watch: "接下來看訂單、毛利率、法人籌碼、客戶需求有沒有跟上股價期待。",
    baseRisk: 58
  },
  etf: {
    focus: "成分股對 ETF 的支撐力",
    up: "主要成分股表現較穩，整包 ETF 跟著受支撐。溢價縮小時是觀察進場時機的參考。",
    down: "成分股走弱或市場氣氛轉保守，ETF 也被一起拖累。折溢價變化是重要指標。",
    flat: "成分股有漲有跌，整體互相抵消，方向不明顯。配息周期也影響走勢。",
    watch: "接下來看它主要持有哪些股票、折溢價幅度、配息頻率和成分股調整時程。",
    baseRisk: 42
  },
  finance: {
    focus: "利率走勢、股利政策和金融業獲利品質",
    up: "投資人今天比較願意買穩定現金流和股利題材。聯準會政策預期和景氣穩定是助力。",
    down: "市場擔心景氣或利率變化會壓到金融業表現。壞帳、淨息差縮小是常見原因。",
    flat: "金融股今天沒有明確新方向，市場在等下一個利率或政策訊號。",
    watch: "接下來看股利政策、放款品質、壽險投資收益、淨息差是否穩住。",
    baseRisk: 35
  },
  defensive: {
    focus: "資金對穩定型股票的需求與美元/利率環境",
    up: "市場偏保守，穩定現金流標的受到支撐。通常出現在風險情緒退潮時。",
    down: "資金暫時去追更有題材的股票，穩定型標的被放慢。不是壞事，只是輪動。",
    flat: "市場沒有特別恐慌，也沒有特別追逐防禦股。比較像平穩整理。",
    watch: "接下來看現金流、股利和本業是否維持穩定，以及利率走向。",
    baseRisk: 28
  },
  cyclical: {
    focus: "景氣循環復甦力道與庫存週期",
    up: "投資人期待景氣回溫，循環股買氣變好。看是否有庫存去化完成的訊號。",
    down: "市場擔心景氣復甦不夠快，短線先保守看待。報價或運價趨弱是警訊。",
    flat: "景氣方向還不明確，今天比較像等待下一個訊號。市場在觀察數據。",
    watch: "接下來看報價、庫存週期、運價、外銷訂單是否改善。",
    baseRisk: 48
  },
  commodity: {
    focus: "全球避險情緒、美元走勢與商品供需",
    up: "避險需求升溫或美元走弱，推動商品類 ETF 上漲。地緣政治或通膨預期也是推力。",
    down: "美元走強或風險情緒改善，商品類 ETF 承壓。需求展望轉弱也是壓力來源。",
    flat: "商品市場觀望氣氛濃，等待下一個供需或宏觀訊號。",
    watch: "接下來看美元指數（DXY）、聯準會政策預期、地緣政治情勢、供需數據。",
    baseRisk: 52
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
    focus: "上海出口貨櫃運價指數（SCFI）與即期運費走勢",
    up: "運價回升或市場預期旺季備貨提早啟動，讓航運買盤回來。",
    down: "運價支撐轉弱，投資人擔心供過於求壓力，航運股先承壓。",
    flat: "運價和需求方向還不夠明確，今天偏整理，市場等待訂艙量數據。",
    watch: "接下來看 SCFI 即期運費指數、訂艙量、船班供給和全球貿易需求是否回溫。",
    baseRisk: 68,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "長榮營收與重大訊息" },
      { name: "工商時報", title: "貨櫃航運與運價新聞" }
    ]
  },
  "2609": {
    focus: "SCFI 運價指數、船班供需與旺季備貨力道",
    up: "運價走穩或旺季預期帶動備貨，航運題材重燃信心。",
    down: "運價壓力使投資人先降低期待，航運股普遍承壓。",
    flat: "供需還在角力，市場等下一波運價方向訊號。",
    watch: "接下來看 SCFI 即期運費、訂艙量、全球需求。",
    baseRisk: 66,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "陽明營收與重大訊息" },
      { name: "工商時報", title: "貨櫃航運行情" }
    ]
  },
  "00635U": {
    focus: "美元指數走向、聯準會降息預期與全球避險情緒",
    up: "美元走弱或避險情緒升溫推升金價，黃金 ETF 跟漲。地緣政治風險也是催化劑。",
    down: "美元走強或風險情緒改善壓抑金價，黃金 ETF 跟跌。",
    flat: "市場對聯準會政策方向存疑，金價方向待確認，黃金 ETF 橫盤整理。",
    watch: "接下來看聯準會官員發言、美元指數（DXY）、地緣政治、通膨數據。",
    baseRisk: 44,
    sources: [
      { name: "Kitco News", title: "黃金現貨與期貨行情" },
      { name: "CME FedWatch", title: "聯準會降息機率追蹤" },
      { name: "投信官網", title: "元大黃金 ETF 淨值" }
    ]
  },
  "00654R": {
    focus: "國際金價走勢、美元強弱與投資需求",
    up: "金價上漲帶動黃金 ETF 淨值提升，避險需求或美元走弱是主因。",
    down: "金價走弱使黃金 ETF 承壓，多半與美元走強或風險偏好改善有關。",
    flat: "金市觀望，等待明確的宏觀訊號。",
    watch: "接下來看金價（XAU/USD）、美元指數和聯準會政策預期。",
    baseRisk: 44,
    sources: [
      { name: "Kitco News", title: "黃金現貨行情" },
      { name: "投信官網", title: "國泰黃金 ETF 淨值" }
    ]
  },
  "00642U": {
    focus: "國際原油供需、OPEC+ 產量決策與美元走勢",
    up: "油價上漲或需求改善預期推升原油 ETF，OPEC+ 減產或地緣緊張是常見催化劑。",
    down: "油價走跌，可能是需求下修、美元走強或 OPEC 增產疑慮。",
    flat: "原油市場等待供需數據，方向不明。",
    watch: "接下來看 WTI/Brent 油價、EIA 庫存數據、OPEC+ 政策和全球需求展望。",
    baseRisk: 72,
    sources: [
      { name: "EIA", title: "美國原油庫存週報" },
      { name: "Reuters", title: "OPEC+ 與原油市場新聞" },
      { name: "投信官網", title: "元大石油 ETF 淨值" }
    ]
  },
  "00679B": {
    focus: "聯準會降息預期、美國公債殖利率走向",
    up: "市場加大降息押注，公債殖利率下行，長天期美債 ETF 價格上漲。",
    down: "通膨數據或就業數據強勁，市場降低降息預期，美債殖利率走升，ETF 下跌。",
    flat: "聯準會政策方向模糊，市場在等下一個通膨或就業數據。",
    watch: "接下來看美國 CPI、PCE、非農就業、聯準會會議紀要與官員發言。",
    baseRisk: 38,
    sources: [
      { name: "CME FedWatch", title: "聯準會降息機率" },
      { name: "US Treasury", title: "美國公債殖利率" },
      { name: "投信官網", title: "元大美債20年 ETF 淨值" }
    ]
  },
  "00687B": {
    focus: "美國長天期公債殖利率與聯準會政策預期",
    up: "降息預期升溫，公債殖利率走低，長債 ETF 受益。",
    down: "通膨韌性或強勁數據推升殖利率，長債 ETF 下跌。",
    flat: "市場在等下一個宏觀數據確認方向。",
    watch: "接下來看美國通膨數據（CPI/PCE）、Fed 官員講話和殖利率曲線。",
    baseRisk: 38,
    sources: [
      { name: "CME FedWatch", title: "聯準會降息機率" },
      { name: "投信官網", title: "國泰20年美債 ETF 淨值" }
    ]
  },
  "00662": {
    focus: "那斯達克100指數走勢和美股科技巨頭表現",
    up: "美股科技股買盤回來，那指走強，ETF 跟著受惠。AI、雲端、半導體是主軸。",
    down: "美股科技股漲多後面臨獲利了結，或宏觀數據影響風險情緒。",
    flat: "科技股方向待確認，市場在等財報或宏觀數據。",
    watch: "接下來看那指成分股（AAPL、MSFT、NVDA）財報、Fed 政策和美元。",
    baseRisk: 62,
    sources: [
      { name: "Nasdaq", title: "那斯達克100指數行情" },
      { name: "投信官網", title: "富邦NASDAQ ETF 淨值" }
    ]
  },
  "00646": {
    focus: "美股標普500大盤氣氛、企業財報與聯準會政策",
    up: "美股大型企業氣氛較好，大盤續漲，S&P500 ETF 跟著受支撐。",
    down: "美股轉弱或匯率不利，ETF 今天被壓住。",
    flat: "美股方向不明，ETF 今天比較像等待下一個線索。",
    watch: "接下來看 S&P500 成分股財報、美元走勢和聯準會政策。",
    baseRisk: 44,
    sources: [
      ...defaultSources,
      { name: "投信官網", title: "ETF 淨值與持股資料" },
      { name: "Reuters", title: "美股大型企業行情" }
    ]
  },
  "2303": {
    focus: "成熟製程晶圓代工需求與客戶庫存去化進度",
    up: "成熟製程需求回溫，市場期待聯電接單改善。工控、汽車芯片是重要觀察點。",
    down: "客戶庫存調整未完，訂單能見度偏低，投資人先降低期待。",
    flat: "需求訊號混雜，市場等更明確的接單數據。",
    watch: "接下來看工控、車用晶片、消費電子出貨以及 22/28nm 產能利用率。",
    baseRisk: 48,
    sources: [
      ...defaultSources,
      { name: "公開資訊觀測站", title: "聯電營收與法說" }
    ]
  },
  "2344": {
    focus: "DRAM 現貨報價走勢與消費性需求動能",
    up: "DRAM 報價走穩或漲價預期支撐，記憶體族群獲買盤青睞。",
    down: "記憶體報價壓力或需求觀望，華邦電先被市場打折。",
    flat: "DRAM 市場供需角力中，方向待確認。",
    watch: "接下來看 DRAM 現貨報價、消費性電子需求和主要客戶拉貨情況。",
    baseRisk: 54,
    sources: [
      ...defaultSources,
      { name: "DRAMeXchange", title: "DRAM 報價與記憶體市況" }
    ]
  },
  "4904": {
    focus: "5G 月租用戶數、ARPU（每用戶平均收入）與數位服務滲透率",
    up: "電信股防禦特性受青睞，或市場預期 5G 帶動 ARPU 成長。",
    down: "市場偏好風險資產，防禦型電信股相對失色。",
    flat: "電信股今天沒有特殊催化劑，隨大盤溫和整理。",
    watch: "接下來看月租用戶成長、ARPU 趨勢、數位加值服務滲透率。",
    baseRisk: 26,
    sources: [
      ...defaultSources,
      { name: "NCC", title: "行動通信統計" },
      { name: "公開資訊觀測站", title: "遠傳電信法說與財報" }
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

function buildAiNewsSimple(stock: StockCardData, profile: InsightProfile, priceMove: PriceMove, risk: RiskProfile): string {
  const moveEmoji = priceMove === "up" ? "📈" : priceMove === "down" ? "📉" : "➡️";
  if (priceMove === "up") {
    return `${moveEmoji} ${stock.name}今天偏強。${risk.riskWord === "偏熱" || risk.riskWord === "明顯升溫" ? "但溫度偏高，不急著追。" : "可繼續觀察是否有支撐延續。"}`;
  }
  if (priceMove === "down") {
    return `${moveEmoji} ${stock.name}今天轉弱。先確認是短線整理還是有基本面轉差，${risk.riskWord === "明顯升溫" ? "風險溫度偏高，操作要更謹慎。" : "不需要過度緊張。"}`;
  }
  return `➡️ ${stock.name}今天橫盤整理，沒有明確方向。可以繼續放著觀察。`;
}

function buildAiNewsStandard(stock: StockCardData, profile: InsightProfile, priceMove: PriceMove, risk: RiskProfile, hasVerifiedQuote: boolean): string {
  const moveLabel = getMoveLabel(priceMove);
  const moveReason = getMoveReason(profile, priceMove);
  if (!hasVerifiedQuote) {
    return `今日資料待更新。這檔的核心觀察點是「${profile.focus}」，這是決定它今天漲跌最重要的因素。${profile.watch}`;
  }
  return `今天${moveLabel}。${moveReason} 這背後的核心是「${profile.focus}」。${profile.watch}`;
}

function buildAiNewsDetailed(stock: StockCardData, profile: InsightProfile, priceMove: PriceMove, risk: RiskProfile, hasVerifiedQuote: boolean, quote?: QuoteSnapshot): string {
  const moveLabel = getMoveLabel(priceMove);
  const moveReason = getMoveReason(profile, priceMove);
  const volumeText = quote?.volume
    ? `成交量約 ${quote.volume >= 10000 ? `${(Math.round(quote.volume / 1000) / 10).toFixed(1)}萬張` : `${quote.volume.toLocaleString()} 張`}，`
    : "成交量資料更新中，";
  const volumeSignal = priceMove === "up"
    ? "量價若同步走揚，代表買盤有實質支撐，而非只有情緒。"
    : priceMove === "down"
      ? "若放量下跌，代表賣壓正在擴大，需警惕趨勢轉空。"
      : "縮量整理通常不需過度解讀，放量才需要確認方向。";

  if (!hasVerifiedQuote) {
    return `【待更新】核心觀察：${profile.focus}。${profile.flat} ${profile.watch}`;
  }
  return `今天${moveLabel}。${moveReason}\n\n核心驅動：${profile.focus}。\n\n${volumeText}${volumeSignal}\n\n風險溫度：${risk.riskWord}。${risk.riskWord === "偏熱" || risk.riskWord === "明顯升溫" ? "期待已高，建議看訊號再決策，而非只看漲跌。" : "目前風險可控，重點是觀察是否有持續性。"}`;
}

export function applyDailyInsight(
  stock: StockCardData,
  date = new Date(),
  quote?: QuoteSnapshot
): StockCardData {
  const profile = getProfile(stock);
  const priceMove = quote?.priceMove ?? getFallbackMove(stock, date);
  const moveLabel = getMoveLabel(priceMove);
  const risk = getRiskProfile(stock, profile, priceMove);
  const minute = String(10 + (hashText(stock.symbol) % 45)).padStart(2, "0");
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
  const hasVerifiedQuote = Boolean(quote);
  const referenceSources = profile.sources ?? defaultSources;

  const aiNewsSimple = buildAiNewsSimple(stock, profile, priceMove, risk);
  const aiNews = buildAiNewsStandard(stock, profile, priceMove, risk, hasVerifiedQuote);
  const aiNewsDetailed = buildAiNewsDetailed(stock, profile, priceMove, risk, hasVerifiedQuote, quote);

  return {
    ...stock,
    ...risk,
    priceMove,
    priceChangePercent: 0,
    dataSource: hasVerifiedQuote ? "twse" : "demo",
    quoteTime: quote?.quoteTime,
    quoteVolume: quote?.volume,
    reason: `${stock.name}今天${moveLabel}。核心在於：${profile.focus}。`,
    reminder: profile.watch,
    aiNews,
    aiNewsSimple,
    aiNewsDetailed,
    referenceSources,
    updatedAt: quote?.quoteTime ?? `${dateLabel} 08:${minute}`
  };
}
