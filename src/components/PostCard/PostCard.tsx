"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThumbsUp, MessageSquare, Globe, Lock, X, Edit3, Trash2 } from "lucide-react";
import { toggleLikePost, updatePost, deletePost, Post } from "@/redux/slices/feedSlice";
import { RootState } from "@/redux/store";
import Comments from "../Comments/Comments";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editPrivacy, setEditPrivacy] = useState(post.privacy);

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

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    dispatch(
      updatePost({
        id: post.id,
        content: editContent,
        privacy: editPrivacy,
      }) as any
    );
    setIsEditing(false);
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post.id) as any);
    }
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

        {/* Author Actions (Edit / Delete) */}
        {post.author.id === currentUser.id && (
          <div className={styles.authorActions}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.authorActionBtn}
              title="Edit Post"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={handleDeletePost}
              className={styles.authorActionBtnDanger}
              title="Delete Post"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Content Text - Truncated to 50 chars with ...more option */}
      {isEditing ? (
        <div className={styles.editForm}>
          <textarea
            className={styles.editTextarea}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className={styles.editActions}>
            <select
              className={styles.editPrivacySelect}
              value={editPrivacy}
              onChange={(e) => setEditPrivacy(e.target.value as "public" | "private")}
            >
              <option value="public">🌐 Public</option>
              <option value="private">🔒 Private</option>
            </select>
            <div className={styles.editButtonGroup}>
              <button onClick={handleSaveEdit} className={styles.saveBtn}>Save</button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                  setEditPrivacy(post.privacy);
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className={styles.content}>
          {post.content.length > 50 && !isExpanded ? (
            <>
              {post.content.slice(0, 50)}...
              <button
                onClick={() => setIsExpanded(true)}
                className={styles.moreBtn}
              >
                more
              </button>
            </>
          ) : (
            <>
              {post.content}
              {post.content.length > 50 && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className={styles.moreBtn}
                >
                  less
                </button>
              )}
            </>
          )}
        </p>
      )}

      {/* Content Image (if uploaded) */}
      {post.imageUrl && (
        <div className={styles.imageContainer} onClick={() => setImageModalOpen(true)}>
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

      {/* Full-Screen Image Lightbox Modal */}
      {imageModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setImageModalOpen(false)}>
          <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.imageCloseBtn} onClick={() => setImageModalOpen(false)}>
              <X size={20} />
            </button>
            <img src={post.imageUrl} alt="Post Attachment Full" className={styles.fullImage} />
          </div>
        </div>
      )}
    </article>
  );
}
