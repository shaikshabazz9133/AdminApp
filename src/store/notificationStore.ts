import { create } from 'zustand';
import { AppNotification } from '../data/types';
import { mockNotifications } from '../data/mockNotifications';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  loadNotifications: async () => {
    await new Promise((r) => setTimeout(r, 400));
    const sorted = [...mockNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    set({ notifications: sorted, unreadCount: sorted.filter((n) => !n.isRead).length });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },
}));
