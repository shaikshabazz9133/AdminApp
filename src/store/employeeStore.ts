import { create } from "zustand";
import { Employee } from "../data/types";
import { mockEmployees } from "../data/mockEmployees";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  loadEmployees: () => Promise<void>;
  selectEmployee: (employee: Employee) => void;
  toggleEmployeeActive: (employeeId: string) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,

  loadEmployees: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ employees: [...mockEmployees], isLoading: false });
  },

  selectEmployee: (employee) => set({ selectedEmployee: employee }),

  toggleEmployeeActive: (employeeId) => {
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === employeeId ? { ...e, isActive: !e.isActive } : e,
      ),
    }));
  },
}));
