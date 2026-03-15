"use server";

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Создаём таблицу works, если её ещё нет
    await sql`
      CREATE TABLE IF NOT EXISTS works (
        id SERIAL PRIMARY KEY,
        unique_id TEXT NOT NULL, -- UUID для каждой записи
        work_id TEXT NOT NULL,
        date DATE NOT NULL,
        start_work TIME NOT NULL,
        end_work TIME NOT NULL,
        has_break BOOLEAN DEFAULT false,
        is_day_off BOOLEAN DEFAULT false,
        work_type TEXT DEFAULT 'packer'
      );
    `;

    return NextResponse.json({ success: true, message: "Table 'works' created successfully!" });
  } catch {
  return NextResponse.json({ success: false, error: "Internal Server Error" });
  }
}