import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/authCheck";
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const supabaseAdmin = createServiceClient();

    let userId: string | null = null;
    try {
      const auth = await checkAuth(request);
      userId = auth.userId;
    } catch {
      userId = null;
    }

    const { data: question, error } = await supabaseAdmin
      .from("support_questions")
      .select("*, users!inner(username)")
      .eq("id", questionId)
      .single();

    if (error || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (!question.is_public && question.user_id !== userId && question.target_user_id !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await supabaseAdmin
      .from("support_questions")
      .update({ view_count: (question.view_count || 0) + 1 })
      .eq("id", questionId);

    const { data: answers } = await supabaseAdmin
      .from("support_answers")
      .select("*, users!admin_id(username)")
      .eq("question_id", questionId)
      .order("created_at", { ascending: true });

    const { data: attachments } = await supabaseAdmin
      .from("support_attachments")
      .select("*")
      .eq("question_id", questionId)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      question: {
        ...question,
        username: question.users?.username || "Anonymous",
        answers: (answers || []).map((a: any) => ({
          ...a,
          admin_username: a.users?.username || "Admin",
        })),
        attachments: attachments || [],
      },
      isOwner: question.user_id === userId,
    }, {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" },
    });
  } catch (error) {
    console.error("Question GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
