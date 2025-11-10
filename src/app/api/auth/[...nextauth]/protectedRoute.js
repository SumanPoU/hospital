import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { options } from "../[...nextauth]/options";

export async function GET(req) {
  const session = await getServerSession(options);

  if (session?.user) {
    return NextResponse.json(session.user, { status: 200 });
  }

  return NextResponse.json({ message: "User not found" }, { status: 400 });
}

