import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Badge } from "./Badge";
import { Card } from "./Card";

type StockStatusCardProps = {
  stock: StockCardData;
  onPress?: () => void;
};

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

export function StockStatusCard({ stock, onPress }: StockStatusCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.identity}>
            <Text style={styles.symbol}>{stock.symbol}</Text>
            <Text style={styles.name}>{stock.name}</Text>
          </View>
          <Text style={styles.chevron}>{onPress ? ">" : ""}</Text>
        </View>
        <View style={styles.badges}>
          <Badge label={stock.status} tone={stock.statusTone} />
          <Badge label={stock.temperature} tone={stock.temperatureTone} />
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>今日漲跌</Text>
          <Text
            style={[
              styles.priceChange,
              stock.priceMove === "down" && styles.priceChangeDown,
              stock.priceMove === "flat" && styles.priceChangeFlat
            ]}
          >
            {getMoveLabel(stock)}
          </Text>
        </View>
        <Text style={styles.reason}>{stock.reason}</Text>
        <View style={styles.newsBox}>
          <Text style={styles.newsLabel}>今日股市重點</Text>
          <Text style={styles.newsText}>{stock.aiNews}</Text>
          <Text style={styles.sourceNote}>{stock.sourceNote}</Text>
          <Text style={styles.updatedAt}>{getSourceLabel(stock)}</Text>
        </View>
        <Text style={styles.reminder}>{stock.reminder}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  identity: {
    flex: 1
  },
  symbol: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  name: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700"
  },
  chevron: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: "800"
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  reason: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600"
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  priceLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  priceChange: {
    color: colors.green,
    fontSize: 18,
    fontWeight: "900"
  },
  priceChangeDown: {
    color: colors.red
  },
  priceChangeFlat: {
    color: colors.muted
  },
  newsBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softCard
  },
  newsLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900"
  },
  newsText: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600"
  },
  updatedAt: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  sourceNote: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600"
  },
  reminder: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
