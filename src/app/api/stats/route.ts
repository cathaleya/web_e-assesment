import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: returns counts for the landing page stats widget
export async function GET() {
  try {
    const [totalUsers, totalAssessments, totalSurveys] = await Promise.all([
      prisma.user.count(),
      prisma.assessment.count(),
      prisma.survey.count(),
    ]);

    // Get registrations per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const dailyMap: Record<string, number> = {};
    recentUsers.forEach(u => {
      const d = u.createdAt.toISOString().split('T')[0];
      dailyMap[d] = (dailyMap[d] || 0) + 1;
    });

    // Build last 7 days array
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      daily.push({ date: key, count: dailyMap[key] || 0 });
    }

    return NextResponse.json({
      totalUsers,
      totalAssessments,
      totalSurveys,
      daily
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
