import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import type { HoldingWeights, StockCardData } from "../types";
import { Card } from "./Card";

type PositionSizingCardProps = {
  stocks: StockCardData[];
  holdingWeights: HoldingWeights;
  onChangeHoldingWeights: (weights: HoldingWeights) => void;
};

function clampWeight(value: number) {
  return Math.max(0, Math.min(80, value));
}

export function PositionSizingCard({
  stocks,
  holdingWeights,
  onChangeHoldingWeights
}: PositionSizingCardProps) {
  const updateWeight = (symbol: string, delta: number) => {
    onChangeHoldingWeights({
      ...holdingWeights,
      [symbol]: clampWeight((holdingWeights[symbol] ?? 10) + delta)
    });
  };

  return (
    <Card>
      <Text style={styles.title}>持股比例</Text>
      <Text style={styles.summary}>Demo 版先用比例估算風險，之後可改成串券商或手動輸入張數。</Text>
      <View style={styles.list}>
        {stocks.map((stock) => (
          <View key={stock.symbol} style={styles.row}>
            <View style={styles.identity}>
              <Text style={styles.symbol}>
                {stock.symbol} {stock.name}
              </Text>
              <Text style={styles.risk}>{stock.temperature}</Text>
            </View>
            <View style={styles.controls}>
              <Pressable onPress={() => updateWeight(stock.symbol, -5)} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </Pressable>
              <Text style={styles.value}>{holdingWeights[stock.symbol] ?? 10}%</Text>
              <Pressable onPress={() => updateWeight(stock.symbol, 5)} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </Pressable>
            </View>
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
  summary: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700"
  },
  list: {
    marginTop: spacing.md
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  identity: {
    flex: 1
  },
  symbol: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  risk: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  button: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softCard
  },
  buttonText: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "900"
  },
  value: {
    minWidth: 42,
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center"
  }
});
