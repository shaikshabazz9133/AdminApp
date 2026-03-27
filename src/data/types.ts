// ─── Shared Types ────────────────────────────────────────────────────────────

export type ComplaintStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";
export type IssueType = "road_damage" | "garbage" | "drainage" | "street_light";
export type Priority = "high" | "medium" | "low";
export type EmployeeRole = "field_worker" | "supervisor" | "inspector";

// ─── Admin User ───────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  password: string; // DEMO ONLY — never store plaintext in production
  phone: string;
  wardNumber: number;
  designation: string;
  avatarInitials: string;
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  username: string;
  phone: string;
  role: EmployeeRole;
  wardNumber: number;
  department: string;
  isActive: boolean;
  tasksAssigned: number;
  tasksCompleted: number;
  joinedAt: string;
}

// ─── Complaint ────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  wardNumber: number;
  issueType: IssueType;
  description: string;
  status: ComplaintStatus;
  priority: Priority;
  isMajorIssue: boolean;
  assignedEmployeeId: string | null;
  assignedEmployeeName: string | null;
  location: string;
  imageUri?: string;
  afterImageUri?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

// ─── Ward Stats ───────────────────────────────────────────────────────────────

export interface WardStats {
  wardNumber: number;
  totalComplaints: number;
  resolved: number;
  pending: number;
  inProgress: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "complaint_escalated" | "task_completed" | "new_complaint" | "system";
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalComplaints: number;
  submitted: number;
  assigned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalEmployees: number;
  activeEmployees: number;
  majorIssues: number;
  resolvedToday: number;
}
