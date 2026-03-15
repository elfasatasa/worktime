import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, date } = body;

    if (!email || !date) {
      return NextResponse.json(
        { error: "Email и дата обязательны" },
        { status: 400 }
      );
    }

    // Получаем work_id пользователя
    const profile = await sql`
      SELECT work_id
      FROM profiles
      WHERE email = ${email}
    `;

    if (!profile.length) {
      return NextResponse.json(
        { error: "Профиль не найден" },
        { status: 404 }
      );
    }

    const userWorkId = profile[0].work_id;

    // значения по умолчанию
    const start_work = body.start_work ?? "00:00";
    const end_work = body.end_work ?? "00:00";
    const has_break = body.has_break ?? false;
    const is_day_off = body.is_day_off ?? false;
    const work_type = body.work_type ?? "0";

    // добавляем запись с уникальным id
    const newWorkRows = await sql`
      INSERT INTO works (
        unique_id,
        work_id,
        date,
        start_work,
        end_work,
        has_break,
        is_day_off,
        work_type
      )
      VALUES (
        gen_random_uuid(),
        ${userWorkId},
        ${date},
        ${start_work},
        ${end_work},
        ${has_break},
        ${is_day_off},
        ${work_type}
      )
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      work: newWorkRows[0],
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}