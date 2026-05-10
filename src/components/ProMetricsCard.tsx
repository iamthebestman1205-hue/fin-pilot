import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Card } from "./Card";

type ProMetricsCardProps = {
  stock: StockCardData;
};

function formatVolume(volume?: number) {
  if (!volume) {
    return "待接入";
  }

  if (volume >= 10000) {
    return `${Math.round(volume / 1000) / 10}萬張`;
  }

  return `${volume.toLocaleString()} 張`;
}

function getLiquidityText(stock: StockCardData) {
  if (!stock.quoteVolume) {
    return "等資料源";
  }

  if (stock.quoteVolume >= 50000) {
    return "活絡";
  }

  if (stock.quoteVolume >= 10000) {
    return "中高";
  }

  return "普通";
}

function getChipText(stock: StockCardData) {
  if (stock.priceMove === "down" && stock.temperatureTone !== "yellow") {
    return "賣壓需追";
  }

  if (stock.priceMove === "up" && stock.temperatureTone === "orange") {
    return "追價偏熱";
  }

  return "待確認";
}

export function ProMetricsCard({ stock }: ProMetricsCardProps) {
  const metrics = [
    { label: "成交量", value: formatVolume(stock.quoteVolume), note: "TWSE" },
    { label: "流動性", value: getLiquidityText(stock), note: "量能觀察" },
    { label: "籌碼壓力", value: getChipText(stock), note: "Pro 法人資料" },
    { label: "波動風險", value: stock.temperature, note: "風險模型" }
  ];

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Pro 專業指標</Text>
        <Text style={styles.badge}>付費預覽</Text>
      </View>
      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={styles.label}>{metric.label}</Text>
            <Text style={styles.value}>{metric.value}</Text>
            <Text style={styles.note}>{metric.note}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>
        正式版可解鎖法人買賣超、主力籌碼、週轉率、量價背離與同族群比較。
      </Text>
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
  },
  footer: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700"
  }
});
