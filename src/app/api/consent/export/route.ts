import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  PageBreak,
} from "docx";

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

function getConsents(): any[] {
  ensureUploadDir();
  try {
    const data = fs.readFileSync(registryFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

/**
 * Membangun dokumen docx resmi untuk satu atau banyak consent
 */
function buildDocxDocument(consentList: any[]): Document {
  const children: any[] = [];

  consentList.forEach((consent, index) => {
    if (index > 0) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Header Lembaga Formal
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: "KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI",
            bold: true,
            size: 20,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: "UNIVERSITAS NEGERI JAKARTA — PASCASARJANA PROGRAM DOKTOR (S3)",
            bold: true,
            size: 22,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "PROGRAM STUDI PENELITIAN DAN EVALUASI PENDIDIKAN (PEP)",
            size: 18,
            font: "Calibri",
            color: "333333",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: "LEMBAR PERSETUJUAN KEIKUTSERTAAN (INFORMED CONSENT)",
            bold: true,
            size: 24,
            color: "002B49",
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Instrumen Asesmen HDAP MADEL-5C (Model Literasi Digital Ekspansif Calon Guru SD)",
            italics: true,
            size: 18,
            color: "555555",
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Saya yang bertanda tangan di bawah ini:",
            size: 20,
            font: "Calibri",
          }),
        ],
      })
    );

    // Tabel Metadata Responden
    const metaRows: [string, string][] = [
      ["Nama Lengkap Partisipan", consent.userName || "-"],
      ["Jenjang Responden", consent.respondentLevel || "S1 Calon Guru"],
      ["Program Studi", consent.studyProgram || "-"],
      ["NIM / NPM / ID", consent.userNim || "-"],
      ["LPTK / Instansi Kampus", consent.userCampus || "-"],
      ["Sesi Asesmen", `Sesi ${consent.sessionNo || 1} — Wawancara Think-Aloud Protocol`],
      [
        "Waktu Persetujuan",
        consent.createdAt
          ? new Date(consent.createdAt).toLocaleString("id-ID", {
              dateStyle: "full",
              timeStyle: "medium",
            }) + " WIB"
          : "-",
      ],
      ["Status Persetujuan Legal", "DISETUJUI SECARA SADAR (VALID & LEGAL)"],
    ];

    const tableRows = metaRows.map(([label, value]) => {
      const isStatus = label.includes("Status");
      const isName = label.includes("Nama");

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            margins: { top: 70, bottom: 70, left: 100, right: 100 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: label, bold: true, size: 19, font: "Calibri" })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 5, type: WidthType.PERCENTAGE },
            margins: { top: 70, bottom: 70, left: 40, right: 40 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: ":", bold: true, size: 19, font: "Calibri" })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            margins: { top: 70, bottom: 70, left: 100, right: 100 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: value,
                    bold: isName || isStatus,
                    color: isStatus ? "15803D" : isName ? "0F172A" : "334155",
                    size: 19,
                    font: "Calibri",
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    });

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      }),
      new Paragraph({ spacing: { before: 180, after: 80 } }),
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: "PERNYATAAN KETENTUAN ETIKA PENELITIAN & PERSETUJUAN:",
            bold: true,
            size: 20,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: "Saya menyatakan telah membaca, memahami, dan menyetujui seluruh prosedur penelitian instrumen HDAP MADEL-5C ini secara sadar dan tanpa paksaan dari pihak manapun.",
            size: 19,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: "Saya bersedia memberikan respon tertulis dan suara (audio Think-Aloud) untuk keperluan analisis data ilmiah Disertasi & Publikasi Artikel Jurnal Bereputasi Internasional.",
            size: 19,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: "Saya memahami bahwa seluruh identitas pribadi saya akan dijaga kerahasiaannya dan dianonimkan (anonymized) sesuai standar kode etik penelitian universitas.",
            size: 19,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 150 },
        children: [
          new TextRun({
            text: "Hak partisipan untuk mengundurkan diri sewaktu-waktu dijamin tanpa ada konsekuensi atau sanksi apapun.",
            size: 19,
            font: "Calibri",
          }),
        ],
      })
    );

    // Blok Tanda Tangan Partisipan
    const sigChildren: any[] = [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: "Partisipan yang Membuat Pernyataan,",
            size: 19,
            font: "Calibri",
          }),
        ],
      }),
    ];

    let hasValidImage = false;
    if (consent.signatureDataUrl && typeof consent.signatureDataUrl === "string") {
      const match = consent.signatureDataUrl.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
      if (match) {
        try {
          const imgBuffer = Buffer.from(match[2], "base64");
          sigChildren.push(
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 40 },
              children: [
                new ImageRun({
                  data: imgBuffer,
                  transformation: { width: 140, height: 60 },
                  type: "png",
                }),
              ],
            })
          );
          hasValidImage = true;
        } catch (e) {
          console.error("Gagal parse base64 tanda tangan:", e);
        }
      }
    }

    if (!hasValidImage) {
      sigChildren.push(new Paragraph({ spacing: { before: 180, after: 20 } }));
    }

    sigChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: consent.userName || "Nama Partisipan",
            bold: true,
            underline: {},
            size: 20,
            font: "Calibri",
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `NIM: ${consent.userNim || "-"}`,
            size: 18,
            color: "64748B",
            font: "Calibri",
          }),
        ],
      })
    );

    children.push(...sigChildren);
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 },
          },
        },
        children,
      },
    ],
  });
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const type = url.searchParams.get("type"); // 'all' or specific
    const format = url.searchParams.get("format") || "docx"; // 'docx' or 'zip'

    const consents = getConsents();

    if (consents.length === 0) {
      return NextResponse.json({ error: "Belum ada data Informed Consent tersimpan." }, { status: 404 });
    }

    // ── Mode 1: Unduh Arsip ZIP Berisi Seluruh Dokumen DOCX Responden ────────
    if (format === "zip" || type === "zip") {
      const AdmZip = require("adm-zip");
      const zip = new AdmZip();

      for (let i = 0; i < consents.length; i++) {
        const c = consents[i];
        const singleDoc = buildDocxDocument([c]);
        const singleBuf = await Packer.toBuffer(singleDoc);
        const safeName = (c.userName || `Responden_${i + 1}`).replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `InformedConsent_Sesi${c.sessionNo || 1}_${safeName}.docx`;
        zip.addFile(fileName, singleBuf);
      }

      // Metadata ringkasan CSV
      const csvHeader = "No,ID,Nama Partisipan,Jenjang,Program Studi,Kampus,NIM,Sesi,Waktu Persetujuan,Status\r\n";
      const csvRows = consents
        .map((c, idx) =>
          [
            idx + 1,
            `"${c.id || ""}"`,
            `"${(c.userName || "").replace(/"/g, '""')}"`,
            `"${(c.respondentLevel || "S1 Calon Guru").replace(/"/g, '""')}"`,
            `"${(c.studyProgram || "").replace(/"/g, '""')}"`,
            `"${(c.userCampus || "").replace(/"/g, '""')}"`,
            `"${(c.userNim || "-").replace(/"/g, '""')}"`,
            c.sessionNo || 1,
            `"${c.createdAt || ""}"`,
            "Valid & Legal",
          ].join(",")
        )
        .join("\r\n");

      zip.addFile("DAFTAR_INFORMED_CONSENT.csv", Buffer.from("\uFEFF" + csvHeader + csvRows, "utf-8"));

      const zipBuf = zip.toBuffer();
      const zipName = `Arsip_Informed_Consent_MADEL5C_${new Date().toISOString().slice(0, 10)}.zip`;

      return new NextResponse(new Uint8Array(zipBuf), {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${zipName}"`,
          "Content-Length": zipBuf.length.toString(),
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    // ── Mode 2: Unduh Satu Dokumen DOCX Gabungan Seluruh Responden (All in One) ─
    if (type === "all" || !id) {
      const allDoc = buildDocxDocument(consents);
      const buffer = await Packer.toBuffer(allDoc);
      const fileName = `InformedConsent_SEMUA_RESPONDEN_MADEL5C_${new Date().toISOString().slice(0, 10)}.docx`;

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    // ── Mode 3: Unduh Dokumen DOCX Untuk Satu Responden Tertentu ─────────────
    const targetConsent = consents.find((c: any) => c.id === id);
    if (!targetConsent) {
      return NextResponse.json({ error: "Data Informed Consent tidak ditemukan." }, { status: 404 });
    }

    const singleDoc = buildDocxDocument([targetConsent]);
    const buffer = await Packer.toBuffer(singleDoc);
    const safeName = (targetConsent.userName || "Responden").replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `InformedConsent_Sesi${targetConsent.sessionNo || 1}_${safeName}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("Gagal export Informed Consent docx:", err);
    return NextResponse.json({ error: "Gagal membuat dokumen Word: " + (err?.message || "Unknown error") }, { status: 500 });
  }
}
