import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import { Card } from "./Card";

type RiskTemperatureCardProps = {
  temperature: string;
  note?: string;
  fill?: number;
};

export function RiskTemperatureCard({
  temperature,
  note,
  fill = 0.68
}: RiskTemperatureCardProps) {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>風險溫度計</Text>
        <Text style={styles.temperature}>{temperature}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(fill * 100)}%` }]} />
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  temperature: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: "900"
  },
  track: {
    height: 12,
    marginTop: spacing.lg,
    overflow: "hidden",
    borderRadius: radius.md,
    backgroundColor: colors.softCard
  },
  fill: {
    height: "100%",
    borderRadius: radius.md,
    backgroundColor: colors.gold
  },
  note: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
