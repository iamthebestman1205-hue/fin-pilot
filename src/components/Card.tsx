import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, spacing, shadow } from "../theme";

type CardProps = PropsWithChildren<{
  soft?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, soft = false, style }: CardProps) {
  return <View style={[styles.card, soft && styles.soft, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    ...shadow
  },
  soft: {
    backgroundColor: colors.softCard
  }
});
