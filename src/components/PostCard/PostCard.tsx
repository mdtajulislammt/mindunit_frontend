"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThumbsUp, MessageSquare, Globe, Lock, X } from "lucide-react";
import { toggleLikePost, Post } from "@/redux/slices/feedSlice";
import { RootState } from "@/redux/store";
import Comments from "../Comments/Comments";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { currentUser, users } = useSelector((state: RootState) => state.auth);

  if (!currentUser) return null;

  const isLiked = post.likes.includes(currentUser.id);

  // Map user details who liked the post
  const likedUsersDetails = post.likes.map((likeUserId) => {
    if (likeUserId === currentUser.id) return currentUser;
    return users.find((u) => u.id === likeUserId);
  }).filter(Boolean);

  const handleTimeAgo = (dateStr: string) => {
    const elapsed = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  };

  return (
    <article className={styles.postCard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.authorSection}>
          <img
            src={post.author.avatarUrl}
            alt={`${post.author.firstName} ${post.author.lastName}`}
            className={styles.avatar}
          />
          <div className={styles.authorMeta}>
            <span className={styles.authorName}>
              {post.author.firstName} {post.author.lastName}
            </span>
            <span className={styles.authorHeadline}>{post.author.headline}</span>
            <div className={styles.postMeta}>
              <span className={styles.metaItem}>{handleTimeAgo(post.createdAt)}</span>
              <span>•</span>
              <span className={styles.metaItem}>
                <span className={styles.privacyBadge}>
                  {post.privacy === "public" ? (
                    <>
                      <Globe size={10} style={{ marginRight: 4 }} /> Public
                    </>
                  ) : (
                    <>
                      <Lock size={10} style={{ marginRight: 4 }} /> Private
                    </>
                  )}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Text */}
      <p className={styles.content}>{post.content}</p>

      {/* Content Image (if uploaded) */}
      {post.imageUrl && (
        <div className={styles.imageContainer}>
          <img src={post.imageUrl} alt="Post Attachment" className={styles.postImage} />
        </div>
      )}

      {/* Engagement Stats */}
      <div className={styles.statsRow}>
        <div className={styles.likeCount} onClick={() => { if (post.likes.length > 0) setLikesModalOpen(true); }}>
          <ThumbsUp size={14} style={{ color: "var(--primary-color)" }} />
          <span>{post.likes.length} {post.likes.length === 1 ? "like" : "likes"}</span>
        </div>
        <div className={styles.commentCount}>
          <span>{post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionsRow}>
        <button
          className={`${styles.actionBtn} ${isLiked ? styles.activeLikeBtn : ""}`}
          onClick={() => dispatch(toggleLikePost({ postId: post.id, userId: currentUser.id }) as any)}
        >
          <ThumbsUp size={18} fill={isLiked ? "var(--primary-color)" : "none"} />
          <span>Like</span>
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => setCommentsOpen(!commentsOpen)}
        >
          <MessageSquare size={18} />
          <span>Comment</span>
        </button>
      </div>

      {/* Comments Area */}
      {commentsOpen && <Comments postId={post.id} comments={post.comments} />}

      {/* Likes Modal Popup */}
      {likesModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setLikesModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Likes</h3>
              <button className={styles.closeBtn} onClick={() => setLikesModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {likedUsersDetails.map((user: any) => (
                <div key={user.id} className={styles.likedUser}>
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className={styles.likedUserAvatar}
                  />
                  <div className={styles.likedUserInfo}>
                    <div className={styles.likedUserName}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className={styles.likedUserHeadline}>{user.headline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
