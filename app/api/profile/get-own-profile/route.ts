"use server";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" });
    }

    // Получаем профиль по email
    const profiles = await sql`
      SELECT id, name, email, work_status, work_id
      FROM profiles
      WHERE email = ${email};
    `;

    if (profiles.length === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" });
    }

    return NextResponse.json({ success: true, profile: profiles[0] });
  } catch  {
  return NextResponse.json({ success: false, error: "Internal Server Error" });
  
  }
}