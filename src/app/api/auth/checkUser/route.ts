import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as {
      id: number;
      username: string;
      email: string;
    };

    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, username, email, phone FROM users WHERE id = $1",
      [decodedToken.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    return NextResponse.json({
      message: "User verified successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("error in checkUser --> ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
