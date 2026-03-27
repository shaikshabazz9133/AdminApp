import { AppNotification } from "./types";

export const mockNotifications: AppNotification[] = [
  {
    id: "NOTIF001",
    title: "Major Issue Escalated",
    message:
      "Drainage blockage at Ward 23 flagged as MAJOR by Srinivas Murthy.",
    type: "complaint_escalated",
    isRead: false,
    createdAt: "2024-04-06T10:05:00.000Z",
    relatedId: "COMP003",
  },
  {
    id: "NOTIF002",
    title: "Task Completed",
    message: "Road repair at Ward 12 marked completed by Mahesh Babu.",
    type: "task_completed",
    isRead: false,
    createdAt: "2024-04-04T16:05:00.000Z",
    relatedId: "COMP001",
  },
  {
    id: "NOTIF003",
    title: "New Complaint Received",
    message:
      "New complaint CMP-2024-005 submitted for Ward 5 — school zone speed breaker.",
    type: "new_complaint",
    isRead: true,
    createdAt: "2024-04-07T15:05:00.000Z",
    relatedId: "COMP005",
  },
  {
    id: "NOTIF004",
    title: "System Reminder",
    message:
      "3 complaints are unassigned and pending review. Please take action.",
    type: "system",
    isRead: true,
    createdAt: "2024-04-07T08:00:00.000Z",
  },
];
