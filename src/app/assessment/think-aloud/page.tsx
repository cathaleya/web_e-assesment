"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";

interface SpecialQuestion {
  sjtId: string;
  no: number;
  title: string;
  question: string;
}

const specialQuestions: SpecialQuestion[] = [
  { sjtId: "SJT_01", no: 1, title: "Validasi Modul Pembelajaran dari Blog Guru", question: "Menurut Anda, apa artinya memeriksa kelayakan modul dari blog? Langkah apa yang terpikir pertama kali?" },
  { sjtId: "SJT_02", no: 2, title: "Mengatasi Kebosanan Sejarah dengan Advanced Search", question: "Apakah Anda mengenal fitur Advanced Search? Apakah pengetahuan tentang fitur itu memengaruhi pilihan Anda?" },
  { sjtId: "SJT_03", no: 3, title: "Menyikapi Klaim Gamifikasi Instan di Media Sosial", question: "Bagian mana dari klaim tersebut yang membuat Anda percaya atau ragu?" },
  { sjtId: "SJT_04", no: 16, title: "Mengelola File Referensi yang Menumpuk di Laptop", question: "Apakah Anda mengenal aplikasi pengelola referensi? Apakah istilah dalam opsi dipahami?" },
  { sjtId: "SJT_05", no: 17, title: "Menyaring Kebocoran Soal Palsu di Grup Angkatan", question: "Apa yang membuat Anda menyimpulkan informasi itu palsu atau asli?" },
  { sjtId: "SJT_06", no: 18, title: "Pengumpulan Data Kebutuhan E-Book Kelas", question: "Data apa yang menurut Anda perlu dikumpulkan sebelum memutuskan?" },
  { sjtId: "SJT_07", no: 4, title: "Penyalahgunaan Aset Visual Milik Profesor Terkenal", question: "Menurut Anda, situasi ini lebih tentang hak cipta, etika, atau hal lain?" },
  { sjtId: "SJT_08", no: 5, title: "Kasus Perundungan Siber Halus di YouTube Kelas", question: "Bagian mana dari cerita yang menurut Anda menunjukkan perundungan? Apakah perundungan itu terlihat jelas?" },
  { sjtId: "SJT_09", no: 6, title: "Penolakan Agresif Teknologi Ujian oleh Guru Senior", question: "Apakah posisi Anda sebagai mahasiswa PLP di hadapan guru senior memengaruhi pilihan Anda?" },
  { sjtId: "SJT_10", no: 19, title: "Penanganan Keluhan Dosen Mengenai Format Tugas di Email", question: "Apa yang Anda pahami tentang netiket dalam surel kepada dosen?" },
  { sjtId: "SJT_11", no: 20, title: "Menghubungi Guru Pamong yang Resisten via WhatsApp", question: "Apakah Anda merasakan perbedaan nada pesan antaropsi? Opsi mana yang terasa paling sopan dan efektif?" },
  { sjtId: "SJT_12", no: 21, title: "Menjawab Pertanyaan Sensitif Siswa di Forum Publik Daring", question: "Informasi apa dalam skenario ini yang menurut Anda sensitif? Mengapa?" },
  { sjtId: "SJT_13", no: 7, title: "Menghadapi Anggota Kelompok yang Pasif (Freerider)", question: "Apakah istilah freerider dipahami? Apa yang Anda bayangkan tentang anggota kelompok ini?" },
  { sjtId: "SJT_14", no: 8, title: "Konflik Tumpang Tindih Kewenangan Divisi Publikasi Digital", question: "Siapa yang menurut Anda berwenang memutuskan dalam situasi ini?" },
  { sjtId: "SJT_15", no: 9, title: "Menghindari Kekacauan Edit Bersama di Google Docs", question: "Apakah Anda pernah mengalami penyuntingan bersama yang kacau? Apakah situasi ini terasa nyata?" },
  { sjtId: "SJT_16", no: 22, title: "Delegasi Tugas Projek Akhir yang Kompleks via Trello", question: "Apakah Anda mengenal Trello? Apakah ketidaktahuan tentang aplikasi itu menyulitkan Anda memilih?" },
  { sjtId: "SJT_17", no: 23, title: "Melacak Kontribusi Menggunakan Version History Docs", question: "Apakah istilah version history dipahami? Bagaimana Anda membayangkan cara kerjanya?" },
  { sjtId: "SJT_18", no: 24, title: "Berbagi Beban Kognitif saat Menyusun RPP Tematik Terpadu", question: "Apa yang Anda pahami dari frasa 'berbagi beban kognitif'? Apakah istilah ini perlu diganti?" },
  { sjtId: "SJT_19", no: 10, title: "Desain Slide Pembelajaran Sains SD yang Interaktif", question: "Apa yang Anda pahami dari kata 'interaktif' dalam skenario ini?" },
  { sjtId: "SJT_20", no: 11, title: "Memotong Klip Video Sejarah Menggunakan Edpuzzle", question: "Apakah Anda mengenal Edpuzzle? Jika tidak, apakah Anda tetap dapat menilai opsi?" },
  { sjtId: "SJT_21", no: 12, title: "Menyediakan Takarir Video untuk Lingkungan Bising", question: "Apakah istilah 'takarir' dipahami? Apa padanan yang biasa Anda gunakan?" },
  { sjtId: "SJT_22", no: 25, title: "Merancang Modul Biologi Adaptif untuk Berbagai Gaya Belajar", question: "Apa arti 'adaptif untuk berbagai gaya belajar' menurut Anda?" },
  { sjtId: "SJT_23", no: 26, title: "Merancang Modul Bencana Alam Bebas Hak Cipta", question: "Apakah Anda mengenal lisensi Creative Commons? Bagaimana Anda membedakan materi yang boleh dan tidak boleh dipakai?" },
  { sjtId: "SJT_24", no: 27, title: "Mengamankan Video Pembelajaran Menggunakan Watermark", question: "Apakah tujuan penggunaan watermark dalam skenario ini jelas?" },
  { sjtId: "SJT_25", no: 13, title: "Tugas Mengolah 1000 Baris Data Nilai Rapor via Excel", question: "Apakah kemampuan Anda menggunakan rumus Excel memengaruhi pilihan?" },
  { sjtId: "SJT_26", no: 14, title: "Gawat Darurat Internet Terputus Saat ANBK di Sekolah", question: "Apakah Anda mengenal ANBK? Apa peran Anda dalam skenario ini menurut pemahaman Anda?" },
  { sjtId: "SJT_27", no: 15, title: "Materi Literasi Digital di Sekolah Tanpa Listrik", question: "Apakah kondisi sekolah dalam skenario ini terasa realistis?" },
  { sjtId: "SJT_28", no: 28, title: "Rencana Cadangan Saat Server Web Quizizz Tiba-tiba Down", question: "Sebelum melihat opsi, rencana cadangan apa yang terpikir oleh Anda?" },
  { sjtId: "SJT_29", no: 29, title: "Serangan Pop-Up Iklan Tak Senonoh saat Mengajar Daring", question: "Apa langkah pertama yang terpikir? Apakah redaksi skenario ini nyaman dibaca?" },
  { sjtId: "SJT_30", no: 30, title: "Laptop Dosen Penguji Tidak Kompatibel dengan File Presentasi", question: "Apa yang terpikir pertama kali ketika membaca masalah ini?" }
];

export default function ThinkAloudProtocolPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"guidance" | "probing" | "items">("guidance");
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Gagal mengaktifkan mikrofon:", err);
      alert("Izin mikrofon diperlukan untuk melakukan sesi Think-Aloud Suara.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentItem = specialQuestions[selectedItemIdx];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col py-4 md:py-8 px-3 md:px-6"
      style={{
        backgroundImage: "url('/unj_bg_v2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <main className="relative z-10 w-full max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* TOP HEADER TIMBUL THICK CORAL THEME */}
        <div className="card-timbul p-5 md:p-7 rounded-[28px] md:rounded-[36px] bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 text-white border-2 border-rose-950 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner shrink-0">
                <i className="fa-solid fa-microphone-lines text-2xl md:text-3xl text-rose-300"></i>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-300 block mb-0.5">
                  WAWANCARA KOGNITIF (THINK-ALOUD)
                </span>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                  PROTOKOL SUARA MADEL-5C
                </h1>
                <p className="text-[10px] md:text-[11px] font-bold text-rose-100/90 mt-0.5">
                  Menyuarakan Proses Respons &amp; Pemikiran Kognitif dalam Pengisian SJT Literasi Digital
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/20 transition-all active:scale-95 shrink-0 self-start md:self-center"
            >
              <i className="fa-solid fa-arrow-left mr-1.5"></i> Dashboard
            </button>
          </div>

          {/* RECORDING AUDIO PANEL WIDGET */}
          <div className="mt-5 p-4 bg-black/30 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  isRecording
                    ? "bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.8)]"
                    : "bg-white/10 text-rose-200"
                }`}
              >
                <i className={`fa-solid ${isRecording ? "fa-circle-dot" : "fa-microphone"}`}></i>
              </div>
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-rose-200 block">
                  Perekam Suara Think-Aloud
                </span>
                <p className="text-sm font-black text-white font-mono">
                  {isRecording ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      MEREKAM... {formatTime(recordingTime)}
                    </span>
                  ) : (
                    "Siap Merekam Suara"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg border-b-2 border-emerald-950 transition-all active:scale-95"
                >
                  <i className="fa-solid fa-microphone mr-1.5"></i> Mulai Rekam
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg border-b-2 border-rose-950 transition-all active:scale-95"
                >
                  <i className="fa-solid fa-square mr-1.5"></i> Hentikan Rekaman
                </button>
              )}

              {audioUrl && !isRecording && (
                <audio controls src={audioUrl} className="h-8 max-w-[180px] rounded-lg shadow-sm" />
              )}
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION BUTTONS */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/80 shadow-inner">
          <button
            onClick={() => setActiveTab("guidance")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "guidance"
                ? "bg-rose-800 text-white shadow-md border-b-2 border-rose-950"
                : "bg-transparent text-slate-700 hover:bg-slate-300/60"
            }`}
          >
            <i className="fa-solid fa-book-open mr-1.5"></i> 1. Panduan &amp; Strategi
          </button>

          <button
            onClick={() => setActiveTab("probing")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "probing"
                ? "bg-rose-800 text-white shadow-md border-b-2 border-rose-950"
                : "bg-transparent text-slate-700 hover:bg-slate-300/60"
            }`}
          >
            <i className="fa-solid fa-comments mr-1.5"></i> 2. Pertanyaan Probing Umum
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "items"
                ? "bg-rose-800 text-white shadow-md border-b-2 border-rose-950"
                : "bg-transparent text-slate-700 hover:bg-slate-300/60"
            }`}
          >
            <i className="fa-solid fa-list-check mr-1.5"></i> 3. Probing Khusus (30 SJT)
          </button>
        </div>

        {/* TAB 1: PANDUAN & STRATEGI */}
        <AnimatePresence mode="wait">
          {activeTab === "guidance" && (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="card-timbul p-5 md:p-6 rounded-[24px] bg-white border border-rose-200 space-y-4">
                <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
                    <i className="fa-solid fa-bullseye"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase">Tujuan Protokol Think-Aloud</h3>
                    <p className="text-[10px] font-bold text-slate-500">Rujukan: Ericsson &amp; Simon (1993); Willis (2005)</p>
                  </div>
                </div>

                <p className="text-[11px] md:text-xs font-bold text-slate-800 leading-relaxed">
                  Protokol ini bertujuan memperoleh bukti proses respons secara langsung: yaitu memeriksa apakah mahasiswa calon guru memahami skenario dan opsi sebagaimana dimaksud penulis butir, serta apakah penalaran mereka selaras dengan logika kunci penskoran.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-bold">
                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-900 block mb-1">
                      <i className="fa-solid fa-users text-rose-700 mr-1"></i> Partisipan Sesi
                    </span>
                    <p className="text-slate-800">
                      5 mahasiswa calon guru (purposif dengan variasi prodi, jenis kelamin, &amp; kecakapan teknologi).
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-900 block mb-1">
                      <i className="fa-solid fa-clock text-rose-700 mr-1"></i> Durasi &amp; Metode
                    </span>
                    <p className="text-slate-800">
                      60–90 menit per sesi (individual, tatap muka atau daring via perekam suara).
                    </p>
                  </div>
                </div>
              </div>

              {/* STRATEGI PENGERJAAN 2 TINGKAT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-timbul p-5 rounded-[24px] bg-white border border-rose-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shadow-xs">
                    1
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">Concurrent Think-Aloud</h4>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-700 leading-relaxed">
                    Menyuarakan secara lisan setiap pikiran, kebingungan, pertimbangan, dan alasan yang terlintas saat membaca skenario dan memilih opsi jawaban secara langsung.
                  </p>
                </div>

                <div className="card-timbul p-5 rounded-[24px] bg-white border border-rose-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xs shadow-xs">
                    2
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">Retrospective Probing</h4>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-700 leading-relaxed">
                    Pertanyaan pendalaman yang diajukan peneliti setelah partisipan memilih jawaban untuk menggali pemahaman bahasa, realisme situasi, dan alasan keputusan.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PERTANYAAN PROBING UMUM */}
          {activeTab === "probing" && (
            <motion.div
              key="probing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="card-timbul p-4 md:p-5 rounded-[24px] bg-white border border-rose-200">
                <h3 className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-comments text-rose-700"></i> Pertanyaan Pendalaman Umum per Butir
                </h3>
                <p className="text-[10px] font-bold text-slate-600 italic">
                  Diajukan setelah partisipan memilih jawaban untuk memeriksa 4 aspek utama kognitif:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-bold">
                {/* Aspect 1 */}
                <div className="p-4 card-timbul rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 rounded-lg text-[8px] font-black uppercase">
                    1. Pemahaman Situasi
                  </span>
                  <div className="space-y-1.5 text-slate-800">
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-rose-900">P1:</strong> &quot;Dengan kata-kata Anda sendiri, situasi ini menceritakan apa?&quot;
                    </p>
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-rose-900">P2:</strong> &quot;Menurut Anda, apa masalah utama yang harus diputuskan?&quot;
                    </p>
                  </div>
                </div>

                {/* Aspect 2 */}
                <div className="p-4 card-timbul rounded-2xl bg-white border border-slate-200 space-y-2">
                  <span className="px-2.5 py-0.5 bg-sky-100 text-sky-900 rounded-lg text-[8px] font-black uppercase">
                    2. Kejelasan Bahasa &amp; Konteks
                  </span>
                  <div className="space-y-1.5 text-slate-800">
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-sky-900">B1:</strong> &quot;Adakah kata atau istilah yang tidak dipahami / asing?&quot;
                    </p>
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-sky-900">K1:</strong> &quot;Apakah situasi ini pernah Anda alami saat PLP / perkuliahan?&quot;
                    </p>
                  </div>
                </div>

                {/* Aspect 3 */}
                <div className="p-4 card-timbul rounded-2xl bg-white border border-slate-200 space-y-2 sm:col-span-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-lg text-[8px] font-black uppercase">
                    3. Evaluasi Opsi Jawaban
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-emerald-900">O1:</strong> &quot;Mengapa memilih opsi itu daripada opsi lain?&quot;
                    </p>
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-emerald-900">O2:</strong> &quot;Opsi mana yang menurut Anda paling tidak tepat? Mengapa?&quot;
                    </p>
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-emerald-900">O3:</strong> &quot;Adakah dua opsi yang terasa sama saja / membingungkan?&quot;
                    </p>
                    <p className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <strong className="text-emerald-900">O5:</strong> &quot;Adakah tindakan lain yang lebih Anda pilih tetapi tidak ada di opsi?&quot;
                    </p>
                  </div>
                </div>

                {/* Aspect 4 */}
                <div className="p-4 card-timbul rounded-2xl bg-white border border-slate-200 space-y-2 sm:col-span-2">
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-lg text-[8px] font-black uppercase">
                    4. Tingkat Keyakinan Decision (D1 &amp; D2)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                    <p className="p-2 bg-amber-50/60 rounded-xl border border-amber-200/80">
                      <strong className="text-amber-950">D1:</strong> &quot;Seberapa yakin Anda dengan pilihan tadi (skala 1–5)? Apa yang membuat Anda ragu?&quot;
                    </p>
                    <p className="p-2 bg-amber-50/60 rounded-xl border border-amber-200/80">
                      <strong className="text-amber-950">D2:</strong> &quot;Apakah Anda memilih tindakan yang dianggap paling tepat, atau tindakan yang benar-benar akan Anda lakukan?&quot;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: PROBING KHUSUS 30 SJT */}
          {activeTab === "items" && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="card-timbul p-4 md:p-5 rounded-[24px] bg-white border border-rose-200">
                <h3 className="text-xs font-black text-slate-900 uppercase mb-1">
                  <i className="fa-solid fa-list-check text-rose-700 mr-1.5"></i> Pertanyaan Pendalaman Khusus Per Butir (30 SJT)
                </h3>
                <p className="text-[10px] font-bold text-slate-600">
                  Pilih salah satu nomor butir di bawah untuk melihat judul situasi dan pertanyaan khusus kognitifnya:
                </p>

                {/* ITEM NUMBERS GRID SELECTOR */}
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 mt-3">
                  {specialQuestions.map((q, idx) => (
                    <button
                      key={q.sjtId}
                      onClick={() => setSelectedItemIdx(idx)}
                      className={`py-2 rounded-xl text-[10px] font-black transition-all ${
                        selectedItemIdx === idx
                          ? "bg-rose-800 text-white shadow-md border-b-2 border-rose-950 scale-105"
                          : "bg-slate-100 hover:bg-rose-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      #{q.no}
                    </button>
                  ))}
                </div>
              </div>

              {/* DISPLAY SELECTED ITEM DETAIL CARD TIMBUL */}
              {currentItem && (
                <div className="card-timbul p-5 md:p-6 rounded-[28px] bg-gradient-to-br from-rose-50/90 via-white to-red-50/60 border border-rose-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 bg-rose-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {currentItem.sjtId} (Soal #{currentItem.no})
                      </span>
                      <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase">
                        {currentItem.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-rose-200 shadow-sm space-y-2">
                    <span className="text-[9px] font-black text-rose-900 uppercase tracking-widest block">
                      <i className="fa-solid fa-circle-question text-rose-700 mr-1"></i> Pertanyaan Khusus Kognitif Peneliti:
                    </span>
                    <p className="text-xs md:text-sm font-bold text-slate-900 leading-relaxed italic">
                      &quot;{currentItem.question}&quot;
                    </p>
                  </div>

                  {/* ITEM NAVIGATION PREV/NEXT */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      disabled={selectedItemIdx === 0}
                      onClick={() => setSelectedItemIdx((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 rounded-xl text-[10px] font-black uppercase border border-slate-200 transition-all"
                    >
                      <i className="fa-solid fa-arrow-left mr-1"></i> Butir Sebelumnya
                    </button>
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      Butir {selectedItemIdx + 1} dari 30
                    </span>
                    <button
                      disabled={selectedItemIdx === specialQuestions.length - 1}
                      onClick={() => setSelectedItemIdx((prev) => Math.min(specialQuestions.length - 1, prev + 1))}
                      className="px-4 py-2 bg-rose-800 hover:bg-rose-900 disabled:opacity-40 text-white rounded-xl text-[10px] font-black uppercase border-b-2 border-rose-950 transition-all"
                    >
                      Butir Selanjutnya <i className="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
