import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch all users including their assessments and surveys
    const users = await prisma.user.findMany({
      include: {
        assessments: true,
        surveys: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
