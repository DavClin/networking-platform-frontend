"use client";

import { useEffect, useState } from "react";
import { portfolioService } from "@/lib/portfolioService";
import { Button, Card, Input, Textarea, LoadingSpinner, EmptyState, ErrorBanner, Badge } from "@/components/ui";

const emptyForm = { title: "", description: "", url: "", image_url: "", technologies: "", completion_date: "" };

export default function PortfolioPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function load() {
    setLoading(true);
    portfolioService
      .myItems()
      .then(setItems)
      .catch((err) => setError(err.message || "Couldn't load your portfolio."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || "",
      url: item.url || "",
      image_url: item.image_url || "",
      technologies: (item.technologies || []).join(", "),
      completion_date: item.completion_date || "",
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      technologies: form.technologies
        ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      completion_date: form.completion_date || null,
    };
    try {
      if (editingId) {
        await portfolioService.update(editingId, payload);
      } else {
        await portfolioService.create(payload);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message || "Couldn't save this portfolio item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await portfolioService.remove(id);
      load();
    } catch (err) {
      setError(err.message || "Couldn't delete this item.");
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">My portfolio</h1>
        {!showForm && <Button onClick={startNew}>Add project</Button>}
      </div>

      <ErrorBanner message={error} />

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
            <Textarea
              label="Description"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Project URL" value={form.url} onChange={(e) => update("url", e.target.value)} />
              <Input label="Image URL" value={form.image_url} onChange={(e) => update("image_url", e.target.value)} />
            </div>
            <Input
              label="Technologies (comma separated)"
              placeholder="Python, FastAPI, MongoDB"
              value={form.technologies}
              onChange={(e) => update("technologies", e.target.value)}
            />
            <Input
              label="Completion date"
              type="date"
              value={form.completion_date}
              onChange={(e) => update("completion_date", e.target.value)}
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Save changes" : "Add project"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 && !showForm ? (
        <EmptyState
          title="No projects added yet"
          description="Add work samples so employers can see what you've built."
          action={<Button onClick={startNew}>Add your first project</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-ink">{item.title}</p>
                  {item.description && <p className="text-sm text-ink-soft mt-1">{item.description}</p>}
                  {item.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.technologies.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  )}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-sm text-indigo font-medium mt-2 inline-block">
                      View project →
                    </a>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(item)} className="text-xs font-medium text-ink-soft hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-danger hover:opacity-80">
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
