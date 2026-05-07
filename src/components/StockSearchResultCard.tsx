import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Badge } from "./Badge";
import { Card } from "./Card";

type StockSearchResultCardProps = {
  stock: StockCardData;
  isTracked: boolean;
  onToggleTrack: () => void;
};

export function StockSearchResultCard({
  stock,
  isTracked,
  onToggleTrack
}: StockSearchResultCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <Text style={styles.name}>{stock.name}</Text>
        </View>
        <Pressable
          onPress={onToggleTrack}
          style={[styles.trackButton, isTracked && styles.trackButtonActive]}
        >
          <Text style={[styles.trackText, isTracked && styles.trackTextActive]}>
            {isTracked ? "已追蹤" : "追蹤"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.badges}>
        <Badge label={stock.status} tone={stock.statusTone} />
        <Badge label={stock.temperature} tone={stock.temperatureTone} />
      </View>
      <Text style={styles.news}>{stock.aiNews}</Text>
      <Text style={styles.sourceNote}>{stock.sourceNote}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  identity: {
    flex: 1
  },
  symbol: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  name: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700"
  },
  trackButton: {
    minWidth: 74,
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: "transparent"
  },
  trackButtonActive: {
    backgroundColor: colors.gold
  },
  trackText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900"
  },
  trackTextActive: {
    color: colors.background
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  news: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600"
  },
  sourceNote: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600"
  }
});
