import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to escape values in CSV to handle quotes, commas, and newlines safely
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const instrument = searchParams.get('instrument') || 'all';

    let csvContent = "";
    let filename = "";

    if (instrument === 'madel5c') {
      const assessments = await prisma.assessment.findMany({
        where: { type: 'MADEL5C' },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });

      // Header: Timestamp, UserID, Name, Gender, Campus, TotalScore, Q1, Q2, ..., Q25
      let header = ["Timestamp", "UserID", "Name", "Gender", "Campus", "TotalScore"];
      for (let i = 1; i <= 25; i++) {
        header.push(`Q${i}`);
      }
      csvContent += header.join(",") + "\n";

      assessments.forEach(a => {
        let row = [
          new Date(a.createdAt).toISOString(),
          a.userId,
          a.user.name,
          a.user.gender,
          a.user.campus,
          a.totalScore
        ].map(escapeCsvValue);

        let answers: any = {};
        try {
          answers = JSON.parse(a.answersJson);
        } catch (e) {
          answers = {};
        }

        for (let i = 0; i < 25; i++) {
          const val = answers[i] !== undefined ? answers[i] : "";
          row.push(escapeCsvValue(val));
        }

        csvContent += row.join(",") + "\n";
      });

      filename = `HDAP_Export_MADEL5C_${new Date().toISOString().split('T')[0]}.csv`;

    } else if (instrument === 'pdi-dl') {
      const assessments = await prisma.assessment.findMany({
        where: { type: 'PDI-DL' },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });

      // Header: Timestamp, UserID, Name, Gender, Campus, TotalScore, Q1, Q2, ..., Q8
      let header = ["Timestamp", "UserID", "Name", "Gender", "Campus", "TotalScore"];
      for (let i = 1; i <= 8; i++) {
        header.push(`Q${i}`);
      }
      csvContent += header.join(",") + "\n";

      assessments.forEach(a => {
        let row = [
          new Date(a.createdAt).toISOString(),
          a.userId,
          a.user.name,
          a.user.gender,
          a.user.campus,
          a.totalScore
        ].map(escapeCsvValue);

        let answers: any = {};
        try {
          answers = JSON.parse(a.answersJson);
        } catch (e) {
          answers = {};
        }

        for (let i = 0; i < 8; i++) {
          const val = answers[i] !== undefined ? answers[i] : "";
          row.push(escapeCsvValue(val));
        }

        csvContent += row.join(",") + "\n";
      });

      filename = `HDAP_Export_PDI-DL_${new Date().toISOString().split('T')[0]}.csv`;

    } else if (instrument === 'sus') {
      const surveys = await prisma.survey.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });

      // Header: Timestamp, UserID, Name, Gender, Campus, TotalScore, Q1, Q2, ..., Q10, Feedback
      let header = ["Timestamp", "UserID", "Name", "Gender", "Campus", "TotalScore"];
      for (let i = 1; i <= 10; i++) {
        header.push(`Q${i}`);
      }
      header.push("Feedback");
      csvContent += header.join(",") + "\n";

      surveys.forEach(s => {
        let row = [
          new Date(s.createdAt).toISOString(),
          s.userId,
          s.user.name,
          s.user.gender,
          s.user.campus,
          s.totalScore
        ].map(escapeCsvValue);

        let answers: any = {};
        try {
          answers = typeof s.answersJson === 'string' ? JSON.parse(s.answersJson) : s.answersJson;
        } catch (e) {
          answers = {};
        }

        for (let i = 0; i < 10; i++) {
          const val = answers[i] !== undefined ? answers[i] : "";
          row.push(escapeCsvValue(val));
        }

        row.push(escapeCsvValue((s as any).feedback ?? ''));

        csvContent += row.join(",") + "\n";
      });

      filename = `HDAP_Export_SUS_${new Date().toISOString().split('T')[0]}.csv`;

    } else {
      // Default: 'all' combined wide format
      const assessments = await prisma.assessment.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
      
      const surveys = await prisma.survey.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });

      // Header: Timestamp, UserID, Name, Gender, Campus, Instrument, TotalScore, Q1, Q2, ..., Q30, Feedback
      let header = ["Timestamp", "UserID", "Name", "Gender", "Campus", "Instrument", "TotalScore"];
      for (let i = 1; i <= 30; i++) {
        header.push(`Q${i}`);
      }
      header.push("Feedback");
      csvContent += header.join(",") + "\n";

      assessments.forEach(a => {
        let row = [
          new Date(a.createdAt).toISOString(),
          a.userId,
          a.user.name,
          a.user.gender,
          a.user.campus,
          a.type,
          a.totalScore
        ].map(escapeCsvValue);

        let answers: any = {};
        try {
          answers = JSON.parse(a.answersJson);
        } catch (e) {
          answers = {};
        }

        for (let i = 0; i < 30; i++) {
          const val = answers[i] !== undefined ? answers[i] : "";
          row.push(escapeCsvValue(val));
        }

        row.push(''); // Feedback column is empty for assessments

        csvContent += row.join(",") + "\n";
      });

      surveys.forEach(s => {
        let row = [
          new Date(s.createdAt).toISOString(),
          s.userId,
          s.user.name,
          s.user.gender,
          s.user.campus,
          "SURVEY-SUS",
          s.totalScore
        ].map(escapeCsvValue);

        let answers: any = {};
        try {
          answers = typeof s.answersJson === 'string' ? JSON.parse(s.answersJson) : s.answersJson;
        } catch (e) {
          answers = {};
        }

        for (let i = 0; i < 30; i++) {
          const val = answers[i] !== undefined ? answers[i] : "";
          row.push(escapeCsvValue(val));
        }

        row.push(escapeCsvValue((s as any).feedback ?? ''));

        csvContent += row.join(",") + "\n";
      });

      filename = `HDAP_Export_All_${new Date().toISOString().split('T')[0]}.csv`;
    }

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=${filename}`
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
