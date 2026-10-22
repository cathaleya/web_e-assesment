// Autentik 10 Butir Instrumen Probing Dosen PPG Pendidikan Seni (2 Sesi x 5 Butir)
// Sumber: vps_version/deploy/instrumen_manajemen/Instrumen_Probing_Dosen_PPG_Pendidikan_Seni.docx

export interface DosenOption {
  label: string;
  text: string;
}

export interface DosenProbings {
  step1: string;
  step2_explain: string;
  step2_specific: string;
  step3_needs: string;
  step4_eval: string;
}

export interface DosenQuestion {
  id: number;
  code: string;
  title: string;
  session: 1 | 2;
  sessionItemNo: number;
  dimensi: string;
  indikator: string;
  lensa: string;
  scenario: string;
  questionPrompt: string;
  options: DosenOption[];
  probings: DosenProbings;
}

export const DOSEN_QUESTIONS: DosenQuestion[] = [
  {
    "id": 1,
    "code": "D01",
    "title": "Menentukan Porsi Seni dalam Kurikulum PPG",
    "session": 1,
    "sessionItemNo": 1,
    "dimensi": "D1 Kurikulum dan Perencanaan Seni",
    "indikator": "D1.1 Menetapkan muatan dan porsi seni berdasarkan kebutuhan",
    "lensa": "Integrasi",
    "scenario": "Dalam rapat prodi, jadwal PPG disusun dengan waktu terbatas. Muncul usul agar materi seni dilebur menjadi satu pertemuan dalam mata kuliah pembelajaran SD karena \"bukan mata pelajaran yang diujikan\".",
    "questionPrompt": "Bagaimana sikap Anda sebagai dosen pengampu?",
    "options": [
      {
        "label": "A",
        "text": "Menghapus materi seni dari PPG dan menyerahkannya kepada sekolah mitra."
      },
      {
        "label": "B",
        "text": "Menambah porsi seni besar-besaran tanpa berdiskusi dengan prodi lain."
      },
      {
        "label": "C",
        "text": "Menunda pembahasan sampai ada instruksi dari pimpinan."
      },
      {
        "label": "D",
        "text": "Menyetujui peleburan satu pertemuan karena sudah menjadi pendapat mayoritas."
      },
      {
        "label": "E",
        "text": "Mengusulkan analisis kebutuhan lebih dulu: memetakan kompetensi seni mahasiswa dan tuntutan kurikulum SD, lalu menetapkan porsi dan bentuk muatan seni berdasarkan hasilnya."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Menurut Anda, mengapa seni sering dianggap kurang penting dalam kurikulum calon guru SD?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 2,
    "code": "D02",
    "title": "Memetakan Kompetensi Awal Seni Mahasiswa",
    "session": 1,
    "sessionItemNo": 2,
    "dimensi": "D2 Asesmen Kompetensi Awal",
    "indikator": "D2.1 Memetakan latar belakang dan keyakinan mengajar seni mahasiswa",
    "lensa": "Survei",
    "scenario": "Mahasiswa PPG Anda berasal dari S1 yang beragam (PGSD, bahasa, sains). Anda tidak tahu siapa yang memiliki pengalaman seni dan siapa yang tidak.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Menanyakan secara lisan di depan kelas siapa yang bisa memainkan alat musik."
      },
      {
        "label": "B",
        "text": "Memberi angket atau tugas diagnostik singkat tentang pengalaman dan keyakinan mengajar seni, lalu memakainya untuk merencanakan dukungan."
      },
      {
        "label": "C",
        "text": "Mengasumsikan semua mahasiswa sama dan memulai dari materi tingkat menengah."
      },
      {
        "label": "D",
        "text": "Mengandalkan latar belakang S1 pada data administrasi sebagai satu-satunya acuan."
      },
      {
        "label": "E",
        "text": "Menunggu mahasiswa yang kesulitan datang sendiri."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda pahami dengan \"tugas diagnostik\", dan bagaimana biasanya Anda mengenali bekal seni mahasiswa?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 3,
    "code": "D03",
    "title": "Mahasiswa Tidak Mendapat Jadwal Seni di PLP",
    "session": 1,
    "sessionItemNo": 3,
    "dimensi": "D3 Pengelolaan PLP",
    "indikator": "D3.1 Menjamin kesempatan mengajar seni selama PLP",
    "lensa": "Aplikasi",
    "scenario": "Laporan PLP menunjukkan hampir semua mahasiswa tidak mendapat jadwal mengajar seni di sekolah mitra.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Menetapkan dalam panduan PLP jumlah minimal pertemuan seni per mahasiswa, mengomunikasikannya kepada sekolah mitra, dan memantaunya melalui jurnal PLP."
      },
      {
        "label": "B",
        "text": "Mewajibkan mahasiswa mengajar seni tanpa koordinasi dengan guru pamong."
      },
      {
        "label": "C",
        "text": "Mengganti praktik seni dengan tugas membuat makalah."
      },
      {
        "label": "D",
        "text": "Menganggap hal itu kewenangan sekolah mitra dan tidak menindaklanjuti."
      },
      {
        "label": "E",
        "text": "Meminta mahasiswa meminta sendiri jadwal seni kepada guru pamong tanpa panduan."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Bagaimana saat ini jumlah kesempatan mengajar seni dipantau di PLP, dan oleh siapa?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 4,
    "code": "D04",
    "title": "Supervisi yang Hanya Menilai Administrasi",
    "session": 1,
    "sessionItemNo": 4,
    "dimensi": "D4 Pendampingan dan Umpan Balik",
    "indikator": "D4.1 Memberi umpan balik spesifik pembelajaran seni",
    "lensa": "Pendampingan",
    "scenario": "Saat supervisi, Anda mengamati mahasiswa mengajar seni dengan kegiatan yang kurang terkelola. Lembar supervisi yang Anda pakai hanya memuat kelengkapan administrasi.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Memberi komentar administrasi saja karena itu yang tercantum di lembar supervisi."
      },
      {
        "label": "B",
        "text": "Meminta mahasiswa mencari perbaikan sendiri tanpa diskusi."
      },
      {
        "label": "C",
        "text": "Menambahkan aspek seni pada lembar observasi (pengelolaan kegiatan, kesesuaian tujuan, penilaian karya), memberi satu kekuatan dan satu saran konkret, lalu menjadwalkan tindak lanjut."
      },
      {
        "label": "D",
        "text": "Menyampaikan bahwa mengajar seni memang sulit dan tidak memberi saran."
      },
      {
        "label": "E",
        "text": "Memberi skor tunggal tanpa catatan."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa arti \"umpan balik spesifik seni\" bagi Anda, dan apa yang membedakannya dari komentar umum?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 5,
    "code": "D05",
    "title": "Sarana dan Media Seni Terbatas",
    "session": 1,
    "sessionItemNo": 5,
    "dimensi": "D5 Sumber Daya dan Keberlanjutan",
    "indikator": "D5.1 Mengelola sarana dan media seni dengan sumber daya terbatas",
    "lensa": "Integrasi",
    "scenario": "Laboratorium PPG hanya memiliki sedikit alat musik dan tidak memiliki ruang seni rupa. Anggaran semester ini tidak bertambah.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Memetakan kebutuhan paling mendesak, memanfaatkan bahan bekas dan media digital gratis, meminjam alat dari sekolah mitra atau komunitas seni, dan mengusulkan prioritas anggaran dengan data."
      },
      {
        "label": "B",
        "text": "Membeli alat mahal dengan uang pribadi tanpa pencatatan."
      },
      {
        "label": "C",
        "text": "Menghapus praktik seni karena sarana terbatas."
      },
      {
        "label": "D",
        "text": "Menyerahkan pengadaan sepenuhnya kepada mahasiswa."
      },
      {
        "label": "E",
        "text": "Menunggu anggaran tahun depan."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa arti \"prioritas\" kebutuhan sarana bagi Anda, dan apa yang Anda utamakan?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 6,
    "code": "D06",
    "title": "Kuliah Seni yang Terasa Tidak Terpakai di PLP",
    "session": 2,
    "sessionItemNo": 1,
    "dimensi": "D1 Kurikulum dan Perencanaan Seni",
    "indikator": "D1.2 Menghubungkan muatan seni di kampus dengan praktik PLP",
    "lensa": "Integrasi",
    "scenario": "Mahasiswa mempelajari seni di kampus, tetapi saat PLP mereka merasa materi itu tidak terpakai di kelas.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Mengganti tugas dengan ujian tertulis seni."
      },
      {
        "label": "B",
        "text": "Memperbanyak teori seni di kampus tanpa mengubah PLP."
      },
      {
        "label": "C",
        "text": "Mengurangi tugas praktik agar mahasiswa tidak terbebani."
      },
      {
        "label": "D",
        "text": "Memetakan capaian mata kuliah seni ke kegiatan PLP, menyusun tugas praktik di kelas, dan merancang pertemuan refleksi bersama."
      },
      {
        "label": "E",
        "text": "Menganggap itu urusan mahasiswa."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda pahami dengan \"keterpaduan\" antara kuliah seni dan PLP?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 7,
    "code": "D07",
    "title": "Menindaklanjuti Hasil Pemetaan Kompetensi",
    "session": 2,
    "sessionItemNo": 2,
    "dimensi": "D2 Asesmen Kompetensi Awal",
    "indikator": "D2.2 Menindaklanjuti hasil pemetaan kompetensi awal",
    "lensa": "Survei",
    "scenario": "Hasil diagnostik menunjukkan sebagian besar mahasiswa belum percaya diri mengajar seni, sedangkan sebagian kecil sudah mahir.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Memberi nilai awal rendah kepada mahasiswa yang belum percaya diri."
      },
      {
        "label": "B",
        "text": "Mengabaikan hasil karena jumlah mahasiswa yang mahir sedikit."
      },
      {
        "label": "C",
        "text": "Memberi materi yang sama untuk semua mahasiswa."
      },
      {
        "label": "D",
        "text": "Membuat jalur dukungan berjenjang: sesi dasar untuk yang belum percaya diri, peran tutor sebaya bagi yang mahir, dan pemantauan perkembangan."
      },
      {
        "label": "E",
        "text": "Membebaskan mahasiswa yang mahir dari seluruh kegiatan seni."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda bayangkan dengan \"jalur dukungan berjenjang\", dan siapa yang menjalankannya?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 8,
    "code": "D08",
    "title": "Guru Pamong Merasa Tidak Kompeten Membimbing Seni",
    "session": 2,
    "sessionItemNo": 3,
    "dimensi": "D3 Pengelolaan PLP",
    "indikator": "D3.2 Berkoordinasi dengan guru pamong dalam pembimbingan seni",
    "lensa": "Pendampingan",
    "scenario": "Seorang guru pamong mengatakan bahwa ia tidak merasa kompeten membimbing seni dan meminta dosen yang menangani bimbingan seni mahasiswa.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Menyelenggarakan pertemuan singkat dengan guru pamong, membagikan panduan observasi seni, dan membagi peran: guru pamong mengamati kelas, dosen memberi umpan balik seni."
      },
      {
        "label": "B",
        "text": "Membiarkan guru pamong dan mahasiswa menyelesaikannya sendiri."
      },
      {
        "label": "C",
        "text": "Menyalahkan guru pamong di forum koordinasi."
      },
      {
        "label": "D",
        "text": "Mengganti guru pamong dengan guru seni dari sekolah lain tanpa komunikasi."
      },
      {
        "label": "E",
        "text": "Menerima dan mengambil seluruh bimbingan seni sendiri tanpa melibatkan guru pamong."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa pembagian peran ideal antara dosen dan guru pamong dalam pembimbingan seni menurut Anda?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 9,
    "code": "D09",
    "title": "Latihan Mandiri Mahasiswa Terbatas Waktu",
    "session": 2,
    "sessionItemNo": 4,
    "dimensi": "D4 Pendampingan dan Umpan Balik",
    "indikator": "D4.2 Memadukan mentoring tatap muka dengan media digital",
    "lensa": "Pendampingan",
    "scenario": "Mahasiswa kesulitan melatih keterampilan seni di luar jam kuliah dan menyampaikan bahwa waktu berlatih mereka terbatas.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Menambah jam kuliah tatap muka."
      },
      {
        "label": "B",
        "text": "Mengganti latihan dengan membaca teori."
      },
      {
        "label": "C",
        "text": "Menyarankan mahasiswa mengunduh aplikasi apa saja."
      },
      {
        "label": "D",
        "text": "Memadukan mentoring tatap muka dengan materi digital bertahap yang dapat diakses mandiri, menetapkan target latihan singkat, dan memantau melalui kelompok kerja."
      },
      {
        "label": "E",
        "text": "Menunda keterampilan seni sampai mahasiswa mengajar nanti."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda pahami dengan \"materi digital bertahap\", dan bagaimana Anda memilih medianya?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 10,
    "code": "D10",
    "title": "Keberlanjutan Program Seni Setelah Dosen Pindah Tugas",
    "session": 2,
    "sessionItemNo": 5,
    "dimensi": "D5 Sumber Daya dan Keberlanjutan",
    "indikator": "D5.2 Menjamin keberlanjutan dan evaluasi program seni",
    "lensa": "Pendampingan",
    "scenario": "Program pendampingan seni berjalan baik semester ini berkat seorang dosen yang aktif, tetapi dosen tersebut akan pindah tugas.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Mengganti evaluasi dengan laporan foto kegiatan."
      },
      {
        "label": "B",
        "text": "Menghentikan program karena bergantung pada satu orang."
      },
      {
        "label": "C",
        "text": "Menganggap program otomatis berlanjut."
      },
      {
        "label": "D",
        "text": "Menyerahkan kepada dosen yang akan pindah untuk mencari pengganti sendiri."
      },
      {
        "label": "E",
        "text": "Mendokumentasikan prosedur, melatih dosen atau guru pamong lain, menyusun indikator evaluasi, dan membahasnya dengan prodi serta sekolah mitra untuk dimasukkan ke rencana program."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa arti \"keberlanjutan\" program bagi Anda, dan siapa yang bertanggung jawab?",
      "step3_needs": "Dukungan apa (kebijakan, waktu, sarana, atau kemitraan) yang Anda perlukan untuk menjalankan pilihan tersebut di program PPG Anda? Seberapa sering situasi seperti ini terjadi di program PPG Anda, dan apa yang saat ini sudah atau belum dilakukan?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi dosen atau pengelola PPG? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  }
];
