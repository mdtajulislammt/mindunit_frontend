"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addCommentToPost, 
  toggleLikeComment, 
  addReplyToComment, 
  toggleLikeReply 
} from "@/redux/slices/feedSlice";
import { RootState } from "@/redux/store";
import styles from "./Comments.module.css";

interface CommentsProps {
  postId: string;
  comments: any[];
}

export default function Comments({ postId, comments }: CommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  if (!currentUser) return null;

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

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(
      addCommentToPost({
        postId,
        content: commentText,
      }) as any
    );
    setCommentText("");
  };

  const handlePostReply = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    dispatch(
      addReplyToComment({
        postId,
        commentId,
        content: replyText,
      }) as any
    );
    setReplyText("");
    setActiveReplyId(null);
  };

  return (
    <div className={styles.container}>
      {/* Add Comment Input */}
      <form onSubmit={handlePostComment} className={styles.inputSection}>
        <img
          src={currentUser.avatarUrl}
          alt={`${currentUser.firstName} ${currentUser.lastName}`}
          className={styles.avatar}
        />
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Add a comment..."
            className={styles.input}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className={styles.commentBtn}
            disabled={!commentText.trim()}
          >
            Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className={styles.commentsList}>
        {comments.map((comment) => {
          const isCommentLiked = comment.likes?.includes(currentUser.id);
          return (
            <div key={comment.id} className={styles.commentItem}>
              <img
                src={comment.author.avatarUrl}
                alt={`${comment.author.firstName} ${comment.author.lastName}`}
                className={styles.avatar}
              />
              <div className={styles.commentBody}>
                <div className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <span className={styles.authorName}>
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span className={styles.time}>{handleTimeAgo(comment.createdAt)}</span>
                  </div>
                  <div className={styles.authorHeadline}>{comment.author.headline}</div>
                  <p className={styles.commentText}>{comment.content}</p>
                </div>

                {/* Comment Actions */}
                <div className={styles.actionsRow}>
                  <button
                    className={`${styles.actionBtn} ${isCommentLiked ? styles.likedActionBtn : ""}`}
                    onClick={() =>
                      dispatch(
                        toggleLikeComment({
                          postId,
                          commentId: comment.id,
                          userId: currentUser.id,
                        }) as any
                      )
                    }
                  >
                    Like ({comment.likes?.length || 0})
                  </button>
                  <span className={styles.time}>|</span>
                  <button
                    className={styles.actionBtn}
                    onClick={() => {
                      setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                      setReplyText("");
                    }}
                  >
                    Reply
                  </button>
                </div>

                {/* Indented Replies Section */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className={styles.repliesContainer}>
                    {comment.replies.map((reply: any) => {
                      const isReplyLiked = reply.likes?.includes(currentUser.id);
                      return (
                        <div key={reply.id} className={styles.replyItem}>
                          <img
                            src={reply.author.avatarUrl}
                            alt={`${reply.author.firstName} ${reply.author.lastName}`}
                            className={styles.avatar}
                          />
                          <div className={styles.replyBody}>
                            <div className={styles.replyCard}>
                              <div className={styles.commentHeader}>
                                <span className={styles.authorName}>
                                  {reply.author.firstName} {reply.author.lastName}
                                </span>
                                <span className={styles.time}>
                                  {handleTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <div className={styles.authorHeadline}>{reply.author.headline}</div>
                              <p className={styles.commentText}>{reply.content}</p>
                            </div>
                            <div className={styles.actionsRow}>
                              <button
                                className={`${styles.actionBtn} ${isReplyLiked ? styles.likedActionBtn : ""}`}
                                onClick={() =>
                                  dispatch(
                                    toggleLikeReply({
                                      postId,
                                      commentId: comment.id,
                                      replyId: reply.id,
                                      userId: currentUser.id,
                                    }) as any
                                  )
                                }
                              >
                                Like ({reply.likes?.length || 0})
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Inline Reply Input */}
                {activeReplyId === comment.id && (
                  <form
                    onSubmit={(e) => handlePostReply(e, comment.id)}
                    className={styles.replyInputSection}
                  >
                    <img
                      src={currentUser.avatarUrl}
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                      className={styles.avatar}
                    />
                    <input
                      type="text"
                      placeholder="Reply to this comment..."
                      className={styles.replyInput}
                      autoFocus
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className={styles.replySubmitBtn}
                      disabled={!replyText.trim()}
                    >
                      Reply
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
