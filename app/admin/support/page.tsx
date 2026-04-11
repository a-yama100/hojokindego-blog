"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { LoadingButton } from "@/components/LoadingButton";

interface Question {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  username: string;
  answer_count: number;
  is_admin_post: boolean;
  target_user_id: string | null;
}

interface UserResult {
  id: string;
  username: string;
  email: string;
  plan_type: string;
}

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "primary" | "success" | "warning" | "error" }> = {
  pending: { label: "Pending", variant: "error" },
  ai_answered: { label: "AI Only", variant: "warning" },
  answered: { label: "Answered", variant: "success" },
  closed: { label: "Closed", variant: "default" },
};

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "tools", label: "Tools" },
  { value: "billing", label: "Billing" },
  { value: "account", label: "Account" },
  { value: "workflow", label: "Workflow" },
  { value: "technical", label: "Technical" },
];

export default function AdminSupportPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("needs_answer");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // DM form state
  const [showDmForm, setShowDmForm] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [dmTitle, setDmTitle] = useState("");
  const [dmBody, setDmBody] = useState("");
  const [dmCategory, setDmCategory] = useState("general");
  const [dmSending, setDmSending] = useState(false);
  const [dmSuccess, setDmSuccess] = useState("");
  const [dmError, setDmError] = useState("");
  const [searching, setSearching] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "20" });
      const res = await fetch("/api/support/questions?" + params.toString());
      const data = await res.json();
      if (res.ok) {
        let filtered = data.questions || [];
        if (filter === "needs_answer") {
          filtered = filtered.filter((q: Question) => q.status === "pending" || q.status === "ai_answered");
        } else if (filter !== "all") {
          filtered = filtered.filter((q: Question) => q.status === filter);
        }
        setQuestions(filtered);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, filter]);

  // User search with debounce
  useEffect(() => {
    if (userSearch.length < 2) {
      setUserResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch("/api/admin/users?search=" + encodeURIComponent(userSearch));
        const data = await res.json();
        if (res.ok) {
          setUserResults(data.users || []);
        }
      } catch {
        // ignore
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  const handleSelectUser = (user: UserResult) => {
    setSelectedUser(user);
    setUserSearch("");
    setUserResults([]);
  };

  const handleSendDm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setDmSending(true);
    setDmError("");
    setDmSuccess("");
    try {
      const res = await fetch("/api/admin/support/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUser.id,
          title: dmTitle,
          body: dmBody,
          category: dmCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDmError(data.error || "Failed to send");
        return;
      }
      setDmSuccess("Message sent to " + (data.targetUsername || selectedUser.username) + " successfully!");
      setDmTitle("");
      setDmBody("");
      setSelectedUser(null);
      setDmCategory("general");
      fetchQuestions();
    } catch {
      setDmError("Network error");
    } finally {
      setDmSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      timeZone: "Asia/Manila",
    });
  };

  return (
    <Container>
      <div className="py-8">
        <SectionHeader title="Support Admin" subtitle="Review and answer support questions, or send direct messages to members." />

        {/* DM Toggle Button */}
        <div className="mt-4 flex justify-end">
          <Button
            variant={showDmForm ? "outline" : "primary"}
            size="sm"
            onClick={() => { setShowDmForm(!showDmForm); setDmSuccess(""); setDmError(""); }}
          >
            {showDmForm ? "Hide Message Form" : "Send Direct Message"}
          </Button>
        </div>

        {/* DM Form */}
        {showDmForm && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Send Direct Message to Member</h3>

            {dmError && <p className="text-sm text-red-600 mb-2">{dmError}</p>}
            {dmSuccess && <p className="text-sm text-green-600 mb-2">{dmSuccess}</p>}

            {/* User Search */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Recipient</label>
              {selectedUser ? (
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-900 font-medium">{selectedUser.username}</span>
                  <span className="text-xs text-gray-500">({selectedUser.email})</span>
                  <Badge variant="default" size="sm">{selectedUser.plan_type}</Badge>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="ml-auto text-gray-400 hover:text-red-500 text-sm cursor-pointer"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by username or email (min 2 chars)..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                  />
                  {searching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
                  {userResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {userResults.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSelectUser(u)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm cursor-pointer"
                          type="button"
                        >
                          <span className="font-medium text-gray-900">{u.username}</span>
                          <span className="text-gray-500 text-xs">{u.email}</span>
                          <Badge variant="default" size="sm">{u.plan_type}</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSendDm}>
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={dmCategory}
                  onChange={(e) => setDmCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={dmTitle}
                  onChange={(e) => setDmTitle(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="Message title..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={dmBody}
                  onChange={(e) => setDmBody(e.target.value)}
                  required
                  rows={6}
                  maxLength={10000}
                  placeholder="Write your message... (Markdown supported)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 resize-vertical"
                />
              </div>

              <div className="flex justify-end">
                <LoadingButton
                  loading={dmSending}
                  loadingText="Sending..."
                  disabled={!selectedUser}
                >
                  Send Message
                </LoadingButton>
              </div>
            </form>
          </div>
        )}

        {/* Filter tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { value: "needs_answer", label: "Needs Answer" },
            { value: "answered", label: "Answered" },
            { value: "closed", label: "Closed" },
            { value: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={
                "px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer " +
                (filter === f.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200")
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Question list */}
        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No questions found.</div>
          ) : (
            questions.map((q) => {
              const statusInfo = STATUS_BADGE[q.status] || STATUS_BADGE.pending;
              return (
                <Link
                  key={q.id}
                  href={"/admin/support/" + q.id}
                  className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-green-300 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {q.is_admin_post && (
                          <Badge variant="primary" size="sm">DM</Badge>
                        )}
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{q.title}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {q.username} - {formatDate(q.created_at)} - {q.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
              Previous
            </Button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
