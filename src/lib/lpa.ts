/**
 * lpa.ts
 * Logika Penentuan Profil Laten (Latent Profile Analysis / LPA) & Rekomendasi Tutor Sebaya
 * Berdasarkan Parameter Model Empiris EEI (Equal diagonal variance-covariance across profiles)
 */

export const MU = [
  [3.174, 3.205, 3.338, 3.174, 2.981], // P1 Berkembang
  [3.758, 3.735, 3.768, 3.715, 3.748], // P2 Menengah-Fungsional
  [4.192, 4.220, 4.190, 4.342, 4.355], // P3 Mahir-Holistik
];

export const SIGMA2 = [0.1408, 0.2069, 0.2022, 0.1137, 0.1185]; // EEI: sama antarprofil
export const PI = [0.23, 0.51, 0.26];

export interface LpaResult {
  profil: number; // 1 | 2 | 3
  peluang: number[]; // Posterior probabilities [P(C=1|X), P(C=2|X), P(C=3|X)]
  tegas: boolean; // post[k] >= 0.70
  // Compatibility & UI Presentation Fields
  id: 1 | 2 | 3;
  name: string;
  badgeTitle: string;
  prevalence: string;
  colorScheme: {
    bgGradient: string;
    badgeBg: string;
    border: string;
    textAccent: string;
    ringColor: string;
  };
  recommendedModule: {
    title: string;
    desc: string;
    priorityDimensions: string;
  };
  peerTutor: {
    role: 'mentee' | 'independent' | 'mentor';
    badge: string;
    message: string;
    actionBtn: string;
    icon: string;
    btnClass: string;
  };
}

const PROFILE_METADATA = [
  {
    name: "Berkembang (Butuh Pendampingan)",
    badgeTitle: "Profil Laten: Berkembang (Prioritas Penguatan C5 & C4)",
    prevalence: "23,0% Populasi (Model EEI)",
    colorScheme: {
      bgGradient: "from-rose-50 via-white to-pink-50/60",
      badgeBg: "bg-rose-500 text-white",
      border: "border-rose-300",
      textAccent: "text-rose-700",
      ringColor: "ring-rose-400"
    },
    recommendedModule: {
      title: "Simulasi Troubleshooting Teknologi Darurat & Media Aksesibel",
      desc: "Fokus intervensi terarah pada penanganan kendala teknis gawai di kelas (C5) serta kepatuhan perlindungan data siswa dan media ajar ramah disabilitas (C4).",
      priorityDimensions: "Dimensi Prioritas: C5 (Pemecahan Masalah) & C4 (Keamanan Digital)"
    },
    peerTutor: {
      role: "mentee" as const,
      badge: "Penerima Kemitraan Belajar (Mentee)",
      message: "Sistem merekomendasikan Anda bermitra belajar dengan rekan dari Profil Mahir (Mahir-Holistik) untuk tugas kolaboratif.",
      actionBtn: "Bermitra dengan Tutor Sebaya",
      icon: "fa-solid fa-handshake-angle",
      btnClass: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-500/20"
    }
  },
  {
    name: "Menengah-Fungsional (Mandiri)",
    badgeTitle: "Profil Laten: Menengah-Fungsional (Mandiri)",
    prevalence: "51,0% Populasi (Model EEI)",
    colorScheme: {
      bgGradient: "from-blue-50 via-white to-indigo-50/60",
      badgeBg: "bg-blue-600 text-white",
      border: "border-blue-300",
      textAccent: "text-blue-700",
      ringColor: "ring-blue-400"
    },
    recommendedModule: {
      title: "Pengayaan Kepemimpinan Pedagogis & Dilema Etika Lanjutan",
      desc: "Optimalisasi kepemimpinan instruksional digital, resolusi studi kasus etika kecerdasan buatan, dan perluasan kolaborasi multi-platform antar-sekolah.",
      priorityDimensions: "Fokus Pengembangan: Penguatan Sinergi Antar-Dimensi (C1–C5)"
    },
    peerTutor: {
      role: "independent" as const,
      badge: "Pembelajar Mandiri & Kolaborasi Setara",
      message: "Profil kompetensi Anda seimbang untuk belajar mandiri serta bertukar gagasan dalam lingkaran belajar setara (peer discussion).",
      actionBtn: "Buka Forum Diskusi Mandiri",
      icon: "fa-solid fa-comments",
      btnClass: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20"
    }
  },
  {
    name: "Mahir-Holistik (Siap Menjadi Mentor/Tutor)",
    badgeTitle: "Profil Laten: Mahir-Holistik (Siap Menjadi Mentor/Tutor)",
    prevalence: "26,0% Populasi (Model EEI)",
    colorScheme: {
      bgGradient: "from-emerald-50 via-white to-teal-50/60",
      badgeBg: "bg-emerald-600 text-white",
      border: "border-emerald-300",
      textAccent: "text-emerald-700",
      ringColor: "ring-emerald-400"
    },
    recommendedModule: {
      title: "Pengembangan Inovasi Pembelajaran AI & Diseminasi Praktik Baik",
      desc: "Perancangan inovasi pembelajaran berdiferensiasi berbasis Gen-AI, kepelatihan sejawat, dan penyusunan portofolio digital bertaraf nasional.",
      priorityDimensions: "Taraf Penguasaan: Kepemimpinan Transformatif & Penguasaan Utuh"
    },
    peerTutor: {
      role: "mentor" as const,
      badge: "Fasilitator / Tutor Sebaya Terverifikasi",
      message: "Anda memenuhi syarat sebagai Fasilitator/Tutor Sebaya bagi rekan mahasiswa yang membutuhkan penguatan pada dimensi C4 dan C5.",
      actionBtn: "Aktifkan Status Tutor Sebaya",
      icon: "fa-solid fa-award",
      btnClass: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20"
    }
  }
];

/**
 * Menentukan profil LPA mahasiswa berdasarkan vektor 5 dimensi [C1..C5] (skala 1–5).
 * Mendukung fleksibilitas input:
 * - Array 5 dimensi: [C1, C2, C3, C4, C5] (skala 1–5, atau jika skala 0–100 akan otomatis dinormalisasi /20)
 * - Angka skalar: meanScore (akan direplikasi menjadi 5 dimensi)
 */
export function determineLpaProfile(dim: number[] | number): LpaResult {
  let normalizedDim: number[];

  if (typeof dim === 'number') {
    const val = Math.max(1.0, Math.min(5.0, dim));
    normalizedDim = [val, val, val, val, val];
  } else if (Array.isArray(dim) && dim.length >= 5) {
    // Normalisasi jika nilai masih berupa persentase 0-100 (> 5)
    normalizedDim = dim.slice(0, 5).map(x => {
      const v = x > 5 ? x / 20 : x;
      return Math.max(1.0, Math.min(5.0, v));
    });
  } else {
    normalizedDim = [3.75, 3.75, 3.75, 3.75, 3.75];
  }

  // Hitung kernel log-likelihood
  const ll = MU.map((mu, k) =>
    Math.log(PI[k]) - 0.5 * normalizedDim.reduce((s, x, d) => s + (x - mu[d]) ** 2 / SIGMA2[d], 0)
  );

  // Log-sum-exp trick
  const m = Math.max(...ll);
  const p = ll.map(v => Math.exp(v - m));
  const tot = p.reduce((a, b) => a + b);
  const post = p.map(v => v / tot);
  const k = post.indexOf(Math.max(...post));

  const profil = k + 1;
  const tegas = post[k] >= 0.70;
  const meta = PROFILE_METADATA[k];

  return {
    profil,
    peluang: post,
    tegas,
    id: profil as 1 | 2 | 3,
    ...meta
  };
}
