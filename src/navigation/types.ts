import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Complaints: undefined;
  Employees: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type ComplaintsStackParamList = {
  ComplaintList: undefined;
  ComplaintDetail: { complaintId: string };
};

export type EmployeesStackParamList = {
  EmployeeList: undefined;
  EmployeeDetail: { employeeId: string };
};

// Screen props
export type SplashScreenProps = StackScreenProps<RootStackParamList, "Splash">;
export type LoginScreenProps = StackScreenProps<AuthStackParamList, "Login">;

export type DashboardScreenProps = BottomTabScreenProps<
  MainTabParamList,
  "Dashboard"
>;

export type ComplaintListScreenProps = CompositeScreenProps<
  StackScreenProps<ComplaintsStackParamList, "ComplaintList">,
  BottomTabScreenProps<MainTabParamList>
>;
export type ComplaintDetailScreenProps = StackScreenProps<
  ComplaintsStackParamList,
  "ComplaintDetail"
>;

export type EmployeeListScreenProps = CompositeScreenProps<
  StackScreenProps<EmployeesStackParamList, "EmployeeList">,
  BottomTabScreenProps<MainTabParamList>
>;
export type EmployeeDetailScreenProps = StackScreenProps<
  EmployeesStackParamList,
  "EmployeeDetail"
>;

export type NotificationsScreenProps = BottomTabScreenProps<
  MainTabParamList,
  "Notifications"
>;
export type ProfileScreenProps = BottomTabScreenProps<
  MainTabParamList,
  "Profile"
>;
