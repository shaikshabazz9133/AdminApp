import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useComplaintStore } from "../../store/complaintStore";
import { useEmployeeStore } from "../../store/employeeStore";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";

const ProfileScreen: React.FC = () => {
  const { admin, logout } = useAuthStore();
  const { complaints } = useComplaintStore();
  const { employees } = useEmployeeStore();

  const stats = {
    totalComplaints: complaints.length,
    resolved: complaints.filter((c) => c.status === "completed").length,
    pending: complaints.filter(
      (c) => c.status === "submitted" || c.status === "assigned",
    ).length,
    majorIssues: complaints.filter((c) => c.isMajorIssue).length,
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.isActive).length,
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const systemCards = [
    {
      icon: "stats-chart" as const,
      label: "Total Complaints",
      value: stats.totalComplaints,
      color: Colors.primary,
    },
    {
      icon: "checkmark-done-circle" as const,
      label: "Resolved",
      value: stats.resolved,
      color: Colors.secondary,
    },
    {
      icon: "hourglass" as const,
      label: "Pending",
      value: stats.pending,
      color: Colors.warning,
    },
    {
      icon: "warning" as const,
      label: "Major Issues",
      value: stats.majorIssues,
      color: Colors.error,
    },
    {
      icon: "people" as const,
      label: "Total Staff",
      value: stats.totalEmployees,
      color: Colors.accent,
    },
    {
      icon: "person-circle" as const,
      label: "Active Staff",
      value: stats.activeEmployees,
      color: Colors.secondary,
    },
  ];

  const menuItems = [
    { icon: "help-circle-outline" as const, label: "Help & Support" },
    { icon: "shield-checkmark-outline" as const, label: "Privacy Policy" },
    { icon: "document-text-outline" as const, label: "Terms of Service" },
    { icon: "information-circle-outline" as const, label: "App Version 1.0.0" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={Colors.gradient.admin} style={styles.header}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {admin?.avatarInitials ?? "AD"}
              </Text>
            </View>
            <Text style={styles.adminName}>{admin?.name}</Text>
            <Text style={styles.designation}>{admin?.designation}</Text>
            <View style={styles.adminBadge}>
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.adminBadgeText}>Administrator</Text>
            </View>
          </View>
          <View style={styles.wave} />
        </LinearGradient>

        <View style={styles.content}>
          {/* System Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Overview</Text>
            <View style={styles.statsGrid}>
              {systemCards.map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: `${s.color}15` },
                    ]}
                  >
                    <Ionicons name={s.icon} size={22} color={s.color} />
                  </View>
                  <Text style={styles.statNum}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Admin Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin Information</Text>
            {[
              {
                icon: "person-outline" as const,
                label: "Username",
                value: admin?.username ?? "-",
              },
              {
                icon: "call-outline" as const,
                label: "Phone",
                value: admin?.phone ?? "-",
              },
              {
                icon: "map-outline" as const,
                label: "Ward",
                value:
                  admin?.wardNumber === 0
                    ? "All Wards"
                    : `Ward ${admin?.wardNumber}`,
              },
            ].map((r) => (
              <View key={r.label} style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name={r.icon} size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>{r.label}</Text>
                  <Text style={styles.infoValue}>{r.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Menu */}
          <View style={styles.section}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={Colors.textSecondary}
                />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LinearGradient
              colors={Colors.gradient.error}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 64 },
  avatarRow: { alignItems: "center", gap: 6, paddingHorizontal: Spacing.lg },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    marginBottom: 8,
  },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#fff" },
  adminName: { fontSize: FontSize.xxl, fontWeight: "800", color: "#fff" },
  designation: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.8)" },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  adminBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  content: { padding: Spacing.lg },
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
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "30%",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    gap: 4,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statNum: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.text },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  infoValue: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  logoutBtn: { borderRadius: BorderRadius.lg, overflow: "hidden" },
  logoutGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  logoutText: { fontSize: FontSize.lg, fontWeight: "800", color: "#fff" },
});

export default ProfileScreen;
