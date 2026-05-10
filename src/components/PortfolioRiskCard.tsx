import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import type { HoldingWeights, InvestorMode, StockCardData } from "../types";
import { Card } from "./Card";

type PortfolioRiskCardProps = {
  stocks: StockCardData[];
  holdingWeights: HoldingWeights;
  investorMode: InvestorMode;
};

function getWeight(stock: StockCardData, holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  return investorMode === "holding" ? holdingWeights[stock.symbol] ?? 10 : 10;
}

function getHeatScore(stock: StockCardData) {
  if (stock.temperatureTone === "red") {
    return 3;
  }

  if (stock.temperatureTone === "orange") {
    return 2;
  }

  return 1;
}

function getMoveScore(stock: StockCardData) {
  if (stock.priceMove === "down") {
    return 2;
  }

  if (stock.priceMove === "up") {
    return 1;
  }

  return 0;
}

function getImpactScore(stock: StockCardData, holdingWeights: HoldingWeights, investorMode: InvestorMode) {
  return getWeight(stock, holdingWeights, investorMode) * getHeatScore(stock) + getMoveScore(stock) * 10;
}

function getRiskLevel(score: number) {
  if (score >= 85) {
    return "高影響";
  }

  if (score >= 45) {
    return "中影響";
  }

  return "低影響";
}

function getCategoryPhrase(stock: StockCardData) {
  switch (stock.category) {
    case "tech":
      return "科技題材一旦降溫，通常會比大盤更晃";
    case "etf":
      return "ETF 要拆開看成分股，不能只看名稱覺得分散";
    case "finance":
      return "金融股重點在利率、股利和市場信心";
    case "defensive":
      return "防禦股通常比較穩，但上漲爆發力也較有限";
    case "cyclical":
      return "循環股的問題在景氣敏感，報價和需求一轉弱，股價反應會很快";
    default:
      return "核心問題在事件延續性";
  }
}

function getPersonalizedLine(
  stock: StockCardData,
  holdingWeights: HoldingWeights,
  investorMode: InvestorMode
) {
  const weight = getWeight(stock, holdingWeights, investorMode);
  const categoryPhrase = getCategoryPhrase(stock);

  if (investorMode === "watching") {
    if (stock.temperatureTone === "red" || stock.temperatureTone === "orange") {
      return `結論：這檔現在不適合追。問題是${categoryPhrase}，而且目前溫度已經偏高，進場位置不漂亮。`;
    }

    if (stock.priceMove === "down") {
      return `結論：這檔今天轉弱，問題出在賣壓已經反映到價格。若同族群也弱，這不是單一股票問題，而是整個題材在降溫。`;
    }

    return `結論：這檔目前不是主要風險。好處是溫度不高，壞處是方向還不明確。`;
  }

  if (weight >= 30 && (stock.temperatureTone === "red" || stock.temperatureTone === "orange")) {
    return `結論：這是組合裡最大的風險。你給它 ${weight}% 的比重，又遇到${stock.temperature}，問題是單一題材對你的組合影響太大。`;
  }

  if (weight >= 25 && stock.priceMove === "down") {
    return `結論：這檔正在拖累組合。你給它 ${weight}% 的比重，價格又轉弱，問題是賣壓已經從新聞面進到你的部位損益。`;
  }

  if (weight <= 10 && stock.priceMove === "down") {
    return `結論：這檔不是你的主要傷害。比重只有 ${weight}%，下跌對整體影響有限；真正要注意的是它會不會拖累同族群。`;
  }

  if (weight >= 20 && stock.priceMove === "up" && stock.temperatureTone === "orange") {
    return `結論：這檔是目前的主要貢獻，但也偏熱。好處是 ${weight}% 的比重讓上漲很有感，問題是獲利太集中在單一題材。`;
  }

  return `結論：這檔目前影響可控。比重約 ${weight}%，好處是沒有拖累組合；問題是${categoryPhrase}。`;
}

export function PortfolioRiskCard({
  stocks,
  holdingWeights,
  investorMode
}: PortfolioRiskCardProps) {
  const riskStocks = [...stocks]
    .sort((a, b) => getImpactScore(b, holdingWeights, investorMode) - getImpactScore(a, holdingWeights, investorMode))
    .slice(0, 3);

  return (
    <Card soft>
      <Text style={styles.title}>
        {investorMode === "holding" ? "個人持有風險雷達" : "觀察名單風險雷達"}
      </Text>
      <Text style={styles.summary}>
        {investorMode === "holding"
          ? "依照你設定的持股比例、今日漲跌與風險溫度，抓出對你影響最大的部位。"
          : "依照今日漲跌與風險溫度，抓出觀察名單裡最需要先看的標的。"}
      </Text>

      <View style={styles.list}>
        {riskStocks.map((stock) => {
          const score = getImpactScore(stock, holdingWeights, investorMode);

          return (
            <View key={stock.symbol} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.symbol}>
                  {stock.symbol} {stock.name}
                </Text>
                <Text style={styles.impact}>{getRiskLevel(score)}</Text>
              </View>
              <Text style={styles.meta}>
                比重 {getWeight(stock, holdingWeights, investorMode)}% · {stock.temperature}
              </Text>
              <Text style={styles.reason}>
                {getPersonalizedLine(stock, holdingWeights, investorMode)}
              </Text>
            </View>
          );
        })}
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
  meta: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  reason: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700"
  }
});
