"use server";

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Создаём таблицу пользователей
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        work_status TEXT DEFAULT 'worker',
        work_id TEXT
      );
    `;



    return NextResponse.json({ success: true, message: "Tables created successfully!" });
  } catch {
   return NextResponse.json({ success: false, error: "Internal Server Error" });
  }
}