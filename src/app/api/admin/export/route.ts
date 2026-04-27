import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const surveys = await prisma.survey.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    // Create a wide format CSV
    // Columns: Timestamp, UserID, Name, Gender, Campus, Instrument, TotalScore, Q1, Q2, ..., Q30
    let csvContent = "Timestamp,UserID,Name,Gender,Campus,Instrument,TotalScore";
    
    // Max 30 questions for wide format
    for(let i=1; i<=30; i++) {
        csvContent += `,Q${i}`;
    }
    csvContent += "\n";

    assessments.forEach(a => {
      let row = `${new Date(a.createdAt).toISOString()},${a.userId},"${a.user.name}",${a.user.gender},"${a.user.campus}",${a.type},${a.totalScore}`;
      
      let answers: any = {};
      try {
        answers = JSON.parse(a.answersJson);
      } catch (e) {
        // Fallback for non-json
        answers = {};
      }

      // Fill in question columns
      for(let i=0; i<30; i++) {
          const val = answers[i] !== undefined ? answers[i] : "";
          row += `,${val}`;
      }
      csvContent += row + "\n";
    });

    surveys.forEach(s => {
      let row = `${new Date(s.createdAt).toISOString()},${s.userId},"${s.user.name}",${s.user.gender},"${s.user.campus}",SURVEY-SUS,${s.totalScore}`;
      
      let answers: any = {};
      try {
        answers = typeof s.answersJson === 'string' ? JSON.parse(s.answersJson) : s.answersJson;
      } catch (e) {
        answers = {};
      }

      // SUS usually has 10 items
      for(let i=0; i<30; i++) {
          const val = answers[i] !== undefined ? answers[i] : "";
          row += `,${val}`;
      }
      csvContent += row + "\n";
    });

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=HDAP_Export_${new Date().toISOString().split('T')[0]}.csv`
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
