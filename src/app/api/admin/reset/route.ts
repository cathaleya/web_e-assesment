import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log("Admin requesting database and analysis reset...");

    // 1. Clear database records using Prisma (in order of relations)
    await prisma.survey.deleteMany({});
    await prisma.assessment.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Database tables cleared successfully.");

    // 2. Clear cached psychometric outputs and scree plots, then mark as reset
    const outputDir = path.join(process.cwd(), 'public', 'analysis', 'outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const files = fs.readdirSync(outputDir);
    let deletedCount = 0;
    files.forEach(file => {
      try {
        fs.unlinkSync(path.join(outputDir, file));
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete cache file ${file}:`, err);
      }
    });
    // Set .reset_flag so the system knows the reset was deliberate by admin
    fs.writeFileSync(path.join(outputDir, '.reset_flag'), new Date().toISOString());
    console.log(`Cleared ${deletedCount} files from analysis outputs directory and set .reset_flag.`);

    // 3. Clear audio recordings registry and files if present
    const audioDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
    const audioRegistry = path.join(audioDir, 'recordings.json');
    if (fs.existsSync(audioDir)) {
      const audioFiles = fs.readdirSync(audioDir);
      audioFiles.forEach(file => {
        try { fs.unlinkSync(path.join(audioDir, file)); } catch (e) {}
      });
      fs.writeFileSync(audioRegistry, JSON.stringify([], null, 2));
      console.log("Audio recordings registry cleared.");
    }

    // 4. Clear consent forms registry and files if present
    const consentDir = path.join(process.cwd(), 'public', 'uploads', 'consent');
    const consentRegistry = path.join(consentDir, 'consents.json');
    if (fs.existsSync(consentDir)) {
      const consentFiles = fs.readdirSync(consentDir);
      consentFiles.forEach(file => {
        try { fs.unlinkSync(path.join(consentDir, file)); } catch (e) {}
      });
      fs.writeFileSync(consentRegistry, JSON.stringify([], null, 2));
      console.log("Consent registry cleared.");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database tables, audio registry, consent forms, and analysis cache cleared successfully." 
    }, { 
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });

  } catch (error) {
    console.error('Error executing admin reset:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
