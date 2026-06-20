#!/usr/bin/env node
const http = require('http');

// Daftar Nama Mahasiswa Indonesia untuk Simulasi Realistis
const FIRST_NAMES = [
  "Ahmad", "Muhammad", "Rian", "Dwi", "Eko", "Budi", "Adi", "Agus", "Hendra", "Fauzi",
  "Siti", "Sri", "Dewi", "Indah", "Putri", "Lestari", "Mega", "Kartika", "Rina", "Dian",
  "Fikri", "Rangga", "Gilang", "Rizky", "Aditya", "Roni", "Yusuf", "Dimas", "Denny", "Aris",
  "Anisa", "Amalia", "Fitri", "Nanda", "Aulia", "Intan", "Nisa", "Rahma", "Wulan", "Sari"
];

const LAST_NAMES = [
  "Fauzi", "Hidayat", "Prasetyo", "Santoso", "Wibowo", "Saputra", "Kurniawan", "Setiawan", "Utomo", "Nugroho",
  "Lestari", "Aminah", "Rahayu", "Fitriani", "Sari", "Utami", "Pertiwi", "Handayani", "Hartati", "Mulyani",
  "Arifin", "Subagyo", "Gunawan", "Susanto", "Budiman", "Syahputra", "Baskoro", "Wicaksono", "Pamungkas", "Siregar"
];

const CAMPUSES = [
  "Universitas Negeri Jakarta",
  "Universitas Indonesia",
  "Universitas Negeri Padang",
  "Universitas Pendidikan Indonesia",
  "Universitas Negeri Yogyakarta"
];

const GENDERS = ["Laki-laki", "Perempuan"];

// Fungsi Box-Muller transform untuk distribusi normal
function randomNormal(mean = 0, stdDev = 1) {
  const u1 = 1 - Math.random(); // Avoid log(0)
  const u2 = 1 - Math.random();
  const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
  return mean + stdDev * randStdNormal;
}

function clamp(val, minVal, maxVal) {
  return Math.max(minVal, Math.min(maxVal, val));
}

function generateCovarianceScores() {
  // Menghasilkan skor variabel laten berdasarkan model jalur CB-SEM teoretis MADEL5C
  const c1 = clamp(randomNormal(3.8, 0.5), 1.0, 5.0);
  const c2 = clamp(0.65 * (c1 - 3.8) + 3.8 + randomNormal(0, 0.4), 1.0, 5.0);
  const c3 = clamp(0.58 * (c1 - 3.8) + 3.8 + randomNormal(0, 0.4), 1.0, 5.0);
  const c4 = clamp(0.42 * (c2 - 3.8) + 0.48 * (c3 - 3.8) + 3.8 + randomNormal(0, 0.3), 1.0, 5.0);
  const c5 = clamp(0.72 * (c4 - 3.8) + 0.35 * (c1 - 3.8) + 3.8 + randomNormal(0, 0.3), 1.0, 5.0);
  return [c1, c2, c3, c4, c5];
}

function generateParticipantData(idx) {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${firstName} ${lastName} ${idx}`;
  const campus = CAMPUSES[Math.floor(Math.random() * CAMPUSES.length)];
  const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];

  const cScores = generateCovarianceScores();

  // 20 Butir PDI-DL (4 per dimensi)
  const pdiAnswers = {};
  let pdiTotal = 0;
  for (let qIdx = 0; qIdx < 20; qIdx++) {
    const dimIdx = Math.floor(qIdx / 4);
    const cVal = cScores[dimIdx];
    const score = clamp(Math.round(cVal + randomNormal(0, 0.5)), 1, 5);
    pdiAnswers[qIdx] = score;
    pdiTotal += score;
  }

  // 75 Butir MADEL5C (15 per dimensi)
  const madelAnswers = {};
  let madelTotal = 0;
  for (let qIdx = 0; qIdx < 75; qIdx++) {
    const dimIdx = Math.floor(qIdx / 15);
    const cVal = cScores[dimIdx];
    const score = clamp(Math.round(cVal + randomNormal(0, 0.5)), 1, 5);
    madelAnswers[qIdx] = score;
    madelTotal += score;
  }

  // 10 Butir Survey (SUS)
  const surveyAnswers = {};
  let surveyTotalScore = 0;
  for (let qIdx = 0; qIdx < 10; qIdx++) {
    const score = clamp(Math.round(randomNormal(4.2, 0.6)), 1, 5);
    surveyAnswers[qIdx] = score;

    const qNum = qIdx + 1;
    if (qNum % 2 !== 0) {
      surveyTotalScore += (score - 1);
    } else {
      surveyTotalScore += (5 - score);
    }
  }

  const feedbacks = [
    "Antarmuka sangat modern dan responsif.",
    "Sistem visualisasinya sangat membantu memahami skor.",
    "Pengisian bertahap MADEL5C membuat tidak lelah.",
    "Sangat bagus, pendaftaran dan pengisian sangat mulus.",
    "Desain dashboard-nya premium dan cepat sekali loadingnya.",
    "Bagus sekali untuk penelitian evaluasi digital.",
    "Petunjuk instrumennya sangat jelas."
  ];
  const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

  return {
    name, campus, gender,
    pdi_total: pdiTotal, pdi_answers: pdiAnswers,
    madel_total: madelTotal, madel_answers: madelAnswers,
    survey_total: surveyTotalScore, survey_answers: surveyAnswers,
    feedback
  };
}

// Custom request function using native http.request for zero-dependency execution
function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = JSON.stringify(data);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`Status: ${res.statusCode}, Body: ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("====================================================");
  console.log("   AUTOMATION BOT - PLATFORM PENGISIAN HDAP (JS)    ");
  console.log("====================================================");

  let baseUrl = "http://localhost:3000";
  let numUsers = 100;

  // Baca argumen command line
  const args = process.argv.slice(2);
  if (args.length > 0) {
    if (args[0].startsWith("http")) {
      baseUrl = args[0].replace(/\/$/, "");
    } else {
      const parsedNum = parseInt(args[0], 10);
      if (!isNaN(parsedNum)) numUsers = parsedNum;
    }
  }

  if (args.length > 1) {
    const parsedNum = parseInt(args[1], 10);
    if (!isNaN(parsedNum)) numUsers = parsedNum;
  }

  console.log(`Target Base URL: ${baseUrl}`);
  console.log(`Jumlah Responden: ${numUsers} user`);
  console.log("Mulai mengisi instrumen...");
  console.log("----------------------------------------------------");

  let successCount = 0;

  for (let i = 1; i <= numUsers; i++) {
    const participant = generateParticipantData(i);

    try {
      // Step 1: Registrasi User
      const regRes = await postJson(`${baseUrl}/api/auth`, {
        name: participant.name,
        campus: participant.campus,
        gender: participant.gender
      });

      const userId = regRes.userId;
      if (!userId) {
        console.log(`[${i}/${numUsers}] Gagal mendapatkan userId untuk ${participant.name}`);
        continue;
      }

      // Step 2: Submit PDI-DL
      await postJson(`${baseUrl}/api/assessment`, {
        userId,
        type: "PDI-DL",
        totalScore: participant.pdi_total,
        answersJson: participant.pdi_answers
      });

      // Step 3: Submit MADEL5C
      await postJson(`${baseUrl}/api/assessment`, {
        userId,
        type: "MADEL5C",
        totalScore: participant.madel_total,
        answersJson: participant.madel_answers
      });

      // Step 4: Submit Survey
      await postJson(`${baseUrl}/api/survey`, {
        userId,
        totalScore: participant.survey_total,
        answersJson: participant.survey_answers,
        feedback: participant.feedback
      });

      successCount++;
      console.log(`[${i}/${numUsers}] SUKSES - ${participant.name} (${participant.campus}) | PDI: ${participant.pdi_total} | MADEL: ${participant.madel_total} | SUS: ${participant.survey_total}`);
      
      // Delay kecil
      await delay(50);

    } catch (err) {
      console.log(`[${i}/${numUsers}] Error sistem pada user ${participant.name}: ${err.message}`);
    }
  }

  console.log("----------------------------------------------------");
  console.log(`Proses Selesai! Berhasil menginput {successCount} dari {numUsers} responden.`);
  console.log("Data terpopulasi dengan struktur covariance CB-SEM MADEL5C teoretis.");
  console.log("====================================================");
}

main().catch(err => console.error(err));
