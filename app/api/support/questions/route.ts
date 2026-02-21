import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/authCheck";
import { createServiceClient } from '@/lib/supabase/server'
import { callAI } from "@/lib/aiProvider";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.CONTACT_EMAIL || "";

const MONTHLY_QUESTION_LIMITS: Record<string, number> = {
  free: 0,
  light: 3,
  standard: 5,
  premium: 10,
};

const CATEGORIES = [
  "general",
  "tools",
  "billing",
  "account",
  "workflow",
  "technical",
];

// GET: List questions with search, category filter, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const myOnly = searchParams.get("my") === "true";
    const offset = (page - 1) * limit;

    const supabaseAdmin = createServiceClient();

    let userId: string | null = null;
    try {
      const auth = await checkAuth(request);
      userId = auth.userId;
    } catch {
      userId = null;
    }

    let query = supabaseAdmin
      .from("support_questions")
      .select("id, title, body, category, status, ai_response, is_public, view_count, created_at, updated_at, user_id, users!inner(username)", { count: "exact" });

    // Filter: public OR own questions OR targeted to this user
    if (myOnly && userId) {
      query = query.or("user_id.eq." + userId + ",target_user_id.eq." + userId);
    } else if (!myOnly) {
      if (userId) {
        query = query.or("is_public.eq.true,user_id.eq." + userId + ",target_user_id.eq." + userId);
      } else {
        query = query.eq("is_public", true);
      }
    }

    if (search) {
      query = query.or("title.ilike.%" + search + "%,body.ilike.%" + search + "%");
    }

    if (category && CATEGORIES.includes(category)) {
      query = query.eq("category", category);
    }

    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    const { data: questions, error, count } = await query;

    if (error) {
      console.error("Questions fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }

    const questionIds = (questions || []).map((q: any) => q.id);
    let answerCounts: Record<string, number> = {};
    if (questionIds.length > 0) {
      const { data: answers } = await supabaseAdmin
        .from("support_answers")
        .select("question_id")
        .in("question_id", questionIds);
      if (answers) {
        for (const a of answers) {
          answerCounts[a.question_id] = (answerCounts[a.question_id] || 0) + 1;
        }
      }
    }

    const result = (questions || []).map((q: any) => ({
      ...q,
      username: q.users?.username || "Anonymous",
      answer_count: answerCounts[q.id] || 0,
    }));

    return NextResponse.json({
      questions: result,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Questions GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create question + AI first response + email notification
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAuth(request);

    if (!auth.isAuthenticated || !auth.userId) {
      return NextResponse.json(
        { error: "Please sign up or log in to ask a question", requiresLogin: true },
        { status: 401 }
      );
    }

    const supabaseAdmin = createServiceClient();

    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("plan_type, username")
      .eq("id", auth.userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const planType = userData.plan_type || "free";
    const monthlyLimit = MONTHLY_QUESTION_LIMITS[planType] || 0;

    if (monthlyLimit === 0) {
      return NextResponse.json(
        { error: "Free plan cannot submit questions. Please upgrade.", requiresUpgrade: true },
        { status: 403 }
      );
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const { count: usedCount } = await supabaseAdmin
      .from("support_questions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", auth.userId)
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd);

    const used = usedCount || 0;
    if (used >= monthlyLimit) {
      return NextResponse.json(
        { error: "Monthly question limit reached (" + monthlyLimit + "/" + monthlyLimit + "). Resets next month.", used, limit: monthlyLimit },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title, questionBody, category, attachmentUrls } = body;

    if (!title || !questionBody) {
      return NextResponse.json({ error: "Title and question are required" }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: "Title must be 200 characters or less" }, { status: 400 });
    }
    if (questionBody.length > 5000) {
      return NextResponse.json({ error: "Question must be 5000 characters or less" }, { status: 400 });
    }

    const safeCategory = CATEGORIES.includes(category) ? category : "general";

    let aiResponse = "";
    try {
      const aiPrompt = "You are a helpful support assistant. A user has submitted a support question in Japanese. " +
        "Provide a helpful preliminary answer in Japanese. Be concise and practical. " +
        "If you are not sure, say so and let them know a human admin will follow up.\n\n" +
        "Category: " + safeCategory + "\n" +
        "Title: " + title + "\n" +
        "Question: " + questionBody;
      aiResponse = await callAI("chatgpt", aiPrompt, 3);
    } catch (aiError) {
      console.error("AI response generation failed:", aiError);
      aiResponse = "Thank you for your question. Our team will review it shortly.";
    }

    const { data: question, error: insertError } = await supabaseAdmin
      .from("support_questions")
      .insert({
        user_id: auth.userId,
        title: title.trim(),
        body: questionBody.trim(),
        category: safeCategory,
        status: "ai_answered",
        ai_response: aiResponse,
        is_public: false,
      })
      .select("id, created_at")
      .single();

    if (insertError || !question) {
      console.error("Question insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit question" }, { status: 500 });
    }

    if (attachmentUrls && Array.isArray(attachmentUrls) && attachmentUrls.length > 0) {
      const attachments = attachmentUrls.slice(0, 3).map((att: any) => ({
        question_id: question.id,
        file_name: att.fileName,
        file_url: att.fileUrl,
        file_size: att.fileSize,
        file_type: att.fileType,
      }));
      await supabaseAdmin.from("support_attachments").insert(attachments);
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      const adminUrl = siteUrl + "/admin/support/" + question.id;
      const emailHtml = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">" +
        "<h2>New Support Question</h2>" +
        "<p><strong>From:</strong> " + (userData.username || "User") + " (" + planType + ")</p>" +
        "<p><strong>Category:</strong> " + safeCategory + "</p>" +
        "<p><strong>Title:</strong> " + title + "</p>" +
        "<div style=\"background: #f3f4f6; padding: 12px; border-radius: 6px;\">" + questionBody.substring(0, 500) + "</div>" +
        "<p style=\"margin: 20px 0;\">" +
        "<a href=\"" + adminUrl + "\" style=\"background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;\">Answer</a>" +
        "</p></div>";
      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: "Support <noreply@" + (siteUrl.replace("https://", "").replace("http://", "").replace("www.", "")) + ">",
          to: ADMIN_EMAIL,
          subject: "[Support] " + title.substring(0, 80),
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error("Admin notification email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      questionId: question.id,
      aiResponse,
      used: used + 1,
      limit: monthlyLimit,
      remaining: monthlyLimit - used - 1,
    });
  } catch (error) {
    console.error("Questions POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
