"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { Brain, Search, Home, Users, MessageSquare, Bell, LogOut, User as UserIcon } from "lucide-react";
import { logoutUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import styles from "./Header.module.css";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  if (!currentUser) return null;

  return (
    <header className={styles.header}>
      <div className={`${styles.navContainer} container`}>
        {/* Left Side: Logo & Search */}
        <div className={styles.leftNav}>
          <div className={styles.logo} onClick={() => router.push("/")}>
            <Brain className={styles.logoIcon} size={28} strokeWidth={2.5} />
            <span>MindUnite</span>
          </div>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Search professionals, articles..."
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Center: Main Links */}
        <nav className={styles.centerNav}>
          <div
            className={`${styles.navLink} ${pathname === "/" ? styles.activeNavLink : ""}`}
            onClick={() => router.push("/")}
          >
            <Home size={20} />
            <span>Home</span>
          </div>
          <div
            className={`${styles.navLink} ${pathname === "/network" ? styles.activeNavLink : ""}`}
            onClick={() => router.push("/network")}
          >
            <Users size={20} />
            <span>Network</span>
          </div>
          <div
            className={`${styles.navLink} ${pathname === "/messages" ? styles.activeNavLink : ""}`}
            onClick={() => router.push("/messages")}
          >
            <MessageSquare size={20} />
            <span>Messages</span>
          </div>
          <div
            className={`${styles.navLink} ${pathname === "/notifications" ? styles.activeNavLink : ""}`}
            onClick={() => router.push("/notifications")}
          >
            <Bell size={20} />
            <span>Notifications</span>
          </div>
        </nav>

        {/* Right Side: Profile Menu */}
        <div className={styles.rightNav} ref={dropdownRef}>
          <button
            className={styles.profileButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={currentUser.avatarUrl}
              alt={`${currentUser.firstName} ${currentUser.lastName}`}
              className={styles.avatar}
            />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownUser}>
                <div className={styles.dropdownName}>
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className={styles.dropdownEmail}>{currentUser.email}</div>
              </div>
              
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setDropdownOpen(false);
                  alert("Profile page coming soon!");
                }}
              >
                <UserIcon size={16} />
                <span>My Profile</span>
              </button>
              
              <button
                className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
