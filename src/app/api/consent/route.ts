import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads", "consent");
const registryFile = path.join(uploadDir, "consents.json");

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(registryFile)) {
    fs.writeFileSync(registryFile, JSON.stringify([], null, 2));
  }
}

function getConsents() {
  ensureUploadDir();
  try {
    const data = fs.readFileSync(registryFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveConsents(consents: any[]) {
  ensureUploadDir();
  fs.writeFileSync(registryFile, JSON.stringify(consents, null, 2));
}

export async function POST(req: Request) {
  try {
    ensureUploadDir();
    const body = await req.json();
    const { userId, userName, userCampus, userNim, sessionNo, signatureDataUrl, respondentLevel, studyProgram } = body;

    if (!userName || !sessionNo) {
      return NextResponse.json({ error: "Nama dan Sesi wajib diisi." }, { status: 400 });
    }

    const newRecord = {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: userId || "anonymous",
      userName: userName || "Mahasiswa Calon Guru",
      userCampus: userCampus || "LPTK Universitas",
      userNim: userNim || "2026_PLP_01",
      respondentLevel: respondentLevel || "S1 Calon Guru",
      studyProgram: studyProgram || "",
      sessionNo: parseInt(sessionNo.toString(), 10) || 1,
      approved: true,
      signatureDataUrl: signatureDataUrl || "",
      createdAt: new Date().toISOString(),
    };

    const currentConsents = getConsents();
    // Replace if existing consent for same user and session
    const existingIndex = currentConsents.findIndex(
      (c: any) => c.userId === newRecord.userId && c.sessionNo === newRecord.sessionNo
    );

    if (existingIndex !== -1) {
      currentConsents[existingIndex] = newRecord;
    } else {
      currentConsents.unshift(newRecord);
    }

    saveConsents(currentConsents);

    return NextResponse.json(
      {
        success: true,
        message: "Informed consent berhasil tersimpan di database server!",
        record: newRecord,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal menyimpan Informed Consent:", err);
    return NextResponse.json({ error: "Gagal menyimpan informed consent ke server." }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const consents = getConsents();
    return NextResponse.json(consents, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("Gagal mengambil Informed Consent:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    ensureUploadDir();
    let current = getConsents();
    current = current.filter((c: any) => c.id !== id);
    saveConsents(current);
    return NextResponse.json({ success: true, message: "Informed consent berhasil dihapus." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus informed consent." }, { status: 500 });
  }
}
