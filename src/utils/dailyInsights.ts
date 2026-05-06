import type { StockCardData, StockCategory, Tone } from "../types";
import type { QuoteSnapshot } from "../services/marketData";

const categoryCatalysts: Record<StockCategory, string[]> = {
  tech: [
    "AI 伺服器訂單能見度",
    "半導體庫存調整",
    "法人對毛利率的預期",
    "大型科技股財報氣氛",
    "先進製程與高階晶片需求"
  ],
  etf: [
    "成分股集中度變化",
    "配息預期與淨值表現",
    "台股權值股資金流向",
    "美元與台幣匯率波動",
    "市場風格在成長與高息間切換"
  ],
  finance: [
    "利率預期變化",
    "壽險投資收益",
    "銀行放款動能",
    "股利政策想像",
    "金融股防禦買盤"
  ],
  defensive: [
    "穩定現金流需求",
    "股利與防禦配置買盤",
    "景氣放緩時的避險需求",
    "民生消費韌性",
    "低波動資金輪動"
  ],
  cyclical: [
    "景氣循環復甦訊號",
    "原物料價格波動",
    "運價與庫存變化",
    "出口需求能見度",
    "市場對傳產輪動的期待"
  ]
};

const eventVerbs = [
  "市場今天重新評估",
  "法人早盤聚焦",
  "短線資金留意",
  "投資人開始觀察",
  "盤前討論集中在"
];

const riskNotes = [
  "若追價過急，短線震盪會比基本面更先被感受到。",
  "目前不適合只看單一利多，還要對照估值與資金流向。",
  "如果後續需求、買盤或獲利沒有延續，市場期待可能會降溫。",
  "這類標的適合用分批觀察取代一次押注。",
  "今天的重點是確認故事是否延續，而不是猜一天漲跌。"
];

const reminders = [
  "先看風險溫度是否連續升高，再決定是否調整追蹤重點。",
  "留意利多是否只影響短線情緒，還是真的改善營收、獲利或配息條件。",
  "如果已經持有，重點是部位大小是否符合自己的承受度。",
  "今天更適合觀察原因，不適合只被漲跌牽著走。",
  "把它和投資組合集中度一起看，會比單看一檔更準。"
];

const upReasons: Record<StockCategory, string[]> = {
  tech: [
    "大家覺得 AI 和高階晶片需求還在，所以願意給它比較高的期待",
    "市場看到大公司持續投資科技設備，帶動相關股票想像空間",
    "買盤偏向成長題材，科技股今天比較受青睞"
  ],
  etf: [
    "主要成分股表現穩，讓整包 ETF 跟著加分",
    "大盤氣氛偏好，ETF 裡的權值股撐住表現",
    "市場今天比較願意買分散型標的，ETF 受到支撐"
  ],
  finance: [
    "市場覺得金融股配息和穩定性仍有吸引力",
    "利率環境沒有明顯惡化，金融股買盤回來一些",
    "投資人今天偏好比較穩的金融族群"
  ],
  defensive: [
    "市場想找比較穩的標的，防禦型股票受到支撐",
    "現金流穩定的股票今天比較有人買",
    "大盤不確定時，資金偏向生活必需和穩定型標的"
  ],
  cyclical: [
    "市場期待景氣慢慢回溫，循環股買氣變好",
    "報價或運價想像改善，帶動買盤進來",
    "投資人今天在找落後補漲的景氣股"
  ]
};

const downReasons: Record<StockCategory, string[]> = {
  tech: [
    "前面漲太快，今天有人先獲利了結",
    "市場擔心 AI 題材已經太熱，短線先降溫",
    "投資人對高價科技股變謹慎，所以賣壓比較明顯"
  ],
  etf: [
    "主要成分股走弱，整包 ETF 也被拖下來",
    "大盤氣氛轉弱，ETF 很難自己逆勢表現",
    "市場今天偏保守，分散型標的也跟著整理"
  ],
  finance: [
    "市場擔心景氣轉弱會影響金融業表現",
    "金融股今天缺少明顯買盤，價格比較容易回落",
    "投資人轉向其他題材，金融股短線被冷落"
  ],
  defensive: [
    "市場風險胃口變高，資金暫時離開穩定型股票",
    "防禦型股票今天缺少新買盤，表現比較平淡",
    "投資人追逐更有題材的標的，穩定型股票被放慢"
  ],
  cyclical: [
    "市場擔心景氣復甦不夠快，循環股先承壓",
    "報價或運價想像沒有繼續改善，買盤轉弱",
    "前面反彈後有人先賣出，短線壓力變大"
  ]
};

const flatReasons: Record<StockCategory, string[]> = {
  tech: [
    "市場還在等更明確的訂單或財報線索",
    "AI 題材仍在，但今天買賣雙方力道差不多",
    "投資人暫時觀望科技股是不是還能續強"
  ],
  etf: [
    "成分股有漲有跌，整體互相抵消",
    "大盤方向不明，ETF 今天比較像整理",
    "市場還在等下一個明確方向"
  ],
  finance: [
    "金融股今天沒有新的明確方向，表現偏整理",
    "投資人還在觀察利率和股利期待",
    "買盤和賣壓都不強，價格暫時震盪"
  ],
  defensive: [
    "穩定型標的今天沒有明顯風向，表現偏平",
    "市場沒有特別恐慌，也沒有特別追逐防禦股",
    "買盤穩定但不積極，價格變化不大"
  ],
  cyclical: [
    "景氣方向還不明確，循環股暫時整理",
    "投資人還在等報價、運價或需求更明確",
    "今天買賣力道接近，短線沒有明顯方向"
  ]
};

function hashText(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function pick<T>(items: T[], seed: number) {
  return items[Math.abs(seed) % items.length];
}

function getRiskProfile(score: number): {
  status: string;
  statusTone: Tone;
  temperature: string;
  temperatureTone: Tone;
  riskWord: string;
} {
  if (score >= 86) {
    return {
      status: "🔴 風險升高",
      statusTone: "red",
      temperature: "🔴 高溫",
      temperatureTone: "red",
      riskWord: "明顯升溫"
    };
  }

  if (score >= 62) {
    return {
      status: "🟡 觀察中",
      statusTone: "yellow",
      temperature: "🟠 偏熱",
      temperatureTone: "orange",
      riskWord: "偏熱"
    };
  }

  if (score >= 34) {
    return {
      status: "🟢 穩定偏強",
      statusTone: "green",
      temperature: "🟡 中溫",
      temperatureTone: "yellow",
      riskWord: "中性偏穩"
    };
  }

  return {
    status: "🟡 觀察中",
    statusTone: "yellow",
    temperature: "🟡 中溫",
    temperatureTone: "yellow",
    riskWord: "降溫觀察"
  };
}

function getMoveProfile(score: number): {
  move: string;
  priceMove: "up" | "down" | "flat";
  reasonSet: "up" | "down" | "flat";
} {
  if (score >= 67) {
    return { move: "上漲", priceMove: "up", reasonSet: "up" };
  }

  if (score <= 32) {
    return { move: "下跌", priceMove: "down", reasonSet: "down" };
  }

  return { move: "小幅震盪", priceMove: "flat", reasonSet: "flat" };
}

function getMoveLabel(priceMove: "up" | "down" | "flat") {
  if (priceMove === "up") {
    return "上漲";
  }

  if (priceMove === "down") {
    return "下跌";
  }

  return "震盪";
}

export function applyDailyInsight(
  stock: StockCardData,
  date = new Date(),
  quote?: QuoteSnapshot
): StockCardData {
  const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const seed = hashText(`${stock.symbol}-${dateKey}`);
  const catalyst = pick(categoryCatalysts[stock.category], seed);
  const verb = pick(eventVerbs, seed + 3);
  const riskNote = pick(riskNotes, seed + 7);
  const reminder = pick(reminders, seed + 11);
  const score = (seed + stock.symbol.length * 13 + date.getDate() * 5) % 100;
  const risk = getRiskProfile(score);
  const fallbackMove = getMoveProfile(score);
  const priceMove = quote?.priceMove ?? fallbackMove.priceMove;
  const moveLabel = getMoveLabel(priceMove);
  const moveReason =
    priceMove === "up"
      ? pick(upReasons[stock.category], seed + 13)
      : priceMove === "down"
        ? pick(downReasons[stock.category], seed + 13)
        : pick(flatReasons[stock.category], seed + 13);
  const minute = String(10 + (seed % 45)).padStart(2, "0");
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;

  return {
    ...stock,
    ...risk,
    priceMove,
    priceChangePercent: 0,
    dataSource: quote ? "twse" : "demo",
    quoteTime: quote?.quoteTime,
    reason: `${stock.name}今天${moveLabel}，主因是${moveReason}。目前風險溫度${risk.riskWord}。`,
    reminder,
    aiNews: quote
      ? `股市重點：今天${moveLabel}。白話來說，${moveReason}。`
      : `股市重點：目前未接到真實報價，這是 Demo 推估，不能當作今日行情。`,
    updatedAt: quote?.quoteTime ?? `${dateLabel} 08:${minute}`
  };
}
