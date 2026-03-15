// app/api/work/clean_works/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1️⃣ Получаем профиль по email
    const profileResult = await sql`
      SELECT id, work_id
      FROM profiles
      WHERE email = ${email}
    `;

    const profiles = profileResult as { id: number; work_id: string }[];

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const userProfile = profiles[0];
    const workId = userProfile.work_id; // строка

    if (!workId) {
      return NextResponse.json({ message: 'No work_id for this profile' });
    }

    // 2️⃣ Удаляем все работы старше 45 дней
    // Преобразуем text -> date с помощью ::date
const deleteResult = await sql`
  DELETE FROM works
  WHERE work_id = ${workId}
    AND TO_DATE(date, 'YYYY-MM-DD') < CURRENT_DATE - INTERVAL '45 days'
  RETURNING id
`;

    const deletedWorks = deleteResult as { id: number }[];

    return NextResponse.json({ message: `Deleted ${deletedWorks.length} old works` });
  } catch {
    console.error("Error in clean_works:");
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}