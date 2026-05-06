import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { StockSearchResultCard } from "../components/StockSearchResultCard";
import { colors, radius, spacing } from "../theme";
import type { StockCardData } from "../types";

type WatchlistScreenProps = {
  stocks: StockCardData[];
  trackedSymbols: string[];
  onToggleTrack: (symbol: string) => void;
  onOpenStocks: () => void;
};

export function WatchlistScreen({
  stocks,
  trackedSymbols,
  onToggleTrack,
  onOpenStocks
}: WatchlistScreenProps) {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return stocks;
    }

    return stocks.filter((stock) => {
      return (
        stock.symbol.toLowerCase().includes(keyword) ||
        stock.name.toLowerCase().includes(keyword)
      );
    });
  }, [query, stocks]);

  return (
    <Screen>
      <Text style={styles.title}>搜尋股票</Text>
      <Text style={styles.subtitle}>先以台股為主，搜尋代號或名稱後加入追蹤清單。</Text>

      <SectionTitle title="台股搜尋" caption="例如 00646、009810、2330、台積電、元大。" />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="輸入股票代號或名稱"
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>目前可搜尋 {stocks.length} 檔台股與 ETF</Text>
        <Pressable onPress={onOpenStocks} style={styles.summaryButton}>
          <Text style={styles.summaryButtonText}>看已追蹤</Text>
        </Pressable>
      </View>

      <View style={styles.resultList}>
        {searchResults.length > 0 ? (
          searchResults.map((stock) => (
            <StockSearchResultCard
              key={stock.symbol}
              stock={stock}
              isTracked={trackedSymbols.includes(stock.symbol)}
              onToggleTrack={() => onToggleTrack(stock.symbol)}
            />
          ))
        ) : (
          <Card>
            <Text style={styles.emptyText}>
              目前 Demo 清單還沒有這檔。正式版會改接完整台股資料庫，避免查不到想看的股票。
            </Text>
          </Card>
        )}
      </View>
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
  searchInput: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softCard,
    color: colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.md
  },
  summaryText: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  summaryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.gold
  },
  summaryButtonText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: "900"
  },
  resultList: {
    marginTop: spacing.md
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23
  }
});
