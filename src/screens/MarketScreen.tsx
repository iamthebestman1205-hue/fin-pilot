import { StyleSheet, Text } from "react-native";

import { Card } from "../components/Card";
import { ImpactBreakdownCard, type ImpactItem } from "../components/ImpactBreakdownCard";
import { MarketWeatherCard } from "../components/MarketWeatherCard";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { WeekendBriefingCard } from "../components/WeekendBriefingCard";
import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";

type MarketScreenProps = {
  stocks: StockCardData[];
  weekendMode: boolean;
};

type SectorStat = {
  label: string;
  up: number;
  total: number;
  hot: number;
};

const categoryLabel: Record<string, string> = {
  tech: "科技股",
  etf: "ETF",
  finance: "金融股",
  defensive: "防禦/債券",
  cyclical: "循環股",
  commodity: "黃金/原物料"
};

function getSectorStats(stocks: StockCardData[]): SectorStat[] {
  const groups: Record<string, StockCardData[]> = {};
  for (const s of stocks) {
    if (!groups[s.category]) groups[s.category] = [];
    groups[s.category].push(s);
  }

  return Object.entries(groups)
    .filter(([, arr]) => arr.length > 0)
    .map(([cat, arr]) => ({
      label: categoryLabel[cat] ?? cat,
      up: arr.filter((s) => s.priceMove === "up").length,
      total: arr.length,
      hot: arr.filter((s) => s.temperatureTone === "orange" || s.temperatureTone === "red").length
    }))
    .sort((a, b) => b.total - a.total);
}

function getMarketMood(stocks: StockCardData[]) {
  const total = Math.max(stocks.length, 1);
  const hotCount = stocks.filter(
    (stock) => stock.temperatureTone === "orange" || stock.temperatureTone === "red"
  ).length;
  const redCount = stocks.filter((stock) => stock.temperatureTone === "red").length;
  const upCount = stocks.filter((s) => s.priceMove === "up").length;
  const downCount = stocks.filter((s) => s.priceMove === "down").length;

  const techStocks = stocks.filter((s) => s.category === "tech");
  const etfStocks = stocks.filter((s) => s.category === "etf");
  const financeStocks = stocks.filter((s) => s.category === "finance");
  const cyclicalStocks = stocks.filter((s) => s.category === "cyclical");
  const defensiveStocks = stocks.filter((s) => s.category === "defensive");
  const commodityStocks = stocks.filter((s) => s.category === "commodity");

  const techUp = techStocks.filter((s) => s.priceMove === "up").length;
  const etfUp = etfStocks.filter((s) => s.priceMove === "up").length;
  const finUp = financeStocks.filter((s) => s.priceMove === "up").length;
  const defUp = defensiveStocks.filter((s) => s.priceMove === "up").length;

  const hotRatio = hotCount / total;
  const techRatio = techStocks.length / total;
  const upRatio = upCount / total;
  const score = Math.min(
    99,
    Math.round(24 + hotRatio * 40 + techRatio * 18 + redCount * 8 + (upRatio > 0.6 ? 8 : 0))
  );

  const weather =
    score >= 82 ? "⛈ 雷雨" : score >= 64 ? "☁️ 多雲" : score >= 42 ? "🌤 微晴" : "☀️ 晴朗";

  const summary =
    score >= 82
      ? "追蹤清單裡高溫標的偏多，今天不是不能看市場，而是要先把風險放在獲利前面。"
      : score >= 64
        ? "市場還有題材，但熱度已經不低。適合看清楚原因，不適合看到上漲就急著追。"
        : score >= 42
          ? "市場氣氛偏穩，部分題材仍有支撐，但還是要留意熱門股的短線震盪。"
          : "追蹤清單目前風險溫度不高，市場比較像可以慢慢觀察的天氣。";

  // 分產業評估
  const techLine = techStocks.length > 0
    ? `科技股 ${techUp}/${techStocks.length} 上漲${techStocks.filter((s) => s.temperatureTone === "red" || s.temperatureTone === "orange").length > 0 ? "、有高溫標的" : ""}`
    : null;
  const etfLine = etfStocks.length > 0
    ? `ETF ${etfUp}/${etfStocks.length} 上漲`
    : null;
  const finLine = financeStocks.length > 0
    ? `金融股 ${finUp}/${financeStocks.length} 上漲`
    : null;
  const cyclLine = cyclicalStocks.length > 0
    ? `循環股 ${cyclicalStocks.filter((s) => s.priceMove === "up").length}/${cyclicalStocks.length} 上漲`
    : null;
  const defLine = defensiveStocks.length > 0
    ? `防禦/債券 ${defUp}/${defensiveStocks.length} 上漲`
    : null;
  const comLine = commodityStocks.length > 0
    ? `黃金/原物料 ${commodityStocks.filter((s) => s.priceMove === "up").length}/${commodityStocks.length} 上漲`
    : null;

  const sectorLines = [techLine, etfLine, finLine, cyclLine, defLine, comLine].filter(Boolean);
  const method = stocks.length === 0
    ? "先加入追蹤股票，才能估算市場天氣。"
    : `根據你的 ${stocks.length} 檔追蹤股票（今天 ${upCount} 漲 ${downCount} 跌）：${sectorLines.join("；")}。高溫越多、科技集中越高，天氣越容易轉陰。`;

  const sectorStats = getSectorStats(stocks);

  const impacts: ImpactItem[] = [
    {
      title: "今天整體漲跌狀況",
      effect: upCount > downCount ? `${upCount} 漲 ${downCount} 跌` : upCount < downCount ? `${downCount} 跌 ${upCount} 漲` : "漲跌接近",
      plain: upCount > downCount
        ? `你的 ${total} 檔追蹤股票今天有 ${upCount} 檔上漲、${downCount} 檔下跌。整體偏多，但還是要看是題材驅動還是只有情緒推升。`
        : upCount < downCount
          ? `今天有 ${downCount} 檔下跌、${upCount} 檔上漲。大多數標的轉弱，要確認是短線整理還是風險上升的訊號。`
          : `今天漲跌差不多，市場方向不明確，可能正在等一個新訊號。`
    },
    {
      title: "科技/AI 題材溫度",
      effect: techStocks.length === 0 ? "未追蹤" : hotCount >= techStocks.length * 0.5 ? "偏熱" : "可控",
      plain: techStocks.length === 0
        ? "你的追蹤清單裡沒有科技股，AI 題材的起伏對你的清單影響比較小。"
        : hotCount >= techStocks.length * 0.5
          ? `你的 ${techStocks.length} 檔科技股裡，今天 ${techUp} 檔上漲，且偏熱標的較多。市場期待偏高，好消息不夠好也可能引發回調。`
          : `你的 ${techStocks.length} 檔科技股今天 ${techUp} 檔上漲。溫度還在可控範圍，繼續觀察訂單和需求訊號。`
    },
    {
      title: "防禦/債券/黃金訊號",
      effect: (defensiveStocks.length + commodityStocks.length) > 0 ? (defUp + commodityStocks.filter((s) => s.priceMove === "up").length > (defensiveStocks.length + commodityStocks.length) / 2 ? "避險需求升溫" : "中性") : "未追蹤",
      plain: (defensiveStocks.length + commodityStocks.length) === 0
        ? "你的清單裡沒有防禦型、美債或黃金標的。如果市場轉保守，你的清單可能缺少緩衝。"
        : defUp + commodityStocks.filter((s) => s.priceMove === "up").length > (defensiveStocks.length + commodityStocks.length) / 2
          ? "防禦型標的（美債、黃金等）今天相對強，通常代表部分資金在尋找避風港，可能是市場情緒轉保守的訊號。"
          : "防禦型標的今天沒有明顯走強，市場風險偏好還算穩定，資金還沒有大量撤往安全資產。"
    },
    {
      title: "今天該做什麼",
      effect: score >= 64 ? "先降速" : "可觀察",
      plain: score >= 64
        ? "如果想加碼，先問自己：這檔今天的消息，是真的改善基本面，還是只是市場又更興奮？高溫環境裡，好消息往往已被提前反映。"
        : "目前風險溫度偏低，可以繼續觀察清單裡風險溫度是否連續升高，不用把一天漲跌看得太重。"
    }
  ];

  const reminder =
    score >= 64
      ? "今天的重點不是找最會漲的股票，而是分辨哪些標的只是熱、哪些是真的有基本面支持。"
      : "今天比較適合整理追蹤清單，確認每檔股票為什麼值得繼續看。";

  return { weather, score, summary, method, impacts, reminder, sectorStats };
}

export function MarketScreen({ stocks, weekendMode }: MarketScreenProps) {
  const mood = getMarketMood(stocks);

  return (
    <Screen>
      <Text style={styles.appName}>FinPilot</Text>
      <Text style={styles.hero}>不用懂 K 線，也能看懂市場。</Text>

      {weekendMode && (
        <>
          <SectionTitle title="週末模式" caption="台股休市時，自動改看上週回顧和下週觀察。" />
          <WeekendBriefingCard stocks={stocks} />
        </>
      )}

      {!weekendMode && (
        <>
          <SectionTitle title="市場天氣" caption="依照你的追蹤清單，估算今天市場比較像哪種天氣。" />
          <MarketWeatherCard
            weather={mood.weather}
            score={mood.score}
            summary={mood.summary}
            method={mood.method}
          />

          <SectionTitle title="影響來源" caption="不講術語，直接說它會怎麼影響你。" />
          <ImpactBreakdownCard items={mood.impacts} />

          <SectionTitle title="今日提醒" />
          <Card accent>
            <Text style={styles.reminder}>{mood.reminder}</Text>
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  hero: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 34,
    lineHeight: 43,
    fontWeight: "900",
    letterSpacing: 0
  },
  reminder: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 29,
    fontWeight: "700"
  }
});
