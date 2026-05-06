import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { defaultTrackedSymbols, taiwanStocks } from "./src/data/stocks";
import { MarketScreen } from "./src/screens/MarketScreen";
import { PortfolioScreen } from "./src/screens/PortfolioScreen";
import { StockDetailScreen } from "./src/screens/StockDetailScreen";
import { WatchlistScreen } from "./src/screens/WatchlistScreen";
import { fetchTaiwanQuotes, type QuoteSnapshot } from "./src/services/marketData";
import { colors, radius, spacing } from "./src/theme";
import { applyDailyInsight } from "./src/utils/dailyInsights";

type TabKey = "market" | "watchlist" | "stock" | "portfolio";

const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "market", label: "Market", icon: "M" },
  { key: "watchlist", label: "Search", icon: "+" },
  { key: "stock", label: "Stock", icon: "S" },
  { key: "portfolio", label: "Portfolio", icon: "P" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("market");
  const [trackedSymbols, setTrackedSymbols] = useState(defaultTrackedSymbols);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [quotesBySymbol, setQuotesBySymbol] = useState<Record<string, QuoteSnapshot>>({});
  const todayKey = new Date().toDateString();

  useEffect(() => {
    let active = true;

    fetchTaiwanQuotes(taiwanStocks.map((stock) => stock.symbol))
      .then((quotes) => {
        if (active) {
          setQuotesBySymbol(quotes);
        }
      })
      .catch(() => {
        if (active) {
          setQuotesBySymbol({});
        }
      });

    return () => {
      active = false;
    };
  }, [todayKey]);

  const dailyStocks = useMemo(
    () => taiwanStocks.map((stock) => applyDailyInsight(stock, new Date(), quotesBySymbol[stock.symbol])),
    [quotesBySymbol, todayKey]
  );

  const trackedStocks = useMemo(
    () => dailyStocks.filter((stock) => trackedSymbols.includes(stock.symbol)),
    [dailyStocks, trackedSymbols]
  );

  const selectedStock = useMemo(
    () => trackedStocks.find((stock) => stock.symbol === selectedStockSymbol) ?? null,
    [trackedStocks, selectedStockSymbol]
  );

  const toggleTrack = (symbol: string) => {
    setTrackedSymbols((current) => {
      if (current.includes(symbol)) {
        if (selectedStockSymbol === symbol) {
          setSelectedStockSymbol(null);
        }
        return current.filter((item) => item !== symbol);
      }

      return [...current, symbol];
    });
  };

  const openStock = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setActiveTab("stock");
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "watchlist":
        return (
          <WatchlistScreen
            stocks={dailyStocks}
            trackedSymbols={trackedSymbols}
            onToggleTrack={toggleTrack}
            onOpenStocks={() => setActiveTab("stock")}
          />
        );
      case "stock":
        return (
          <StockDetailScreen
            stocks={trackedStocks}
            selectedStock={selectedStock}
            onSelectStock={openStock}
            onBackToList={() => setSelectedStockSymbol(null)}
            onFindStocks={() => setActiveTab("watchlist")}
          />
        );
      case "portfolio":
        return <PortfolioScreen stocks={trackedStocks} />;
      case "market":
      default:
        return <MarketScreen stocks={trackedStocks} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.appShell}>
          <View style={styles.content}>{renderScreen()}</View>
          <View style={styles.tabBar}>
            {tabs.map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[styles.tabItem, selected && styles.tabItemActive]}
                >
                  <Text style={[styles.tabIcon, selected && styles.tabIconActive]}>
                    {tab.icon}
                  </Text>
                  <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  appShell: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: 6,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
    borderRadius: radius.lg
  },
  tabItemActive: {
    backgroundColor: colors.softCard
  },
  tabIcon: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "700"
  },
  tabIconActive: {
    color: colors.gold
  },
  tabLabel: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600"
  },
  tabLabelActive: {
    color: colors.text
  }
});
