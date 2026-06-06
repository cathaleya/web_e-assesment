import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import AdmZip from 'adm-zip';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const method = searchParams.get('method') || 'python';
    
    if (!type) {
      return NextResponse.json({ error: 'Missing analysis type' }, { status: 400 });
    }

    const outputDir = path.join(process.cwd(), 'public', 'analysis', 'outputs');
    const jsonFileName = `${type}_${method.toLowerCase()}_output.json`;
    const plotFileName = `${type}_${method.toLowerCase()}_plot.png`;
    const plot2FileName = `${type}_${method.toLowerCase()}_plot2.png`;

    const jsonPath = path.join(outputDir, jsonFileName);
    const plotPath = path.join(outputDir, plotFileName);
    const plot2Path = path.join(outputDir, plot2FileName);

    const zip = new AdmZip();

    // Add JSON data
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath);
      zip.addFile(`${type}_results.json`, data);
      
      // Also generate a readable text summary / report inside the zip
      try {
        const parsed = JSON.parse(data.toString());
        let summaryText = `HDAP ANALYSIS REPORT - ${type.toUpperCase()}\n`;
        summaryText += `========================================\n\n`;
        summaryText += `Generated on: ${new Date().toISOString()}\n\n`;
        
        if (type === 'efa') {
          summaryText += `KMO Measure of Sampling Adequacy: ${parsed.kmo}\n`;
          summaryText += `Bartlett Sphericity p-value: ${parsed.bartlett}\n\n`;
          summaryText += `Extracted Factor Loadings:\n`;
          parsed.loadings.forEach((l: any) => {
            summaryText += `- ${l.item} (${l.dimension}): F1=${l.loadings.Information || 0}, F2=${l.loadings.Collaboration || 0}, F3=${l.loadings.Productivity || 0}\n`;
          });
        } else if (type === 'cfa') {
          summaryText += `Fit Indices:\n`;
          summaryText += `- CFI: ${parsed.fit_indices.cfi}\n`;
          summaryText += `- TLI: ${parsed.fit_indices.tli}\n`;
          summaryText += `- RMSEA: ${parsed.fit_indices.rmsea}\n`;
          summaryText += `- SRMR: ${parsed.fit_indices.srmr}\n\n`;
          summaryText += `Factor Loadings:\n`;
          parsed.loadings.forEach((dim: any) => {
            summaryText += `\nDimension: ${dim.dimension}\n`;
            dim.items.forEach((it: any) => {
              summaryText += `- ${it.id}: loading = ${it.load}\n`;
            });
          });
        } else if (type === 'rasch') {
          summaryText += `Rasch/IRT Model Fit Summary:\n`;
          summaryText += `- Person Reliability: ${parsed.reliability.person_reliability}\n`;
          summaryText += `- Person Separation: ${parsed.reliability.person_separation}\n`;
          summaryText += `- Item Reliability: ${parsed.reliability.item_reliability}\n`;
          summaryText += `- Item Separation: ${parsed.reliability.item_separation}\n\n`;
          summaryText += `Item Parameters:\n`;
          parsed.items.forEach((it: any) => {
            summaryText += `- ${it.item}: difficulty (b) = ${it.difficulty}, discrimination (a) = ${it.discrimination}, fit status = ${it.status}\n`;
          });
        } else if (type === 'sem') {
          summaryText += `SEM Path Coefficients:\n`;
          parsed.paths.forEach((p: any) => {
            summaryText += `- ${p.source} -> ${p.target}: beta = ${p.coef}, p-value = ${p.p_value}\n`;
          });
          summaryText += `\nR-Squared Values:\n`;
          Object.entries(parsed.r_squared).forEach(([k, v]) => {
            summaryText += `- ${k}: R2 = ${v}\n`;
          });
        }
        
        zip.addFile(`readable_report.txt`, Buffer.from(summaryText, 'utf8'));
      } catch (err) {
        // Ignore parsing errors for custom reports
      }
    }

    // Add Image Plots
    if (fs.existsSync(plotPath)) {
      const imgData = fs.readFileSync(plotPath);
      zip.addFile(`${type}_plot_wright_map_or_path.png`, imgData);
    }
    
    if (fs.existsSync(plot2Path)) {
      const imgData2 = fs.readFileSync(plot2Path);
      zip.addFile(`${type}_plot_curves_icc_crc.png`, imgData2);
    }

    const zipBuffer = zip.toBuffer();

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="HDAP_${type.toUpperCase()}_Package.zip"`,
      },
    });

  } catch (error) {
    console.error('Download analysis package error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
