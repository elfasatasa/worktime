"use server";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json({ success: false, error: "Email and name required" });
    }

    // Проверяем, есть ли уже такой пользователь
    const existingUser = await sql`
      SELECT id FROM profiles WHERE email = ${email};
    `;

    if (existingUser.length > 0) {
      return NextResponse.json({ success: true, message: "User already exists" });
    }

    // Генерируем work_id
    const work_id = randomUUID();

    // Добавляем в таблицу
    await sql`
      INSERT INTO profiles (name, email, work_id)
      VALUES (${name}, ${email}, ${work_id});
    `;

    return NextResponse.json({ success: true, message: "User created", work_id });
  } catch  {
   
    return NextResponse.json({ success: false, error: "Internal Server Error" });
  }
}