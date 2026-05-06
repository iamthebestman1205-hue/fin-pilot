import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import { Card } from "./Card";

export type ImpactItem = {
  title: string;
  plain: string;
  effect: string;
};

type ImpactBreakdownCardProps = {
  items: ImpactItem[];
};

export function ImpactBreakdownCard({ items }: ImpactBreakdownCardProps) {
  return (
    <Card>
      <Text style={styles.cardTitle}>影響來源拆解</Text>
      <View style={styles.list}>
        {items.map((item) => (
          <View key={item.title} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.effect}>{item.effect}</Text>
            </View>
            <Text style={styles.plain}>{item.plain}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  list: {
    marginTop: spacing.md
  },
  item: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  effect: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900"
  },
  plain: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22
  }
});
