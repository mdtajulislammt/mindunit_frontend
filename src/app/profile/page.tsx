"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Camera, Calendar, Users } from "lucide-react";
import { RootState } from "@/redux/store";
import { updateCurrentUser } from "@/redux/slices/authSlice";
import Header from "@/components/Header/Header";
import SidebarLeft from "@/components/SidebarLeft/SidebarLeft";
import PostCard from "@/components/PostCard/PostCard";
import styles from "./profile.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state: RootState) => state.auth);
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit form states
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect route
  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, router, mounted]);

  // Fetch Profile data
  const fetchProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }
      setProfileData(data);
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
      setHeadline(data.user.headline);
      setAvatarPreview(data.user.avatarUrl);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && currentUser) {
      fetchProfile();
    }
  }, [mounted, currentUser]);

  if (!mounted) return null;

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner} />
        <p style={{ fontFamily: "var(--font-family)" }}>Loading profile...</p>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert("First name and Last name are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("headline", headline);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update Redux Store
      dispatch(updateCurrentUser(data));
      // Update local state
      setProfileData((prev: any) => ({
        ...prev,
        user: data,
      }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Error saving profile");
    }
  };

  return (
    <div className={styles.profilePageWrapper}>
      <Header />
      <main className={`${styles.mainLayout} container`}>
        {/* Left Column: Left Sidebar (reads from store, will automatically sync) */}
        <div className={styles.leftSidebarWrapper}>
          <SidebarLeft />
        </div>

        {/* Center Column: Profile Info Card & User Posts */}
        <div className={styles.middleContent}>
          <div className={styles.profileCard}>
            <div className={styles.coverBanner} />
            
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className={styles.editForm}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Edit Profile</h3>
                
                {/* Avatar Edit preview inside the edit form */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                  <div className={styles.profileAvatarWrapper}>
                    <img
                      src={avatarPreview || "/default-avatar.png"}
                      alt="Avatar Preview"
                      className={styles.profileAvatar}
                    />
                    <label className={styles.avatarUploadOverlay}>
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div>
                    <button
                      type="button"
                      className={styles.editProfileBtn}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </button>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                      Support JPG, PNG. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Headline / Profession</label>
                  <textarea
                    className={styles.textarea}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Cognitive Neuroscientist | Psychology Student"
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>Save Changes</button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(profileData.user.firstName);
                      setLastName(profileData.user.lastName);
                      setHeadline(profileData.user.headline);
                      setAvatarPreview(profileData.user.avatarUrl);
                      setAvatarFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.avatarSection}>
                  <div className={styles.profileAvatarWrapper}>
                    <img
                      src={profileData?.user.avatarUrl || "/default-avatar.png"}
                      alt={`${profileData?.user.firstName} ${profileData?.user.lastName}`}
                      className={styles.profileAvatar}
                    />
                  </div>
                  <button
                    className={styles.editProfileBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>

                <div className={styles.infoSection}>
                  <h2 className={styles.name}>
                    {profileData?.user.firstName} {profileData?.user.lastName}
                  </h2>
                  <p className={styles.headline}>{profileData?.user.headline}</p>
                  
                  <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                      <Users size={14} style={{ marginRight: 2 }} />
                      <span>{profileData?.user.connectionsCount} Connections</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Calendar size={14} style={{ marginRight: 2 }} />
                      <span>Joined {new Date(profileData?.user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User's own posts list */}
          <h3 style={{ textAlign: "left", fontSize: 16, fontWeight: 750, color: "var(--text-primary)", marginTop: 8 }}>
            My Publications & Research Posts
          </h3>

          {profileData?.posts.length === 0 ? (
            <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: 40, color: "var(--text-secondary)" }}>
              <p>You haven't posted anything yet. Share your thoughts or research on the homepage!</p>
            </div>
          ) : (
            profileData?.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* Right Column: Joined Groups & Connected Professionals list */}
        <div className={styles.rightSidebarWrapper} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Joined Groups Card */}
          <div className={styles.sidebarCard}>
            <h4 className={styles.sidebarTitle}>Joined Groups</h4>
            <div className={styles.itemList}>
              {profileData?.joinedGroups.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "left" }}>No groups joined yet.</p>
              ) : (
                profileData?.joinedGroups.map((group: any) => (
                  <div key={group.id} className={styles.groupItem}>
                    <div className={styles.itemInfo}>
                      <img src={group.avatarUrl} alt={group.name} className={styles.itemAvatar} />
                      <div className={styles.itemText}>
                        <span className={styles.itemName}>{group.name}</span>
                        <span className={styles.itemSub}>{group.category}</span>
                      </div>
                    </div>
                    <span className={styles.badge}>Joined</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Connections Card */}
          <div className={styles.sidebarCard}>
            <h4 className={styles.sidebarTitle}>My Connections</h4>
            <div className={styles.itemList}>
              {profileData?.connections.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "left" }}>No active connections.</p>
              ) : (
                profileData?.connections.map((conn: any) => (
                  <div key={conn.id} className={styles.connectionItem}>
                    <div className={styles.itemInfo}>
                      <img src={conn.avatarUrl} alt={`${conn.firstName} ${conn.lastName}`} className={`${styles.itemAvatar} ${styles.avatarCircle}`} />
                      <div className={styles.itemText}>
                        <span className={styles.itemName}>{conn.firstName} {conn.lastName}</span>
                        <span className={styles.itemSub}>{conn.headline}</span>
                      </div>
                    </div>
                    <span className={styles.badge}>Connected</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
