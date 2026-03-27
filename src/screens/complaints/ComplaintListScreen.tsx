import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useComplaintStore } from "../../store/complaintStore";
import { ComplaintListScreenProps } from "../../navigation/types";
import { Complaint, ComplaintStatus } from "../../data/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";
import { formatRelativeTime } from "../../utils/helpers";

const ISSUE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  road_damage: "construct",
  garbage: "trash",
  drainage: "water",
  street_light: "bulb",
};
const ISSUE_LABELS: Record<string, string> = {
  road_damage: "Road Damage",
  garbage: "Garbage",
  drainage: "Drainage",
  street_light: "Street Light",
};

type FilterStatus = "all" | ComplaintStatus;
const FILTER_TABS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "New" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "Active" },
  { key: "completed", label: "Done" },
];

const ComplaintCard: React.FC<{
  complaint: Complaint;
  onPress: () => void;
}> = ({ complaint: c, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View
      style={[
        styles.priorityBar,
        { backgroundColor: Colors.priority[c.priority] },
      ]}
    />
    <View style={styles.cardInner}>
      <View style={styles.cardTop}>
        <View
          style={[styles.typeIcon, { backgroundColor: Colors.primaryLight }]}
        >
          <Ionicons
            name={ISSUE_ICONS[c.issueType] ?? "alert-circle"}
            size={20}
            color={Colors.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.complaintNo}>{c.complaintNumber}</Text>
          <Text style={styles.issueLabel}>{ISSUE_LABELS[c.issueType]}</Text>
        </View>
        <View style={styles.badges}>
          {c.isMajorIssue && (
            <View style={styles.majorBadge}>
              <Text style={styles.majorText}>MAJOR</Text>
            </View>
          )}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: Colors.statusBg[c.status] },
            ]}
          >
            <Text
              style={[styles.statusText, { color: Colors.status[c.status] }]}
            >
              {c.status.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {c.description}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons
            name="person-outline"
            size={13}
            color={Colors.textSecondary}
          />
          <Text style={styles.footerText}>
            {c.customerName} · Ward {c.wardNumber}
          </Text>
        </View>
        {!c.assignedEmployeeId && (
          <View style={styles.unassignedTag}>
            <Text style={styles.unassignedText}>Unassigned</Text>
          </View>
        )}
        <Text style={styles.time}>{formatRelativeTime(c.createdAt)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ComplaintListScreen: React.FC<ComplaintListScreenProps> = ({
  navigation,
}) => {
  const { complaints, loadComplaints, selectComplaint, isLoading } =
    useComplaintStore();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const filtered = complaints
    .filter((c) => filter === "all" || c.status === filter)
    .filter(
      (c) =>
        !search ||
        c.complaintNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.customerName.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={Colors.gradient.admin} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Complaints</Text>
          <Text style={styles.headerSub}>
            {complaints.length} total complaints
          </Text>
        </View>
        <View style={styles.wave} />
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search complaints..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter tabs */}
      <FlatList
        horizontal
        data={FILTER_TABS}
        keyExtractor={(i) => i.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === item.key && styles.filterTabActive,
            ]}
            onPress={() => setFilter(item.key)}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === item.key && styles.filterLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterRow}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ComplaintCard
            complaint={item}
            onPress={() => {
              selectComplaint(item);
              navigation.navigate("ComplaintDetail", { complaintId: item.id });
            }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>📋</Text>
            <Text style={styles.emptyTitle}>No complaints found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 48 },
  headerContent: { paddingHorizontal: Spacing.lg },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: "800", color: "#fff" },
  headerSub: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  searchRow: { padding: Spacing.md, paddingBottom: 0 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  filterRow: { paddingHorizontal: Spacing.md, paddingVertical: 10, gap: 8 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  filterLabelActive: { color: "#fff" },
  list: { padding: Spacing.md, flexGrow: 1 },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    overflow: "hidden",
    shadowColor: "rgba(15,23,42,0.07)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityBar: { width: 5 },
  cardInner: { flex: 1, padding: Spacing.md },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  complaintNo: { fontSize: FontSize.xs, color: Colors.textSecondary },
  issueLabel: { fontSize: FontSize.md, fontWeight: "700", color: Colors.text },
  badges: { alignItems: "flex-end", gap: 4 },
  majorBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  majorText: { fontSize: 9, fontWeight: "700", color: Colors.error },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 9, fontWeight: "700" },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  unassignedTag: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  unassignedText: { fontSize: 9, fontWeight: "700", color: Colors.warning },
  time: { fontSize: FontSize.xs, color: Colors.textTertiary },
  empty: { flex: 1, alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.text },
});

export default ComplaintListScreen;
