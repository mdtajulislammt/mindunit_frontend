"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Users, UserPlus, UserCheck, FolderHeart } from "lucide-react";
import { RootState } from "@/redux/store";
import styles from "./SidebarLeft.module.css";

export default function SidebarLeft() {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  if (!currentUser) return null;

  return (
    <aside className={styles.sidebar}>
      {/* Profile Overview Card */}
      <div className={styles.profileCard}>
        <div className={styles.banner} />
        <div className={styles.profileInfo}>
          <div className={styles.avatarWrapper}>
            <img
              src={currentUser.avatarUrl}
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              className={styles.avatar}
            />
          </div>
          <h3 className={styles.name}>
            {currentUser.firstName} {currentUser.lastName}
          </h3>
          <p className={styles.headline}>{currentUser.headline}</p>
        </div>

        {/* Stats */}
        <div className={styles.statsSection} onClick={() => alert("Network Connections list coming soon!")}>
          <div>
            <span className={styles.statsLabel}>Connections</span>
            <p className={styles.statsSub}>Grow your professional circle</p>
          </div>
          <span className={styles.statsValue}>{currentUser.connectionsCount}</span>
        </div>
      </div>

      {/* Manage Network Widget */}
      <div className={styles.networkCard}>
        <h4 className={styles.networkTitle}>Manage Network</h4>
        <div className={styles.networkList}>
          <button className={styles.networkItem} onClick={() => alert("Connections view coming soon!")}>
            <Users size={16} />
            <span>My Connections</span>
          </button>
          <button className={styles.networkItem} onClick={() => alert("Requests view coming soon!")}>
            <UserPlus size={16} />
            <span>Connection Requests</span>
          </button>
          <button className={styles.networkItem} onClick={() => alert("Following list coming soon!")}>
            <UserCheck size={16} />
            <span>Following & Followers</span>
          </button>
          <button className={`${styles.networkItem} ${styles.networkItemActive}`}>
            <FolderHeart size={16} />
            <span>Groups</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
