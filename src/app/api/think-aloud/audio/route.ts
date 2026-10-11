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
    const isTextOnlyParam = formData.get("isTextOnly") === "true";
    const userId = (formData.get("userId") as string) || "anonymous";
    const userName = (formData.get("userName") as string) || "Mahasiswa Calon Guru";
    const userCampus = (formData.get("userCampus") as string) || "LPTK";
    const respondentLevel = (formData.get("respondentLevel") as string) || "S1 Calon Guru";
    const studyProgram = (formData.get("studyProgram") as string) || "";
    const sessionNo = parseInt((formData.get("sessionNo") as string) || "1", 10);
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

    // Deteksi apakah berkas audio ini sungguhan atau respon teks manual
    const isTextMock = isTextOnlyParam || (duration === 0 && buffer.length < 150 && buffer.toString().includes("Respon Teks"));

    let filename = "";
    let publicAudioUrl: string | null = null;
    let downloadUrl: string | null = null;

    if (!isTextMock) {
      const sanitizeName = userName.replace(/[^a-zA-Z0-9]/g, "_");
      filename = `ThinkAloud_Sesi${sessionNo}_Soal${itemNo}_P${probingStep}_${Date.now()}_${sanitizeName}.webm`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      publicAudioUrl = `/api/think-aloud/audio?file=${encodeURIComponent(filename)}`;
      downloadUrl = `/api/think-aloud/audio?file=${encodeURIComponent(filename)}&download=1`;
    }

    let finalTranscript = transcript.trim();

    // OTOMATIS TRANSKRIP VIA SERVER AI (GEMINI) JIKA MEMILIKI AUDIO TAPI TRANSKRIP BELUM LENGKAP
    if (!isTextMock && (!finalTranscript || finalTranscript.includes("[Respon Suara Terkirim") || finalTranscript.length < 5)) {
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
      finalTranscript = isTextMock ? "[Respon Teks Manual]" : "[Respon Suara Terkirim (Audio tersimpan di server)]";
    }

    const newRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      userName,
      userCampus,
      respondentLevel,
      studyProgram,
      sessionNo,
      itemNo,
      sjtId,
      probingStep,
      questionTitle,
      selectedOption,
      duration,
      transcript: finalTranscript,
      hasAudio: !isTextMock,
      filename: filename || null,
      audioUrl: publicAudioUrl,
      downloadUrl,
      createdAt: new Date().toISOString()
    };

    const currentRecordings = getRecordings();
    currentRecordings.unshift(newRecord);
    saveRecordings(currentRecordings);

    return NextResponse.json({
      success: true,
      message: isTextMock 
        ? "Respon teks manual Think-Aloud berhasil disimpan ke database admin!"
        : "Rekaman suara Think-Aloud berhasil disimpan ke database admin!",
      record: newRecord
    }, { status: 200 });

  } catch (err) {
    console.error("Gagal mengunggah berkas audio Think-Aloud:", err);
    return NextResponse.json({ error: "Gagal menyimpan berkas audio di server." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    ensureUploadDir();
    const url = new URL(req.url);
    const file = url.searchParams.get("file");
    const download = url.searchParams.get("download");

    // ── Mode 1: Streaming / Unduh Berkas Audio Asli ────────────────────────
    if (file) {
      const safeFilename = path.basename(file);
      const filePath = path.join(uploadDir, safeFilename);

      if (!fs.existsSync(filePath)) {
        return new NextResponse("Berkas audio tidak ditemukan di server.", { 
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }

      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.get("range");

      // Dukungan HTTP Range 206 (Sangat krusial untuk HTML5 <audio> scrubber/seeking di Chrome & Edge)
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
          return new NextResponse("Requested range not satisfiable", {
            status: 416,
            headers: { "Content-Range": `bytes */${fileSize}` },
          });
        }

        const chunksize = end - start + 1;
        const fileBuffer = fs.readFileSync(filePath);
        const slicedBuffer = fileBuffer.subarray(start, end + 1);

        return new NextResponse(slicedBuffer, {
          status: 206,
          headers: {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize.toString(),
            "Content-Type": "audio/webm",
            "Cache-Control": "no-cache",
          },
        });
      }

      // Full Response (200 OK)
      const fileBuffer = fs.readFileSync(filePath);
      const headers: Record<string, string> = {
        "Content-Type": "audio/webm",
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=86400, must-revalidate",
      };

      if (download === "true" || download === "1") {
        headers["Content-Disposition"] = `attachment; filename="${safeFilename}"`;
      } else {
        headers["Content-Disposition"] = `inline; filename="${safeFilename}"`;
      }

      return new NextResponse(fileBuffer, {
        status: 200,
        headers,
      });
    }

    // ── Mode 2: Mengambil Daftar JSON Rekaman Audio (Self-Healing URL) ──────
    const recordings = getRecordings();
    
    // Normalisasi otomatis jika ada rekaman lama dengan format path statis /uploads/audio/
    const normalizedRecordings = recordings.map((rec: any) => {
      const filename = rec.filename || (rec.audioUrl ? path.basename(rec.audioUrl) : null);
      const isTextMock = rec.duration === 0 || (filename && filename.includes("Tanpa"));
      const hasAudio = rec.hasAudio !== undefined ? rec.hasAudio : (!isTextMock && !!filename);
      
      return {
        ...rec,
        respondentLevel: rec.respondentLevel || "S1 Calon Guru",
        studyProgram: rec.studyProgram || "",
        hasAudio,
        audioUrl: hasAudio && filename ? `/api/think-aloud/audio?file=${encodeURIComponent(filename)}` : null,
        downloadUrl: hasAudio && filename ? `/api/think-aloud/audio?file=${encodeURIComponent(filename)}&download=1` : null,
      };
    });

    return NextResponse.json(normalizedRecordings, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (err) {
    console.error("Gagal memproses permintaan Think-Aloud audio:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, filename } = await req.json();
    ensureUploadDir();
    let current = getRecordings();

    if (filename) {
      const safeFilename = path.basename(filename);
      const filePath = path.join(uploadDir, safeFilename);
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

export async function PUT(req: Request) {
  try {
    const { id, transcript } = await req.json();
    ensureUploadDir();
    let current = getRecordings();
    const index = current.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      current[index].transcript = transcript;
      saveRecordings(current);
      return NextResponse.json({ success: true, record: current[index] });
    }
    return NextResponse.json({ error: "Rekaman tidak ditemukan." }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyunting transkrip." }, { status: 500 });
  }
}
