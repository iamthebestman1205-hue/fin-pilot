import { StyleSheet, Text } from "react-native";

import { Card } from "../components/Card";
import { PositionSizingCard } from "../components/PositionSizingCard";
import { PortfolioHealthCard, type AllocationItem } from "../components/PortfolioHealthCard";
import { PortfolioProCard } from "../components/PortfolioProCard";
import { PortfolioRiskCard } from "../components/PortfolioRiskCard";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { TimelineCard } from "../components/TimelineCard";
import { colors, spacing } from "../theme";
import type { HoldingWeights, StockCardData, StockCategory, UserPreferences } from "../types";

type PortfolioScreenProps = {
  stocks: StockCardData[];
  preferences: UserPreferences;
  holdingWeights: HoldingWeights;
  onChangeHoldingWeights: (weights: HoldingWeights) => void;
};

const categoryLabels: Record<StockCategory | "cash", string> = {
  tech: "科技股",
  etf: "ETF",
  finance: "金融",
  defensive: "防禦",
  cyclical: "循環股",
  cash: "現金"
};

const categoryColors: Record<StockCategory | "cash", string> = {
  tech: colors.gold,
  etf: colors.green,
  finance: "#60A5FA",
  defensive: "#A78BFA",
  cyclical: colors.orange,
  cash: colors.muted
};

function getPortfolioModel(stocks: StockCardData[], holdingWeights: HoldingWeights, useWeights: boolean) {
  const cash = stocks.length === 0 ? 100 : 8;
  const invested = 100 - cash;
  const counts: Record<StockCategory, number> = {
    tech: 0,
    etf: 0,
    finance: 0,
    defensive: 0,
    cyclical: 0
  };

  stocks.forEach((stock) => {
    counts[stock.category] += useWeights ? holdingWeights[stock.symbol] ?? 10 : 1;
  });

  const total = Math.max(
    useWeights
      ? stocks.reduce((sum, stock) => sum + (holdingWeights[stock.symbol] ?? 10), 0)
      : stocks.length,
    1
  );
  const categories: StockCategory[] = ["tech", "etf", "finance", "defensive", "cyclical"];
  const allocations: AllocationItem[] = categories
    .map((category) => ({
      label: categoryLabels[category],
      value: stocks.length === 0 ? 0 : Math.round((counts[category] / total) * invested),
      color: categoryColors[category]
    }))
    .filter((item) => item.value > 0);

  allocations.push({ label: categoryLabels.cash, value: cash, color: categoryColors.cash });

  const techPercent = allocations.find((item) => item.label === "科技股")?.value ?? 0;
  const etfPercent = allocations.find((item) => item.label === "ETF")?.value ?? 0;
  const top = allocations
    .filter((item) => item.label !== "現金")
    .sort((a, b) => b.value - a.value)[0];

  const health =
    stocks.length === 0
      ? "尚未建立"
      : top && top.value >= 70
        ? "集中偏高"
        : techPercent + etfPercent >= 75
          ? "中等偏積極"
          : "相對均衡";

  const concentration =
    stocks.length === 0
      ? "你尚未追蹤股票，投資組合還沒有可分析的集中度。"
      : top && top.value >= 70
        ? `你的追蹤清單高度集中在${top.label}，目前約 ${top.value}%。`
        : `你的追蹤清單最大類別是${top?.label ?? "未分類"}，目前約 ${top?.value ?? 0}%。`;

  const aiReminder =
    stocks.length === 0
      ? "先加入追蹤股票後，FinPilot 才能估算組合健康度與風險來源。"
      : techPercent >= 55
        ? "科技與 AI 題材占比較高，上漲時可能很有感，但市場修正時波動也會比較大。"
        : etfPercent >= 55
          ? "ETF 比重較高，分散度通常比單一股票好，但仍要看成分股是否集中在科技或高股息。"
          : "目前分類較分散，整體波動可能比較平衡，但仍要持續追蹤風險溫度變化。";

  return { allocations, health, concentration, aiReminder, top };
}

function getSimplePortfolioText(stocks: StockCardData[], model: ReturnType<typeof getPortfolioModel>) {
  if (stocks.length === 0) {
    return "先加入追蹤股票，FinPilot 才能幫你看持有風險。";
  }

  if (model.health === "集中偏高") {
    return "你的持有風險偏集中。先不要只看哪一檔會漲，應該先看風險是不是都壓在同一類股票。";
  }

  if (model.health === "中等偏積極") {
    return "你的組合偏積極，行情好時會很有感，但修正時也會比較晃。";
  }

  return "你的組合目前相對平衡，重點是持續追蹤偏熱股票。";
}

export function PortfolioScreen({
  stocks,
  preferences,
  holdingWeights,
  onChangeHoldingWeights
}: PortfolioScreenProps) {
  const useWeights = preferences.investorMode === "holding";
  const model = getPortfolioModel(stocks, holdingWeights, useWeights);
  const simpleMode = preferences.explanationLevel === "simple";
  const detailedMode = preferences.explanationLevel === "detailed";
  const portfolioTimelineItems = [
    {
      time: "今天",
      title: `健康度：${model.health}`,
      description: `根據 ${stocks.length} 檔追蹤股票估算目前配置，${model.concentration}`,
      tag: model.top ? `${model.top.label} ${model.top.value}%` : "待建立"
    },
    {
      time: "明天 08:40",
      title: "下一次組合更新",
      description: "正式版會在每日 AI 更新後，重新計算集中度、健康度與風險提醒。",
      tag: "排程"
    },
    {
      time: "最近一次變更",
      title: "追蹤清單影響組合",
      description: "你在 Search 加入或移除追蹤股票後，這裡的比例與提醒會同步改變。",
      tag: "動態"
    }
  ];

  return (
    <Screen>
      <Text style={styles.title}>投資組合狀態</Text>
      <Text style={styles.subtitle}>
        {preferences.investorMode === "holding"
          ? "把追蹤清單當作已持有部位，估算集中度與風險。"
          : "把追蹤清單當作觀察名單，找出值得注意的風險。"}
      </Text>

      <SectionTitle title="健康度" />
      <PortfolioHealthCard health={model.health} allocations={model.allocations} />

      {preferences.investorMode === "holding" && (
        <>
          <SectionTitle title="持股比例" />
          <PositionSizingCard
            stocks={stocks}
            holdingWeights={holdingWeights}
            onChangeHoldingWeights={onChangeHoldingWeights}
          />
        </>
      )}

      <SectionTitle title={preferences.investorMode === "holding" ? "個人持有風險雷達" : "觀察名單風險雷達"} />
      {simpleMode ? (
        <Card soft>
          <Text style={styles.aiText}>{getSimplePortfolioText(stocks, model)}</Text>
        </Card>
      ) : (
        <PortfolioRiskCard
          stocks={stocks}
          holdingWeights={holdingWeights}
          investorMode={preferences.investorMode}
        />
      )}

      {detailedMode && (
        <>
          <SectionTitle title="Pro 組合健檢" caption="詳細模式預覽，正式版可作為付費功能。" />
          <PortfolioProCard
            stocks={stocks}
            holdingWeights={holdingWeights}
            investorMode={preferences.investorMode}
          />
        </>
      )}

      {!simpleMode && (
        <>
          <SectionTitle title="集中度提醒" />
          <Card>
            <Text style={styles.cardTitle}>{model.concentration}</Text>
          </Card>
        </>
      )}

      {preferences.explanationLevel === "standard" && (
        <>
          <SectionTitle title="時間追蹤" caption="追蹤清單改變時，組合狀態會跟著更新。" />
          <TimelineCard items={portfolioTimelineItems} />
        </>
      )}

      <SectionTitle title="AI 白話提醒" />
      <Card soft>
        <Text style={styles.aiText}>
          {simpleMode ? getSimplePortfolioText(stocks, model) : model.aiReminder}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "800"
  },
  aiText: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 29,
    fontWeight: "700"
  }
});
