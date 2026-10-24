"use client";

import { useNotification } from "./NotificationContext";

const styles = {
  success: "border-green-600 bg-green-50 text-green-800",
  error: "border-red-600 bg-red-50 text-red-800",
};

export default function NotificationBanner() {
  const { notification } = useNotification();

  if (!notification) {
    return null;
  }

  return (
    <div
      role={notification.type === "error" ? "alert" : "status"}
      className={`mx-auto mt-4 w-[calc(100%-2rem)] max-w-184 rounded-md border border-l-4 border-border bg-surface px-4 py-3 text-foreground shadow-sm ${styles[notification.type]}`}
    >
      {notification.message}
    </div>
  );
}
