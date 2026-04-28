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

  const apiKey = process.env.GEMINI_API_KEY ?? '';
  let userData: UserWithAssessments | null = null;

  try {
    const rawUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { assessments: true }
    });

    if (!rawUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    userData = rawUser as unknown as UserWithAssessments;

    const pdi  = userData.assessments.find((a) => a.type === 'PDI-DL');
    const madel = userData.assessments.find((a) => a.type === 'MADEL5C');

    // Jika API key belum diset, kembalikan pesan statis
    if (!apiKey) {
      const baseMsg = (pdi && madel)
        ? `Halo ${userData.name}! Skor PDI-DL Anda ${pdi.totalScore} dan MADEL5C ${madel.totalScore}. ` +
          `Hubungi peneliti untuk mendapatkan diagnosis lengkap.`
        : `Halo ${userData.name}! Selesaikan semua tahap asesmen agar sistem dapat memetakan profil literasi digital Anda secara akurat.`;
      return NextResponse.json({ message: baseMsg });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Gunakan gemini-2.0-flash sebagai model utama, fallback ke 1.5-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt = '';
    if (pdi && madel) {
      const pdiLabel  = pdi.totalScore  >= 80 ? 'Sangat Tinggi' : pdi.totalScore  >= 60 ? 'Tinggi' : pdi.totalScore  >= 40 ? 'Cukup' : 'Rendah';
      const madelLabel = madel.totalScore >= 80 ? 'Sangat Tinggi' : madel.totalScore >= 60 ? 'Tinggi' : madel.totalScore >= 40 ? 'Cukup' : 'Rendah';
      prompt = `
Anda adalah Pakar Psikometrika Digital dari Universitas Negeri Jakarta.
Tulis diagnosis singkat (maksimal 3 kalimat, bahasa Indonesia, akademis dan memotivasi) untuk mahasiswa bernama ${userData.name}.

Data hasil asesmen:
- Skor PDI-DL  : ${pdi.totalScore}  (Kategori: ${pdiLabel})
- Skor MADEL5C : ${madel.totalScore} (Kategori: ${madelLabel})

Panduan:
- Jika skor tinggi: beri pujian dan dorong untuk terus berkembang.
- Jika skor rendah: beri saran konkret dan motivasi positif.
- Sebut nama mahasiswa.
- Jangan gunakan bullet point, cukup paragraf singkat.
      `.trim();
    } else {
      prompt = `
Sapa mahasiswa bernama ${userData.name} dengan hangat. 
Ajak dia menyelesaikan seluruh instrumen (PDI-DL, Survey, dan MADEL5C) 
agar sistem dapat memetakan profil literasi digitalnya secara lengkap dan akurat.
Maksimal 2 kalimat, bahasa Indonesia, akademis.
      `.trim();
    }

    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    return NextResponse.json({ message: text });

  } catch (error) {
    console.error('[AI Feedback Error]:', error);

    // Fallback yang informatif agar user tidak melihat layar kosong
    const fallback = (userData)
      ? `Halo ${userData.name}! Sistem diagnostik AI sedang dalam pemeliharaan. Silakan coba lagi beberapa saat.`
      : 'Sistem diagnostik AI sedang dalam pemeliharaan. Silakan coba lagi beberapa saat.';

    return NextResponse.json({ message: fallback });
  }
}
