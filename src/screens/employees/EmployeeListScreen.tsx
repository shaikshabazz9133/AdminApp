import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEmployeeStore } from "../../store/employeeStore";
import { EmployeeListScreenProps } from "../../navigation/types";
import { Employee } from "../../data/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";
import { getCompletionRate } from "../../utils/helpers";

const ROLE_LABELS: Record<string, string> = {
  field_worker: "Field Worker",
  supervisor: "Supervisor",
  inspector: "Inspector",
};

const EmployeeCard: React.FC<{ employee: Employee; onPress: () => void }> = ({
  employee: e,
  onPress,
}) => {
  const rate = getCompletionRate(e.tasksAssigned, e.tasksCompleted);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTop}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: e.isActive
                ? Colors.primaryLight
                : Colors.surfaceElevated,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { color: e.isActive ? Colors.primary : Colors.textTertiary },
            ]}
          >
            {e.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.empName}>{e.name}</Text>
          <Text style={styles.empId}>{e.employeeId}</Text>
          <Text style={styles.empRole}>
            {ROLE_LABELS[e.role]} · Ward {e.wardNumber}
          </Text>
        </View>
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
      </View>

      <View style={styles.cardDept}>
        <Ionicons
          name="business-outline"
          size={13}
          color={Colors.textSecondary}
        />
        <Text style={styles.deptText}>{e.department}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{e.tasksAssigned}</Text>
          <Text style={styles.statLabel}>Assigned</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{e.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statNum,
              {
                color:
                  rate >= 80
                    ? Colors.secondary
                    : rate >= 50
                      ? Colors.warning
                      : Colors.error,
              },
            ]}
          >
            {rate}%
          </Text>
          <Text style={styles.statLabel}>Rate</Text>
        </View>
      </View>

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
    </TouchableOpacity>
  );
};

const EmployeeListScreen: React.FC<EmployeeListScreenProps> = ({
  navigation,
}) => {
  const { employees, loadEmployees, selectEmployee, isLoading } =
    useEmployeeStore();

  useEffect(() => {
    loadEmployees();
  }, []);

  const activeCount = employees.filter((e) => e.isActive).length;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={Colors.gradient.admin} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Employees</Text>
          <Text style={styles.headerSub}>
            {activeCount} of {employees.length} active
          </Text>
        </View>
        <View style={styles.wave} />
      </LinearGradient>

      <FlatList
        data={employees}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <EmployeeCard
            employee={item}
            onPress={() => {
              selectEmployee(item);
              navigation.navigate("EmployeeDetail", { employeeId: item.id });
            }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40 }}>👷</Text>
            <Text style={styles.emptyTitle}>No employees found</Text>
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
  list: { padding: Spacing.md, flexGrow: 1 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: "rgba(15,23,42,0.07)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: FontSize.md, fontWeight: "800" },
  empName: { fontSize: FontSize.md, fontWeight: "800", color: Colors.text },
  empId: { fontSize: FontSize.xs, color: Colors.textTertiary },
  empRole: { fontSize: FontSize.xs, color: Colors.textSecondary },
  activeDot: { width: 10, height: 10, borderRadius: 5 },
  cardDept: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  deptText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  statsRow: { flexDirection: "row", marginBottom: 8 },
  stat: { flex: 1, alignItems: "center" },
  statNum: { fontSize: FontSize.lg, fontWeight: "800", color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 3 },
  empty: { flex: 1, alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.text },
});

export default EmployeeListScreen;
