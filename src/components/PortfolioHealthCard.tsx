import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import { Card } from "./Card";

export type AllocationItem = {
  label: string;
  value: number;
  color: string;
};

type PortfolioHealthCardProps = {
  health: string;
  allocations: AllocationItem[];
};

export function PortfolioHealthCard({ health, allocations }: PortfolioHealthCardProps) {
  return (
    <Card soft>
      <Text style={styles.label}>投資組合健康度</Text>
      <Text style={styles.health}>{health}</Text>
      <View style={styles.bar}>
        {allocations.map((item) => (
          <View
            key={item.label}
            style={[styles.segment, { flex: Math.max(item.value, 1), backgroundColor: item.color }]}
          />
        ))}
      </View>
      <View style={styles.allocations}>
        {allocations.map((item) => (
          <View key={item.label} style={styles.allocationRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.allocationText}>
              {item.label} {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  health: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0
  },
  bar: {
    flexDirection: "row",
    height: 14,
    marginTop: spacing.lg,
    overflow: "hidden",
    borderRadius: radius.md,
    backgroundColor: colors.card
  },
  segment: {
    height: "100%"
  },
  allocations: {
    marginTop: spacing.lg,
    gap: spacing.sm
  },
  allocationRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  dot: {
    width: 9,
    height: 9,
    marginRight: spacing.sm,
    borderRadius: 5
  },
  allocationText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  }
});
