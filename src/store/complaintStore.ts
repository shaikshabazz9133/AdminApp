import { create } from "zustand";
import { Complaint, ComplaintStatus, Priority } from "../data/types";
import { mockComplaints } from "../data/mockComplaints";

interface ComplaintState {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  isLoading: boolean;
  loadComplaints: () => Promise<void>;
  selectComplaint: (complaint: Complaint) => void;
  assignEmployee: (
    complaintId: string,
    employeeId: string,
    employeeName: string,
  ) => Promise<void>;
  updatePriority: (complaintId: string, priority: Priority) => Promise<void>;
  updateStatus: (complaintId: string, status: ComplaintStatus) => Promise<void>;
  toggleMajorIssue: (complaintId: string) => void;
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: [],
  selectedComplaint: null,
  isLoading: false,

  loadComplaints: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 700));
    set({ complaints: [...mockComplaints], isLoading: false });
  },

  selectComplaint: (complaint) => set({ selectedComplaint: complaint }),

  assignEmployee: async (complaintId, employeeId, employeeName) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => {
      const updated = state.complaints.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              assignedEmployeeId: employeeId,
              assignedEmployeeName: employeeName,
              status: "assigned" as ComplaintStatus,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: `TL-${Date.now()}`,
                  status: "assigned" as ComplaintStatus,
                  title: "Assigned to Employee",
                  description: `Assigned to ${employeeName} by admin.`,
                  timestamp: new Date().toISOString(),
                  updatedBy: "Admin",
                },
              ],
            }
          : c,
      );
      const sel =
        updated.find((c) => c.id === complaintId) ?? state.selectedComplaint;
      return { complaints: updated, selectedComplaint: sel, isLoading: false };
    });
  },

  updatePriority: async (complaintId, priority) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 500));
    set((state) => {
      const updated = state.complaints.map((c) =>
        c.id === complaintId
          ? { ...c, priority, updatedAt: new Date().toISOString() }
          : c,
      );
      const sel =
        updated.find((c) => c.id === complaintId) ?? state.selectedComplaint;
      return { complaints: updated, selectedComplaint: sel, isLoading: false };
    });
  },

  updateStatus: async (complaintId, status) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set((state) => {
      const updated = state.complaints.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: `TL-${Date.now()}`,
                  status,
                  title: `Status Updated`,
                  description: `Status changed to ${status.replace("_", " ")} by admin.`,
                  timestamp: new Date().toISOString(),
                  updatedBy: "Admin",
                },
              ],
            }
          : c,
      );
      const sel =
        updated.find((c) => c.id === complaintId) ?? state.selectedComplaint;
      return { complaints: updated, selectedComplaint: sel, isLoading: false };
    });
  },

  toggleMajorIssue: (complaintId) => {
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === complaintId ? { ...c, isMajorIssue: !c.isMajorIssue } : c,
      ),
      selectedComplaint:
        state.selectedComplaint?.id === complaintId
          ? {
              ...state.selectedComplaint,
              isMajorIssue: !state.selectedComplaint.isMajorIssue,
            }
          : state.selectedComplaint,
    }));
  },
}));
