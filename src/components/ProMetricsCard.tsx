import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Card } from "./Card";

type ProMetricsCardProps = {
  stock: StockCardData;
};

function formatVolume(volume?: number) {
  if (!volume) {
    return "Pro 解鎖";
  }

  if (volume >= 10000) {
    return `${Math.round(volume / 1000) / 10}萬張`;
  }

  return `${volume.toLocaleString()} 張`;
}

function getLiquidityText(stock: StockCardData) {
  if (!stock.quoteVolume) {
    return "需解鎖";
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

  return "中性";
}

function getVolumePriceText(stock: StockCardData) {
  if (!stock.quoteVolume) {
    return "Pro 解鎖";
  }

  if (stock.priceMove === "up" && stock.quoteVolume >= 10000) {
    return "量價配合";
  }

  if (stock.priceMove === "down" && stock.quoteVolume >= 10000) {
    return "放量轉弱";
  }

  if (stock.priceMove === "flat") {
    return "量縮整理";
  }

  return "量能普通";
}

function getThemeHeatText(stock: StockCardData) {
  if (stock.temperatureTone === "red") {
    return "過熱";
  }

  if (stock.temperatureTone === "orange") {
    return "偏熱";
  }

  return "可控";
}

function getProSummary(stock: StockCardData) {
  const volumePrice = getVolumePriceText(stock);
  const chip = getChipText(stock);
  const heat = getThemeHeatText(stock);

  if (stock.priceMove === "down") {
    return `專業角度先看賣壓是否只是短線，還是量能與籌碼一起轉弱。目前量價訊號是「${volumePrice}」，籌碼壓力為「${chip}」，題材溫度「${heat}」。`;
  }

  if (stock.priceMove === "up") {
    return `專業角度不是只看上漲，而是看量能有沒有跟上、籌碼是否過熱。目前量價訊號是「${volumePrice}」，籌碼壓力為「${chip}」，題材溫度「${heat}」。`;
  }

  return `專業角度會把震盪視為等待訊號，重點是量能是否收斂、籌碼是否穩定。目前量價訊號是「${volumePrice}」，籌碼壓力為「${chip}」，題材溫度「${heat}」。`;
}

export function ProMetricsCard({ stock }: ProMetricsCardProps) {
  const metrics = [
    { label: "成交量", value: formatVolume(stock.quoteVolume), note: "TWSE" },
    { label: "流動性", value: getLiquidityText(stock), note: "量能觀察" },
    { label: "量價關係", value: getVolumePriceText(stock), note: "價量判讀" },
    { label: "籌碼壓力", value: getChipText(stock), note: "法人/主力" },
    { label: "題材溫度", value: getThemeHeatText(stock), note: "市場期待" },
    { label: "波動風險", value: stock.temperature, note: "風險模型" }
  ];

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Pro 專業指標</Text>
        <Text style={styles.badge}>付費預覽</Text>
      </View>
      <Text style={styles.summary}>{getProSummary(stock)}</Text>
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
  summary: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 14,
    lineHeight: 23,
    fontWeight: "700"
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
