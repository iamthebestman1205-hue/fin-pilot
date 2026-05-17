import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, radius, spacing, shadow } from "../theme";

type CardProps = PropsWithChildren<{
  soft?: boolean;
  accent?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, soft = false, accent = false, style }: CardProps) {
  if (accent) {
    return (
      <LinearGradient
        colors={["#FACC1533", "#FB923C22", "#27272F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientWrapper, style]}
      >
        <View style={[styles.card, styles.accentInner]}>{children}</View>
      </LinearGradient>
    );
  }
  return <View style={[styles.card, soft && styles.soft, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: radius.xl,
    padding: 1.5,
    ...shadow
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    ...shadow
  },
  accentInner: {
    borderWidth: 0,
    borderRadius: radius.xl - 1.5,
    backgroundColor: colors.softCard,
    shadowOpacity: 0
  },
  soft: {
    backgroundColor: colors.softCard
  }
});
