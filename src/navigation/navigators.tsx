import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationStore } from "../store/notificationStore";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/colors";

import {
  AuthStackParamList,
  MainTabParamList,
  ComplaintsStackParamList,
  EmployeesStackParamList,
} from "./types";

// Screens
import LoginScreen from "../screens/auth/LoginScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ComplaintListScreen from "../screens/complaints/ComplaintListScreen";
import ComplaintDetailScreen from "../screens/complaints/ComplaintDetailScreen";
import EmployeeListScreen from "../screens/employees/EmployeeListScreen";
import EmployeeDetailScreen from "../screens/employees/EmployeeDetailScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const AuthStack = createStackNavigator<AuthStackParamList>();
export const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const ComplaintsStack = createStackNavigator<ComplaintsStackParamList>();
const ComplaintsNavigator = () => (
  <ComplaintsStack.Navigator screenOptions={{ headerShown: false }}>
    <ComplaintsStack.Screen
      name="ComplaintList"
      component={ComplaintListScreen}
    />
    <ComplaintsStack.Screen
      name="ComplaintDetail"
      component={ComplaintDetailScreen}
    />
  </ComplaintsStack.Navigator>
);

const EmployeesStack = createStackNavigator<EmployeesStackParamList>();
const EmployeesNavigator = () => (
  <EmployeesStack.Navigator screenOptions={{ headerShown: false }}>
    <EmployeesStack.Screen name="EmployeeList" component={EmployeeListScreen} />
    <EmployeesStack.Screen
      name="EmployeeDetail"
      component={EmployeeDetailScreen}
    />
  </EmployeesStack.Navigator>
);

// ─── Tab config ───────────────────────────────────────────────────────────────
const TAB_CONFIG: {
  name: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
  {
    name: "Dashboard",
    activeIcon: "grid",
    inactiveIcon: "grid-outline",
    label: "Dashboard",
  },
  {
    name: "Complaints",
    activeIcon: "document-text",
    inactiveIcon: "document-text-outline",
    label: "Complaints",
  },
  {
    name: "Employees",
    activeIcon: "people",
    inactiveIcon: "people-outline",
    label: "Employees",
  },
  {
    name: "Notifications",
    activeIcon: "notifications",
    inactiveIcon: "notifications-outline",
    label: "Notifications",
  },
  {
    name: "Profile",
    activeIcon: "person-circle",
    inactiveIcon: "person-circle-outline",
    label: "Profile",
  },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotificationStore();

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const cfg = TAB_CONFIG.find((t) => t.name === route.name)!;
        const focused = state.index === index;
        const color = focused ? Colors.primary : Colors.textTertiary;
        const hasNotif = route.name === "Notifications" && unreadCount > 0;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented)
                navigation.navigate(route.name);
            }}
          >
            {/* Active pill indicator */}
            {focused && <View style={styles.activePill} />}

            {/* Icon + badge wrapper */}
            <View style={styles.iconWrap}>
              <Ionicons
                name={focused ? cfg.activeIcon : cfg.inactiveIcon}
                size={24}
                color={color}
              />
              {hasNotif && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>

            {/* Label */}
            <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
              {cfg.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Main Navigator ───────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator<MainTabParamList>();
export const MainNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Complaints" component={ComplaintsNavigator} />
    <Tab.Screen name="Employees" component={EmployeesNavigator} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    minHeight: 56,
  },
  activePill: {
    position: "absolute",
    top: -8,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  iconWrap: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#fff",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 3,
    letterSpacing: 0.1,
  },
});
