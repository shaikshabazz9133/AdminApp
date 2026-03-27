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
import { useEmployeeStore } from "../../store/employeeStore";
import { useComplaintStore } from "../../store/complaintStore";
import { EmployeeDetailScreenProps } from "../../navigation/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";
import { formatDate, getCompletionRate } from "../../utils/helpers";

const ROLE_LABELS: Record<string, string> = {
  field_worker: "Field Worker",
  supervisor: "Supervisor",
  inspector: "Inspector",
};

const EmployeeDetailScreen: React.FC<EmployeeDetailScreenProps> = ({
  navigation,
}) => {
  const { selectedEmployee, toggleEmployeeActive } = useEmployeeStore();
  const { complaints } = useComplaintStore();

  if (!selectedEmployee) {
    return (
      <View style={styles.center}>
        <Text>Employee not found.</Text>
      </View>
    );
  }

  const e = selectedEmployee;
  const assignedComplaints = complaints.filter(
    (c) => c.assignedEmployeeId === e.id,
  );
  const rate = getCompletionRate(e.tasksAssigned, e.tasksCompleted);

  const handleToggle = () => {
    Alert.alert(
      e.isActive ? "Deactivate Employee" : "Activate Employee",
      `${e.isActive ? "Deactivate" : "Activate"} ${e.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => toggleEmployeeActive(e.id) },
      ],
    );
  };

  const infoRows = [
    {
      icon: "id-card-outline" as const,
      label: "Employee ID",
      value: e.employeeId,
    },
    {
      icon: "phone-portrait-outline" as const,
      label: "Username",
      value: e.username,
    },
    { icon: "call-outline" as const, label: "Phone", value: e.phone },
    {
      icon: "briefcase-outline" as const,
      label: "Department",
      value: e.department,
    },
    {
      icon: "shield-checkmark-outline" as const,
      label: "Role",
      value: ROLE_LABELS[e.role],
    },
    {
      icon: "map-outline" as const,
      label: "Ward",
      value: `Ward ${e.wardNumber}`,
    },
    {
      icon: "calendar-outline" as const,
      label: "Joined",
      value: formatDate(e.joinedAt),
    },
  ];

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
      <LinearGradient colors={Colors.gradient.admin} style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {e.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </Text>
            </View>
            <Text style={styles.empName}>{e.name}</Text>
            <Text style={styles.empRole}>{ROLE_LABELS[e.role]}</Text>
            <View
              style={[
                styles.activeBadge,
                { backgroundColor: e.isActive ? "#ECFDF5" : "#F1F5F9" },
              ]}
            >
              <View
                style={[
                  styles.activeDot,
                  {
                    backgroundColor: e.isActive
                      ? Colors.secondary
                      : Colors.textTertiary,
                  },
                ]}
              />
              <Text
                style={[
                  styles.activeText,
                  {
                    color: e.isActive ? Colors.secondary : Colors.textTertiary,
                  },
                ]}
              >
                {e.isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.wave} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Assigned", value: e.tasksAssigned },
            { label: "Completed", value: e.tasksCompleted },
            { label: "Active", value: e.tasksAssigned - e.tasksCompleted },
            { label: "Rate", value: `${rate}%` },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statNum}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completion Rate</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${rate}%`,
                  backgroundColor:
                    rate >= 80
                      ? Colors.secondary
                      : rate >= 50
                        ? Colors.warning
                        : Colors.error,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>{rate}% tasks completed</Text>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Information</Text>
          {infoRows.map((r) => (
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

        {/* Assigned Complaints */}
        {assignedComplaints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Assigned Complaints ({assignedComplaints.length})
            </Text>
            {assignedComplaints.map((c) => (
              <View key={c.id} style={styles.complaintRow}>
                <View>
                  <Text style={styles.complaintNo}>{c.complaintNumber}</Text>
                  <Text style={styles.complaintDesc} numberOfLines={1}>
                    {c.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: Colors.statusBg[c.status] },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColors[c.status] },
                    ]}
                  >
                    {c.status.replace("_", " ").toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Toggle Active */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            {
              backgroundColor: e.isActive
                ? Colors.errorLight
                : Colors.primaryLight,
            },
          ]}
          onPress={handleToggle}
        >
          <Ionicons
            name={e.isActive ? "person-remove" : "person-add"}
            size={18}
            color={e.isActive ? Colors.error : Colors.primary}
          />
          <Text
            style={[
              styles.toggleText,
              { color: e.isActive ? Colors.error : Colors.primary },
            ]}
          >
            {e.isActive ? "Deactivate Employee" : "Activate Employee"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { paddingTop: 52, paddingBottom: 56 },
  topBarContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
  },
  back: { padding: 4 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    marginBottom: 8,
  },
  avatarText: { fontSize: 24, fontWeight: "800", color: "#fff" },
  empName: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 2,
  },
  empRole: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  activeText: { fontSize: FontSize.sm, fontWeight: "700" },
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
  scroll: { padding: Spacing.lg },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "rgba(15,23,42,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  statCard: { flex: 1, alignItems: "center" },
  statNum: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.text },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
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
  progressBarBg: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: { height: "100%", borderRadius: 5 },
  progressLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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
  complaintRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  complaintNo: { fontSize: FontSize.xs, color: Colors.textSecondary },
  complaintDesc: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
    maxWidth: 220,
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 9, fontWeight: "700" },
  toggleBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    marginBottom: Spacing.md,
  },
  toggleText: { fontSize: FontSize.md, fontWeight: "700" },
});

export default EmployeeDetailScreen;
