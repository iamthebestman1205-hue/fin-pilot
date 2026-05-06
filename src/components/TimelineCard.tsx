import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import { Card } from "./Card";

export type TimelineItem = {
  time: string;
  title: string;
  description: string;
  tag?: string;
};

type TimelineCardProps = {
  items: TimelineItem[];
};

export function TimelineCard({ items }: TimelineCardProps) {
  return (
    <Card>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={`${item.time}-${item.title}`} style={styles.row}>
            <View style={styles.rail}>
              <View style={styles.dot} />
              {!isLast ? <View style={styles.line} /> : null}
            </View>
            <View style={[styles.content, !isLast && styles.contentWithBorder]}>
              <View style={styles.header}>
                <Text style={styles.time}>{item.time}</Text>
                {item.tag ? <Text style={styles.tag}>{item.tag}</Text> : null}
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  rail: {
    width: 24,
    alignItems: "center"
  },
  dot: {
    width: 10,
    height: 10,
    marginTop: 6,
    borderRadius: 5,
    backgroundColor: colors.gold
  },
  line: {
    flex: 1,
    width: 1,
    marginTop: 6,
    backgroundColor: colors.border
  },
  content: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.lg
  },
  contentWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  time: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  tag: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24
  },
  description: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
