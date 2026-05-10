import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Card } from "./Card";

type DailyBriefingCardProps = {
  stocks: StockCardData[];
};

function getMoveText(stock: StockCardData) {
  if (stock.priceMove === "up") {
    return "上漲";
  }

  if (stock.priceMove === "down") {
    return "下跌";
  }

  return "震盪";
}

function getPriorityScore(stock: StockCardData) {
  const heat = stock.temperatureTone === "red" ? 4 : stock.temperatureTone === "orange" ? 3 : 1;
  const move = stock.priceMove === "down" ? 2 : stock.priceMove === "up" ? 1 : 0;

  return heat + move;
}

function getBriefingLine(stock: StockCardData) {
  const cause = stock.reason.replace(`${stock.name}今天${getMoveText(stock)}。`, "");
  return cause.length > 0 ? cause : stock.reminder;
}

export function DailyBriefingCard({ stocks }: DailyBriefingCardProps) {
  const sortedStocks = [...stocks]
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, 3);
  const hotCount = stocks.filter(
    (stock) => stock.temperatureTone === "orange" || stock.temperatureTone === "red"
  ).length;
  const downCount = stocks.filter((stock) => stock.priceMove === "down").length;

  return (
    <Card soft>
      <Text style={styles.eyebrow}>今日總覽</Text>
      <Text style={styles.title}>
        {hotCount > 0 || downCount > 0 ? "今天先看需要注意的股票。" : "今天追蹤清單偏穩。"}
      </Text>
      <Text style={styles.summary}>
        {hotCount > 0 || downCount > 0
          ? "追蹤清單裡有幾檔需要先看原因。"
          : "追蹤清單目前沒有明顯警訊。"}
      </Text>

      <View style={styles.list}>
        {sortedStocks.map((stock) => (
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
                {getMoveText(stock)}
              </Text>
            </View>
            <Text style={styles.reason}>{getBriefingLine(stock)}</Text>
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
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700"
  },
  list: {
    marginTop: spacing.md
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
