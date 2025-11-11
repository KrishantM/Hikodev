import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { HikeStatus } from "@/lib/types";

const STATUS_COLORS: Record<HikeStatus, string> = {
  open: "#2E7D32",
  caution: "#ED6C02",
  closed: "#D32F2F",
  unknown: "#616161",
};

interface StatusChipProps {
  status?: HikeStatus;
}

function StatusChipComponent({ status = "unknown" }: StatusChipProps) {
  return (
    <View style={[styles.container, { backgroundColor: `${STATUS_COLORS[status]}20` }]}>
      <View style={[styles.dot, { backgroundColor: STATUS_COLORS[status] }]} />
      <Text style={[styles.text, { color: STATUS_COLORS[status] }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});

export const StatusChip = memo(StatusChipComponent);
