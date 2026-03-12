"use server";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { work_id, newStatus } = await req.json();

    if (!work_id || !newStatus) {
      return NextResponse.json({ success: false, error: "work_id and newStatus required" });
    }

    // Обновляем work_status
    const updated = await sql`
      UPDATE profiles
      SET work_status = ${newStatus}
      WHERE work_id = ${work_id}
      RETURNING id, name, email, work_status, work_id;
    `;

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" });
    }

    return NextResponse.json({ success: true, profile: updated[0] });
  } catch  {
  return NextResponse.json({ success: false, error: "Internal Server Error" });
  }
}