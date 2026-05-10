import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { StockCardData } from "../types";
import { Card } from "./Card";

type CauseChainCardProps = {
  stock: StockCardData;
};

function getMoveText(stock: StockCardData) {
  if (stock.priceMove === "up") {
    return "股價上漲";
  }

  if (stock.priceMove === "down") {
    return "股價下跌";
  }

  return "股價震盪";
}

function getInvestorMeaning(stock: StockCardData) {
  if (stock.temperatureTone === "red") {
    return "風險已經偏高。問題是市場期待太滿，壞消息會被放大。";
  }

  if (stock.temperatureTone === "orange") {
    return "短線溫度偏熱。問題是追價空間變小，波動會變大。";
  }

  return "目前不用過度緊張。好處是風險溫度還沒有失控。";
}

export function CauseChainCard({ stock }: CauseChainCardProps) {
  const items = [
    { label: "事件", value: stock.reason },
    { label: "市場解讀", value: stock.aiNews.replace("股市重點：", "") },
    { label: "價格反應", value: getMoveText(stock) },
    { label: "你的重點", value: getInvestorMeaning(stock) }
  ];

  return (
    <Card>
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={item.label} style={styles.item}>
            <View style={styles.dotWrap}>
              <View style={styles.dot} />
              {index < items.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 0
  },
  item: {
    flexDirection: "row",
    gap: spacing.md
  },
  dotWrap: {
    alignItems: "center",
    width: 14
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.gold
  },
  line: {
    flex: 1,
    width: 1,
    marginTop: spacing.xs,
    backgroundColor: colors.border
  },
  content: {
    flex: 1,
    paddingBottom: spacing.md
  },
  label: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900"
  },
  value: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600"
  }
});
