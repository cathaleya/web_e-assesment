import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assessments: true,
        surveys: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const pdi = user.assessments.find((a) => a.type === "PDI-DL");
    const madel = user.assessments.find((a) => a.type === "MADEL5C");

    const stats = {
      preliminary: pdi?.totalScore || 0,
      pdiAnswers: pdi?.answersJson ? JSON.parse(pdi.answersJson) : null,
      madel5c: madel?.totalScore || 0,
      madelAnswers: madel?.answersJson ? JSON.parse(madel.answersJson) : null,
      surveyDone: user.surveys.length > 0,
      radar: [
        (pdi?.totalScore || 0) / 10,
        (madel?.totalScore || 0) / 10,
        3, 4, 2 // Dummy for other dimensions
      ]
    };

    return NextResponse.json({ user, stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
