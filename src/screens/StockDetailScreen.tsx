import { Pressable, StyleSheet, Text, View } from "react-native";

import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { DailyAiNewsCard } from "../components/DailyAiNewsCard";
import { ImpactBreakdownCard, type ImpactItem } from "../components/ImpactBreakdownCard";
import { RiskTemperatureCard } from "../components/RiskTemperatureCard";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { StockForecastCard, type ForecastItem } from "../components/StockForecastCard";
import { StockStatusCard } from "../components/StockStatusCard";
import { colors, radius, spacing } from "../theme";
import type { StockCardData } from "../types";

type StockDetailScreenProps = {
  stocks: StockCardData[];
  selectedStock: StockCardData | null;
  onSelectStock: (symbol: string) => void;
  onBackToList: () => void;
  onFindStocks: () => void;
};

function hashText(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function pick<T>(items: T[], seed: number) {
  return items[Math.abs(seed) % items.length];
}

function getMoveLabel(stock: StockCardData) {
  if (stock.priceMove === "up") {
    return "今天上漲";
  }

  if (stock.priceMove === "down") {
    return "今天下跌";
  }

  return "今天震盪";
}

function getSourceLabel(stock: StockCardData) {
  if (stock.dataSource === "twse") {
    return `TWSE ${stock.updatedAt}`;
  }

  return "Demo 推估，非真實報價";
}

function getForecastWeather(stock: StockCardData) {
  if (stock.temperatureTone === "red") {
    return { today: "⛈ 雷雨", tomorrow: "🌧 陣雨", week: "☁️ 多雲" };
  }

  if (stock.temperatureTone === "orange") {
    return { today: "🌤 悶熱", tomorrow: "☁️ 多雲", week: "🌦 短暫雨" };
  }

  if (stock.statusTone === "green") {
    return { today: "☀️ 晴朗", tomorrow: "🌤 微晴", week: "🌤 微晴" };
  }

  return { today: "🌤 微晴", tomorrow: "☁️ 多雲", week: "🌤 微晴" };
}

function buildForecastItems(stock: StockCardData): ForecastItem[] {
  const weather = getForecastWeather(stock);
  const isHot = stock.temperatureTone === "orange" || stock.temperatureTone === "red";
  const seed = hashText(`${stock.symbol}-${stock.updatedAt}-${stock.temperature}`);
  const todayNotes = isHot
    ? [
        "今天像悶熱午後，題材還在但空氣有點黏。先看原因，不急著追。",
        "短線情緒偏熱，利多容易被放大，財報或展望不如期待時也容易被放大。",
        "市場期待已經不低，今天要確認生意、賺錢能力和價格是不是還合理。"
      ]
    : [
        "今天氣氛相對穩，適合觀察買氣、訂單和大戶態度是否延續原本故事。",
        "短線沒有明顯過熱，重點是看買盤是不是有理由。",
        "目前比較像可觀察的天氣，不需要把一天波動看得太重。"
      ];
  const tomorrowNotes = [
    "如果明天沒有新的利多接上，市場期待可能降溫。",
    "明天要看今天的焦點是否延續，不是只看開盤漲跌。",
    "若買盤和題材續航，溫度會維持；若大家開始退場，天氣可能轉陰。"
  ];
  const weekNotes =
    stock.category === "tech" || stock.category === "etf"
      ? [
          "未來一週留意 AI、半導體、ETF 內容是否太集中，以及大盤買氣是否同步支持。",
          "如果市場不再偏愛科技股，這檔的天氣也可能跟著變差。",
          "觀察題材是否從單日題材變成連續買盤，這比一天漲跌更重要。"
        ]
      : [
          "未來一週留意買氣、利率與大盤氣氛是否改變原本故事。",
          "如果防禦或金融買盤轉強，這檔可能走出和科技股不同的天氣。",
          "觀察生意、賺錢能力或發錢條件是否真的改善，而不是只有短線情緒。"
        ];

  return [
    {
      period: "今天",
      weather: weather.today,
      temperature: stock.temperature,
      note: pick(todayNotes, seed)
    },
    {
      period: "明天",
      weather: weather.tomorrow,
      temperature: isHot ? "🟠 仍偏熱" : "🟡 中溫",
      note: pick(tomorrowNotes, seed + 3)
    },
    {
      period: "未來一週",
      weather: weather.week,
      temperature: isHot ? "震盪機率高" : "觀察續航",
      note: pick(weekNotes, seed + 7)
    }
  ];
}

function getMechanismText(stock: StockCardData) {
  switch (stock.category) {
    case "tech":
      return "科技股很像大家都在排隊買的新產品。只要大家相信未來會賣很好，價格就容易先被炒熱；但如果後來沒有想像中熱門，價格也會很快退燒。";
    case "etf":
      return "ETF 像一個便當，裡面裝了很多菜。名字看起來很分散，但如果裡面大多都是同一種菜，吃起來其實還是很集中。";
    case "finance":
      return "金融股像開銀行和保險店，賺錢方式跟利息、景氣和大家還不還得起錢有關。環境穩時比較加分，市場緊張時就會比較保守。";
    case "defensive":
      return "防禦型股票像生活必需品店，不一定突然大爆發，但生意比較穩。市場不安時，很多人會喜歡這種比較不刺激的選擇。";
    case "cyclical":
      return "循環股像靠季節吃飯的店，旺季來了會很熱鬧，淡季來了就會冷清。重點是判斷現在是不是真的進入旺季。";
    default:
      return "這檔股票不能只看一個好理由，要看生意有沒有變好、大家是不是願意買、價格是不是已經太貴。";
  }
}

function getInvestorImpactText(stock: StockCardData) {
  if (stock.temperatureTone === "red" || stock.temperatureTone === "orange") {
    return "對一般投資人來說，這像一間店外面已經大排長龍。你可以覺得它很好，但不一定要在人最多、最擠的時候衝進去。已經持有的人要確認自己能不能接受排隊散掉時的波動。";
  }

  return "對一般投資人來說，這像一間店開始有人注意，但還沒有擠爆。可以先放進觀察名單，看接下來是不是真的越來越多人買單。";
}

function getSignalText(stock: StockCardData) {
  switch (stock.category) {
    case "tech":
      return "接下來看三件事：產品是不是一直有人要買、公司賺錢能力有沒有變好、價格是不是已經被炒太高。";
    case "etf":
      return "接下來看三件事：便當裡是不是都同一種菜、領到的配息穩不穩、整個市場是不是還喜歡這種口味。";
    case "finance":
      return "接下來看三件事：利息環境對它有沒有利、發錢穩不穩、整體景氣會不會讓金融業變保守。";
    case "defensive":
      return "接下來看三件事：生意穩不穩、發錢穩不穩、市場亂的時候大家會不會更想買它。";
    case "cyclical":
      return "接下來看三件事：是不是進入旺季、賣價有沒有變好、之前堆太多的貨有沒有消化掉。";
    default:
      return "接下來看生意有沒有變好、大家是不是願意買、價格是不是已經太貴。";
  }
}

function buildImpactItems(stock: StockCardData): ImpactItem[] {
  return [
    {
      title: "今天市場在看什麼",
      effect: stock.status,
      plain: stock.reason
    },
    {
      title: "為什麼它會影響股價",
      effect: "影響機制",
      plain: getMechanismText(stock)
    },
    {
      title: "這代表什麼風險",
      effect: stock.temperature,
      plain:
        stock.temperatureTone === "red" || stock.temperatureTone === "orange"
          ? "大家已經很期待它表現好，所以標準會變高。只要結果沒有大家想像中好，價格就容易晃得比較大。"
          : "目前沒有明顯過熱，重點是看這個好故事能不能連續幾天站得住腳。"
    },
    {
      title: "這對一般投資人有什麼影響",
      effect: "白話影響",
      plain: getInvestorImpactText(stock)
    },
    {
      title: "接下來看哪幾個訊號",
      effect: "觀察清單",
      plain: getSignalText(stock)
    },
    {
      title: "今天該怎麼看",
      effect: "行動提醒",
      plain: stock.reminder
    }
  ];
}

function StockInsightDetail({
  stock,
  onBackToList
}: {
  stock: StockCardData;
  onBackToList: () => void;
}) {
  const riskFill =
    stock.temperatureTone === "red" ? 0.88 : stock.temperatureTone === "orange" ? 0.72 : 0.5;

  return (
    <Screen>
      <Pressable onPress={onBackToList} style={styles.backButton}>
        <Text style={styles.backButtonText}>回到追蹤清單</Text>
      </Pressable>

      <Text style={styles.symbol}>{stock.symbol}</Text>
      <Text style={styles.name}>{stock.name}</Text>
      <View style={styles.badges}>
        <Badge label={stock.status} tone={stock.statusTone} />
        <Badge label={stock.temperature} tone={stock.temperatureTone} />
      </View>
      <View style={styles.detailMoveCard}>
        <Text style={styles.detailMoveLabel}>今日漲跌</Text>
        <Text
          style={[
            styles.detailMoveValue,
            stock.priceMove === "down" && styles.detailMoveDown,
            stock.priceMove === "flat" && styles.detailMoveFlat
          ]}
        >
          {getMoveLabel(stock)}
        </Text>
      </View>

      <SectionTitle title="今日股市重點" />
      <Card soft>
        <Text style={styles.detailNews}>{stock.aiNews}</Text>
        <Text style={styles.sourceNote}>{stock.sourceNote}</Text>
        <Text style={styles.detailTime}>{getSourceLabel(stock)}</Text>
      </Card>

      <SectionTitle title="查證狀態" />
      <Card>
        <Text style={styles.conclusion}>{stock.informationBasis}</Text>
      </Card>

      <SectionTitle title="風險溫度" />
      <RiskTemperatureCard temperature={stock.temperature} fill={riskFill} note={stock.reminder} />

      <SectionTitle
        title="天氣預報"
        caption={`依照 ${getSourceLabel(stock)}，推估今天、明天與未來一週。`}
      />
      <StockForecastCard items={buildForecastItems(stock)} />

      <SectionTitle title="影響來源拆解" />
      <ImpactBreakdownCard items={buildImpactItems(stock)} />

      <SectionTitle title="AI 白話結論" />
      <Card>
        <Text style={styles.conclusion}>
          {stock.name}
          的重點不是只看今天漲跌，而是理解「為什麼大家在意它、這件事會怎麼影響價格、你要看哪些簡單訊號」。天氣預報看短線溫度，影響來源拆解看背後原因。
        </Text>
      </Card>

      <Text style={styles.disclaimer}>這不是投資建議，請自行判斷風險。</Text>
    </Screen>
  );
}

export function StockDetailScreen({
  stocks,
  selectedStock,
  onSelectStock,
  onBackToList,
  onFindStocks
}: StockDetailScreenProps) {
  if (selectedStock) {
    return <StockInsightDetail stock={selectedStock} onBackToList={onBackToList} />;
  }

  const hotCount = stocks.filter(
    (stock) => stock.temperatureTone === "orange" || stock.temperatureTone === "red"
  ).length;

  return (
    <Screen>
      <Text style={styles.title}>已追蹤股票</Text>
      <Text style={styles.subtitle}>點進任一檔股票，就能看今日股市重點、風險溫度與個股天氣預報。</Text>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stocks.length}</Text>
          <Text style={styles.statLabel}>追蹤中</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{hotCount}</Text>
          <Text style={styles.statLabel}>偏熱標的</Text>
        </Card>
      </View>

      <SectionTitle title="整體風險溫度" />
      <RiskTemperatureCard
        temperature={hotCount > 0 ? "🟠 偏熱" : "🟡 中溫"}
        fill={hotCount > 0 ? 0.68 : 0.48}
        note="這是根據目前追蹤清單的模擬風險摘要，正式版可由每日資料與 AI 重新計算。"
      />

      {stocks.length > 0 ? (
        <>
          <SectionTitle title="股市重點" />
          <DailyAiNewsCard stocks={stocks} />

          <SectionTitle title="我的追蹤清單" />
          {stocks.map((stock) => (
            <StockStatusCard
              key={stock.symbol}
              stock={stock}
              onPress={() => onSelectStock(stock.symbol)}
            />
          ))}
        </>
      ) : (
        <Card>
          <Text style={styles.emptyTitle}>尚未追蹤股票</Text>
          <Text style={styles.emptyText}>到搜尋頁輸入股票代號或名稱，按「追蹤」加入清單。</Text>
          <Pressable onPress={onFindStocks} style={styles.findButton}>
            <Text style={styles.findButtonText}>去搜尋股票</Text>
          </Pressable>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl
  },
  statCard: {
    flex: 1
  },
  statValue: {
    color: colors.gold,
    fontSize: 34,
    fontWeight: "900"
  },
  statLabel: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  backButtonText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900"
  },
  symbol: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "900"
  },
  name: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  detailMoveCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  detailMoveLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  detailMoveValue: {
    marginTop: spacing.xs,
    color: colors.green,
    fontSize: 38,
    fontWeight: "900"
  },
  detailMoveDown: {
    color: colors.red
  },
  detailMoveFlat: {
    color: colors.muted
  },
  detailNews: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "700"
  },
  detailTime: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  sourceNote: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600"
  },
  conclusion: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 27,
    fontWeight: "600"
  },
  disclaimer: {
    marginTop: spacing.lg,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center"
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  emptyText: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23
  },
  findButton: {
    alignSelf: "flex-start",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.gold
  },
  findButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "900"
  }
});
