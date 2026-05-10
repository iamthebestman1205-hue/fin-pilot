import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { defaultTrackedSymbols, taiwanStocks } from "./src/data/stocks";
import { MarketScreen } from "./src/screens/MarketScreen";
import { PortfolioScreen } from "./src/screens/PortfolioScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { StockDetailScreen } from "./src/screens/StockDetailScreen";
import { WatchlistScreen } from "./src/screens/WatchlistScreen";
import { fetchTaiwanQuotes, type QuoteSnapshot } from "./src/services/marketData";
import { colors, radius, spacing } from "./src/theme";
import type { HoldingWeights, UserPreferences } from "./src/types";
import { applyDailyInsight } from "./src/utils/dailyInsights";

type TabKey = "market" | "watchlist" | "stock" | "portfolio" | "settings";

const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "market", label: "Market", icon: "M" },
  { key: "watchlist", label: "Search", icon: "+" },
  { key: "stock", label: "Stock", icon: "S" },
  { key: "portfolio", label: "Portfolio", icon: "P" },
  { key: "settings", label: "Prefs", icon: "◎" }
];

const defaultPreferences: UserPreferences = {
  explanationLevel: "standard",
  investorMode: "watching",
  showCauseChain: true,
  showForecast: true,
  showImpactBreakdown: true,
  showSources: true
};

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function loadPreferences() {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  const saved = window.localStorage.getItem("finpilot.preferences");
  if (!saved) {
    return defaultPreferences;
  }

  try {
    return { ...defaultPreferences, ...JSON.parse(saved) } as UserPreferences;
  } catch {
    return defaultPreferences;
  }
}

function loadHoldingWeights(): HoldingWeights {
  if (typeof window === "undefined") {
    return {};
  }

  const saved = window.localStorage.getItem("finpilot.holdings");
  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved) as HoldingWeights;
  } catch {
    return {};
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("market");
  const [trackedSymbols, setTrackedSymbols] = useState(defaultTrackedSymbols);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [quotesBySymbol, setQuotesBySymbol] = useState<Record<string, QuoteSnapshot>>({});
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);
  const [holdingWeights, setHoldingWeights] = useState<HoldingWeights>(loadHoldingWeights);
  const now = new Date();
  const todayKey = new Date().toDateString();
  const weekendMode = isWeekend(now);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("finpilot.preferences", JSON.stringify(preferences));
    }
  }, [preferences]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("finpilot.holdings", JSON.stringify(holdingWeights));
    }
  }, [holdingWeights]);

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

    setHoldingWeights((current) => {
      if (trackedSymbols.includes(symbol)) {
        const next = { ...current };
        delete next[symbol];
        return next;
      }

      return { ...current, [symbol]: current[symbol] ?? 10 };
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
            weekendMode={weekendMode}
            preferences={preferences}
            onSelectStock={openStock}
            onBackToList={() => setSelectedStockSymbol(null)}
            onFindStocks={() => setActiveTab("watchlist")}
          />
        );
      case "portfolio":
        return (
          <PortfolioScreen
            stocks={trackedStocks}
            preferences={preferences}
            holdingWeights={holdingWeights}
            onChangeHoldingWeights={setHoldingWeights}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            preferences={preferences}
            onChangePreferences={setPreferences}
          />
        );
      case "market":
      default:
        return <MarketScreen stocks={trackedStocks} weekendMode={weekendMode} />;
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
