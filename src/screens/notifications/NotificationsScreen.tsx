import React from "react";
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
import { useNotificationStore } from "../../store/notificationStore";
import { AppNotification } from "../../data/types";
import Colors from "../../constants/colors";
import { FontSize, Spacing, BorderRadius } from "../../constants/index";
import { formatRelativeTime } from "../../utils/helpers";

const TYPE_CONFIG = {
  complaint_escalated: {
    icon: "warning" as const,
    color: Colors.error,
    bg: Colors.errorLight,
  },
  task_completed: {
    icon: "checkmark-circle" as const,
    color: Colors.secondary,
    bg: Colors.secondaryLight,
  },
  new_complaint: {
    icon: "document-text" as const,
    color: Colors.primary,
    bg: Colors.primaryLight,
  },
  system: {
    icon: "information-circle" as const,
    color: Colors.warning,
    bg: Colors.warningLight,
  },
};

const NotificationItem: React.FC<{
  item: AppNotification;
  onPress: () => void;
}> = ({ item, onPress }) => {
  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.system;
  return (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unread]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {!item.isRead && <View style={styles.unreadDot} />}
      <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={22} color={cfg.color} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, !item.isRead && styles.titleBold]}>
          {item.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotificationStore();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={Colors.gradient.admin} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadLabel}>{unreadCount} unread</Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.wave} />
      </LinearGradient>

      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => markAsRead(item.id)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 52, paddingBottom: 48 },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: "800", color: "#fff" },
  unreadLabel: {
    fontSize: FontSize.sm,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  markAllBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  markAllText: { fontSize: FontSize.sm, color: "#fff", fontWeight: "600" },
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
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: "rgba(15,23,42,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
    position: "relative",
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  unreadDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  body: { flex: 1 },
  title: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 3,
  },
  titleBold: { fontWeight: "800" },
  message: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: { fontSize: FontSize.xs, color: Colors.textTertiary },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.text },
});

export default NotificationsScreen;
