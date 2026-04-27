import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assessments = await prisma.assessmentResult.findMany({
      include: { user: true }
    });
    
    const surveys = await prisma.surveyResult.findMany({
      include: { user: true }
    });

    let csvContent = "Type,User Name,Gender,Campus,Total Score,Answers,Timestamp\n";

    assessments.forEach(a => {
      csvContent += `${a.type},${a.user.name},${a.user.gender},${a.user.campus},${a.totalScore},"${a.answersJson.replace(/"/g, '""')}",${a.createdAt}\n`;
    });

    surveys.forEach(s => {
      csvContent += `SURVEY-SUS,${s.user.name},${s.user.gender},${s.user.campus},${s.totalScore},"${s.answersJson.replace(/"/g, '""')}",${s.createdAt}\n`;
    });

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=hdap_raw_data.csv'
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
