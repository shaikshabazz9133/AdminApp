import { WardStats } from "./types";

export const mockWardStats: WardStats[] = [
  { wardNumber: 5, totalComplaints: 4, resolved: 2, pending: 1, inProgress: 1 },
  { wardNumber: 7, totalComplaints: 6, resolved: 4, pending: 1, inProgress: 1 },
  {
    wardNumber: 12,
    totalComplaints: 8,
    resolved: 5,
    pending: 2,
    inProgress: 1,
  },
  {
    wardNumber: 18,
    totalComplaints: 3,
    resolved: 3,
    pending: 0,
    inProgress: 0,
  },
  {
    wardNumber: 23,
    totalComplaints: 5,
    resolved: 2,
    pending: 2,
    inProgress: 1,
  },
];
