"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import Header from "@/components/Header/Header";
import styles from "./messages.module.css";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatThread {
  userId: string;
  messages: Message[];
}

const initialMockChats = (currentUserId: string): ChatThread[] => [
  {
    userId: "user-1", // Sarah
    messages: [
      {
        id: "m1",
        senderId: "user-1",
        text: "Hi! I saw your interest in the design tokens mapping. Do you have any suggestions on the alias tokens classification?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "m2",
        senderId: currentUserId,
        text: "Hi Dr. Sarah! It looks very clear. I suggest adding custom descriptions so students understand component specifications better.",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "m3",
        senderId: "user-1",
        text: "That is a great suggestion. I will incorporate that in the next revision of the tokens layout. Let's touch base soon!",
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
    ],
  },
  {
    userId: "user-2", // Rahat
    messages: [
      {
        id: "m4",
        senderId: "user-2",
        text: "Hello! Are you attending the upcoming Neuroscience seminar next week?",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
  },
];

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, users } = useSelector((state: RootState) => state.auth);
  
  const [mounted, setMounted] = useState(false);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Set mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect route
  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, router, mounted]);

  // Set initial mock chats
  useEffect(() => {
    if (currentUser) {
      setChatThreads(initialMockChats(currentUser.id));
    }
  }, [currentUser]);

  // Handle URL query param: e.g. /messages?user=user-1
  useEffect(() => {
    if (mounted && currentUser) {
      const userParam = searchParams.get("user");
      if (userParam) {
        setActiveUserId(userParam);
        
        // If thread doesn't exist, create an empty one
        setChatThreads((prev) => {
          const exists = prev.find((t) => t.userId === userParam);
          if (!exists) {
            return [...prev, { userId: userParam, messages: [] }];
          }
          return prev;
        });
      } else if (chatThreads.length > 0 && !activeUserId) {
        // Default to first chat thread if no user query param
        setActiveUserId(chatThreads[0].userId);
      }
    }
  }, [searchParams, chatThreads, activeUserId, mounted, currentUser]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [activeUserId, chatThreads]);

  if (!mounted || !currentUser) {
    return (
      <div className={styles.loadingOverlay} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ fontFamily: "var(--font-family)" }}>Loading Messages...</p>
      </div>
    );
  }

  // Get active chat metadata
  const activeUser = users.find((u) => u.id === activeUserId);
  const activeThread = chatThreads.find((t) => t.userId === activeUserId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUserId) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.userId === activeUserId) {
          return {
            ...thread,
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );

    setNewMessage("");
  };

  // Helper to get thread list details
  const threadListDetails = chatThreads.map((thread) => {
    const user = users.find((u) => u.id === thread.userId);
    const lastMsg = thread.messages[thread.messages.length - 1];
    return {
      userId: thread.userId,
      user,
      lastMessageText: lastMsg ? lastMsg.text : "No messages yet",
    };
  }).filter((item) => item.user !== undefined);

  return (
    <div style={{ backgroundColor: "var(--bg-color)", minHeight: "100vh" }}>
      <Header />
      <main className={styles.container}>
        <div className={styles.messagesCard}>
          {/* Left Panel: Threads List */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>Messaging</div>
            <div className={styles.threadList}>
              {threadListDetails.map((item) => (
                <button
                  key={item.userId}
                  className={`${styles.threadItem} ${activeUserId === item.userId ? styles.threadItemActive : ""}`}
                  onClick={() => router.push(`/messages?user=${item.userId}`)}
                >
                  <img
                    src={item.user!.avatarUrl}
                    alt={item.user!.firstName}
                    className={styles.threadAvatar}
                  />
                  <div className={styles.threadMeta}>
                    <span className={styles.threadName}>
                      {item.user!.firstName} {item.user!.lastName}
                    </span>
                    <span className={styles.threadLastMsg}>{item.lastMessageText}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Active Chat */}
          <div className={styles.chatPane}>
            {activeUser && activeThread ? (
              <>
                <div className={styles.chatHeader}>
                  <img
                    src={activeUser.avatarUrl}
                    alt={activeUser.firstName}
                    className={styles.chatHeaderAvatar}
                  />
                  <div className={styles.chatHeaderInfo}>
                    <span className={styles.chatHeaderName}>
                      {activeUser.firstName} {activeUser.lastName}
                    </span>
                    <span className={styles.chatHeaderHeadline}>{activeUser.headline}</span>
                  </div>
                </div>

                <div className={styles.chatArea} ref={chatAreaRef}>
                  {activeThread.messages.length === 0 ? (
                    <div className={styles.emptyChat}>
                      <span>No messages yet. Send a message to start the conversation!</span>
                    </div>
                  ) : (
                    activeThread.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${styles.messageBubble} ${msg.senderId === currentUser.id ? styles.sentMsg : styles.receivedMsg}`}
                      >
                        {msg.text}
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className={styles.chatInput}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.emptyChat}>
                <span>Select a conversation to read or write messages.</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
