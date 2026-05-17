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

const healthColor: Record<string, string> = {
  "相對均衡": colors.green,
  "中等偏積極": colors.yellow,
  "集中偏高": colors.red,
  "尚未建立": colors.muted
};

export function PortfolioHealthCard({ health, allocations }: PortfolioHealthCardProps) {
  const color = healthColor[health] ?? colors.muted;
  const total = Math.max(allocations.reduce((s, a) => s + a.value, 0), 1);

  return (
    <Card soft>
      <Text style={styles.label}>投資組合健康度</Text>
      <View style={styles.healthRow}>
        <Text style={[styles.health, { color }]}>{health}</Text>
        <View style={[styles.healthPill, { backgroundColor: `${color}22`, borderColor: `${color}55` }]}>
          <Text style={[styles.healthPillText, { color }]}>
            {allocations.filter(a => a.label !== "現金").length} 類資產
          </Text>
        </View>
      </View>

      <View style={styles.barContainer}>
        {allocations.map((item, i) => {
          const isFirst = i === 0;
          const isLast = i === allocations.length - 1;
          return (
            <View
              key={item.label}
              style={[
                styles.segment,
                {
                  flex: Math.max(item.value, 1),
                  backgroundColor: item.color,
                  borderTopLeftRadius: isFirst ? 11 : 2,
                  borderBottomLeftRadius: isFirst ? 11 : 2,
                  borderTopRightRadius: isLast ? 11 : 2,
                  borderBottomRightRadius: isLast ? 11 : 2,
                  marginRight: isLast ? 0 : 2
                }
              ]}
            />
          );
        })}
      </View>

      <View style={styles.allocations}>
        {allocations.map((item) => (
          <View key={item.label} style={styles.allocationRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.allocationLabel}>{item.label}</Text>
            <View style={styles.allocationBarWrap}>
              <View
                style={[
                  styles.allocationBar,
                  { width: `${(item.value / total) * 100}%` as unknown as number, backgroundColor: item.color }
                ]}
              />
            </View>
            <Text style={[styles.allocationPct, { color: item.color }]}>{item.value}%</Text>
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
  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm
  },
  health: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0
  },
  healthPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1
  },
  healthPillText: {
    fontSize: 12,
    fontWeight: "800"
  },
  barContainer: {
    flexDirection: "row",
    height: 22,
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 11
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
    alignItems: "center",
    gap: spacing.sm
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0
  },
  allocationLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    width: 44
  },
  allocationBarWrap: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.card,
    overflow: "hidden"
  },
  allocationBar: {
    height: "100%",
    borderRadius: 3
  },
  allocationPct: {
    fontSize: 13,
    fontWeight: "800",
    width: 36,
    textAlign: "right"
  }
});
