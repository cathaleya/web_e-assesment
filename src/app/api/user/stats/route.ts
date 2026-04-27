import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assessments: true,
        survey: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate specific stats
    const preliminary = user.assessments.find(a => a.type === 'PDI-DL')?.totalScore || 0;
    const madel5c = user.assessments.find(a => a.type === 'MADEL5C')?.totalScore || 0;
    
    // Mock radar data for now based on scores
    const radar = [
      Math.min(5, (preliminary / 20)), 
      Math.min(5, (madel5c / 30)),
      user.survey ? 5 : 0,
      4, // Placeholder for other metrics
      3  // Placeholder for other metrics
    ];

    return NextResponse.json({
      user: {
        name: user.name,
        campus: user.campus,
        gender: user.gender
      },
      stats: {
        preliminary,
        madel5c,
        radar
      }
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
