import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { HoldingWeights, InvestorMode, StockCardData, StockCategory } from "../types";
import { Card } from "./Card";

type PortfolioProCardProps = {
  stocks: StockCardData[];
  holdingWeights: HoldingWeights;
  investorMode: InvestorMode;
};

const categoryNames: Record<StockCategory, string> = {
  tech: "科技 / AI",
  etf: "ETF",
  finance: "金融",
  defensive: "防禦",
  cyclical: "景氣循環"
};

function getDominantCategory(stocks: StockCardData[]) {
  const counts: Record<StockCategory, number> = {
    tech: 0,
    etf: 0,
    finance: 0,
    defensive: 0,
    cyclical: 0
  };

  stocks.forEach((stock) => {
    counts[stock.category] += 1;
  });

  return (Object.keys(counts) as StockCategory[]).sort((a, b) => counts[b] - counts[a])[0];
}

function getWeightedExposure(stock: StockCardData, holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  return investorMode === "holding" ? holdingWeights[stock.symbol] ?? 10 : 10;
}

function getDrawdownStress(stocks: StockCardData[], holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  const hotCount = stocks.filter(
    (stock) => stock.temperatureTone === "orange" || stock.temperatureTone === "red"
  ).length;
  const downCount = stocks.filter((stock) => stock.priceMove === "down").length;
  const hotWeight = stocks
    .filter((stock) => stock.temperatureTone === "orange" || stock.temperatureTone === "red")
    .reduce((total, stock) => total + getWeightedExposure(stock, holdingWeights, investorMode), 0);
  const score = Math.min(99, Math.round((hotCount * 18 + downCount * 14 + hotWeight) / Math.max(stocks.length, 1)));

  if (score >= 45) {
    return "偏高";
  }

  if (score >= 25) {
    return "中等";
  }

  return "可控";
}

function getRebalanceText(stocks: StockCardData[], holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  const dominant = getDominantCategory(stocks);
  const categoryExposure = stocks
    .filter((stock) => stock.category === dominant)
    .reduce((total, stock) => total + getWeightedExposure(stock, holdingWeights, investorMode), 0);
  const totalExposure = stocks.reduce((total, stock) => total + getWeightedExposure(stock, holdingWeights, investorMode), 0);
  const ratio = categoryExposure / Math.max(totalExposure, 1);

  if (ratio >= 0.6) {
    return investorMode === "holding"
      ? `問題很明確：部位集中在${categoryNames[dominant]}，單一題材正在主導你的組合風險。`
      : `問題很明確：觀察清單太集中在${categoryNames[dominant]}，你看到的不是分散機會，而是同一種風險。`;
  }

  return "好處是族群分散度尚可，問題只集中在少數高溫標的。";
}

function getPortfolioSummary(stocks: StockCardData[], holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  const dominant = getDominantCategory(stocks);
  const stress = getDrawdownStress(stocks, holdingWeights, investorMode);
  const modeText = investorMode === "holding" ? "持有部位" : "觀察名單";

  return `Pro 組合健檢：你的${modeText}主要曝險在${categoryNames[dominant]}，回檔壓力目前「${stress}」。${getRebalanceText(stocks, holdingWeights, investorMode)}`;
}

export function PortfolioProCard({ stocks, holdingWeights, investorMode }: PortfolioProCardProps) {
  const dominant = getDominantCategory(stocks);
  const metrics = [
    { label: "主要曝險", value: categoryNames[dominant], note: "集中度" },
    { label: "回檔壓力", value: getDrawdownStress(stocks, holdingWeights, investorMode), note: "風險模型" },
    { label: "題材重疊", value: stocks.filter((stock) => stock.category === dominant).length >= 3 ? "偏高" : "可控", note: "同族群" },
    { label: "再平衡", value: stocks.length >= 4 ? "可評估" : "資料不足", note: "Pro 建議" }
  ];

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Pro 組合健檢</Text>
        <Text style={styles.badge}>付費預覽</Text>
      </View>
      <Text style={styles.summary}>{getPortfolioSummary(stocks, holdingWeights, investorMode)}</Text>

      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={styles.label}>{metric.label}</Text>
            <Text style={styles.value}>{metric.value}</Text>
            <Text style={styles.note}>{metric.note}</Text>
          </View>
        ))}
      </View>
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
    fontWeight: "900"
  },
  badge: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.gold
  },
  summary: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  metric: {
    width: "48%",
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softCard
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  value: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  note: {
    marginTop: 4,
    color: colors.gold,
    fontSize: 11,
    fontWeight: "800"
  }
});
