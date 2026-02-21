import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/adminCheck";
import { createServiceClient } from "@/lib/supabase/server"
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "otona AI Lab <noreply@ai-workhack.com>";
const SITE_URL = "https://www.ai-workhack.com";

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { targetUserId, title, body, category } = await request.json();

    if (!targetUserId || !title || !body) {
      return NextResponse.json({ error: "Target user, title, and body are required" }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();

    // Verify target user exists
    const { data: targetUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, username, email")
      .eq("id", targetUserId)
      .single();

    if (userError || !targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    // Insert as admin post targeted to specific user
    const { data: question, error: insertError } = await supabaseAdmin
      .from("support_questions")
      .insert({
        user_id: adminCheck.userId,
        target_user_id: targetUserId,
        title: title.trim(),
        body: body.trim(),
        category: category || "general",
        status: "answered",
        is_public: false,
        is_admin_post: true,
      })
      .select("id, created_at")
      .single();

    if (insertError || !question) {
      console.error("DM insert error:", insertError);
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
    }

    // Send email notification to target user
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
      const userEmail = authUser?.user?.email;

      if (userEmail) {
        const questionUrl = SITE_URL + "/support/" + question.id;
        const emailHtml = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">" +
          "<h2 style=\"color: #16a34a;\">otona AI Lab</h2>" +
          "<p>Hi " + (targetUser.username || "there") + ",</p>" +
          "<p>You have a new message from our support team:</p>" +
          "<p><strong>" + title + "</strong></p>" +
          "<div style=\"background: #f3f4f6; padding: 12px; border-radius: 6px; margin: 12px 0;\">" +
          body.substring(0, 300) + (body.length > 300 ? "..." : "") +
          "</div>" +
          "<p style=\"margin: 20px 0;\">" +
          "<a href=\"" + questionUrl + "\" style=\"background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;\">View Message</a>" +
          "</p>" +
          "<p>Best regards,<br>otona AI Lab Team</p>" +
          "</div>";

        await resend.emails.send({
          from: FROM_EMAIL,
          to: userEmail,
          subject: "[Support] " + title.substring(0, 80),
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error("DM notification email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      questionId: question.id,
      targetUsername: targetUser.username,
    });
  } catch (error) {
    console.error("DM POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
