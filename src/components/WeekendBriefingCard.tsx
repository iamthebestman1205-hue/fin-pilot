import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Card } from "./Card";

type WeekendBriefingCardProps = {
  stocks: StockCardData[];
};

function getMoveLabel(stock: StockCardData) {
  if (stock.priceMove === "up") {
    return "上週走強";
  }

  if (stock.priceMove === "down") {
    return "上週轉弱";
  }

  return "上週整理";
}

function getPriorityScore(stock: StockCardData) {
  const heat = stock.temperatureTone === "red" ? 4 : stock.temperatureTone === "orange" ? 3 : 1;
  const move = stock.priceMove === "down" ? 2 : stock.priceMove === "up" ? 1 : 0;

  return heat + move;
}

function getNextWeekFocus(stocks: StockCardData[]) {
  const techCount = stocks.filter((stock) => stock.category === "tech").length;
  const etfCount = stocks.filter((stock) => stock.category === "etf").length;

  if (techCount >= Math.max(2, etfCount)) {
    return "下週先看 AI、半導體與科技股買盤是否延續，尤其是漲多後的賣壓。";
  }

  if (etfCount >= 2) {
    return "下週先看 ETF 成分股是否集中在同一類題材，不要只看名稱以為很分散。";
  }

  return "下週先看資金是否從熱門股轉向金融、防禦或景氣循環股。";
}

export function WeekendBriefingCard({ stocks }: WeekendBriefingCardProps) {
  const watchList = [...stocks].sort((a, b) => getPriorityScore(b) - getPriorityScore(a)).slice(0, 3);
  const downCount = stocks.filter((stock) => stock.priceMove === "down").length;
  const hotCount = stocks.filter(
    (stock) => stock.temperatureTone === "orange" || stock.temperatureTone === "red"
  ).length;

  return (
    <Card soft>
      <Text style={styles.eyebrow}>週末模式</Text>
      <Text style={styles.title}>台股休市，改看上週回顧與下週觀察。</Text>
      <Text style={styles.summary}>
        上週追蹤清單有 {downCount} 檔轉弱、{hotCount} 檔偏熱。{getNextWeekFocus(stocks)}
      </Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>下週可注意</Text>
        {watchList.map((stock) => (
          <View key={stock.symbol} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.symbol}>
                {stock.symbol} {stock.name}
              </Text>
              <Text
                style={[
                  styles.move,
                  stock.priceMove === "down" && styles.moveDown,
                  stock.priceMove === "flat" && styles.moveFlat
                ]}
              >
                {getMoveLabel(stock)}
              </Text>
            </View>
            <Text style={styles.reason}>{stock.reminder}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "900"
  },
  summary: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700"
  },
  block: {
    marginTop: spacing.lg
  },
  blockTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  item: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  symbol: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  move: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "900"
  },
  moveDown: {
    color: colors.red
  },
  moveFlat: {
    color: colors.muted
  },
  reason: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22
  }
});
