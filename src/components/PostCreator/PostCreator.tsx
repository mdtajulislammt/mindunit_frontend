"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image as ImageIcon, Globe, Lock, X, ChevronDown } from "lucide-react";
import { addPost } from "@/redux/slices/feedSlice";
import { RootState } from "@/redux/store";
import styles from "./PostCreator.module.css";

export default function PostCreator() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
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

  if (!currentUser) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = () => {
    if (!content.trim() && !image) return;

    dispatch(
      addPost({
        content,
        imageUrl: image || undefined,
        privacy,
        author: currentUser,
      })
    );

    setContent("");
    setImage(null);
    setPrivacy("public");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.creatorCard}>
      <div className={styles.inputSection}>
        <img
          src={currentUser.avatarUrl}
          alt={`${currentUser.firstName} ${currentUser.lastName}`}
          className={styles.avatar}
        />
        <textarea
          placeholder="Start a post, share your research or thoughts..."
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {image && (
        <div className={styles.previewContainer}>
          <img src={image} alt="Preview" className={styles.previewImage} />
          <button className={styles.removeImageBtn} onClick={removeImage}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.actionSection}>
        <div className={styles.leftActions}>
          <label className={styles.uploadLabel}>
            <ImageIcon size={18} />
            <span>Image</span>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </label>

          {/* Custom Privacy Dropdown */}
          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              className={`${styles.dropdownBtn} ${dropdownOpen ? styles.dropdownBtnActive : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {privacy === "public" ? (
                <>
                  <Globe size={13} className={styles.dropdownIcon} />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock size={13} className={styles.dropdownIcon} />
                  <span>Private</span>
                </>
              )}
              <ChevronDown size={13} style={{ opacity: 0.8 }} />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  className={`${styles.dropdownItem} ${privacy === "public" ? styles.dropdownItemActive : ""}`}
                  onClick={() => {
                    setPrivacy("public");
                    setDropdownOpen(false);
                  }}
                >
                  <Globe size={13} />
                  <span>Public</span>
                </button>
                <button
                  className={`${styles.dropdownItem} ${privacy === "private" ? styles.dropdownItemActive : ""}`}
                  onClick={() => {
                    setPrivacy("private");
                    setDropdownOpen(false);
                  }}
                >
                  <Lock size={13} />
                  <span>Private</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className={styles.postBtn}
          onClick={handlePost}
          disabled={!content.trim() && !image}
        >
          Post
        </button>
      </div>
    </div>
  );
}
