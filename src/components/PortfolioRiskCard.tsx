import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { InvestorMode, StockCardData } from "../types";
import { Card } from "./Card";

type PortfolioRiskCardProps = {
  stocks: StockCardData[];
  investorMode: InvestorMode;
};

function getPriorityScore(stock: StockCardData) {
  const heat = stock.temperatureTone === "red" ? 4 : stock.temperatureTone === "orange" ? 3 : 1;
  const move = stock.priceMove === "down" ? 2 : stock.priceMove === "up" ? 1 : 0;
  return heat + move;
}

function getRiskLine(stock: StockCardData, investorMode: InvestorMode) {
  if (investorMode === "holding") {
    if (stock.temperatureTone === "red") {
      return "已持有者要先檢查部位大小，避免單一題材過熱拖累整體。";
    }

    if (stock.priceMove === "down") {
      return "已持有者先觀察賣壓是否連續，避免一天波動就做決定。";
    }

    return "已持有者可續抱觀察，但要追蹤量價是否失衡。";
  }

  if (stock.temperatureTone === "red" || stock.temperatureTone === "orange") {
    return "觀察者先等溫度降一點，避免追在最熱的位置。";
  }

  return "觀察者可先放入口袋名單，等事件更明確。";
}

export function PortfolioRiskCard({ stocks, investorMode }: PortfolioRiskCardProps) {
  const riskyStocks = [...stocks].sort((a, b) => getPriorityScore(b) - getPriorityScore(a)).slice(0, 3);

  return (
    <Card soft>
      <Text style={styles.title}>{investorMode === "holding" ? "持有風險" : "觀察風險"}</Text>
      <Text style={styles.summary}>
        {investorMode === "holding"
          ? "這裡會把追蹤清單當成你的持有部位，先抓出最需要注意的風險。"
          : "這裡會把追蹤清單當成觀察名單，幫你避開最容易追高的標的。"}
      </Text>

      <View style={styles.list}>
        {riskyStocks.map((stock) => (
          <View key={stock.symbol} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.symbol}>
                {stock.symbol} {stock.name}
              </Text>
              <Text style={styles.temperature}>{stock.temperature}</Text>
            </View>
            <Text style={styles.reason}>{getRiskLine(stock, investorMode)}</Text>
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
  temperature: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900"
  },
  reason: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22
  }
});
