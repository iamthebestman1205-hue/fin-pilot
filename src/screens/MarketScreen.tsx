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

function getMarketMood(stocks: StockCardData[]) {
  const total = Math.max(stocks.length, 1);
  const hotCount = stocks.filter(
    (stock) => stock.temperatureTone === "orange" || stock.temperatureTone === "red"
  ).length;
  const redCount = stocks.filter((stock) => stock.temperatureTone === "red").length;
  const techCount = stocks.filter((stock) => stock.category === "tech").length;
  const etfCount = stocks.filter((stock) => stock.category === "etf").length;

  const hotRatio = hotCount / total;
  const techRatio = techCount / total;
  const etfRatio = etfCount / total;
  const score = Math.min(
    99,
    Math.round(26 + hotRatio * 42 + techRatio * 20 + redCount * 10)
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

  const method = `用你的 ${stocks.length} 檔追蹤股票估算：偏熱或高溫 ${hotCount} 檔、科技股 ${techCount} 檔、ETF ${etfCount} 檔。高溫越多、科技集中越高，天氣越容易轉陰。`;

  const impacts: ImpactItem[] = [
    {
      title: "熱門題材有沒有過熱",
      effect: hotRatio >= 0.5 ? "偏熱" : "可控",
      plain:
        hotRatio >= 0.5
          ? "你的清單裡不少股票已經偏熱，代表市場期待高。這時候最怕的不是公司變差，而是好消息不夠好。"
          : "偏熱股票還沒有占多數，市場情緒比較沒有一面倒，短線壓力相對可控。"
    },
    {
      title: "科技股占比",
      effect: techRatio >= 0.5 ? "集中" : "分散",
      plain:
        techRatio >= 0.5
          ? "科技與 AI 題材占比較高，市場好時會很有感，但一旦資金從科技股撤出，波動也會被放大。"
          : "科技股不是唯一主軸，清單裡還有其他類型標的，整體比較不會只被 AI 題材牽動。"
    },
    {
      title: "ETF 是分散還是同一包題材",
      effect: etfRatio >= 0.5 ? "要拆開看" : "影響中等",
      plain:
        etfRatio >= 0.5
          ? "ETF 多不一定代表很分散。若成分股都集中在半導體、高股息或美股科技，實際風險可能還是同一種。"
          : "ETF 比重沒有壓過其他類別，對整體市場天氣的影響比較像穩定器，不是唯一方向盤。"
    },
    {
      title: "今天該做什麼",
      effect: score >= 64 ? "先降速" : "可觀察",
      plain:
        score >= 64
          ? "如果想加碼，先問自己：這檔今天的新消息，是真的改善基本面，還是只是市場又更興奮？"
          : "可以繼續觀察清單裡風險溫度是否連續升高，還不用把一天漲跌看得太重。"
    }
  ];

  const reminder =
    score >= 64
      ? "今天的重點不是找最會漲的股票，而是分辨哪些標的只是熱、哪些是真的有基本面支持。"
      : "今天比較適合整理追蹤清單，確認每檔股票為什麼值得繼續看。";

  return { weather, score, summary, method, impacts, reminder };
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
