import { AdminUser } from "./types";

export const adminUsers: AdminUser[] = [
  {
    id: "ADM001",
    name: "Srinivasa Rao",
    username: "admin",
    password: "admin123", // DEMO ONLY
    phone: "9876543210",
    wardNumber: 0,
    designation: "Municipal Commissioner",
    avatarInitials: "SR",
  },
  {
    id: "ADM002",
    name: "Lakshmi Devi",
    username: "corporator1",
    password: "admin123", // DEMO ONLY
    phone: "9876543211",
    wardNumber: 12,
    designation: "Ward Corporator - Ward 12",
    avatarInitials: "LD",
  },
];

export const getAdminByUsername = (username: string): AdminUser | undefined =>
  adminUsers.find((a) => a.username === username);

export const defaultAdmin = adminUsers[0];
