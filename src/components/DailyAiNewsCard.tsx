import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Card } from "./Card";

type DailyAiNewsCardProps = {
  stocks: StockCardData[];
};

function getMoveLabel(stock: StockCardData) {
  if (stock.priceMove === "up") {
    return "上漲";
  }

  if (stock.priceMove === "down") {
    return "下跌";
  }

  return "震盪";
}

function getSourceLabel(stock: StockCardData) {
  if (stock.dataSource === "twse") {
    return `報價 ${stock.updatedAt}`;
  }

  return "等待今日資料更新";
}

export function DailyAiNewsCard({ stocks }: DailyAiNewsCardProps) {
  return (
    <Card soft>
      <Text style={styles.title}>股市重點</Text>
      <Text style={styles.caption}>保留最重要的原因，不堆滿新聞。</Text>
      <View style={styles.list}>
        {stocks.map((stock, index) => (
          <View
            key={stock.symbol}
            style={[styles.item, index === stocks.length - 1 && styles.lastItem]}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.symbol}>
                {stock.symbol} {stock.name}
              </Text>
              <Text
                style={[
                  styles.change,
                  stock.priceMove === "down" && styles.changeDown,
                  stock.priceMove === "flat" && styles.changeFlat
                ]}
              >
                {getMoveLabel(stock)}
              </Text>
            </View>
            <Text style={styles.time}>{getSourceLabel(stock)}</Text>
            <Text style={styles.news}>{stock.aiNews}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  caption: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20
  },
  list: {
    marginTop: spacing.md
  },
  item: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  lastItem: {
    borderBottomWidth: 0,
    paddingBottom: 0
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  symbol: {
    flex: 1,
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900"
  },
  time: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  change: {
    color: colors.green,
    fontSize: 14,
    fontWeight: "900"
  },
  changeDown: {
    color: colors.red
  },
  changeFlat: {
    color: colors.muted
  },
  news: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600"
  }
});
