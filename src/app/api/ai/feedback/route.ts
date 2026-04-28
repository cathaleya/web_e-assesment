import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

interface AssessmentData {
  type: string;
  totalScore: number;
}

interface UserWithAssessments {
  id: string;
  name: string;
  assessments: AssessmentData[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY || "";
  let userData: UserWithAssessments | null = null;
  
  try {
    const rawUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { assessments: true }
    });

    if (!rawUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    userData = rawUser as unknown as UserWithAssessments;

    const pdi = userData.assessments.find((a) => a.type === 'PDI-DL');
    const madel = userData.assessments.find((a) => a.type === 'MADEL5C');
    
    if (!apiKey) {
      return NextResponse.json({ 
        message: `Halo ${userData.name}! Selesaikan semua tahap untuk mendapatkan diagnosis AI.` 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (pdi && madel) {
      prompt = `
        Anda adalah Pakar Psikometrika Digital UNJ.
        Berikan diagnosis singkat (maks 3 kalimat) untuk ${userData.name} yang telah menyelesaikan seluruh instrumen.
        Skor PDI-DL: ${pdi.totalScore}
        Skor MADEL5C: ${madel.totalScore}
        
        Berikan pujian jika skor tinggi, atau saran perbaikan jika skor rendah. 
        Gunakan gaya bahasa akademik yang memotivasi dan sangat ringkas.
      `;
    } else {
      prompt = `
        Sapa ${userData.name} dan ajak dia menyelesaikan seluruh instrumen (PDI-DL, Survey, MADEL5C) 
        agar AI dapat memetakan profil literasi digitalnya secara akurat. Maks 2 kalimat.
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ 
      message: `Selamat datang, ${userData?.name || 'User'}! Selesaikan instrumen Anda untuk diagnosis AI.` 
    });
  }
}
