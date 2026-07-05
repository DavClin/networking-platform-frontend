"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { messageService } from "@/lib/messageService";
import { Button, Input, Card, LoadingSpinner, EmptyState, ErrorBanner } from "@/components/ui";

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newRecipientId, setNewRecipientId] = useState("");

  function loadConversations() {
    setLoading(true);
    messageService
      .conversations()
      .then(setConversations)
      .catch((err) => setError(err.message || "Couldn't load conversations."))
      .finally(() => setLoading(false));
  }

  useEffect(loadConversations, []);

  function otherPartyId(message) {
    return message.sender_id === user.id ? message.receiver_id : message.sender_id;
  }

  async function openThread(partnerId) {
    setActivePartnerId(partnerId);
    setThreadLoading(true);
    try {
      const messages = await messageService.thread(partnerId);
      setThread(messages.reverse());
    } catch (err) {
      setError(err.message || "Couldn't load this conversation.");
    } finally {
      setThreadLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const receiverId = activePartnerId || newRecipientId.trim();
    if (!receiverId || !newMessage.trim()) return;
    try {
      await messageService.send({ receiver_id: receiverId, body: newMessage.trim() });
      setNewMessage("");
      setNewRecipientId("");
      await openThread(receiverId);
      loadConversations();
    } catch (err) {
      setError(err.message || "Couldn't send that message.");
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Messages</h1>
      <ErrorBanner message={error} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-2">
          {conversations.length === 0 ? (
            <p className="text-sm text-ink-soft">No conversations yet.</p>
          ) : (
            conversations.map((m) => {
              const partnerId = otherPartyId(m);
              return (
                <button
                  key={m.id}
                  onClick={() => openThread(partnerId)}
                  className={`text-left p-3 rounded-xl border transition-colors ${
                    activePartnerId === partnerId ? "border-indigo bg-indigo/5" : "border-line hover:border-indigo/50"
                  }`}
                >
                  <p className="font-data text-xs text-ink-soft truncate">{partnerId}</p>
                  <p className="text-sm text-ink truncate mt-0.5">{m.body}</p>
                </button>
              );
            })
          )}
        </div>

        <div className="md:col-span-2">
          <Card className="p-5 flex flex-col gap-4 min-h-[24rem]">
            {activePartnerId ? (
              <>
                <p className="font-data text-xs text-ink-soft">Conversation with {activePartnerId}</p>
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-96">
                  {threadLoading ? (
                    <LoadingSpinner />
                  ) : (
                    thread.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                          m.sender_id === user.id
                            ? "self-end bg-indigo text-white"
                            : "self-start bg-paper text-ink"
                        }`}
                      >
                        {m.body}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <EmptyState title="Start a new message" description="Select a conversation or enter a user ID below." />
            )}

            <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-line">
              {!activePartnerId && (
                <Input
                  placeholder="Recipient user ID"
                  value={newRecipientId}
                  onChange={(e) => setNewRecipientId(e.target.value)}
                  className="max-w-[10rem]"
                />
              )}
              <Input
                placeholder="Write a message…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
