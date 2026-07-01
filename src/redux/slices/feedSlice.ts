import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
}

// Generate the "Design Tokens" chart SVG matching the user's provided mockup
const designTokensSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 550" width="100%" height="100%" style="background:%23f8fafc; border-radius:12px; font-family:'Comic Sans MS', cursive, sans-serif;"><rect width="500" height="550" fill="%23ffffff" rx="12" stroke="%23e2e8f0" stroke-width="1"/><text x="250" y="50" font-size="28" font-weight="800" fill="%23008051" text-anchor="middle">Design Tokens</text><g transform="translate(100, 90)"><rect width="300" height="45" rx="6" fill="%23008051" /><text x="15" y="28" font-size="14" font-weight="bold" fill="white">%23008051</text><text x="285" y="28" font-size="14" font-weight="bold" fill="white" text-anchor="end">Value</text></g><path d="M 250 135 L 250 170" stroke="%2394a3b8" stroke-dasharray="4 4" stroke-width="2" marker-end="url(%23arrow)"/><g transform="translate(100, 170)"><rect width="300" height="45" rx="6" fill="%23e6f3ee" stroke="%23008051" stroke-width="1" /><text x="15" y="28" font-size="14" font-weight="bold" fill="%23008051">green-500</text><text x="285" y="28" font-size="12" fill="%2364748b" text-anchor="end">Global Token</text></g><path d="M 250 215 L 250 250" stroke="%2394a3b8" stroke-dasharray="4 4" stroke-width="2"/><g transform="translate(100, 250)"><rect width="300" height="45" rx="6" fill="%23e6f2f1" stroke="%23008077" stroke-width="1" /><text x="15" y="28" font-size="14" font-weight="bold" fill="%23008077">accent-color-900</text><text x="285" y="28" font-size="12" fill="%2364748b" text-anchor="end">Alias Token</text></g><path d="M 250 295 L 250 330" stroke="%2394a3b8" stroke-dasharray="4 4" stroke-width="2"/><g transform="translate(100, 330)"><rect width="300" height="45" rx="6" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="1" /><text x="15" y="28" font-size="13" font-weight="600" fill="%23475569">accent-background-color-default</text></g><path d="M 250 375 L 250 410" stroke="%2394a3b8" stroke-dasharray="4 4" stroke-width="2"/><g transform="translate(175, 410)"><rect width="150" height="40" rx="20" fill="%23008051" /><text x="75" y="25" font-size="14" font-weight="bold" fill="white" text-anchor="middle">Button</text></g><text x="250" y="485" font-size="12" fill="%2394a3b8" text-anchor="middle">Component Specific Token</text><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="%2394a3b8"/></marker></defs></svg>`;

const initialPosts: Post[] = [
  {
    id: "post-1",
    author: {
      id: "user-1",
      firstName: "Sarah",
      lastName: "Rahman",
      email: "sarah@mindunite.org",
      headline: "Cognitive Neuroscientist | Professor at DU | Brain Research lead",
      avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23008051"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">SR</text></svg>`,
      connectionsCount: 342,
    },
    content: "Excited to share the updated design token mapping for the MindUnite components! Implementing a unified token structure allows us to build a highly customizable and themeable UI system easily. Take a look at the relationship mapping below:",
    imageUrl: designTokensSvg,
    privacy: "public",
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9h ago
    likes: ["user-2", "user-3"],
    comments: [
      {
        id: "comment-1",
        author: {
          id: "user-2",
          firstName: "Rahat",
          lastName: "Islam",
          email: "rahat@mindunite.org",
          headline: "Psychology Student at RU | Aspiring Neuro-therapist",
          avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%230a7e8c"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">RI</text></svg>`,
          connectionsCount: 89,
        },
        content: "This makes so much sense, Dr. Sarah! It simplifies how components resolve dynamic styling properties. Really clean diagram.",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        likes: ["user-1"],
        replies: [
          {
            id: "reply-1",
            author: {
              id: "user-1",
              firstName: "Sarah",
              lastName: "Rahman",
              email: "sarah@mindunite.org",
              headline: "Cognitive Neuroscientist | Professor at DU | Brain Research lead",
              avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23008051"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">SR</text></svg>`,
              connectionsCount: 342,
            },
            content: "Thanks, Rahat! The next step is mapping these variables inside our Tailwind-free CSS variables system directly.",
            createdAt: new Date(Date.now() - 7.5 * 60 * 60 * 1000).toISOString(),
            likes: ["user-2"],
          },
        ],
      },
    ],
  },
  {
    id: "post-2",
    author: {
      id: "user-3",
      firstName: "Fahmida",
      lastName: "Yeasmin",
      email: "fahmida@mindunite.org",
      headline: "Clinical Psychologist | Mental Health Counselor & Wellness Coach",
      avatarUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%238c0a5b"/><text x="50" y="55" font-family="'Comic Sans MS', cursive, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">FY</text></svg>`,
      connectionsCount: 195,
    },
    content: "Quick reminder: mindfulness isn't about clearing your mind completely. It's about developing a new relationship with your thoughts—one of non-judgmental observation. Try taking 3 conscious breaths next time you feel overwhelmed today. 🧠✨",
    privacy: "public",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12h ago
    likes: ["user-1"],
    comments: [],
  },
];

const initialState: FeedState = {
  posts: initialPosts,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addPost: (
      state,
      action: PayloadAction<{ content: string; imageUrl?: string; privacy: "public" | "private"; author: User }>
    ) => {
      const { content, imageUrl, privacy, author } = action.payload;
      const newPost: Post = {
        id: `post-${Date.now()}`,
        author,
        content,
        imageUrl,
        privacy,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
      };
      state.posts.unshift(newPost); // Newest First
    },
    toggleLikePost: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex > -1) {
          post.likes.splice(likeIndex, 1); // Unlike
        } else {
          post.likes.push(userId); // Like
        }
      }
    },
    addCommentToPost: (
      state,
      action: PayloadAction<{ postId: string; content: string; author: User }>
    ) => {
      const { postId, content, author } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          author,
          content,
          createdAt: new Date().toISOString(),
          likes: [],
          replies: [],
        };
        post.comments.push(newComment);
      }
    },
    toggleLikeComment: (state, action: PayloadAction<{ postId: string; commentId: string; userId: string }>) => {
      const { postId, commentId, userId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const comment = post.comments.find((c) => c.id === commentId);
        if (comment) {
          const likeIndex = comment.likes.indexOf(userId);
          if (likeIndex > -1) {
            comment.likes.splice(likeIndex, 1);
          } else {
            comment.likes.push(userId);
          }
        }
      }
    },
    addReplyToComment: (
      state,
      action: PayloadAction<{ postId: string; commentId: string; content: string; author: User }>
    ) => {
      const { postId, commentId, content, author } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const comment = post.comments.find((c) => c.id === commentId);
        if (comment) {
          const newReply: Reply = {
            id: `reply-${Date.now()}`,
            author,
            content,
            createdAt: new Date().toISOString(),
            likes: [],
          };
          comment.replies.push(newReply);
        }
      }
    },
    toggleLikeReply: (
      state,
      action: PayloadAction<{ postId: string; commentId: string; replyId: string; userId: string }>
    ) => {
      const { postId, commentId, replyId, userId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const comment = post.comments.find((c) => c.id === commentId);
        if (comment) {
          const reply = comment.replies.find((r) => r.id === replyId);
          if (reply) {
            const likeIndex = reply.likes.indexOf(userId);
            if (likeIndex > -1) {
              reply.likes.splice(likeIndex, 1);
            } else {
              reply.likes.push(userId);
            }
          }
        }
      }
    },
  },
});

export const {
  addPost,
  toggleLikePost,
  addCommentToPost,
  toggleLikeComment,
  addReplyToComment,
  toggleLikeReply,
} = feedSlice.actions;

export default feedSlice.reducer;
