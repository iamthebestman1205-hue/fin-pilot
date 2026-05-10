import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { colors, radius, spacing } from "../theme";
import type { ExplanationLevel, UserPreferences } from "../types";

type SettingsScreenProps = {
  preferences: UserPreferences;
  onChangePreferences: (preferences: UserPreferences) => void;
};

const levels: Array<{ key: ExplanationLevel; label: string; description: string }> = [
  { key: "simple", label: "簡單", description: "只看重點和提醒，畫面最乾淨。" },
  { key: "standard", label: "標準", description: "保留原因鏈與天氣預報，適合日常使用。" },
  { key: "detailed", label: "詳細", description: "顯示更多拆解和來源，適合想深入看的人。" }
];

function ToggleRow({
  label,
  value,
  onPress
}: {
  label: string;
  value: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.switchTrack, value && styles.switchTrackActive]}>
        <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
      </View>
    </Pressable>
  );
}

export function SettingsScreen({ preferences, onChangePreferences }: SettingsScreenProps) {
  const update = (next: Partial<UserPreferences>) => {
    onChangePreferences({ ...preferences, ...next });
  };

  return (
    <Screen>
      <Text style={styles.title}>個人化</Text>
      <Text style={styles.subtitle}>調整 FinPilot 說話方式和畫面密度。</Text>

      <SectionTitle title="解釋程度" />
      <Card>
        <View style={styles.levelRow}>
          {levels.map((level) => {
            const selected = preferences.explanationLevel === level.key;
            return (
              <Pressable
                key={level.key}
                onPress={() => update({ explanationLevel: level.key })}
                style={[styles.levelButton, selected && styles.levelButtonActive]}
              >
                <Text style={[styles.levelLabel, selected && styles.levelLabelActive]}>
                  {level.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.levelDescription}>
          {levels.find((level) => level.key === preferences.explanationLevel)?.description}
        </Text>
      </Card>

      <SectionTitle title="顯示內容" />
      <Card>
        <ToggleRow
          label="原因鏈"
          value={preferences.showCauseChain}
          onPress={() => update({ showCauseChain: !preferences.showCauseChain })}
        />
        <ToggleRow
          label="天氣預報"
          value={preferences.showForecast}
          onPress={() => update({ showForecast: !preferences.showForecast })}
        />
        <ToggleRow
          label="影響來源拆解"
          value={preferences.showImpactBreakdown}
          onPress={() => update({ showImpactBreakdown: !preferences.showImpactBreakdown })}
        />
        <ToggleRow
          label="參考來源"
          value={preferences.showSources}
          onPress={() => update({ showSources: !preferences.showSources })}
        />
      </Card>
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
  levelRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  levelButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softCard
  },
  levelButtonActive: {
    borderColor: colors.gold,
    backgroundColor: "rgba(250, 204, 21, 0.14)"
  },
  levelLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "900"
  },
  levelLabelActive: {
    color: colors.gold
  },
  levelDescription: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700"
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  toggleLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  switchTrack: {
    width: 46,
    height: 28,
    padding: 3,
    borderRadius: 20,
    backgroundColor: colors.border
  },
  switchTrackActive: {
    backgroundColor: colors.gold
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.muted
  },
  switchThumbActive: {
    marginLeft: 18,
    backgroundColor: colors.background
  }
});
