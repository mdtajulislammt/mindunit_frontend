"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import Header from "@/components/Header/Header";
import styles from "./network.module.css";

export default function NetworkPage() {
  const router = useRouter();
  const { currentUser, users } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, router, mounted]);

  if (!mounted || !currentUser) {
    return (
      <div className={styles.loadingOverlay} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ fontFamily: "var(--font-family)" }}>Loading Network...</p>
      </div>
    );
  }

  // Filter out the logged-in user
  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => [...prev, id]);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
      <Header />
      <main className={styles.container}>
        <h2 className={styles.title}>Brain Health Professionals Directory</h2>
        <div className={styles.grid}>
          {otherUsers.map((user) => {
            const isPending = connectedIds.includes(user.id);
            return (
              <div key={user.id} className={styles.card}>
                <div className={styles.userInfo}>
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className={styles.avatar}
                  />
                  <div className={styles.details}>
                    <span className={styles.name}>
                      {user.firstName} {user.lastName}
                    </span>
                    <span className={styles.headline}>{user.headline}</span>
                    <span className={styles.stats}>
                      {user.connectionsCount + (isPending ? 0 : 0)} connections
                    </span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={`${styles.btn} ${styles.messageBtn}`}
                    onClick={() => router.push(`/messages?user=${user.id}`)}
                  >
                    Message
                  </button>
                  {isPending ? (
                    <button className={`${styles.btn} ${styles.pendingBtn}`}>
                      Pending
                    </button>
                  ) : (
                    <button
                      className={`${styles.btn} ${styles.connectBtn}`}
                      onClick={() => handleConnect(user.id)}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
