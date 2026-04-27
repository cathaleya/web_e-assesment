import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, totalScore, answersJson } = await req.json();

    if (!userId || totalScore === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await prisma.survey.create({
      data: {
        userId,
        totalScore,
        answersJson: JSON.stringify(answersJson)
      },
      include: { user: true }
    });

    // Real-time sync to Google Sheets
    try {
      const { syncToGoogleSheets } = await import('@/lib/googleSync');
      await syncToGoogleSheets({
        userId: result.userId,
        name: result.user.name,
        type: "SURVEY-SUS",
        score: result.totalScore,
        gender: result.user.gender,
        campus: result.user.campus,
        answers: answersJson
      });
    } catch (e) {
      console.error("Google Sheets sync failed:", e);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error saving survey result:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const results = await prisma.survey.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching survey results:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
