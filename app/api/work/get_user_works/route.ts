import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const profile = await sql`
      SELECT work_id
      FROM profiles
      WHERE email = ${email};
    `;

    if (!profile[0]) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userWorkId = profile[0].work_id;

    const userWorks = await sql`
      SELECT *
      FROM works
      WHERE work_id = ${userWorkId}
      ORDER BY date DESC;
    `;

    return NextResponse.json({ success: true, works: userWorks });
  } catch  {

    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
