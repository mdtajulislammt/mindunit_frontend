"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { fetchPosts } from "@/redux/slices/feedSlice";
import { fetchGroups } from "@/redux/slices/groupsSlice";
import Header from "@/components/Header/Header";
import SidebarLeft from "@/components/SidebarLeft/SidebarLeft";
import SidebarRight from "@/components/SidebarRight/SidebarRight";
import PostCreator from "@/components/PostCreator/PostCreator";
import PostCard from "@/components/PostCard/PostCard";
import styles from "./feed.module.css";

export default function FeedPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { posts } = useSelector((state: RootState) => state.feed);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to ensure we are on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch feed and groups
  useEffect(() => {
    if (mounted && currentUser) {
      dispatch(fetchPosts() as any);
      dispatch(fetchGroups() as any);
    }
  }, [mounted, currentUser, dispatch]);

  // Protect route
  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, router, mounted]);

  // Prevent hydration flash/SSR mismatches
  if (!mounted) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner} />
        <p style={{ fontFamily: "var(--font-family)", fontSize: 14, color: "var(--text-secondary)" }}>
          Loading MindUnite...
        </p>
      </div>
    );
  }

  // Double check auth before rendering dashboard elements
  if (!currentUser) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner} />
        <p style={{ fontFamily: "var(--font-family)", fontSize: 14, color: "var(--text-secondary)" }}>
          Redirecting to secure login...
        </p>
      </div>
    );
  }

  // Sort visible posts newest first
  const visiblePosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={styles.feedPageWrapper}>
      <Header />
      <main className={`${styles.mainLayout} container`}>
        {/* Left Column: Profile Card & Manage Menu */}
        <div className={styles.leftSidebarWrapper}>
          <SidebarLeft />
        </div>

        {/* Center Column: Post Composer & News Feed */}
        <div className={styles.middleContent}>
          <PostCreator />

          {visiblePosts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No posts available</h3>
              <p>Be the first to share your thoughts, case studies, or research articles!</p>
            </div>
          ) : (
            visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* Right Column: Group Recommendations & Footer */}
        <div className={styles.rightSidebarWrapper}>
          <SidebarRight />
        </div>
      </main>
    </div>
  );
}
