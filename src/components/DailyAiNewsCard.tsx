import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { ExplanationLevel, StockCardData } from "../types";
import { Card } from "./Card";

type DailyAiNewsCardProps = {
  stocks: StockCardData[];
  explanationLevel?: ExplanationLevel;
};

const moveLabelMap: Record<string, string> = {
  up: "▲ 上漲",
  down: "▼ 下跌",
  flat: "— 震盪"
};

function getModeLabel(level: ExplanationLevel): string {
  if (level === "simple") return "簡單版";
  if (level === "detailed") return "Pro 版";
  return "標準版";
}

function getNewsContent(stock: StockCardData, level: ExplanationLevel): string {
  if (level === "simple") return stock.aiNewsSimple;
  if (level === "detailed") return stock.aiNewsDetailed;
  return stock.aiNews;
}

function getSourceLabel(stock: StockCardData) {
  if (stock.dataSource === "twse") return `報價 ${stock.updatedAt}`;
  return "等待今日資料更新";
}

export function DailyAiNewsCard({ stocks, explanationLevel = "standard" }: DailyAiNewsCardProps) {
  return (
    <Card soft>
      <View style={styles.headerRow}>
        <Text style={styles.title}>股市重點</Text>
        <View style={styles.modePill}>
          <Text style={styles.modeText}>{getModeLabel(explanationLevel)}</Text>
        </View>
      </View>
      <Text style={styles.caption}>
        {explanationLevel === "simple"
          ? "最簡單的一句話：今天要不要注意這檔。"
          : explanationLevel === "detailed"
            ? "Pro 版：為什麼漲跌、核心驅動、量能訊號一次看清楚。"
            : "一般版：今天漲跌的核心原因，以及接下來要看什麼。"}
      </Text>
      <View style={styles.list}>
        {stocks.map((stock, index) => {
          const content = getNewsContent(stock, explanationLevel);
          const moveColor = stock.priceMove === "up" ? colors.green : stock.priceMove === "down" ? colors.red : colors.muted;
          return (
            <View
              key={stock.symbol}
              style={[styles.item, index === stocks.length - 1 && styles.lastItem]}
            >
              <View style={styles.itemHeader}>
                <View style={styles.symbolBlock}>
                  <Text style={styles.symbol}>{stock.name}</Text>
                  <Text style={styles.symbolCode}>{stock.symbol}</Text>
                </View>
                <View style={[styles.moveBadge, { backgroundColor: `${moveColor}18`, borderColor: `${moveColor}44` }]}>
                  <Text style={[styles.moveLabel, { color: moveColor }]}>
                    {moveLabelMap[stock.priceMove]}
                  </Text>
                </View>
              </View>
              <Text style={styles.news}>{content}</Text>
              {explanationLevel !== "simple" && (
                <View style={styles.metaRow}>
                  <Text style={styles.time}>{getSourceLabel(stock)}</Text>
                  {stock.referenceSources.length > 0 && (
                    <Text style={styles.source}>
                      參考：{stock.referenceSources.map((s) => s.name).join("、")}
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  modePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: `${colors.gold}22`,
    borderWidth: 1,
    borderColor: `${colors.gold}44`
  },
  modeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "800"
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
    borderBottomColor: colors.border,
    gap: spacing.xs
  },
  lastItem: {
    borderBottomWidth: 0,
    paddingBottom: 0
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md
  },
  symbolBlock: {
    flex: 1
  },
  symbol: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  symbolCode: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 1
  },
  moveBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1
  },
  moveLabel: {
    fontSize: 12,
    fontWeight: "900"
  },
  news: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: 2
  },
  time: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  source: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600"
  }
});
