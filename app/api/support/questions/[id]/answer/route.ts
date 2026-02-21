import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/adminCheck";
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id: questionId } = await params;
    const { body: answerBody } = await request.json();

    if (!answerBody || answerBody.trim().length === 0) {
      return NextResponse.json({ error: "Answer body is required" }, { status: 400 });
    }
    if (answerBody.length > 10000) {
      return NextResponse.json({ error: "Answer must be 10000 characters or less" }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();

    const { data: question, error: qError } = await supabaseAdmin
      .from("support_questions")
      .select("id, title, user_id, status")
      .eq("id", questionId)
      .single();

    if (qError || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const { data: answer, error: insertError } = await supabaseAdmin
      .from("support_answers")
      .insert({
        question_id: questionId,
        admin_id: adminCheck.userId,
        body: answerBody.trim(),
      })
      .select("id, created_at")
      .single();

    if (insertError || !answer) {
      return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
    }

    await supabaseAdmin
      .from("support_questions")
      .update({ status: "answered", updated_at: new Date().toISOString() })
      .eq("id", questionId);

    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(question.user_id);
      const authorEmail = authUser?.user?.email;
      if (authorEmail) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
        const questionUrl = siteUrl + "/support/" + questionId;
        const emailHtml = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">" +
          "<h2>Your question was answered</h2>" +
          "<p><strong>" + question.title + "</strong></p>" +
          "<div style=\"background: #f3f4f6; padding: 12px; border-radius: 6px;\">" + answerBody.substring(0, 300) + "</div>" +
          "<p style=\"margin: 20px 0;\">" +
          "<a href=\"" + questionUrl + "\" style=\"background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;\">View Answer</a>" +
          "</p></div>";
        const domain = siteUrl.replace("https://", "").replace("http://", "").replace("www.", "");
        await resend.emails.send({
          from: "Support <noreply@" + domain + ">",
          to: authorEmail,
          subject: "Your question was answered: " + question.title.substring(0, 60),
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error("Author notification email failed:", emailError);
    }

    return NextResponse.json({ success: true, answerId: answer.id });
  } catch (error) {
    console.error("Answer POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH: Publish question as public FAQ (anonymized)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id: questionId } = await params;
    const supabaseAdmin = createServiceClient();

    const { data: question, error: qError } = await supabaseAdmin
      .from("support_questions")
      .select("id, is_public")
      .eq("id", questionId)
      .single();

    if (qError || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const newPublic = !question.is_public;
    await supabaseAdmin
      .from("support_questions")
      .update({ is_public: newPublic, updated_at: new Date().toISOString() })
      .eq("id", questionId);

    return NextResponse.json({
      success: true,
      is_public: newPublic,
      message: newPublic ? "Question published to public FAQ" : "Question set to private",
    });
  } catch (error) {
    console.error("Publish PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
