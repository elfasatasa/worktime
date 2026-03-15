// app/api/work/edit_work/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db"; // neon подключение

interface RequestBody {
  email: string;
  work_id: string;
  date?: string;
  start_work?: string;
  end_work?: string;
  has_break?: boolean;
  is_day_off?: boolean;
  work_type?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { email, work_id, date, start_work, end_work, has_break, is_day_off, work_type } = body;

    if (!email || !work_id) {
      return NextResponse.json({ success: false, error: "Email и work_id обязательны" }, { status: 400 });
    }

    // Найдем work_id из профиля на всякий случай
    const profile = await sql`
      SELECT work_id
      FROM profiles
      WHERE email = ${email};
    `;

    if (!profile[0]) {
      return NextResponse.json({ success: false, error: "Пользователь не найден" }, { status: 404 });
    }

    // Обновляем запись в works
    const updatedWork = await sql`
      UPDATE works
      SET
        date = COALESCE(${date}, date),
        start_work = COALESCE(${start_work}, start_work),
        end_work = COALESCE(${end_work}, end_work),
        has_break = COALESCE(${has_break}, has_break),
        is_day_off = COALESCE(${is_day_off}, is_day_off),
        work_type = COALESCE(${work_type}, work_type)
      WHERE work_id = ${work_id}
      RETURNING *;
    `;

    if (!updatedWork[0]) {
      return NextResponse.json({ success: false, error: "Смена не найдена" }, { status: 404 });
    }

    return NextResponse.json({ success: true, work: updatedWork[0] });
  } catch {
    
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
