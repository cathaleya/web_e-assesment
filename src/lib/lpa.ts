/**
 * lpa.ts
 * Logika Penentuan Profil Laten (Latent Profile Analysis / LPA) & Rekomendasi Tutor Sebaya
 * Berdasarkan Pemodelan Empiris BAB IV Disertasi (N = 251 Mahasiswa Calon Guru)
 */

export interface LpaProfileData {
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

/**
 * Menentukan profil LPA berdasarkan skor rata-rata (skala 1.00 - 5.00)
 * Ambang Batas Empiris LPA N=251:
 * - Skor <= 3.60 : Profil 1 (Emerging - 12.7%)
 * - 3.61 - 4.20  : Profil 2 (Moderate-Functional - 53.0%)
 * - Skor > 4.20  : Profil 3 (Holistic-Advanced - 34.3%)
 */
export function determineLpaProfile(meanScore: number): LpaProfileData {
  // Clamp or normalize to 1.00 - 5.00 range
  const score = Math.max(1.0, Math.min(5.0, Number(meanScore.toFixed(2))));

  if (score <= 3.60) {
    return {
      id: 1,
      name: "Emerging (Butuh Pendampingan)",
      badgeTitle: "Profil Laten: Emerging (Prioritas Penguatan C5 & C4)",
      prevalence: "12,7% Populasi (N=251)",
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
        role: "mentee",
        badge: "Penerima Kemitraan Belajar (Mentee)",
        message: "Sistem merekomendasikan Anda bermitra belajar dengan rekan dari Profil Mahir (Holistic-Advanced) untuk tugas kolaboratif.",
        actionBtn: "Bermitra dengan Tutor Sebaya",
        icon: "fa-solid fa-handshake-angle",
        btnClass: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-500/20"
      }
    };
  } else if (score <= 4.20) {
    return {
      id: 2,
      name: "Moderate-Functional (Mandiri)",
      badgeTitle: "Profil Laten: Moderate-Functional (Mandiri)",
      prevalence: "53,0% Populasi (N=251)",
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
        role: "independent",
        badge: "Pembelajar Mandiri & Kolaborasi Setara",
        message: "Profil kompetensi Anda seimbang untuk belajar mandiri serta bertukar gagasan dalam lingkaran belajar setara (peer discussion).",
        actionBtn: "Buka Forum Diskusi Mandiri",
        icon: "fa-solid fa-comments",
        btnClass: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20"
      }
    };
  } else {
    return {
      id: 3,
      name: "Holistic-Advanced (Siap Menjadi Mentor/Tutor)",
      badgeTitle: "Profil Laten: Holistic-Advanced (Siap Menjadi Mentor/Tutor)",
      prevalence: "34,3% Populasi (N=251)",
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
        role: "mentor",
        badge: "Fasilitator / Tutor Sebaya Terverifikasi",
        message: "Anda memenuhi syarat sebagai Fasilitator/Tutor Sebaya bagi rekan mahasiswa yang membutuhkan penguatan pada dimensi C4 dan C5.",
        actionBtn: "Aktifkan Status Tutor Sebaya",
        icon: "fa-solid fa-award",
        btnClass: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20"
      }
    };
  }
}
