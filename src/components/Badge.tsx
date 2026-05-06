import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import type { Tone } from "../types";

const toneColors: Record<Tone, string> = {
  green: colors.green,
  yellow: colors.yellow,
  orange: colors.orange,
  red: colors.red
};

type BadgeProps = {
  label: string;
  tone: Tone;
};

export function Badge({ label, tone }: BadgeProps) {
  return (
    <View style={[styles.badge, { borderColor: toneColors[tone] }]}>
      <Text style={[styles.text, { color: toneColors[tone] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)"
  },
  text: {
    fontSize: 12,
    fontWeight: "800"
  }
});
