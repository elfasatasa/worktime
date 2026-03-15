// app/api/work/delete_work/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db"; // neon подключение

interface RequestBody {
  email: string;
  unique_id: string;
}

export async function POST(req: Request) {
  try {
    const { email, unique_id } = (await req.json()) as RequestBody;

    if (!email || !unique_id) {
      return NextResponse.json({ success: false, error: "Email и unique_id обязательны" }, { status: 400 });
    }

    // Проверяем, что этот unique_id принадлежит пользователю
    const profile = await sql`
      SELECT work_id
      FROM profiles
      WHERE email = ${email};
    `;

    if (!profile[0]) {
      return NextResponse.json({ success: false, error: "Пользователь не найден" }, { status: 404 });
    }

    // Удаляем запись из works
    const deleted = await sql`
      DELETE FROM works
      WHERE unique_id = ${unique_id}
      RETURNING *;
    `;

    if (!deleted[0]) {
      return NextResponse.json({ success: false, error: "Смена не найдена" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Смена успешно удалена", work: deleted[0] });
  } catch {
  
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
