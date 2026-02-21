import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/authCheck";
import { uploadToR2 } from "@/lib/r2Upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 3;
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf", "text/plain", "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAuth(request);
    if (!auth.isAuthenticated || !auth.userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: "Maximum " + MAX_FILES + " files allowed" }, { status: 400 });
    }

    const uploadedFiles: Array<{
      fileName: string;
      fileUrl: string;
      fileSize: number;
      fileType: string;
    }> = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File " + file.name + " exceeds 5MB limit" }, { status: 400 });
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "File type not allowed: " + file.type }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = "support/" + auth.userId + "/" + Date.now() + "-" + safeName;
      const fileUrl = await uploadToR2(buffer, key, file.type);
      uploadedFiles.push({ fileName: file.name, fileUrl, fileSize: file.size, fileType: file.type });
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
