// Autentik 15 Butir Instrumen Probing Mahasiswa PPG Pendidikan Seni (3 Sesi x 5 Butir)
// Sumber: vps_version/deploy/instrumen_manajemen/Instrumen_Probing_Mahasiswa_PPG_Pendidikan_Seni.docx

export interface ArtOption {
  label: string;
  text: string;
}

export interface ArtProbings {
  step1: string;
  step2_explain: string;
  step2_specific: string;
  step3_needs: string;
  step4_eval: string;
}

export interface ArtQuestion {
  id: number;
  code: string;
  title: string;
  session: 1 | 2 | 3;
  sessionItemNo: number;
  dimensi: string;
  indikator: string;
  lensa: string;
  scenario: string;
  questionPrompt: string;
  options: ArtOption[];
  probings: ArtProbings;
}

export const ART_QUESTIONS: ArtQuestion[] = [
  {
    "id": 1,
    "code": "M01",
    "title": "Memahami Capaian Pembelajaran Seni di Kelas 2 SD",
    "session": 1,
    "sessionItemNo": 1,
    "dimensi": "P Pemahaman",
    "indikator": "P1.1 Memahami capaian pembelajaran seni SD sesuai kurikulum yang berlaku",
    "lensa": "Survei",
    "scenario": "Guru pamong menyerahkan jadwal Anda dan berkata: \"Minggu depan kamu pegang pelajaran seni di kelas 2. Pakai saja materi di buku, tetapi sesuaikan dengan capaian pembelajarannya.\" Anda belum pernah membaca capaian pembelajaran seni untuk SD.",
    "questionPrompt": "Apa yang Anda lakukan untuk memahami capaian pembelajaran yang harus dituju?",
    "options": [
      {
        "label": "A",
        "text": "Membaca dokumen capaian pembelajaran seni untuk fase yang sesuai, memilih satu elemen yang akan dilatih, lalu mencocokkannya dengan materi di buku."
      },
      {
        "label": "B",
        "text": "Menunggu arahan dosen pembimbing pada pertemuan berikutnya sebelum menyiapkan apa pun."
      },
      {
        "label": "C",
        "text": "Mengikuti urutan halaman di buku siswa dan menganggap isinya sudah sama dengan capaian pembelajaran."
      },
      {
        "label": "D",
        "text": "Menyalin tujuan pembelajaran dari modul ajar tahun lalu milik guru pamong tanpa membandingkannya dengan kurikulum yang berlaku."
      },
      {
        "label": "E",
        "text": "Memilih kegiatan menggambar karena paling mudah disiapkan tanpa mengecek capaian pembelajarannya."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda pahami dengan \"capaian pembelajaran\" seni di SD? Dokumen apa yang terpikir pertama kali?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 2,
    "code": "M02",
    "title": "Memandu Bernyanyi Tanpa Alat Musik",
    "session": 1,
    "sessionItemNo": 2,
    "dimensi": "K Keterampilan",
    "indikator": "K1.1 Memandu kegiatan bernyanyi dan mengiringi dengan sumber yang tersedia",
    "lensa": "Survei",
    "scenario": "Rencana pembelajaran Anda memuat kegiatan menyanyikan lagu nasional bersama siswa kelas 3. Anda tidak bisa memainkan alat musik, dan sekolah tidak memiliki piano atau gitar.",
    "questionPrompt": "Bagaimana Anda memandu kegiatan bernyanyi ini?",
    "options": [
      {
        "label": "A",
        "text": "Menyanyikan lagu tanpa memeriksa nada dan tempo, lalu meminta siswa mengikuti apa adanya."
      },
      {
        "label": "B",
        "text": "Mengganti kegiatan bernyanyi dengan membaca teks lagu karena Anda tidak yakin dengan nada."
      },
      {
        "label": "C",
        "text": "Meminta siswa yang suaranya bagus bernyanyi sendiri, sementara siswa lain hanya mendengarkan."
      },
      {
        "label": "D",
        "text": "Mengajak siswa menyanyi bersama sambil memakai aplikasi pengiring di ponsel, setelah Anda berlatih nada dan tempo lagu itu terlebih dahulu."
      },
      {
        "label": "E",
        "text": "Memutar rekaman lagu, memandu dengan tepuk ritme dan gerakan tangan, lalu meminta siswa bergantian memimpin satu baris."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa arti \"memandu\" bernyanyi bagi Anda, dan bagian mana (nada, tempo, atau memimpin) yang paling sulit?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 3,
    "code": "M03",
    "title": "Mengajar Seni Rupa Tanpa Latar Belakang Seni",
    "session": 1,
    "sessionItemNo": 3,
    "dimensi": "C Kepercayaan Diri",
    "indikator": "C1.1 Yakin mengajar seni meskipun tidak berlatar belakang seni",
    "lensa": "Survei",
    "scenario": "Rekan PLP berkata kepada Anda: \"Seni itu urusan yang jago menyanyi atau menggambar. Kita yang bukan anak seni sebaiknya tukar jadwal saja.\" Besok jadwal Anda mengajar seni rupa.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Meminta rekan yang berlatar seni mengajarkan seluruh sesi, dan Anda hanya mengatur ketertiban kelas."
      },
      {
        "label": "B",
        "text": "Memilih kegiatan sederhana yang sudah Anda coba lebih dulu, lalu meminta guru pamong mengamati dan memberi masukan."
      },
      {
        "label": "C",
        "text": "Menukar jadwal dengan rekan dan berharap tidak mendapat giliran seni lagi."
      },
      {
        "label": "D",
        "text": "Menyalin persis contoh dari internet tanpa mencobanya lebih dulu agar tidak salah."
      },
      {
        "label": "E",
        "text": "Meminta siswa menggambar bebas tanpa arahan karena Anda tidak percaya diri memberi contoh."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda bayangkan saat mendengar \"orang yang berlatar seni\"? Apakah itu memengaruhi pilihan Anda?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 4,
    "code": "M04",
    "title": "Menyusun Modul Ajar Seni yang Selaras",
    "session": 1,
    "sessionItemNo": 4,
    "dimensi": "M Kesiapan Mengelola Pembelajaran",
    "indikator": "M1.1 Menyusun modul ajar seni dengan tujuan, kegiatan, dan asesmen yang selaras",
    "lensa": "Aplikasi",
    "scenario": "Dosen pembimbing meminta modul ajar seni Anda. Draf Anda memuat tujuan \"siswa mengenal warna\", kegiatan \"siswa menyanyi\", dan asesmen \"tes tertulis pilihan ganda\".",
    "questionPrompt": "Bagaimana Anda memperbaiki modul agar selaras?",
    "options": [
      {
        "label": "A",
        "text": "Mengganti tujuan menjadi menyanyi agar sama dengan kegiatan, tanpa memeriksa asesmennya."
      },
      {
        "label": "B",
        "text": "Mengganti asesmen dengan tes lisan singkat saja karena kegiatan seni sulit dinilai."
      },
      {
        "label": "C",
        "text": "Menyelaraskan ketiganya: tujuan tentang warna, kegiatan mencampur dan menempel warna, dan asesmen berupa pengamatan proses serta hasil karya dengan rubrik sederhana."
      },
      {
        "label": "D",
        "text": "Menambah banyak kegiatan agar modul terlihat lengkap tanpa menyesuaikan tujuan."
      },
      {
        "label": "E",
        "text": "Mempertahankan draf karena ketiga bagian sudah memuat unsur seni."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa arti \"selaras\" antara tujuan, kegiatan, dan asesmen menurut Anda?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 5,
    "code": "M05",
    "title": "Muatan Seni dalam Perkuliahan PPG",
    "session": 1,
    "sessionItemNo": 5,
    "dimensi": "U Persepsi Dukungan",
    "indikator": "U1.1 Menilai kecukupan muatan seni dalam kurikulum PPG dan menyampaikan kebutuhan",
    "lensa": "Integrasi",
    "scenario": "Di PPG, materi seni hanya muncul satu kali sebagai bagian dari mata kuliah pembelajaran SD, sedangkan jadwal PLP Anda memuat tiga pertemuan seni.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Menerima kondisi karena materi seni dianggap bisa dipelajari sambil mengajar."
      },
      {
        "label": "B",
        "text": "Mengeluh kepada teman di grup tanpa menyampaikannya kepada dosen."
      },
      {
        "label": "C",
        "text": "Menukar jadwal PLP agar tidak mengajar seni."
      },
      {
        "label": "D",
        "text": "Mencari video tutorial seni secara acak di internet tanpa memeriksa kesesuaiannya dengan kurikulum SD."
      },
      {
        "label": "E",
        "text": "Mencatat bagian seni yang belum Anda kuasai, menyampaikannya kepada dosen pengampu, dan meminta bahan atau sesi tambahan yang terkait kegiatan PLP."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Seberapa banyak materi seni yang Anda terima di PPG sejauh ini, dan apa yang membuat Anda merasa cukup atau kurang?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 6,
    "code": "M06",
    "title": "Pertanyaan Siswa tentang Pencampuran Warna",
    "session": 2,
    "sessionItemNo": 1,
    "dimensi": "P Pemahaman",
    "indikator": "P1.2 Menjelaskan unsur dasar seni rupa kepada siswa SD",
    "lensa": "Survei",
    "scenario": "Saat kegiatan mewarnai di kelas 3, seorang siswa bertanya: \"Kenapa warna merah dan kuning kalau dicampur jadi oranye?\" Anda baru sadar belum mempelajari unsur dan prinsip dasar seni rupa dengan baik.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Meminta siswa bertanya kepada orang tua di rumah dan tidak membahasnya di kelas."
      },
      {
        "label": "B",
        "text": "Mengalihkan pertanyaan dengan meminta siswa menggambar bebas."
      },
      {
        "label": "C",
        "text": "Menjawab \"memang sudah begitu\" agar pelajaran tidak terganggu."
      },
      {
        "label": "D",
        "text": "Mengajak siswa mencoba mencampur warna langsung, mencatat hasilnya bersama, lalu memeriksa istilah warna primer dan sekunder setelah kelas."
      },
      {
        "label": "E",
        "text": "Menjelaskan teori warna yang rumit dengan banyak istilah agar terlihat menguasai materi."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Istilah seni rupa apa dalam situasi ini yang Anda ketahui atau belum Anda ketahui?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 7,
    "code": "M07",
    "title": "Mencontohkan Teknik Dasar Menggambar",
    "session": 2,
    "sessionItemNo": 2,
    "dimensi": "K Keterampilan",
    "indikator": "K1.2 Mendemonstrasikan teknik dasar menggambar atau berkarya sederhana",
    "lensa": "Survei",
    "scenario": "Anda mengajar menggambar pemandangan di kelas 4. Siswa meminta Anda mencontohkan di papan tulis, tetapi Anda tidak terbiasa menggambar.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Menampilkan gambar jadi dari internet dan meminta siswa menirunya persis."
      },
      {
        "label": "B",
        "text": "Menggambar cepat tanpa persiapan dan menghapus berulang kali di depan siswa."
      },
      {
        "label": "C",
        "text": "Mencontohkan dengan bentuk dasar sederhana (lingkaran, segitiga, garis) yang sudah Anda latih sebelumnya, lalu meminta siswa mengembangkannya."
      },
      {
        "label": "D",
        "text": "Meminta siswa yang pandai menggambar mencontohkan, lalu Anda tidak memberi arahan lanjutan."
      },
      {
        "label": "E",
        "text": "Menolak mencontohkan dan meminta siswa menggambar sendiri tanpa contoh."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang membuat Anda ragu mencontohkan, dan apa yang bisa membuat Anda lebih siap?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 8,
    "code": "M08",
    "title": "Mengelola Kelas Saat Kegiatan Musik Ramai",
    "session": 2,
    "sessionItemNo": 3,
    "dimensi": "C Kepercayaan Diri",
    "indikator": "C1.2 Yakin mengelola kelas saat kegiatan seni berlangsung (alat, ruang, suara)",
    "lensa": "Aplikasi",
    "scenario": "Anda membagikan alat musik ritmis sederhana. Kelas menjadi sangat ramai dan siswa saling berebut alat. Guru kelas sebelah melihat dari pintu.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Memberi isyarat berhenti yang sudah disepakati, membagi siswa dalam kelompok kecil, menetapkan giliran dan aturan memakai alat, lalu melanjutkan kegiatan."
      },
      {
        "label": "B",
        "text": "Meminta guru kelas sebelah mengambil alih kelas sampai tenang."
      },
      {
        "label": "C",
        "text": "Berteriak agar siswa diam, lalu melanjutkan tanpa mengubah cara membagi alat."
      },
      {
        "label": "D",
        "text": "Membiarkan kelas ramai karena kegiatan seni memang boleh bebas."
      },
      {
        "label": "E",
        "text": "Menghentikan kegiatan, menyimpan semua alat, dan melanjutkan dengan ceramah."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda pahami dari \"mengelola kelas\" dalam kegiatan seni, dan apa bedanya dengan pelajaran lain?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 9,
    "code": "M09",
    "title": "Alat dan Bahan Kolase Terbatas",
    "session": 2,
    "sessionItemNo": 4,
    "dimensi": "M Kesiapan Mengelola Pembelajaran",
    "indikator": "M1.2 Merencanakan alat, bahan, dan ruang dengan sumber daya terbatas",
    "lensa": "Aplikasi",
    "scenario": "Anda merencanakan kegiatan kolase, tetapi kelas tidak memiliki kertas warna dan hanya ada 10 gunting untuk 30 siswa.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Membatalkan kolase dan menggantinya dengan menyalin teks."
      },
      {
        "label": "B",
        "text": "Meminta siswa membawa bahan bekas (koran, kertas, daun kering) dari rumah, menyiapkan stasiun kerja bergilir untuk gunting, dan memberi tahu sehari sebelumnya."
      },
      {
        "label": "C",
        "text": "Membagi gunting tanpa aturan dan melihat hasilnya nanti."
      },
      {
        "label": "D",
        "text": "Membeli bahan mahal dengan uang pribadi tanpa memberi tahu sekolah."
      },
      {
        "label": "E",
        "text": "Meminta guru pamong menunda seni ke pekan depan tanpa menyiapkan alternatif bahan."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Bahan atau alat apa di sekitar Anda yang terpikir sebagai pengganti?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 10,
    "code": "M10",
    "title": "Jadwal Seni Tidak Muncul di PLP",
    "session": 2,
    "sessionItemNo": 5,
    "dimensi": "U Persepsi Dukungan",
    "indikator": "U1.2 Mengupayakan kesempatan mengajar seni selama PLP",
    "lensa": "Aplikasi",
    "scenario": "Selama PLP, jadwal Anda hanya berisi matematika dan bahasa Indonesia. Guru pamong berkata seni jarang diajarkan karena \"tidak diujikan\".",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Meminta dosen menghubungi kepala sekolah langsung tanpa membicarakannya lebih dulu dengan guru pamong."
      },
      {
        "label": "B",
        "text": "Menerima jadwal yang ada dan tidak menyinggung seni lagi."
      },
      {
        "label": "C",
        "text": "Mengusulkan kepada guru pamong satu pertemuan seni yang terintegrasi dengan materi yang sedang berjalan, lalu melaporkannya kepada dosen pembimbing."
      },
      {
        "label": "D",
        "text": "Mengganti seluruh jadwal PLP dengan kegiatan seni karena merasa seni penting."
      },
      {
        "label": "E",
        "text": "Mengajar seni diam-diam saat jam pelajaran lain tanpa izin."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Menurut Anda, mengapa seni jarang diajarkan di sekolah tempat Anda PLP atau sekolah yang Anda kenal?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 11,
    "code": "M11",
    "title": "Gerak dan Lagu untuk Kelas 1 dan Kelas 6",
    "session": 3,
    "sessionItemNo": 1,
    "dimensi": "P Pemahaman",
    "indikator": "P1.3 Memilih kegiatan seni sesuai tahap perkembangan siswa",
    "lensa": "Survei",
    "scenario": "Anda mengajar kelas 1 dan kelas 6 pada hari yang sama dengan materi \"gerak dan lagu\". Rencana Anda memakai kegiatan yang sama untuk keduanya.",
    "questionPrompt": "Bagaimana Anda menyesuaikan kegiatan?",
    "options": [
      {
        "label": "A",
        "text": "Memakai kegiatan yang sama karena materinya sama."
      },
      {
        "label": "B",
        "text": "Menyesuaikan tingkat kesulitan: kelas 1 meniru gerak sederhana dengan lagu pendek, kelas 6 menyusun gerak kelompok sendiri."
      },
      {
        "label": "C",
        "text": "Meniadakan kegiatan gerak untuk kelas 1 karena dianggap belum mampu."
      },
      {
        "label": "D",
        "text": "Memberi kegiatan lebih mudah untuk kelas 6 agar semuanya cepat selesai."
      },
      {
        "label": "E",
        "text": "Memberi kegiatan lebih sulit untuk kelas 1 agar mereka cepat belajar."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa perbedaan kemampuan siswa kelas 1 dan kelas 6 yang Anda bayangkan dalam gerak dan lagu?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 12,
    "code": "M12",
    "title": "Bermain Peran yang Dihindari Siswa",
    "session": 3,
    "sessionItemNo": 2,
    "dimensi": "K Keterampilan",
    "indikator": "K1.3 Memandu gerak atau bermain peran sederhana",
    "lensa": "Survei",
    "scenario": "Modul meminta siswa bermain peran tentang menjaga kebersihan. Siswa malu-malu dan tidak ada yang mau maju. Anda tidak punya pengalaman teater.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Mengganti kegiatan dengan membaca teks dialog dari buku."
      },
      {
        "label": "B",
        "text": "Memberi nilai rendah kepada siswa yang tidak mau maju agar mau tampil."
      },
      {
        "label": "C",
        "text": "Menunjuk siswa secara paksa untuk maju satu per satu."
      },
      {
        "label": "D",
        "text": "Menunda kegiatan sampai ada guru seni."
      },
      {
        "label": "E",
        "text": "Memandu pemanasan bersama (meniru gerak hewan), membagi peran dalam kelompok kecil, dan mencontohkan satu adegan singkat sendiri."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Pernahkah Anda bermain peran atau memandu gerak sebelumnya? Apa yang terpikir sebagai langkah pertama?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 13,
    "code": "M13",
    "title": "Menanggapi Pertanyaan \"Bagus Tidak?\"",
    "session": 3,
    "sessionItemNo": 3,
    "dimensi": "C Kepercayaan Diri",
    "indikator": "C1.3 Yakin memberi umpan balik yang membangun pada karya siswa",
    "lensa": "Aplikasi",
    "scenario": "Seorang siswa menunjukkan lukisannya dan bertanya, \"Bagus tidak?\" Gambar itu tidak sesuai tema, dan Anda tidak yakin cara menilai karya seni.",
    "questionPrompt": "Bagaimana Anda menanggapi?",
    "options": [
      {
        "label": "A",
        "text": "Menjawab \"bagus sekali\" tanpa komentar tambahan agar siswa senang."
      },
      {
        "label": "B",
        "text": "Mengatakan gambar itu salah karena tidak sesuai tema."
      },
      {
        "label": "C",
        "text": "Menyebutkan satu hal yang sudah baik, mengajukan pertanyaan tentang makna gambar, lalu mengarahkan siswa pada bagian yang bisa dikembangkan sesuai tema."
      },
      {
        "label": "D",
        "text": "Membandingkannya dengan karya siswa lain yang lebih rapi."
      },
      {
        "label": "E",
        "text": "Mengalihkan percakapan karena Anda belum yakin memberi penilaian."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa arti \"umpan balik yang membangun\" pada karya seni siswa menurut Anda?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 14,
    "code": "M14",
    "title": "Menilai Proses dan Produk Karya Patung Tanah Liat",
    "session": 3,
    "sessionItemNo": 4,
    "dimensi": "M Kesiapan Mengelola Pembelajaran",
    "indikator": "M1.3 Menyusun asesmen proses dan produk karya seni",
    "lensa": "Aplikasi",
    "scenario": "Dosen meminta Anda melampirkan instrumen asesmen untuk kegiatan membuat patung tanah liat. Anda hanya menyiapkan satu nilai akhir berdasarkan kesan \"bagus atau tidak\".",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Meniadakan penilaian karena seni dianggap bebas."
      },
      {
        "label": "B",
        "text": "Tetap memakai satu nilai berdasarkan kesan umum."
      },
      {
        "label": "C",
        "text": "Menilai hanya kerapian karena paling mudah diamati."
      },
      {
        "label": "D",
        "text": "Menyusun rubrik sederhana dengan kriteria proses (keterlibatan, kerja sama) dan produk (bentuk, kerapian, kesesuaian tema), lalu mencatat observasi saat siswa bekerja."
      },
      {
        "label": "E",
        "text": "Meminta siswa menilai karya temannya tanpa panduan kriteria."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Apa yang Anda pahami dengan \"rubrik\", dan kriteria apa yang terpikir untuk karya patung tanah liat?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  },
  {
    "id": 15,
    "code": "M15",
    "title": "Umpan Balik Seni dan Media Digital",
    "session": 3,
    "sessionItemNo": 5,
    "dimensi": "U Persepsi Dukungan",
    "indikator": "U1.3 Memanfaatkan umpan balik pembimbing dan media digital untuk memperbaiki pembelajaran seni",
    "lensa": "Pendampingan",
    "scenario": "Setelah mengajar seni, Anda ingin tahu bagian mana yang perlu diperbaiki. Dosen pembimbing hanya memberi komentar umum tentang administrasi, sedangkan Anda memiliki akses ke video dan aplikasi pembelajaran seni.",
    "questionPrompt": "Apa yang Anda lakukan?",
    "options": [
      {
        "label": "A",
        "text": "Meminta dosen atau guru pamong menilai dua hal spesifik (pengelolaan kegiatan dan umpan balik kepada siswa), merekam sebagian kegiatan dengan izin untuk refleksi, dan memakai video atau aplikasi seni untuk melatih bagian yang lemah."
      },
      {
        "label": "B",
        "text": "Mengandalkan komentar teman sebaya tanpa panduan."
      },
      {
        "label": "C",
        "text": "Menganggap pembelajaran sudah baik karena tidak ada komentar khusus tentang seni."
      },
      {
        "label": "D",
        "text": "Berhenti mengajar seni karena tidak ada yang membimbing."
      },
      {
        "label": "E",
        "text": "Memakai aplikasi pembelajaran seni apa saja tanpa menilai kesesuaiannya."
      }
    ],
    "probings": {
      "step1": "Bacalah situasi dengan suara keras, lalu pilih satu tindakan yang paling tepat. Suarakan semua yang Anda pikirkan sejak mulai membaca sampai menentukan pilihan.",
      "step2_explain": "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan mengapa Anda memilih tindakan tersebut dibanding opsi lainnya?",
      "step2_specific": "Umpan balik seperti apa tentang pembelajaran seni yang pernah atau belum pernah Anda terima?",
      "step3_needs": "Dukungan apa dari dosen, guru pamong, atau program PPG yang paling Anda perlukan agar bisa menjalankan pilihan tersebut di kelas? Hambatan terbesar apa yang mungkin Anda hadapi jika situasi ini terjadi di PLP Anda?",
      "step4_eval": "Adakah kata, istilah, atau kalimat yang sulit dipahami atau perlu dibaca ulang? Bagian mana? Adakah dua pilihan yang sulit dibedakan, atau pilihan yang terlalu jelas benar atau terlalu jelas salah? Apakah situasi ini realistis bagi calon guru atau mahasiswa PLP? Adakah tindakan lain yang lebih Anda pilih tetapi tidak tersedia?"
    }
  }
];
