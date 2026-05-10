import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { HoldingWeights, InvestorMode, StockCardData } from "../types";
import { Card } from "./Card";

type RiskRadarCardProps = {
  stocks: StockCardData[];
  holdingWeights: HoldingWeights;
  investorMode: InvestorMode;
};

function getImpactScore(stock: StockCardData, holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  const weight = investorMode === "holding" ? holdingWeights[stock.symbol] ?? 10 : 10;
  const heat = stock.temperatureTone === "red" ? 3 : stock.temperatureTone === "orange" ? 2 : 1;
  const move = stock.priceMove === "down" ? 2 : stock.priceMove === "up" ? 1 : 0;

  return weight * heat + move * 8;
}

function getAlertLine(stock: StockCardData, holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  const weight = holdingWeights[stock.symbol] ?? 10;

  if (investorMode === "holding" && weight >= 25 && stock.temperatureTone !== "yellow") {
    return `部位約 ${weight}%，又是${stock.temperature}，這是今天最需要先看的風險。`;
  }

  if (stock.priceMove === "down") {
    return "價格轉弱，先看是個股事件、族群修正，還是大盤一起變弱。";
  }

  if (stock.temperatureTone === "red" || stock.temperatureTone === "orange") {
    return "題材溫度偏高，追價前要先看原因能不能延續。";
  }

  return "目前不是主要警訊，但仍可放在觀察名單。";
}

export function RiskRadarCard({ stocks, holdingWeights, investorMode }: RiskRadarCardProps) {
  const radarStocks = [...stocks]
    .sort((a, b) => getImpactScore(b, holdingWeights, investorMode) - getImpactScore(a, holdingWeights, investorMode))
    .slice(0, 3);

  return (
    <Card soft>
      <Text style={styles.title}>每日風險雷達</Text>
      <Text style={styles.summary}>
        {investorMode === "holding"
          ? "依持股比例、風險溫度和漲跌方向，抓出今天最可能影響你的部位。"
          : "依風險溫度和漲跌方向，抓出觀察名單裡最需要先看的標的。"}
      </Text>
      <View style={styles.list}>
        {radarStocks.map((stock) => (
          <View key={stock.symbol} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.symbol}>
                {stock.symbol} {stock.name}
              </Text>
              <Text style={styles.impact}>
                {investorMode === "holding" ? `${holdingWeights[stock.symbol] ?? 10}%` : stock.temperature}
              </Text>
            </View>
            <Text style={styles.line}>{getAlertLine(stock, holdingWeights, investorMode)}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  summary: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700"
  },
  list: {
    marginTop: spacing.md
  },
  item: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  symbol: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  impact: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900"
  },
  line: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22
  }
});
