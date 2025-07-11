import { NextResponse  } from "next/server";
import { cookies } from "next/headers";


export async function GET(){
  try{
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 200 });
    }


    const response = NextResponse.json(
      {
        success:true,
        message:"logout successfully"
      },
      {status:200}
    );


    response.cookies.delete("auth_token");
    return response;

  }
  catch(error){
    console.log("error in the logout backend --> ",error);
  }
}
