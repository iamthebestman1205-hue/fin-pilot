import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { InvestorMode, StockCardData } from "../types";
import { Card } from "./Card";

type ProMetricsCardProps = {
  stock: StockCardData;
  investorMode: InvestorMode;
};

const peerGroups: Record<string, string[]> = {
  "3017": ["雙鴻", "富世達", "台達電"],
  "2330": ["聯發科", "日月光投控", "世芯-KY"],
  "2382": ["緯創", "英業達", "鴻海"],
  "3231": ["廣達", "英業達", "鴻海"],
  "2308": ["奇鋐", "雙鴻", "光寶科"],
  "2454": ["瑞昱", "聯詠", "祥碩"],
  "2603": ["陽明", "萬海", "慧洋-KY"],
  "0050": ["006208", "台積電", "大型權值股"]
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

function getTurnoverText(stock: StockCardData) {
  if (!stock.quoteVolume) {
    return "Pro 解鎖";
  }

  if (stock.quoteVolume >= 80000) {
    return "短線活躍";
  }

  if (stock.quoteVolume >= 20000) {
    return "資金關注";
  }

  return "正常";
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

function getEventHorizon(stock: StockCardData) {
  if (stock.symbol === "3017") {
    return "一週到一個月";
  }

  if (stock.category === "tech") {
    return "數週";
  }

  if (stock.category === "etf") {
    return "一到兩週";
  }

  return "短線觀察";
}

function getPeers(stock: StockCardData) {
  return peerGroups[stock.symbol] ?? (
    stock.category === "finance"
      ? ["國泰金", "中信金", "兆豐金"]
      : stock.category === "cyclical"
        ? ["同族群報價", "同業營收", "景氣指標"]
        : ["同族群個股", "大盤", "ETF 成分股"]
  );
}

function getInvestorAction(stock: StockCardData, investorMode: InvestorMode) {
  if (investorMode === "holding") {
    if (stock.temperatureTone === "red") {
      return "已持有者先檢查部位大小，避免單一題材過度集中。";
    }

    if (stock.priceMove === "down") {
      return "已持有者先看賣壓是否連續，不急著因一天波動出場。";
    }

    return "已持有者可續抱觀察，但要追蹤量價是否失衡。";
  }

  if (stock.temperatureTone === "red" || stock.temperatureTone === "orange") {
    return "觀察者先等溫度降一點，避免在市場最興奮時追進去。";
  }

  return "觀察者可以放入清單，等事件和量能更明確。";
}

function getProSummary(stock: StockCardData, investorMode: InvestorMode) {
  const volumePrice = getVolumePriceText(stock);
  const chip = getChipText(stock);
  const heat = getThemeHeatText(stock);
  const horizon = getEventHorizon(stock);
  const action = getInvestorAction(stock, investorMode);

  return `Pro 綜合判讀：量價為「${volumePrice}」、籌碼為「${chip}」、題材溫度「${heat}」，事件影響期約 ${horizon}。${action}`;
}

export function ProMetricsCard({ stock, investorMode }: ProMetricsCardProps) {
  const metrics = [
    { label: "成交量", value: formatVolume(stock.quoteVolume), note: "TWSE" },
    { label: "流動性", value: getLiquidityText(stock), note: "量能觀察" },
    { label: "量價關係", value: getVolumePriceText(stock), note: "價量判讀" },
    { label: "籌碼壓力", value: getChipText(stock), note: "法人/主力" },
    { label: "週轉熱度", value: getTurnoverText(stock), note: "短線資金" },
    { label: "事件期限", value: getEventHorizon(stock), note: "影響週期" }
  ];

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Pro 專業指標</Text>
        <Text style={styles.badge}>付費預覽</Text>
      </View>
      <Text style={styles.summary}>{getProSummary(stock, investorMode)}</Text>

      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={styles.label}>{metric.label}</Text>
            <Text style={styles.value}>{metric.value}</Text>
            <Text style={styles.note}>{metric.note}</Text>
          </View>
        ))}
      </View>

      <View style={styles.peerBox}>
        <Text style={styles.peerTitle}>同族群比較</Text>
        <Text style={styles.peerText}>{getPeers(stock).join("、")}</Text>
      </View>

      <Text style={styles.footer}>
        正式版可接法人買賣超、主力籌碼、融資融券、週轉率、同族群強弱排名與事件影響追蹤。
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
  summary: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 14,
    lineHeight: 23,
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
  },
  peerBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softCard
  },
  peerTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900"
  },
  peerText: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700"
  },
  footer: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700"
  }
});
