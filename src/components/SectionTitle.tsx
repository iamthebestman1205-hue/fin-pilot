import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

type SectionTitleProps = {
  title: string;
  caption?: string;
};

export function SectionTitle({ title, caption }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    marginBottom: spacing.md
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  accent: {
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.gold
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0
  },
  caption: {
    marginTop: spacing.xs,
    marginLeft: 3 + spacing.sm,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20
  }
});
