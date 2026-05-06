import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import { Card } from "./Card";

export type ForecastItem = {
  period: string;
  weather: string;
  temperature: string;
  note: string;
};

type StockForecastCardProps = {
  items: ForecastItem[];
};

export function StockForecastCard({ items }: StockForecastCardProps) {
  return (
    <Card>
      <Text style={styles.title}>個股天氣預報</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.period} style={styles.item}>
            <Text style={styles.period}>{item.period}</Text>
            <Text style={styles.weather}>{item.weather}</Text>
            <Text style={styles.temperature}>{item.temperature}</Text>
            <Text style={styles.note}>{item.note}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  grid: {
    gap: spacing.md,
    marginTop: spacing.md
  },
  item: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softCard
  },
  period: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  weather: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 25,
    fontWeight: "900"
  },
  temperature: {
    marginTop: spacing.xs,
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900"
  },
  note: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
