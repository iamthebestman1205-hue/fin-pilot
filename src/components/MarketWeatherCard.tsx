import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, radius, riskColor, spacing } from "../theme";
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
  const color = riskColor(score);
  const pct = score / 100;

  return (
    <Card soft>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.label}>今日市場天氣</Text>
          <Text style={styles.weather}>{weather}</Text>
        </View>
        <LinearGradient
          colors={[`${color}44`, `${color}11`]}
          style={[styles.scoreBadgeOuter, { borderColor: color }]}
        >
          <View style={styles.scoreBadgeInner}>
            <Text style={[styles.score, { color }]}>{score}</Text>
            <Text style={styles.scoreLabel}>風險分</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.riskBar}>
        <LinearGradient
          colors={["#22C55E", "#FACC15", "#FB923C", "#F87171"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.riskBarTrack}
        />
        <View style={[styles.riskBarThumb, { left: `${Math.min(pct * 100, 94)}%` as unknown as number }]} />
      </View>
      <View style={styles.riskBarLabels}>
        <Text style={styles.riskBarLabelText}>低風險</Text>
        <Text style={styles.riskBarLabelText}>高風險</Text>
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
  scoreBadgeOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  scoreBadgeInner: {
    alignItems: "center",
    justifyContent: "center"
  },
  score: {
    fontSize: 26,
    fontWeight: "900"
  },
  scoreLabel: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  riskBar: {
    marginTop: spacing.lg,
    height: 6,
    borderRadius: 3,
    overflow: "visible",
    position: "relative"
  },
  riskBarTrack: {
    height: 6,
    borderRadius: 3
  },
  riskBarThumb: {
    position: "absolute",
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.text,
    borderWidth: 2,
    borderColor: colors.background,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  riskBarLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs
  },
  riskBarLabelText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600"
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
