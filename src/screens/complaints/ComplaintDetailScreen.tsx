import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useComplaintStore } from "../../store/complaintStore";
import { useEmployeeStore } from "../../store/employeeStore";
import { ComplaintDetailScreenProps } from "../../navigation/types";
import { Priority, ComplaintStatus } from "../../data/types";
import Colors from "../../constants/colors";
import {
  FontSize,
  Spacing,
  BorderRadius,
  PRIORITY_LABELS,
} from "../../constants/index";
import { formatDateTime } from "../../utils/helpers";

const PRIORITY_OPTIONS: Priority[] = ["high", "medium", "low"];
const STATUS_OPTIONS: ComplaintStatus[] = [
  "submitted",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
];

const ComplaintDetailScreen: React.FC<ComplaintDetailScreenProps> = ({
  navigation,
}) => {
  const {
    selectedComplaint,
    assignEmployee,
    updatePriority,
    updateStatus,
    toggleMajorIssue,
    isLoading,
  } = useComplaintStore();
  const { employees } = useEmployeeStore();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (!selectedComplaint) {
    return (
      <View style={styles.center}>
        <Text>Complaint not found.</Text>
      </View>
    );
  }

  const c = selectedComplaint;
  const activeEmployees = employees.filter((e) => e.isActive);

  const ISSUE_TYPE_CONFIG: Record<
    string,
    {
      icon: keyof typeof Ionicons.glyphMap;
      color: string;
      bg: string;
      label: string;
    }
  > = {
    road_damage: {
      icon: "construct",
      color: Colors.warning,
      bg: Colors.warningLight,
      label: "Road Damage",
    },
    garbage: {
      icon: "trash",
      color: Colors.error,
      bg: Colors.errorLight,
      label: "Garbage",
    },
    drainage: {
      icon: "water",
      color: Colors.primary,
      bg: Colors.primaryLight,
      label: "Drainage",
    },
    street_light: {
      icon: "bulb",
      color: Colors.accent,
      bg: Colors.accentLight,
      label: "Street Light",
    },
  };
  const issueConfig = ISSUE_TYPE_CONFIG[c.issueType] ?? {
    icon: "alert-circle" as const,
    color: Colors.primary,
    bg: Colors.primaryLight,
    label: c.issueType,
  };

  const handleAssign = (empId: string, empName: string) => {
    setShowAssignModal(false);
    assignEmployee(c.id, empId, empName);
    Alert.alert("Assigned!", `Complaint assigned to ${empName}.`);
  };

  const handlePriority = (p: Priority) => {
    setShowPriorityModal(false);
    updatePriority(c.id, p);
  };

  const handleStatus = (s: ComplaintStatus) => {
    setShowStatusModal(false);
    updateStatus(c.id, s);
  };

  const infoRows = [
    {
      icon: "person-outline" as const,
      label: "Customer",
      value: c.customerName,
    },
    { icon: "call-outline" as const, label: "Phone", value: c.customerPhone },
    { icon: "location-outline" as const, label: "Location", value: c.location },
    {
      icon: "map-outline" as const,
      label: "Ward",
      value: `Ward ${c.wardNumber}`,
    },
    {
      icon: "time-outline" as const,
      label: "Submitted",
      value: formatDateTime(c.createdAt),
    },
    {
      icon: "refresh-outline" as const,
      label: "Last Updated",
      value: formatDateTime(c.updatedAt),
    },
  ];

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
          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle}>{c.complaintNumber}</Text>
            <Text style={styles.topSub}>Complaint Detail</Text>
          </View>
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
        <View style={styles.wave} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={styles.section}>
          <View style={styles.summaryHeader}>
            <View
              style={[
                styles.issueTypeIconBox,
                { backgroundColor: issueConfig.bg },
              ]}
            >
              <Ionicons
                name={issueConfig.icon}
                size={26}
                color={issueConfig.color}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.issueType}>{issueConfig.label}</Text>
              <View style={styles.rowWrap}>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: Colors.priorityBg[c.priority] },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: Colors.priority[c.priority] },
                    ]}
                  >
                    {PRIORITY_LABELS[c.priority].toUpperCase()} PRIORITY
                  </Text>
                </View>
                {c.isMajorIssue && (
                  <View style={styles.majorBadge}>
                    <Ionicons name="warning" size={12} color={Colors.error} />
                    <Text style={styles.majorText}>MAJOR</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <Text style={styles.description}>{c.description}</Text>
        </View>

        {/* Evidence */}
        {c.imageUri ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issue Evidence</Text>
            <View style={styles.evidenceLabelRow}>
              <Ionicons
                name="camera-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.evidenceCaptionText}>
                Photo submitted by customer
              </Text>
            </View>
            <Image
              source={{ uri: c.imageUri }}
              style={styles.evidenceImage}
              resizeMode="cover"
            />
            {c.afterImageUri && (
              <>
                <View style={[styles.evidenceLabelRow, { marginTop: 12 }]}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color={Colors.secondary}
                  />
                  <Text
                    style={[
                      styles.evidenceCaptionText,
                      { color: Colors.secondary },
                    ]}
                  >
                    After resolution
                  </Text>
                </View>
                <Image
                  source={{ uri: c.afterImageUri }}
                  style={styles.evidenceImage}
                  resizeMode="cover"
                />
              </>
            )}
          </View>
        ) : null}

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complaint Information</Text>
          {infoRows.map((r) => (
            <View key={r.label} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name={r.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{r.label}</Text>
                <Text style={styles.infoValue}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Assignment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assignment</Text>
          {c.assignedEmployeeId ? (
            <View style={styles.assignedCard}>
              <View style={styles.empAvatar}>
                <Text style={styles.empInitial}>
                  {c.assignedEmployeeName?.[0] ?? "E"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.empName}>{c.assignedEmployeeName}</Text>
                <Text style={styles.empSub}>Currently assigned</Text>
              </View>
              <TouchableOpacity
                style={styles.reassignBtn}
                onPress={() => setShowAssignModal(true)}
              >
                <Text style={styles.reassignText}>Reassign</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.assignBtn}
              onPress={() => setShowAssignModal(true)}
            >
              <LinearGradient
                colors={Colors.gradient.primary}
                style={styles.assignBtnGradient}
              >
                <Ionicons name="person-add" size={18} color="#fff" />
                <Text style={styles.assignBtnText}>Assign to Employee</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Admin Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setShowPriorityModal(true)}
            >
              <LinearGradient
                colors={Colors.gradient.warning}
                style={styles.actionGradient}
              >
                <Ionicons name="flag" size={22} color="#fff" />
                <Text style={styles.actionLabel}>Set Priority</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setShowStatusModal(true)}
            >
              <LinearGradient
                colors={Colors.gradient.admin}
                style={styles.actionGradient}
              >
                <Ionicons name="sync-circle" size={22} color="#fff" />
                <Text style={styles.actionLabel}>Update Status</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => toggleMajorIssue(c.id)}
            >
              <LinearGradient
                colors={
                  c.isMajorIssue
                    ? ["#6B7280", "#374151"]
                    : Colors.gradient.error
                }
                style={styles.actionGradient}
              >
                <Ionicons
                  name={c.isMajorIssue ? "flag" : "warning"}
                  size={22}
                  color="#fff"
                />
                <Text style={styles.actionLabel}>
                  {c.isMajorIssue ? "Remove Major" : "Mark Major"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          {c.timeline.map((tl, i) => (
            <View key={tl.id} style={styles.tlRow}>
              <View style={styles.tlLeft}>
                <View
                  style={[
                    styles.tlDot,
                    { backgroundColor: Colors.status[tl.status] },
                  ]}
                />
                {i < c.timeline.length - 1 && <View style={styles.tlLine} />}
              </View>
              <View style={styles.tlContent}>
                <Text style={styles.tlTitle}>{tl.title}</Text>
                <Text style={styles.tlDesc}>{tl.description}</Text>
                <Text style={styles.tlTime}>
                  {formatDateTime(tl.timestamp)} · {tl.updatedBy}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Assign Modal */}
      <Modal visible={showAssignModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Assign Employee</Text>
            <FlatList
              data={activeEmployees}
              keyExtractor={(e) => e.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.empRow}
                  onPress={() => handleAssign(item.id, item.name)}
                >
                  <View style={styles.empAvatar}>
                    <Text style={styles.empInitial}>{item.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.empName}>{item.name}</Text>
                    <Text style={styles.empSub}>
                      {item.department} · Ward {item.wardNumber}
                    </Text>
                  </View>
                  <Text style={styles.taskCount}>
                    {item.tasksAssigned - item.tasksCompleted} active
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelModal}
              onPress={() => setShowAssignModal(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Priority Modal */}
      <Modal visible={showPriorityModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Set Priority</Text>
            {PRIORITY_OPTIONS.map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.modalOption}
                onPress={() => handlePriority(p)}
              >
                <View
                  style={[
                    styles.modalDot,
                    { backgroundColor: Colors.priority[p] },
                  ]}
                />
                <Text style={styles.modalOptionText}>{PRIORITY_LABELS[p]}</Text>
                {c.priority === p && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelModal}
              onPress={() => setShowPriorityModal(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Status Modal */}
      <Modal visible={showStatusModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Update Status</Text>
            {STATUS_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.modalOption}
                onPress={() => handleStatus(s)}
              >
                <View
                  style={[
                    styles.modalDot,
                    { backgroundColor: Colors.status[s] },
                  ]}
                />
                <Text style={styles.modalOptionText}>
                  {s
                    .replace("_", " ")
                    .replace(/\b\w/g, (ch) => ch.toUpperCase())}
                </Text>
                {c.status === s && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelModal}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { paddingTop: 52, paddingBottom: 48 },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  back: { padding: 4 },
  topTitle: { fontSize: FontSize.lg, fontWeight: "800", color: "#fff" },
  topSub: { fontSize: FontSize.xs, color: "rgba(255,255,255,0.7)" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: "700" },
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
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityText: { fontSize: FontSize.xs, fontWeight: "700" },
  majorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.errorLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  majorText: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.error },
  issueType: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
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
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: { fontSize: FontSize.md, fontWeight: "600", color: Colors.text },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  issueTypeIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  evidenceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  evidenceCaptionText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  evidenceImage: {
    width: "100%",
    height: 210,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  assignedCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  empAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  empInitial: {
    fontSize: FontSize.lg,
    fontWeight: "800",
    color: Colors.primary,
  },
  empName: { fontSize: FontSize.md, fontWeight: "700", color: Colors.text },
  empSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  reassignBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  reassignText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.primary,
  },
  assignBtn: { borderRadius: BorderRadius.md, overflow: "hidden" },
  assignBtnGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  assignBtnText: { fontSize: FontSize.md, fontWeight: "700", color: "#fff" },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionBtn: {
    flex: 1,
    minWidth: "30%",
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  actionGradient: { alignItems: "center", gap: 6, padding: Spacing.md },
  actionLabel: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  tlRow: { flexDirection: "row", gap: 12, marginBottom: 4 },
  tlLeft: { alignItems: "center", width: 20 },
  tlDot: { width: 16, height: 16, borderRadius: 8, marginTop: 3 },
  tlLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginTop: 4,
    minHeight: 20,
  },
  tlContent: { flex: 1, paddingBottom: 16 },
  tlTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  tlDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  tlTime: { fontSize: FontSize.xs, color: Colors.textTertiary },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 16,
  },
  empRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  taskCount: { fontSize: FontSize.xs, color: Colors.textSecondary },
  cancelModal: { marginTop: 16, alignItems: "center", paddingVertical: 12 },
  cancelModalText: {
    fontSize: FontSize.md,
    color: Colors.error,
    fontWeight: "700",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalDot: { width: 12, height: 12, borderRadius: 6 },
  modalOptionText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },
});

export default ComplaintDetailScreen;
