// app/api/work/get_user_works/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db"; // neon подключение

interface RequestBody {
  email: string;
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as RequestBody;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // 1️⃣ Находим work_id по email из таблицы profiles
    const profile = await sql`
      SELECT work_id
      FROM profiles
      WHERE email = ${email};
    `;

    if (!profile[0]) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userWorkId = profile[0].work_id;

    // 2️⃣ Находим все записи work для этого work_id
    const userWorks = await sql`
      SELECT *
      FROM works
      WHERE work_id = ${userWorkId}
      ORDER BY date DESC;
    `;

    return NextResponse.json({ success: true, works: userWorks });
  } catch  {
    return NextResponse.json({ error: "Internal Server Error" }); }
}
