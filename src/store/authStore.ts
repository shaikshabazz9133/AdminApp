import { create } from "zustand";
import { AdminUser } from "../data/types";
import { getAdminByUsername } from "../data/mockAdmins";

interface AuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  admin: null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 1000));
    const admin = getAdminByUsername(username);
    if (!admin || admin.password !== password) {
      set({
        isLoading: false,
        error: "Invalid credentials. Try admin / admin123",
      });
      return;
    }
    set({ isAuthenticated: true, admin, isLoading: false, error: null });
  },

  logout: () => set({ isAuthenticated: false, admin: null }),
}));
