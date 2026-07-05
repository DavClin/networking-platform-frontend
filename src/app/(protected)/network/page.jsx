"use client";

import { useEffect, useState } from "react";
import { connectionService } from "@/lib/connectionService";
import { Button, Card, Badge, Input, LoadingSpinner, EmptyState, ErrorBanner } from "@/components/ui";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Connections" },
];

export default function NetworkPage() {
  const [tab, setTab] = useState("pending");
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newUserId, setNewUserId] = useState("");

  async function load(statusFilter = tab) {
    setLoading(true);
    setError("");
    try {
      const data = await connectionService.list(statusFilter);
      setConnections(data);
    } catch (err) {
      setError(err.message || "Couldn't load your network.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleSendRequest(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await connectionService.send(newUserId.trim());
      setSuccess("Connection request sent.");
      setNewUserId("");
      if (tab === "pending") load();
    } catch (err) {
      setError(err.message || "Couldn't send that request.");
    }
  }

  async function handleRespond(connectionId, status) {
    try {
      await connectionService.respond(connectionId, status);
      load();
    } catch (err) {
      setError(err.message || "Couldn't update this connection.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Network</h1>

      <Card className="p-5">
        <p className="text-sm font-medium text-ink-soft mb-2">Send a connection request</p>
        <form onSubmit={handleSendRequest} className="flex gap-3">
          <Input
            placeholder="Paste a user ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
        <p className="text-xs text-ink-soft mt-2">
          Find a user ID from their public profile URL — full user search is coming soon.
        </p>
      </Card>

      {error && <ErrorBanner message={error} />}
      {success && <p className="text-sm text-signal">{success}</p>}

      <div className="flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-indigo text-ink" : "border-transparent text-ink-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : connections.length === 0 ? (
        <EmptyState
          title={tab === "pending" ? "No pending requests" : "No connections yet"}
          description="Send a request above to start building your network."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {connections.map((c) => (
            <Card key={c.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="font-data text-sm text-ink-soft">
                {c.requester_id} → {c.receiver_id}
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={c.status === "accepted" ? "signal" : "neutral"}>{c.status}</Badge>
                {tab === "pending" && (
                  <>
                    <Button variant="secondary" className="!px-3 !py-1 text-xs" onClick={() => handleRespond(c.id, "accepted")}>
                      Accept
                    </Button>
                    <Button variant="ghost" className="!px-3 !py-1 text-xs" onClick={() => handleRespond(c.id, "blocked")}>
                      Decline
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
