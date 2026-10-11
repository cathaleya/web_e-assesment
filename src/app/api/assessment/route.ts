import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { userId, type, totalScore, answersJson } = await req.json();

    if (!userId || !type || totalScore === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await prisma.assessment.create({
      data: {
        userId,
        type,
        totalScore,
        answersJson: JSON.stringify(answersJson)
      },
      include: { user: true }
    });

    // If .reset_flag exists, remove it because live user activity is happening
    try {
      const resetFlagPath = path.join(process.cwd(), 'public', 'analysis', 'outputs', '.reset_flag');
      if (fs.existsSync(resetFlagPath)) {
        fs.unlinkSync(resetFlagPath);
      }
    } catch (e) {}

    // Real-time sync to Google Sheets
    try {
      const { syncToGoogleSheets } = await import('@/lib/googleSync');
      await syncToGoogleSheets({
        userId: result.userId,
        name: result.user.name,
        type: result.type,
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
    console.error('Error saving assessment result:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const userId = searchParams.get('userId');

  try {
    const results = await prisma.assessment.findMany({
      where: userId ? { userId } : (type ? { type } : {}),
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(results, { 
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (error) {
    console.error('Error fetching assessment results:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
