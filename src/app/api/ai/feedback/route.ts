import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY || "";
  let userData: any = null;
  
  try {
    userData = await prisma.user.findUnique({
      where: { id: userId },
      include: { assessments: true }
    });

    if (!userData) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const pdi = userData.assessments.find((a: any) => a.type === 'PDI-DL');
    const madel = userData.assessments.find((a: any) => a.type === 'MADEL5C');
    
    if (!apiKey) {
      return NextResponse.json({ 
        message: `Selamat datang, ${userData.name}! Silakan selesaikan instrumen PDI-DL untuk melihat hasil diagnosis literasi digital Anda.` 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Anda adalah Asisten Pakar Diagnostik Literasi Digital UNJ. 
      Berikan pesan selamat datang yang sangat singkat (maksimal 2 kalimat) untuk user bernama ${userData.name}.
      
      Konteks Progres:
      - PDI-DL: ${pdi ? `Selesai dengan skor ${pdi.totalScore}` : 'Belum dikerjakan'}
      - MADEL5C: ${madel ? `Selesai dengan skor ${madel.totalScore}` : 'Belum dikerjakan'}
      
      Gunakan gaya bahasa formal, cerdas, dan memotivasi. 
      Jika belum mengerjakan PDI-DL, ajak dia untuk segera memulainya sebagai langkah awal diagnosis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ 
      message: `Selamat datang kembali, ${userData?.name || 'User'}! Mari lanjutkan perjalanan literasi digital Anda hari ini.` 
    });
  }
}
