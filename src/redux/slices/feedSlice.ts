import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./authSlice";

export interface Reply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: string[]; // user IDs
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: string[]; // user IDs
  replies: Reply[];
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  privacy: "public" | "private";
  createdAt: string;
  likes: string[]; // user IDs
  comments: Comment[];
}

interface FeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api";

const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
};

// Base64 helper
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Async Thunks
export const fetchPosts = createAsyncThunk(
  "feed/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch posts");
      }
      return data; // list of posts
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error fetching feed");
    }
  }
);

export const createPost = createAsyncThunk(
  "feed/createPost",
  async (
    payload: { content: string; privacy: "public" | "private"; image?: string | null },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const formData = new FormData();
      formData.append("content", payload.content);
      formData.append("privacy", payload.privacy);

      if (payload.image) {
        const blob = dataURLtoBlob(payload.image);
        formData.append("image", blob, "post_image.png");
      }

      const response = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to create post");
      }
      return data; // returns newly created post
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error creating post");
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  "feed/toggleLikePost",
  async (payload: { postId: string; userId: string }, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/posts/${payload.postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to toggle post like");
      }
      return { postId: payload.postId, userId: payload.userId, liked: data.liked };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error liking post");
    }
  }
);

export const addCommentToPost = createAsyncThunk(
  "feed/addComment",
  async (payload: { postId: string; content: string }, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/posts/${payload.postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: payload.content }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to add comment");
      }
      return { postId: payload.postId, comment: data };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error adding comment");
    }
  }
);

export const addReplyToComment = createAsyncThunk(
  "feed/addReply",
  async (
    payload: { postId: string; commentId: string; content: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(
        `${API_BASE}/posts/${payload.postId}/comments/${payload.commentId}/replies`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: payload.content }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to add reply");
      }
      return { postId: payload.postId, commentId: payload.commentId, reply: data };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error adding reply");
    }
  }
);

export const toggleLikeComment = createAsyncThunk(
  "feed/toggleLikeComment",
  async (
    payload: { postId: string; commentId: string; userId: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/comments/${payload.commentId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to toggle comment like");
      }
      return {
        postId: payload.postId,
        commentId: payload.commentId,
        userId: payload.userId,
        liked: data.liked,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error liking comment");
    }
  }
);

export const toggleLikeReply = createAsyncThunk(
  "feed/toggleLikeReply",
  async (
    payload: { postId: string; commentId: string; replyId: string; userId: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/replies/${payload.replyId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to toggle reply like");
      }
      return {
        postId: payload.postId,
        commentId: payload.commentId,
        replyId: payload.replyId,
        userId: payload.userId,
        liked: data.liked,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error liking reply");
    }
  }
);

export const updatePost = createAsyncThunk(
  "feed/updatePost",
  async (
    payload: { id: string; content?: string; privacy?: "public" | "private"; image?: string | null },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const formData = new FormData();
      if (payload.content !== undefined) {
        formData.append("content", payload.content);
      }
      if (payload.privacy !== undefined) {
        formData.append("privacy", payload.privacy);
      }
      if (payload.image) {
        const blob = dataURLtoBlob(payload.image);
        formData.append("image", blob, "post_image_updated.png");
      }

      const response = await fetch(`${API_BASE}/posts/${payload.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update post");
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error updating post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "feed/deletePost",
  async (postId: string, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete post");
      }
      return postId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error deleting post");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "feed/deleteComment",
  async (payload: { postId: string; commentId: string }, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/comments/${payload.commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete comment");
      }
      return { postId: payload.postId, commentId: payload.commentId };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error deleting comment");
    }
  }
);

export const deleteReply = createAsyncThunk(
  "feed/deleteReply",
  async (
    payload: { postId: string; commentId: string; replyId: string },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as any;
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token available");

    try {
      const response = await fetch(`${API_BASE}/replies/${payload.replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete reply");
      }
      return { postId: payload.postId, commentId: payload.commentId, replyId: payload.replyId };
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error deleting reply");
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // Toggle Like Post
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, userId, liked } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          const index = post.likes.indexOf(userId);
          if (liked && index === -1) {
            post.likes.push(userId);
          } else if (!liked && index > -1) {
            post.likes.splice(index, 1);
          }
        }
      })

      // Add Comment
      .addCase(addCommentToPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
        }
      })

      // Add Reply
      .addCase(addReplyToComment.fulfilled, (state, action) => {
        const { postId, commentId, reply } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          const comment = post.comments?.find((c) => c.id === commentId);
          if (comment) {
            if (!comment.replies) comment.replies = [];
            comment.replies.push(reply);
          }
        }
      })

      // Toggle Like Comment
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        const { postId, commentId, userId, liked } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          const comment = post.comments?.find((c) => c.id === commentId);
          if (comment) {
            const index = comment.likes.indexOf(userId);
            if (liked && index === -1) {
              comment.likes.push(userId);
            } else if (!liked && index > -1) {
              comment.likes.splice(index, 1);
            }
          }
        }
      })

      // Toggle Like Reply
      .addCase(toggleLikeReply.fulfilled, (state, action) => {
        const { postId, commentId, replyId, userId, liked } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          const comment = post.comments?.find((c) => c.id === commentId);
          if (comment) {
            const reply = comment.replies?.find((r) => r.id === replyId);
            if (reply) {
              const index = reply.likes.indexOf(userId);
              if (liked && index === -1) {
                reply.likes.push(userId);
              } else if (!liked && index > -1) {
                reply.likes.splice(index, 1);
              }
            }
          }
        }
      })

      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      })

      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.comments = post.comments.filter((c) => c.id !== commentId);
        }
      })

      // Delete Reply
      .addCase(deleteReply.fulfilled, (state, action) => {
        const { postId, commentId, replyId } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          const comment = post.comments?.find((c) => c.id === commentId);
          if (comment) {
            comment.replies = comment.replies.filter((r) => r.id !== replyId);
          }
        }
      });
  },
});

export default feedSlice.reducer;
