"use client";

import { useEffect, useState } from "react";
import { notificationService } from "@/lib/notificationService";
import { Button, Card, LoadingSpinner, EmptyState, ErrorBanner } from "@/components/ui";

const TYPE_LABELS = {
  connection_request: "Network",
  job_match: "Job match",
  message: "Message",
  application_status: "Application",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    notificationService
      .list()
      .then(setNotifications)
      .catch((err) => setError(err.message || "Couldn't load notifications."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleMarkRead(id) {
    try {
      await notificationService.markRead(id);
      setNotifications((current) => current.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      setError(err.message || "Couldn't update this notification.");
    }
  }

  async function handleMarkAllRead() {
    try {
      await notificationService.markAllRead();
      setNotifications((current) => current.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      setError(err.message || "Couldn't mark all as read.");
    }
  }

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">Notifications</h1>
        {hasUnread && (
          <Button variant="secondary" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="Connection requests, messages, and application updates will show up here." />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-4 flex items-start justify-between gap-4 ${!n.is_read ? "border-indigo/40 bg-indigo/5" : ""}`}
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-indigo uppercase tracking-wide mb-1">
                  {TYPE_LABELS[n.type] || n.type}
                </p>
                <p className={`text-sm ${!n.is_read ? "font-medium text-ink" : "text-ink-soft"}`}>{n.title}</p>
                {n.message && <p className="text-sm text-ink-soft mt-0.5">{n.message}</p>}
                <p className="text-xs text-ink-soft mt-1 font-data">{timeAgo(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="text-xs font-medium text-indigo whitespace-nowrap"
                >
                  Mark read
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
