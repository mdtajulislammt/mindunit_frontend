"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleJoinGroup } from "@/redux/slices/groupsSlice";
import { RootState } from "@/redux/store";
import styles from "./SidebarRight.module.css";

export default function SidebarRight() {
  const dispatch = useDispatch();
  const groups = useSelector((state: RootState) => state.groups.list);

  const formatMembers = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k members`;
    }
    return `${num} members`;
  };

  return (
    <aside className={styles.sidebar}>
      {/* Recommended Groups Widget */}
      <div className={styles.groupsCard}>
        <h4 className={styles.title}>Groups you might be interested in</h4>
        <div className={styles.groupList}>
          {groups.map((group) => (
            <div key={group.id} className={styles.groupItem}>
              <div className={styles.groupInfo}>
                <img
                  src={group.avatarUrl}
                  alt={group.name}
                  className={styles.avatar}
                />
                <div className={styles.textContainer}>
                  <span className={styles.name}>{group.name}</span>
                  <span className={styles.members}>{formatMembers(group.membersCount)}</span>
                </div>
              </div>

              <button
                className={`${styles.joinBtn} ${group.isJoined ? styles.joinedBtn : ""}`}
                onClick={() => dispatch(toggleJoinGroup(group.id) as any)}
              >
                {group.isJoined ? "Joined" : "Join"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info matching branding */}
      <div className={styles.footer}>
        <p className={styles.copyright}>
          MindUnite © 2026. All Rights Reserved.
        </p>
      </div>
    </aside>
  );
}
