"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessageOnOpen: (message: string) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  sendMessageOnModalOpen: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const CHAT_OPEN_STORAGE_KEY = "chat-assistant-open";

export function ChatProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage, default to true if not found
  const [isOpen, setIsOpen] = useState(() => {
    try {
      const storedValue = localStorage.getItem(CHAT_OPEN_STORAGE_KEY);
      if (storedValue === null) return true; // Default to true if key doesn't exist
      return storedValue === "true";
    } catch {
      return true; // Fallback to default if localStorage reading fails
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasMounted = useRef(false);

  // Update localStorage when state changes (but not on initial mount)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    try {
      localStorage.setItem(CHAT_OPEN_STORAGE_KEY, isOpen.toString());
    } catch (error) {
      console.error("Failed to save chat state to localStorage:", error);
    }
  }, [isOpen]);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessageOnOpen = useCallback((message: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pendingChatMessage", message);
    }
    setIsOpen(true);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const sendMessageOnModalOpen = useCallback((message: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pendingChatMessage", message);
    }
    setIsModalOpen(true);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        sendMessageOnOpen,
        isModalOpen,
        openModal,
        closeModal,
        sendMessageOnModalOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
