import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAuthStore } from "../../store/authStore";
import { useComplaintStore } from "../../store/complaintStore";
import { useEmployeeStore } from "../../store/employeeStore";
import { useNotificationStore } from "../../store/notificationStore";
import { DashboardScreenProps } from "../../navigation/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";
import { Complaint } from "../../data/types";
import { formatRelativeTime } from "../../utils/helpers";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | string;
  gradient: [string, string];
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  gradient,
}) => (
  <LinearGradient colors={gradient} style={styles.statCard}>
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={26} color="#fff" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </LinearGradient>
);

const ISSUE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  road_damage: "construct",
  garbage: "trash",
  drainage: "water",
  street_light: "bulb",
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { admin } = useAuthStore();
  const { complaints, loadComplaints, isLoading } = useComplaintStore();
  const { employees, loadEmployees } = useEmployeeStore();
  const { loadNotifications, unreadCount } = useNotificationStore();
  const fadeIn = useSharedValue(0);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fadeIn.value }));

  useEffect(() => {
    loadComplaints();
    loadEmployees();
    loadNotifications();
    fadeIn.value = withTiming(1, { duration: 500 });
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(
      (c) => c.status === "submitted" || c.status === "assigned",
    ).length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    completed: complaints.filter((c) => c.status === "completed").length,
    major: complaints.filter((c) => c.isMajorIssue).length,
    unassigned: complaints.filter(
      (c) => !c.assignedEmployeeId && c.status !== "cancelled",
    ).length,
    activeEmployees: employees.filter((e) => e.isActive).length,
  };

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  // Ward distribution for mini chart
  const wardCounts = complaints.reduce(
    (acc, c) => {
      acc[c.wardNumber] = (acc[c.wardNumber] ?? 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );
  const wardData = Object.entries(wardCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxWardCount = Math.max(...Object.values(wardCounts), 1);

  const statusColors: Record<string, string> = {
    submitted: Colors.status.submitted,
    assigned: Colors.status.assigned,
    in_progress: Colors.status.in_progress,
    completed: Colors.status.completed,
    cancelled: Colors.status.cancelled,
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={Colors.gradient.admin} style={styles.header}>
        <Animated.View style={[styles.headerContent, fadeStyle]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back 👋</Text>
              <Text style={styles.adminName}>{admin?.name}</Text>
              <Text style={styles.designation}>{admin?.designation}</Text>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons name="notifications" size={26} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
        <View style={styles.wave} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadComplaints}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="document-text"
            label="Total"
            value={stats.total}
            gradient={Colors.gradient.admin}
          />
          <StatCard
            icon="time"
            label="Pending"
            value={stats.pending}
            gradient={Colors.gradient.warning}
          />
          <StatCard
            icon="construct"
            label="In Progress"
            value={stats.inProgress}
            gradient={Colors.gradient.primary}
          />
          <StatCard
            icon="checkmark-circle"
            label="Completed"
            value={stats.completed}
            gradient={Colors.gradient.success}
          />
          <StatCard
            icon="warning"
            label="Major Issues"
            value={stats.major}
            gradient={Colors.gradient.error}
          />
          <StatCard
            icon="people"
            label="Active Staff"
            value={stats.activeEmployees}
            gradient={["#8B5CF6", "#6D28D9"]}
          />
        </View>

        {/* Unassigned Alert */}
        {stats.unassigned > 0 && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => navigation.navigate("Complaints")}
          >
            <View style={styles.alertIcon}>
              <Ionicons name="alert-circle" size={24} color={Colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>
                {stats.unassigned} Unassigned Complaint
                {stats.unassigned > 1 ? "s" : ""}
              </Text>
              <Text style={styles.alertSub}>Tap to review and assign</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        )}

        {/* Ward Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complaints by Ward</Text>
          {wardData.map(([ward, count]) => (
            <View key={ward} style={styles.wardRow}>
              <Text style={styles.wardLabel}>Ward {ward}</Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(count / maxWardCount) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.wardCount}>{count}</Text>
            </View>
          ))}
        </View>

        {/* Recent Complaints */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Complaints</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Complaints")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentComplaints.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.complaintRow}
              onPress={() => {
                const store =
                  require("../../store/complaintStore").useComplaintStore.getState();
                store.selectComplaint(c);
                navigation.navigate("Complaints");
              }}
            >
              <View style={styles.complaintIcon}>
                <Ionicons
                  name={ISSUE_ICONS[c.issueType] ?? "alert-circle"}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.complaintNum}>{c.complaintNumber}</Text>
                <Text style={styles.complaintDesc} numberOfLines={1}>
                  {c.description}
                </Text>
              </View>
              <View>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusColors[c.status] },
                  ]}
                />
                <Text style={styles.complaintTime}>
                  {formatRelativeTime(c.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 52 },
  headerContent: { paddingHorizontal: Spacing.lg },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },
  adminName: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 3,
  },
  designation: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.7)" },
  notifBtn: { padding: 4, position: "relative" },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 10, color: "#fff", fontWeight: "700" },
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
  scroll: { padding: Spacing.md },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: Spacing.md,
  },
  statCard: {
    width: "31%",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: 6,
    shadowColor: "rgba(15,23,42,0.15)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: { fontSize: FontSize.xl, fontWeight: "900", color: "#fff" },
  statLabel: {
    fontSize: FontSize.xs,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  alertTitle: { fontSize: FontSize.md, fontWeight: "700", color: Colors.text },
  alertSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "rgba(15,23,42,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: "600" },
  wardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  wardLabel: {
    fontSize: FontSize.sm,
    color: Colors.text,
    width: 56,
    fontWeight: "600",
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4, backgroundColor: Colors.primary },
  wardCount: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.text,
    width: 24,
    textAlign: "right",
  },
  complaintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  complaintIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  complaintNum: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  complaintDesc: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: "600",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  complaintTime: { fontSize: FontSize.xs, color: Colors.textTertiary },
});

export default DashboardScreen;
