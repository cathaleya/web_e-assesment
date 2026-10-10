import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Folder lokasi penyimpanan berkas audio di server
const uploadDir = path.join(process.cwd(), "public", "uploads", "audio");
const registryFile = path.join(uploadDir, "recordings.json");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(registryFile)) {
    fs.writeFileSync(registryFile, JSON.stringify([], null, 2));
  }
}

function getRecordings() {
  ensureUploadDir();
  try {
    const data = fs.readFileSync(registryFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveRecordings(recordings: any[]) {
  ensureUploadDir();
  fs.writeFileSync(registryFile, JSON.stringify(recordings, null, 2));
}

export async function POST(req: Request) {
  try {
    ensureUploadDir();
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const userId = (formData.get("userId") as string) || "anonymous";
    const userName = (formData.get("userName") as string) || "Mahasiswa Calon Guru";
    const userCampus = (formData.get("userCampus") as string) || "LPTK";
    const itemNo = parseInt((formData.get("itemNo") as string) || "1", 10);
    const sjtId = (formData.get("sjtId") as string) || `SJT_${itemNo.toString().padStart(2, "0")}`;
    const probingStep = parseInt((formData.get("probingStep") as string) || "1", 10);
    const questionTitle = (formData.get("questionTitle") as string) || "Pertanyaan Probing";
    const selectedOption = (formData.get("selectedOption") as string) || "Belum Memilih Opsi";
    const duration = parseInt((formData.get("duration") as string) || "0", 10);
    const transcript = (formData.get("transcript") as string) || "";

    if (!audioFile) {
      return NextResponse.json({ error: "Berkas audio tidak ditemukan dalam request." }, { status: 400 });
    }

    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sanitizeName = userName.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `ThinkAloud_Soal${itemNo}_P${probingStep}_${Date.now()}_${sanitizeName}.webm`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicAudioUrl = `/uploads/audio/${filename}`;

    let finalTranscript = transcript.trim();

    // OTOMATIS TRANSKRIP VIA SERVER AI (GEMINI) JIKA VERBATIM BROWSER HP KOSONG / DEFAULT
    if (!finalTranscript || finalTranscript.includes("[Respon Suara Terkirim") || finalTranscript.length < 5) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const audioBase64 = buffer.toString("base64");

          const aiRes = await model.generateContent([
            {
              inlineData: {
                mimeType: audioFile.type || "audio/webm",
                data: audioBase64,
              },
            },
            {
              text: "Tolong buatkan transkrip verbatim kata-demi-kata secara persis dan lengkap dari ucapan Bahasa Indonesia pada rekaman audio ini. Tuliskan HANYA hasil teks verbatim tanpa kata pengantar atau penjelasan tambahan apapun.",
            },
          ]);

          const aiText = aiRes.response.text()?.trim();
          if (aiText && aiText.length > 0) {
            finalTranscript = aiText;
          }
        } catch (aiErr) {
          console.warn("Gemini AI Auto-transcription notice:", aiErr);
        }
      }
    }

    if (!finalTranscript) {
      finalTranscript = "[Respon Suara Terkirim (Audio tersimpan di server)]";
    }

    const newRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      userName,
      userCampus,
      itemNo,
      sjtId,
      probingStep,
      questionTitle,
      selectedOption,
      duration,
      transcript: finalTranscript,
      filename,
      audioUrl: publicAudioUrl,
      createdAt: new Date().toISOString()
    };

    const currentRecordings = getRecordings();
    currentRecordings.unshift(newRecord);
    saveRecordings(currentRecordings);

    return NextResponse.json({
      success: true,
      message: "Rekaman suara Think-Aloud berhasil disimpan ke database admin!",
      record: newRecord
    }, { status: 200 });

  } catch (err) {
    console.error("Gagal mengunggah berkas audio Think-Aloud:", err);
    return NextResponse.json({ error: "Gagal menyimpan berkas audio di server." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const recordings = getRecordings();
    return NextResponse.json(recordings, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    console.error("Gagal mengambil data rekaman Think-Aloud:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, filename } = await req.json();
    ensureUploadDir();
    let current = getRecordings();

    if (filename) {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    current = current.filter((r: any) => r.id !== id && r.filename !== filename);
    saveRecordings(current);

    return NextResponse.json({ success: true, message: "Rekaman berhasil dihapus dari server." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus rekaman." }, { status: 500 });
  }
}
