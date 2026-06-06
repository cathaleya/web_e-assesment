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

    const pdiAnswers = pdi?.answersJson ? JSON.parse(pdi.answersJson) : null;
    const madelAnswers = madel?.answersJson ? JSON.parse(madel.answersJson) : null;

    let c1 = 4.0;
    let c2 = 4.2;
    let c3 = 3.8;
    let c4 = 3.5;
    let c5 = 4.0;

    if (madelAnswers) {
      let sumC1 = 0, sumC2 = 0, sumC3 = 0, sumC4 = 0, sumC5 = 0;
      for (let i = 0; i < 6; i++) sumC1 += madelAnswers[i] || 0;
      for (let i = 6; i < 12; i++) sumC2 += madelAnswers[i] || 0;
      for (let i = 12; i < 18; i++) sumC3 += madelAnswers[i] || 0;
      for (let i = 18; i < 24; i++) sumC4 += madelAnswers[i] || 0;
      for (let i = 24; i < 30; i++) sumC5 += madelAnswers[i] || 0;

      c1 = sumC1 / 6;
      c2 = sumC2 / 6;
      c3 = sumC3 / 6;
      c4 = sumC4 / 6;
      c5 = sumC5 / 6;
    }

    const stats = {
      preliminary: pdi?.totalScore || 0,
      pdiAnswers,
      madel5c: madel?.totalScore || 0,
      madelAnswers,
      surveyDone: user.surveys.length > 0,
      radar: [
        Math.round(c1 * 20),
        Math.round(c2 * 20),
        Math.round(c3 * 20),
        Math.round(c4 * 20),
        Math.round(c5 * 20)
      ]
    };

    return NextResponse.json({ user, stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

