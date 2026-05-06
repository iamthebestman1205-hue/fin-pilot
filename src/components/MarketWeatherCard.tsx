import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import { Card } from "./Card";

type MarketWeatherCardProps = {
  weather: string;
  summary: string;
  score: number;
  method: string;
};

export function MarketWeatherCard({
  weather,
  summary,
  score,
  method
}: MarketWeatherCardProps) {
  return (
    <Card soft>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.label}>今日市場天氣</Text>
          <Text style={styles.weather}>{weather}</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.scoreLabel}>風險分</Text>
        </View>
      </View>
      <Text style={styles.summary}>{summary}</Text>
      <View style={styles.methodBox}>
        <Text style={styles.methodLabel}>怎麼評的</Text>
        <Text style={styles.method}>{method}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  titleBlock: {
    flex: 1
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  weather: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0
  },
  scoreBadge: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  score: {
    color: colors.gold,
    fontSize: 22,
    fontWeight: "900"
  },
  scoreLabel: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  summary: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "600"
  },
  methodBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  methodLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900"
  },
  method: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
