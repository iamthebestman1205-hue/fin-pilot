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
      return "循環股要看報價和景氣是否真的改善";
    default:
      return "重點是看事件是否會延續";
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
      return `你還在觀察，這檔先不要急著追。${categoryPhrase}，等溫度降一點再看比較舒服。`;
    }

    if (stock.priceMove === "down") {
      return `你還在觀察，今天轉弱反而可以拿來研究原因。先看它是個股問題，還是整個族群都弱。`;
    }

    return `你還在觀察，這檔目前不是主要警訊，可以等下一個明確事件再決定。`;
  }

  if (weight >= 30 && (stock.temperatureTone === "red" || stock.temperatureTone === "orange")) {
    return `你給它 ${weight}% 的比重，而且現在是${stock.temperature}。這不是小波動，應該先檢查是否太集中在同一個題材。`;
  }

  if (weight >= 25 && stock.priceMove === "down") {
    return `你給它 ${weight}% 的比重，最近又轉弱。先看賣壓是否連續，如果同族群也弱，組合壓力會被放大。`;
  }

  if (weight <= 10 && stock.priceMove === "down") {
    return `這檔比重只有 ${weight}%，就算轉弱，對整體傷害相對有限。重點是觀察它會不會拖累同族群。`;
  }

  if (weight >= 20 && stock.priceMove === "up" && stock.temperatureTone === "orange") {
    return `這檔比重 ${weight}% 且偏熱，上漲時很有感，但也要避免讓獲利集中在單一題材。`;
  }

  return `這檔比重約 ${weight}%，目前影響可控。${categoryPhrase}，先持續追蹤事件是否延續。`;
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
