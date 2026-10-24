"use client";

import { createContext, useContext, useRef, useState } from "react";

type NotificationType = "success" | "error";

type NotificationData = {
  message: string;
  type: NotificationType;
};

type NotificationContextValue = {
  notification: NotificationData | null;
  showNotification: (message: string, type?: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<NotificationData | null>(
    null,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNotification(
    message: string,
    type: NotificationType = "success",
  ) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({ message, type });

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used inside a NotificationProvider.",
    );
  }

  return context;
}
