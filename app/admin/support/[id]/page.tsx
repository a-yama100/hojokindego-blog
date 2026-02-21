"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { LoadingButton } from "@/components/LoadingButton";
import { MarkdownDisplay } from "@/components/MarkdownDisplay";
import { createClient } from '@/lib/supabase/client'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const supabase = createClient()

interface Attachment { id: string; file_name: string; file_url: string; file_size: number; file_type: string; }
interface Answer { id: string; body: string; created_at: string; admin_username: string; }
interface QuestionDetail { id: string; title: string; body: string; category: string; status: string; ai_response: string | null; is_public: boolean; username: string; created_at: string; answers: Answer[]; attachments: Attachment[]; }

export default function AdminAnswerPage() {
  const params = useParams();
  const questionId = params.id as string;
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getHeaders = async () => {
    const headers: Record<string, string> = {};
    const { data: { session } } = await supabase.auth.getSession();
    return headers;
  };

  const fetchQuestion = async () => {
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/support/questions/" + questionId, { headers });
      const data = await res.json();
      if (res.ok) setQuestion(data.question);
    } catch { setError("読み込み失敗"); } finally { setLoading(false); }
  };

  useEffect(() => { if (questionId) fetchQuestion(); }, [questionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess(""); setSubmitting(true);
    try {
      const res = await fetch("/api/support/questions/" + questionId + "/answer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: answerBody }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setSuccess("回答を投稿しました。ユーザーに通知しました。"); setAnswerBody(""); await fetchQuestion();
    } catch { setError("Network error"); } finally { setSubmitting(false); }
  };

  const handlePublish = async () => {
    setPublishing(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/support/questions/" + questionId + "/answer", { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setSuccess(data.message); await fetchQuestion();
    } catch { setError("Network error"); } finally { setPublishing(false); }
  };

  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo" });

  if (loading) return <Container><div className="py-16 text-center text-gray-500">Loading...</div></Container>;
  if (!question) return <Container><div className="py-16 text-center text-red-600">Question not found</div></Container>;

  return (
    <>
    <Header />
    <Container>
      <div className="py-8 max-w-3xl mx-auto">
        <Link href="/admin/support" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Back to Support Admin</Link>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{question.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{question.username} - {formatDateTime(question.created_at)} - {question.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={question.is_public ? "success" : "warning"} size="sm">{question.is_public ? "Public" : "Private"}</Badge>
            <Button variant={question.is_public ? "outline" : "primary"} size="sm" onClick={handlePublish} disabled={publishing}>
              {publishing ? "更新中..." : question.is_public ? "非公開にする" : "FAQに公開"}</Button>
          </div>
        </div>

        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Question</p>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{question.body}</div>
          {question.attachments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Attachments:</p>
              {question.attachments.map((att) => (
                <a key={att.id} href={att.file_url} target="_blank" rel="noopener noreferrer"
                  className="block text-xs text-blue-600 hover:underline">{att.file_name}</a>
              ))}
            </div>
          )}
        </div>

        {question.ai_response && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-600 mb-2">AI Preliminary Answer</p>
            <MarkdownDisplay content={question.ai_response} />
          </div>
        )}

        {question.answers.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Previous Answers</p>
            {question.answers.map((ans) => (
              <div key={ans.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-600 mb-1">{ans.admin_username} - {formatDateTime(ans.created_at)}</p>
                <MarkdownDisplay content={ans.body} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Post Expert Answer</h2>
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          {success && <p className="text-sm text-green-600 mb-2">{success}</p>}
          <form onSubmit={handleSubmit}>
            <textarea value={answerBody} onChange={(e) => setAnswerBody(e.target.value)}
              placeholder="回答を入力してください...（マークダウン対応）" rows={8} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 resize-vertical" />
            <div className="mt-3 flex justify-end">
              <LoadingButton loading={submitting} loadingText="投稿中...">Post Answer</LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </Container>
    <Footer />
    </>
  );
}
