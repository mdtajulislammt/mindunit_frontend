"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import Header from "@/components/Header/Header";
import styles from "./notifications.module.css";

interface NotificationItem {
  id: string;
  avatarUrl: string;
  text: string;
  time: string;
  isUnread: boolean;
}

const initialMockNotifications = (): NotificationItem[] => [
  {
    id: "n1",
    avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23008051"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">SR</text></svg>`,
    text: "Dr. Sarah Rahman liked your comment: 'This design tokens architecture is super impressive! Thanks for sharing.'",
    time: "2 hours ago",
    isUnread: true,
  },
  {
    id: "n2",
    avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%230a7e8c"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">RI</text></svg>`,
    text: "Rahat Islam replied to your comment on Sarah's post.",
    time: "4 hours ago",
    isUnread: true,
  },
  {
    id: "n3",
    avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%238c0a5b"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">FY</text></svg>`,
    text: "Fahmida Yeasmin liked your public update.",
    time: "1 day ago",
    isUnread: false,
  },
  {
    id: "n4",
    avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23008051"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">BH</text></svg>`,
    text: "You are now a member of the Brain Health Association group.",
    time: "2 days ago",
    isUnread: false,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setMounted(true);
    setNotifications(initialMockNotifications());
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, router, mounted]);

  if (!mounted || !currentUser) {
    return (
      <div className={styles.loadingOverlay} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ fontFamily: "var(--font-family)" }}>Loading Notifications...</p>
      </div>
    );
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
      <Header />
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title}>Notifications</span>
            {notifications.length > 0 && (
              <div style={{ display: "flex", gap: "16px" }}>
                <button className={styles.clearBtn} onClick={markAllAsRead}>
                  Mark all as read
                </button>
                <button className={styles.clearBtn} style={{ color: "var(--text-muted)" }} onClick={clearAll}>
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No new notifications at this time.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  className={`${styles.item} ${notif.isUnread ? styles.unread : ""}`}
                  onClick={() => handleItemClick(notif.id)}
                >
                  <img
                    src={notif.avatarUrl}
                    alt="Notification Source"
                    className={styles.avatar}
                  />
                  <div className={styles.content}>
                    <span className={styles.text}>{notif.text}</span>
                    <span className={styles.time}>{notif.time}</span>
                  </div>
                  {notif.isUnread && <div className={styles.dot} />}
                </button>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
