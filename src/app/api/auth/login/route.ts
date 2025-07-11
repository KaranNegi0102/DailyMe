import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";
import jwt from "jsonwebtoken";

export async function POST(req:NextRequest){
  try{
    const {email,password} = await req.json();


    const client = await pool.connect();

    const result = await client.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email,password]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = result.rows[0];

    const tokenPayload = {
      id:user.id,
      username: user.username,
      password: user.password, 
      email: user.email,
      phone: user.phone,
    }

    const token = jwt.sign(tokenPayload,process.env.SECRET_KEY!,
      {expiresIn: "7d", algorithm:"HS256"})


    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    })

    response.cookies.set({
      name:"auth_token",
      value:token,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    })

    return response;

  }
  catch(error){
    console.log("the error in login route in next js is -> ",error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}