import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, totalScore, answersJson } = await req.json();

    if (!userId || totalScore === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await prisma.surveyResult.create({
      data: {
        userId,
        totalScore,
        answersJson: JSON.stringify(answersJson)
      }
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error saving survey result:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const results = await prisma.surveyResult.findMany({
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
