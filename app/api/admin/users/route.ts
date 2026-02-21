import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/adminCheck";
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin(request);
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    if (search.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const supabaseAdmin = createServiceClient();

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, username, email, plan_type")
      .or("username.ilike.%" + search + "%,email.ilike.%" + search + "%")
      .order("username")
      .limit(20);

    if (error) {
      console.error("User search error:", error);
      return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error("User search GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
