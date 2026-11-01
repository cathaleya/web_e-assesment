// Autentik 30 Butir Instrumen Think-Aloud Protocol 3-Tier Doktoral (LBD-S3 / MADEL-S3 / MAGER)
// Sumber: vps_version/deploy/Mager/Soal_Think_Aloud_3Tier_MADEL_S3.md

export interface MagerOption {
  label: string;
  name: string;
  text: string;
  score: number;
}

export interface MagerProbings {
  step1: string;
  step2_tier1: string;
  step3_tier2: string;
  step4_tier3: string;
}

export interface MagerQuestion {
  id: number;
  code: string;
  title: string;
  session: 1 | 2 | 3;
  sessionItemNo: number;
  dimensi: string;
  polarity: string;
  isReversed: boolean;
  contextRef: string;
  statement: string;
  options: MagerOption[];
  probings: MagerProbings;
}

export const MAGER_QUESTIONS: MagerQuestion[] = [
  {
    "id": 1,
    "code": "D1.1",
    "title": "D1.1 Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "session": 1,
    "sessionItemNo": 1,
    "dimensi": "Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #1 (Pedagogical Flexibility) & Fenomena Kehilangan Arah Riset S3 (WD-03).",
    "statement": "LMS atau portal digital kampus menyediakan modul panduan terstruktur yang memberi saya fleksibilitas penuh untuk merancang peta jalan (roadmap) dan target capaian riset disertasi secara mandiri.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Saat membaca frasa 'fleksibilitas penuh untuk merancang peta jalan riset', apa makna yang pertama kali terlintas di benak Anda? Apakah ada kata yang ambigu atau bermakna ganda?",
      "step3_tier2": "Mengapa Anda memilih skor tersebut? Pengalaman nyata apa selama kuliah doktoral yang paling mendasari penilaian Anda terhadap portal kampus?",
      "step4_tier3": "Seberapa yakin Anda dengan skor tersebut (Yakin/Ragu-ragu)? Apakah skala 1–5 ini cukup mewakili rentang fleksibilitas yang Anda rasakan di program S3 Anda?"
    }
  },
  {
    "id": 2,
    "code": "D1.2",
    "title": "D1.2 Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "session": 1,
    "sessionItemNo": 2,
    "dimensi": "Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #6 (Higher-Order Cognitive Scaffolding) & Kritik Thread LMS hanya dropbox tugas (WD-14).",
    "statement": "Platform digital pembelajaran menyediakan fasilitas kurasi dan integrasi basis data literatur yang melatih kapasitas berpikir kritis dan kemampuan sintesis saya, bukan sekadar tempat mengunggah file tugas kuliah.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa makna istilah 'kurasi dan integrasi basis data literatur' bagi Anda sebagai kandidat doktor? Apakah terdengar seperti istilah umum atau spesifik?",
      "step3_tier2": "Apakah LMS kampus Anda saat ini benar-benar melatih sintesis kritis, atau sekadar repositori statis (tempat kumpul file PDF)? Ceritakan contoh nyatanya.",
      "step4_tier3": "Apakah butir ini secara tepat mengukur kedalaman pedagogis tingkat doktor, ataukah terasa seperti tugas S1/S2?"
    }
  },
  {
    "id": 3,
    "code": "D1.3",
    "title": "D1.3 Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "session": 1,
    "sessionItemNo": 3,
    "dimensi": "Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #12 (Methodological Diagnostic Tools) & Fenomena Buntu Bab 3 S3 (WD-08).",
    "statement": "Lingkungan digital menyediakan repositori metodologi dan fasilitas konsultasi asinkron yang efektif memandu pemecahan kebuntuan metodologis dalam riset disertasi saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Bagaimana Anda mengartikan 'kebuntuan metodologis' dalam konteks perjalanan penulisan disertasi Anda?",
      "step3_tier2": "Ketika Anda menghadapi jalan buntu dalam metodologi, apakah sistem digital kampus menyediakan solusi, atau Anda mencarinya secara mandiri di luar sistem?",
      "step4_tier3": "Seberapa yakin Anda dengan pilihan skor Anda? Apakah ada usulan kalimat agar butir ini lebih mencerminkan realitas mahasiswa S3?"
    }
  },
  {
    "id": 4,
    "code": "D1.4",
    "title": "D1.4 Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "session": 1,
    "sessionItemNo": 4,
    "dimensi": "Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #85 (Learner Autonomy) & Fenomena Kuliah Pasif S3 (WD-22).",
    "statement": "Penggunaan teknologi digital dalam pembelajaran doktoral mendorong saya mengambil inisiatif mandiri dalam eksplorasi teoretis mutakhir, bukan sekadar menuruti instruksi pasif dosen.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa yang Anda pahami dari frasa 'inisiatif mandiri dalam eksplorasi teoretis mutakhir'?",
      "step3_tier2": "Dalam perkuliahan S3, apakah lingkungan digital memicu Anda membaca rujukan primer jurnal internasional, atau justru membatasi ruang gerak Anda?",
      "step4_tier3": "Apakah pilihan respon 1–5 mampu menangkap dinamika kemandirian intelektual Anda secara akurat?"
    }
  },
  {
    "id": 5,
    "code": "D1.5",
    "title": "D1.5 Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "session": 1,
    "sessionItemNo": 5,
    "dimensi": "Dukungan Pedagogis & Transformasi Kognitif Mandiri",
    "polarity": "Unfavorable (Reversed -)",
    "isReversed": true,
    "contextRef": "Fenomena MAGER: Cognitive & Administrative Overload pada Mahasiswa Doktoral (WD-31).",
    "statement": "Lingkungan digital kampus membebani saya dengan tumpukan berkas administratif dan materi yang tidak terorganisasi sehingga menghambat fokus riset substansial saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah kata 'beban administratif' dan 'riset substansial' saling bertentangan secara jelas dalam persepsi kognitif Anda?",
      "step3_tier2": "Pernahkah Anda merasa waktu riset Anda tersita habis oleh kerumitan birokrasi sistem digital kampus? Berikan contoh riilnya.",
      "step4_tier3": "Apakah arah butir negatif (kebalikan) ini mudah dipahami, atau sempat membuat Anda terkecoh saat memilih angka skor?"
    }
  },
  {
    "id": 6,
    "code": "D2.1",
    "title": "D2.1 Kolaborasi Akademik & Komunitas Praktik Riset",
    "session": 1,
    "sessionItemNo": 6,
    "dimensi": "Kolaborasi Akademik & Komunitas Praktik Riset",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #7 (Peer-Interaction Space) & Fenomena Grup WA Pengganti LMS (WD-05).",
    "statement": "Lingkungan digital kampus memfasilitasi ruang interaksi terstruktur bagi mahasiswa S3 untuk mendiskusikan progres riset, bertukar instrumen, dan saling mengulas draf artikel.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa makna 'ruang interaksi terstruktur' bagi Anda? Apakah forum diskusi di LMS kampus sudah memenuhi kriteria ini?",
      "step3_tier2": "Apakah Anda dan rekan sesama mahasiswa S3 aktif berdiskusi progres riset di platform resmi kampus, atau justru sepenuhnya berpindah ke WhatsApp/Telegram?",
      "step4_tier3": "Seberapa tepat butir ini menggambarkan kebutuhan komunitas akademik doktoral Anda?"
    }
  },
  {
    "id": 7,
    "code": "D2.2",
    "title": "D2.2 Kolaborasi Akademik & Komunitas Praktik Riset",
    "session": 1,
    "sessionItemNo": 7,
    "dimensi": "Kolaborasi Akademik & Komunitas Praktik Riset",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #19 (Cross-Institutional Networking) & Keterisolasian Kampus Daerah (WD-17).",
    "statement": "Platform digital membuka akses bagi saya untuk terhubung, berjejaring, dan berkolaborasi dengan komunitas peneliti atau laboratorium riset di luar universitas saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Bagaimana Anda menafsirkan 'terhubung dan berkolaborasi dengan komunitas peneliti luar' melalui platform digital kampus?",
      "step3_tier2": "Apakah fasilitas kampus pernah membantu Anda membangun networking riset nasional/internasional, atau Anda berjuang sendiri secara personal?",
      "step4_tier3": "Apakah skala 1–5 mencerminkan tingkat keterbukaan jejaring riset digital yang disediakan institusi?"
    }
  },
  {
    "id": 8,
    "code": "D2.3",
    "title": "D2.3 Kolaborasi Akademik & Komunitas Praktik Riset",
    "session": 1,
    "sessionItemNo": 8,
    "dimensi": "Kolaborasi Akademik & Komunitas Praktik Riset",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #24 (Safe Collaborative Climate) & Fenomena Senioritas Doktoral (WD-33).",
    "statement": "Ruang digital perkuliahan menyediakan mekanisme telaah sejawat (peer-review) antar-mahasiswa S3 yang berjalan aman, suportif, dan bebas dari penghakiman hierarkis.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa arti frasa 'bebas dari penghakiman hierarkis' saat mengulas karya ilmiah rekan sesama mahasiswa doktoral?",
      "step3_tier2": "Bagaimana iklim psikologis yang Anda rasakan ketika karya Anda diulas secara daring oleh rekan S3: merasa terbantu atau merasa dihakimi/terancam?",
      "step4_tier3": "Seberapa yakin Anda dengan skor tersebut, dan apakah kata 'suportif' sudah cukup jelas maknanya dalam konteks ini?"
    }
  },
  {
    "id": 9,
    "code": "D2.4",
    "title": "D2.4 Kolaborasi Akademik & Komunitas Praktik Riset",
    "session": 1,
    "sessionItemNo": 9,
    "dimensi": "Kolaborasi Akademik & Komunitas Praktik Riset",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Kompilasi Studi Emosional S3 & Fenomena 'Sendirian di Ujung Jalan Disertasi' (WD-02).",
    "statement": "Keberadaan forum digital aktif dan grup diskusi riset secara nyata mengurangi rasa terisolasi (loneliness/isolation) selama proses penyelesaian disertasi saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah istilah 'rasa terisolasi (doctoral isolation)' relevan dan dipahami dengan baik dalam konteks perjalanan studi doktoral Anda?",
      "step3_tier2": "Apakah forum digital yang ada berhasil menjadi penyangga emosional dan intelektual Anda dari kejenuhan/kesepian meneliti?",
      "step4_tier3": "Apakah butir ini terlalu sensitif/personal, ataukah sangat tepat mengukur peran lingkungan digital dalam menjaga kesehatan mental riset?"
    }
  },
  {
    "id": 10,
    "code": "D2.5",
    "title": "D2.5 Kolaborasi Akademik & Komunitas Praktik Riset",
    "session": 1,
    "sessionItemNo": 10,
    "dimensi": "Kolaborasi Akademik & Komunitas Praktik Riset",
    "polarity": "Unfavorable (Reversed -)",
    "isReversed": true,
    "contextRef": "Kritik Wacana Digital: Fenomena Grup Pengumuman Mati Suri (WD-29).",
    "statement": "Interaksi digital dalam program doktor saya hanya berjalan searah (pengumuman formal dosen/prodi) tanpa adanya dialog ilmiah antarmahasiswa yang bermakna.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa pemahaman Anda mengenai frasa 'interaksi digital hanya berjalan searah'?",
      "step3_tier2": "Ceritakan kenyataan komunikasi digital harian di program studi Anda: apakah hidup dengan debat keilmuan, atau sekadar pengumuman administratif?",
      "step4_tier3": "Apakah formulasi butir terbalik ini membingungkan Anda dalam menentukan posisi skor (STS vs SS)?"
    }
  },
  {
    "id": 11,
    "code": "D3.1",
    "title": "D3.1 Aksesibilitas Teknologi & Desain Fleksibel",
    "session": 2,
    "sessionItemNo": 1,
    "dimensi": "Aksesibilitas Teknologi & Desain Fleksibel",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #3 (Database Integration & Remote Access) & Keluhan Paywall Riset S3 (WD-11).",
    "statement": "Sistem digital kampus menjamin akses terintegrasi tanpa hambatan teknis (Single-Sign-On) ke basis data jurnal internasional bereputasi (seperti Scopus, Web of Science, ScienceDirect) di mana pun saya berada.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah istilah 'Single-Sign-On (SSO)' dan 'akses tanpa hambatan teknis' sudah dipahami dengan sangat jelas?",
      "step3_tier2": "Bagaimana pengalaman riil Anda saat mencoba mengunduh artikel jurnal internasional bereputasi dari luar jaringan kampus menggunakan akun institusi?",
      "step4_tier3": "Seberapa yakin Anda bahwa butir ini adalah indikator paling vital bagi aksesibilitas digital mahasiswa S3?"
    }
  },
  {
    "id": 12,
    "code": "D3.2",
    "title": "D3.2 Aksesibilitas Teknologi & Desain Fleksibel",
    "session": 2,
    "sessionItemNo": 2,
    "dimensi": "Aksesibilitas Teknologi & Desain Fleksibel",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #15 (Cross-Device Interoperability) & Mobilitas Mahasiswa S3 Pekerja (WD-20).",
    "statement": "Platform akademik digital dapat diakses secara sinkron dan stabil baik melalui laptop, tablet, maupun ponsel cerdas tanpa kehilangan data progres penulisan dan perkuliahan.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa yang Anda maksud dengan 'sinkronisasi multi-perangkat' dalam aktivitas belajar dan riset doktoral Anda?",
      "step3_tier2": "Pernahkah Anda mengalami insiden data hilang atau tata letak antarmuka rusak saat berpindah dari komputer jinjing ke ponsel?",
      "step4_tier3": "Apakah butir ini perlu dipertahankan ataukah akses multi-perangkat sudah menjadi hal lumrah yang tidak perlu ditanyakan lagi?"
    }
  },
  {
    "id": 13,
    "code": "D3.3",
    "title": "D3.3 Aksesibilitas Teknologi & Desain Fleksibel",
    "session": 2,
    "sessionItemNo": 3,
    "dimensi": "Aksesibilitas Teknologi & Desain Fleksibel",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #42 (Research Tools Workflow Integration) & Standar Komputasi Disertasi (WD-37).",
    "statement": "Lingkungan digital kampus memiliki interoperabilitas tinggi dengan peranti lunak riset standar (seperti Reference Managers: Mendeley/Zotero, peranti analisis data kuantitatif/kualitatif).",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah kata 'interoperabilitas' terdengar terlalu teknis, atau sudah dipahami secara luas oleh mahasiswa doktoral?",
      "step3_tier2": "Bagaimana pengalaman Anda saat mengintegrasikan pustaka digital kampus dengan tools analisis (seperti R, SPSS, NVivo, Atlas.ti) yang Anda gunakan?",
      "step4_tier3": "Jika kata 'interoperabilitas' disederhanakan menjadi 'kemudahan terhubung dengan peranti lunak riset', apakah maknanya menjadi lebih mudah dipahami?"
    }
  },
  {
    "id": 14,
    "code": "D3.4",
    "title": "D3.4 Aksesibilitas Teknologi & Desain Fleksibel",
    "session": 2,
    "sessionItemNo": 4,
    "dimensi": "Aksesibilitas Teknologi & Desain Fleksibel",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #50 (Intuitive Navigation & Cognitive Load) & Keluhan Labirin Web Kampus (WD-15).",
    "statement": "Desain antarmuka (UI/UX) portal digital pascasarjana intuitif dan memudahkan pencarian dokumen akademik tanpa menyita waktu dan energi kognitif saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa kriteria antarmuka portal kampus yang 'intuitif' menurut pengalaman Anda?",
      "step3_tier2": "Berapa banyak kebingungan atau klik yang tidak perlu saat Anda mencari pedoman ujian proposal, format instrumen, atau materi kuliah di portal kampus?",
      "step4_tier3": "Apakah skala skor yang Anda berikan mencerminkan kenyamanan navigasi sistem kampus secara objektif?"
    }
  },
  {
    "id": 15,
    "code": "D3.5",
    "title": "D3.5 Aksesibilitas Teknologi & Desain Fleksibel",
    "session": 2,
    "sessionItemNo": 5,
    "dimensi": "Aksesibilitas Teknologi & Desain Fleksibel",
    "polarity": "Unfavorable (Reversed -)",
    "isReversed": true,
    "contextRef": "Fenomena Stres Teknologi (Technostress) & Deadline Riset Terhambat Server (WD-06).",
    "statement": "Saya kerap mengalami kegagalan teknis (server macet, tautan rusak, atau akses pangkalan data terputus) saat sangat membutuhkan rujukan artikel ilmiah krusial.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa reaksi pertama Anda ketika membaca butir tentang 'server macet' dan 'tautan rusak' ini?",
      "step3_tier2": "Seberapa sering kendala teknis semacam ini terjadi, dan seberapa besar dampaknya terhadap target penyelesaian bab disertasi Anda?",
      "step4_tier3": "Apakah butir negatif ini berhasil menangkap frustrasi teknis tanpa menimbulkan kerancuan makna?"
    }
  },
  {
    "id": 16,
    "code": "D4.1",
    "title": "D4.1 Tata Kelola, Keamanan Data, & Etika Digital",
    "session": 2,
    "sessionItemNo": 6,
    "dimensi": "Tata Kelola, Keamanan Data, & Etika Digital",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "TEMUAN KUNCI GAP SLR (Governance Gap) & Kekhawatiran Pencurian Ide Disertasi di Media Sosial (WD-19).",
    "statement": "Lingkungan digital kampus memberikan jaminan tertulis mengenai kerahasiaan dan perlindungan hak cipta atas data mentah riset, instrumen orisinal, serta draf manuskrip yang saya unggah.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa yang Anda pahami tentang 'perlindungan hak cipta atas draf manuskrip dan data mentah riset' di sistem kampus?",
      "step3_tier2": "Apakah Anda merasa aman menyimpan instrumen dan ide riset orisinal Anda di repositori/portal kampus, atau ada kekhawatiran ide Anda diserobot pihak lain?",
      "step4_tier3": "Seberapa penting dimensi keamanan data ini bagi integritas riset S3 Anda, dan apakah butir ini mewakilinya secara akurat?"
    }
  },
  {
    "id": 17,
    "code": "D4.2",
    "title": "D4.2 Tata Kelola, Keamanan Data, & Etika Digital",
    "session": 2,
    "sessionItemNo": 7,
    "dimensi": "Tata Kelola, Keamanan Data, & Etika Digital",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Isu Kontemporer SLR (AI Governance) & Dilema Etika AI Mahasiswa S3 Indonesia (WD-25).",
    "statement": "Program studi/pascasarjana menyediakan kebijakan etika digital dan panduan transparan mengenai batasan sah penggunaan AI generatif (seperti ChatGPT, Claude, Copilot) dalam penulisan disertasi.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Bagaimana institusi Anda mendefinisikan 'batasan sah penggunaan AI generatif' dalam penyusunan tugas dan disertasi?",
      "step3_tier2": "Apakah Anda mendapatkan regulasi/panduan AI yang jelas dan aplikatif dari kampus, ataukah Anda merasa berada dalam area abu-abu?",
      "step4_tier3": "Apakah butir ini sangat mendesak ditanyakan dalam instrumen masa kini (2024–2026), dan apakah pilihan kata sudah tepat?"
    }
  },
  {
    "id": 18,
    "code": "D4.3",
    "title": "D4.3 Tata Kelola, Keamanan Data, & Etika Digital",
    "session": 2,
    "sessionItemNo": 8,
    "dimensi": "Tata Kelola, Keamanan Data, & Etika Digital",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Standar Keamanan Siber Pascasarjana & Isu Phishing Akun Sivitas Akademika (WD-39).",
    "statement": "Sistem digital menerapkan protokol autentikasi berlapis (multi-factor authentication) dan perlindungan privasi yang ketat guna mencegah pencurian identitas akademik dan kebocoran data peneliti.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah konsep 'autentikasi berlapis dan privasi data peneliti' relevan dan dipahami dalam konteks sistem login portal kampus Anda?",
      "step3_tier2": "Pernahkah Anda khawatir akun Anda diretas atau data korespondensi bimbingan disertasi Anda diakses oleh pihak tidak berwenang?",
      "step4_tier3": "Apakah rentang skala 1–5 mampu mencerminkan tingkat kepercayaan Anda pada infrastruktur keamanan siber kampus?"
    }
  },
  {
    "id": 19,
    "code": "D4.4",
    "title": "D4.4 Tata Kelola, Keamanan Data, & Etika Digital",
    "session": 2,
    "sessionItemNo": 9,
    "dimensi": "Tata Kelola, Keamanan Data, & Etika Digital",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Temuan Khusus Tata Kelola: Fenomena Nilai Turnitin 90% Akibat Human Error Admin (WD-13).",
    "statement": "Fasilitas uji similaritas/orisinalitas karya ilmiah dikelola secara transparan dan adil, tanpa memasukkan draf awal disertasi ke repositori publik secara sepihak yang memicu lonjakan plagiarisme buatan.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah Anda memahami masalah teknis 'self-plagiarism akibat draf masuk repositori Turnitin secara sepihak'?",
      "step3_tier2": "Ceritakan pengalaman Anda dalam menggunakan fasilitas cek plagiarisme di kampus: apakah prosedurnya transparan atau memicu kekhawatiran naskah terkunci?",
      "step4_tier3": "Seberapa tepat formulasi kalimat ini dalam menangkap keluhan nyata mahasiswa S3 terkait tata kelola cek similaritas?"
    }
  },
  {
    "id": 20,
    "code": "D4.5",
    "title": "D4.5 Tata Kelola, Keamanan Data, & Etika Digital",
    "session": 2,
    "sessionItemNo": 10,
    "dimensi": "Tata Kelola, Keamanan Data, & Etika Digital",
    "polarity": "Unfavorable (Reversed -)",
    "isReversed": true,
    "contextRef": "Dimensi Tata Kelola (Institutional Mistrust) & Kebijakan Data Pribadi PDP UU No 27/2022 (WD-40).",
    "statement": "Saya merasa cemas dan ragu mengunggah draf karya ilmiah asli ke sistem kampus karena tidak adanya regulasi perlindungan data yang jelas dan kredibel.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa yang memicu rasa 'cemas dan ragu' saat mengunggah karya ilmiah yang belum dipublikasikan ke portal kampus?",
      "step3_tier2": "Pernahkah Anda memilih menahan diri atau tidak mengunggah berkas riset lengkap ke portal kampus karena ragu akan keamanan datanya?",
      "step4_tier3": "Apakah butir negatif ini efektif untuk mengungkap ketidakpercayaan (distrust) mahasiswa terhadap tata kelola digital institusi?"
    }
  },
  {
    "id": 21,
    "code": "D5.1",
    "title": "D5.1 Tugas Autentik & Integrasi Luaran Publikasi",
    "session": 3,
    "sessionItemNo": 1,
    "dimensi": "Tugas Autentik & Integrasi Luaran Publikasi",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #16 (Authentic Assessment for Publication) & Tekanan Syarat Kelulusan Scopus (WD-04).",
    "statement": "Tugas-tugas perkuliahan digital dirancang bertahap untuk menghasilkan draf manuskrip yang siap disubmit ke jurnal bereputasi internasional, bukan sekadar resume teori biasa.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa yang membedakan 'tugas bertahap menuju manuskrip jurnal' dengan 'resume teori biasa' menurut pemahaman Anda di jenjang S3?",
      "step3_tier2": "Apakah perkuliahan digital yang Anda ikuti benar-benar membantu menghasilkan artikel publikasi untuk syarat kelulusan disertasi Anda?",
      "step4_tier3": "Apakah skala 1–5 mampu menangkap kesenjangan antara tuntutan publikasi internasional dengan desain penugasan di perkuliahan Anda?"
    }
  },
  {
    "id": 22,
    "code": "D5.2",
    "title": "D5.2 Tugas Autentik & Integrasi Luaran Publikasi",
    "session": 3,
    "sessionItemNo": 2,
    "dimensi": "Tugas Autentik & Integrasi Luaran Publikasi",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #34 (Simulated Peer-Review & Editorial Skills) & Kendala Menghadapi Reviewer Kejam (WD-21).",
    "statement": "Lingkungan belajar digital menyediakan simulasi autentik alur pengiriman naskah (submission workflow) dan tata cara merespons telaah sejawat (rebuttal letter) standar jurnal internasional.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah frasa 'simulasi alur pengiriman naskah dan penyusunan surat sanggahan telaah sejawat (rebuttal)' dipahami dengan jelas?",
      "step3_tier2": "Apakah kampus Anda memfasilitasi latihan konkret mengelola respon reviewer jurnal, atau Anda harus mempelajarinya sendiri secara otodidak?",
      "step4_tier3": "Apakah butir ini dinilai terlalu spesifik, ataukah memang menjadi kompetensi esensial bagi kelulusan doktor abad ke-21?"
    }
  },
  {
    "id": 23,
    "code": "D5.3",
    "title": "D5.3 Tugas Autentik & Integrasi Luaran Publikasi",
    "session": 3,
    "sessionItemNo": 3,
    "dimensi": "Tugas Autentik & Integrasi Luaran Publikasi",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #55 (Phenomenon-Driven Authentic Tasks) & Kesenjangan Tugas Kuliah vs Disertasi (WD-10).",
    "statement": "Penugasan riset digital menuntut pemecahan fenomena riil dan isu mutakhir di lapangan yang selaras dengan tema besar disertasi saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa yang Anda bayangkan saat membaca 'pemecahan fenomena riil dan isu mutakhir di lapangan'?",
      "step3_tier2": "Apakah tugas-tugas perkuliahan digital S3 Anda sinkron dengan tema disertasi Anda, ataukah berjalan di jalur yang sama sekali terpisah?",
      "step4_tier3": "Seberapa yakin Anda dengan pilihan skor Anda, dan apakah formulasi butir ini sudah cukup lugas?"
    }
  },
  {
    "id": 24,
    "code": "D5.4",
    "title": "D5.4 Tugas Autentik & Integrasi Luaran Publikasi",
    "session": 3,
    "sessionItemNo": 4,
    "dimensi": "Tugas Autentik & Integrasi Luaran Publikasi",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #60 (Developmental E-Portfolio) & Kebutuhan Rekam Jejak Peneliti Pascasarjana (WD-35).",
    "statement": "Platform digital menyediakan fasilitas e-portofolio riset yang mendokumentasikan rekam jejak capaian metodologis, draf tulisan, dan sertifikasi keahlian peneliti secara berkesinambungan.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Bagaimana pemahaman Anda mengenai 'e-portofolio riset peneliti doktoral'?",
      "step3_tier2": "Apakah ada rekam jejak digital yang membantu Anda melihat perkembangan kematangan akademik Anda dari awal semester hingga tahap akhir riset?",
      "step4_tier3": "Apakah butir ini realistis dengan kondisi kampus pascasarjana di Indonesia saat ini, ataukah terkesan terlalu idealis?"
    }
  },
  {
    "id": 25,
    "code": "D5.5",
    "title": "D5.5 Tugas Autentik & Integrasi Luaran Publikasi",
    "session": 3,
    "sessionItemNo": 5,
    "dimensi": "Tugas Autentik & Integrasi Luaran Publikasi",
    "polarity": "Unfavorable (Reversed -)",
    "isReversed": true,
    "contextRef": "Fenomena Prokrastinasi & Sikap Sinis terhadap Tugas Formalitas Kampus (WD-09).",
    "statement": "Penugasan digital dalam program doktor saya terasa seperti formalitas administratif yang repetitif dan tidak memberi nilai tambah bagi kemajuan disertasi saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa makna 'formalitas administratif yang repetitif' dalam penugasan kuliah S3 menurut pandangan Anda?",
      "step3_tier2": "Pernahkah Anda merasa membuang waktu dan energi untuk tugas perkuliahan online yang sama sekali tidak berkontribusi pada disertasi Anda?",
      "step4_tier3": "Apakah butir negatif ini dirasa tajam dan mampu mengekspresikan beban riil mahasiswa doktoral?"
    }
  },
  {
    "id": 26,
    "code": "D6.1",
    "title": "D6.1 Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "session": 3,
    "sessionItemNo": 6,
    "dimensi": "Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #68 (Substantive Formative Feedback) & Bimbingan Berbasis Track Changes (WD-16).",
    "statement": "Promotor dan dosen pembimbing memberikan catatan korektif asinkron yang terperinci, mendalam, dan berbasis metodologi langsung pada berkas draf digital saya.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa kriteria catatan korektif yang 'mendalam dan berbasis metodologi' bagi seorang mahasiswa doktoral?",
      "step3_tier2": "Bagaimana bentuk catatan pembimbingan digital yang biasa Anda terima: coretan detail di berkas Word/PDF atau sekadar komentar singkat 'perbaiki lagi'?",
      "step4_tier3": "Apakah butir ini secara tepat mengukur kualitas substantif umpan balik pembimbingan online?"
    }
  },
  {
    "id": 27,
    "code": "D6.2",
    "title": "D6.2 Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "session": 3,
    "sessionItemNo": 7,
    "dimensi": "Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #82 (Collaborative Version Control) & Kontradiksi Arahan Pembimbing (WD-27).",
    "statement": "Sistem digital menyediakan fitur pelacakan riwayat komentar dan revisi dokumen (version control) yang transparan sehingga meminimalkan kontradiksi arahan antar-promotor.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah istilah 'version control dan pelacakan riwayat revisi' dipahami secara fungsional dalam konteks bimbingan tim promotor?",
      "step3_tier2": "Pernahkah Anda terjebak dalam silang pendapat antara Promotor Utama dan Kopromotor, dan apakah sistem digital membantu mendamaikannya?",
      "step4_tier3": "Seberapa yakin Anda bahwa ketiadaan pelacakan revisi digital menjadi pemicu kebingungan dan lamanya masa studi S3?"
    }
  },
  {
    "id": 28,
    "code": "D6.3",
    "title": "D6.3 Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "session": 3,
    "sessionItemNo": 8,
    "dimensi": "Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #88 (Predictable Feedback Turnaround) & Fenomena Berkas Mengendap Berbulan-bulan (WD-01).",
    "statement": "Lingkungan belajar digital memfasilitasi kesepakatan komitmen waktu reviu berkas yang terprediksi antara promotor dan mahasiswa guna mencegah stagnasi penulisan.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa arti 'komitmen waktu reviu berkas yang terprediksi' bagi ritme kerja riset Anda?",
      "step3_tier2": "Apakah portal bimbingan digital kampus Anda memiliki SLA/batas waktu respons reviu (misalnya maksimal 14 hari), atau berkas bisa mengendap tanpa batas?",
      "step4_tier3": "Apakah butir ini menyentuh akar masalah penundaan (mager) yang dialami mahasiswa doktoral?"
    }
  },
  {
    "id": 29,
    "code": "D6.4",
    "title": "D6.4 Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "session": 3,
    "sessionItemNo": 9,
    "dimensi": "Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "polarity": "Favorable (+)",
    "isReversed": false,
    "contextRef": "Indikator SLR #95 (Transparent Evaluation Rubrics) & Ketidakpastian Standar Kelayakan Disertasi (WD-18).",
    "statement": "Rubrik penilaian dan kriteria kelayakan ujian kualifikasi, proposal, serta kemajuan riset disertasi dapat diakses secara transparan dan terukur melalui portal akademik digital.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apakah konsep 'transparansi rubrik penilaian ujian' sudah terwujud dalam portal akademik yang Anda akses sehari-hari?",
      "step3_tier2": "Ketika Anda menghadapi seminar proposal/ujian kelayakan, apakah Anda tahu persis apa saja indikator penilaian para penguji dari portal digital?",
      "step4_tier3": "Apakah skala 1–5 mencerminkan tingkat keterbukaan tolok ukur akademik di program studi Anda?"
    }
  },
  {
    "id": 30,
    "code": "D6.5",
    "title": "D6.5 Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "session": 3,
    "sessionItemNo": 10,
    "dimensi": "Umpan Balik Formatif & Supervisi Pembimbingan Berkelanjutan",
    "polarity": "Unfavorable (Reversed -)",
    "isReversed": true,
    "contextRef": "Faktor Kunci Keterlambatan Doktor: Ghosting & Stagnasi Komunikasi Pembimbingan Digital (WD-30).",
    "statement": "Proses konsultasi pembimbingan melalui sarana digital kerap macet berbulan-bulan tanpa kejelasan tindak lanjut, sehingga memperlambat masa studi saya secara signifikan.",
    "options": [
      {
        "label": "1",
        "name": "STS",
        "text": "Sangat Tidak Setuju",
        "score": 1
      },
      {
        "label": "2",
        "name": "TS",
        "text": "Tidak Setuju",
        "score": 2
      },
      {
        "label": "3",
        "name": "N",
        "text": "Netral / Ragu-ragu",
        "score": 3
      },
      {
        "label": "4",
        "name": "S",
        "text": "Setuju",
        "score": 4
      },
      {
        "label": "5",
        "name": "SS",
        "text": "Sangat Setuju",
        "score": 5
      }
    ],
    "probings": {
      "step1": "Bacalah pernyataan berikut dengan suara lantang, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.",
      "step2_tier1": "Apa kriteria bahwa proses bimbingan telah 'macet' menurut standar waktu Anda?",
      "step3_tier2": "Ceritakan kenyataan waktu tunggu terlama yang pernah Anda alami saat menyerahkan bab naskah secara daring kepada pembimbing.",
      "step4_tier3": "Apakah butir terbalik ini sangat lugas dan tidak menimbulkan keraguan dalam pemberian nilai ekstrim (misal skor 5 jika bimbingan sangat sering macet)?"
    }
  }
];
