"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";

interface Option {
  text: string;
  score: number;
}

interface Question {
  id?: number;
  dim?: string;
  scenario: string;
  options: Option[];
}

interface SpecialProbing {
  sjtId: string;
  no: number;
  title: string;
  question: string;
}

const specialProbings: Record<number, SpecialProbing> = {
  1: { sjtId: "SJT_01", no: 1, title: "Validasi Modul Pembelajaran dari Blog Guru", question: "Menurut Anda, apa artinya memeriksa kelayakan modul dari blog? Langkah apa yang terpikir pertama kali?" },
  2: { sjtId: "SJT_02", no: 2, title: "Mengatasi Kebosanan Sejarah dengan Advanced Search", question: "Apakah Anda mengenal fitur Advanced Search? Apakah pengetahuan tentang fitur itu memengaruhi pilihan Anda?" },
  3: { sjtId: "SJT_03", no: 3, title: "Menyikapi Klaim Gamifikasi Instan di Media Sosial", question: "Bagian mana dari klaim tersebut yang membuat Anda percaya atau ragu?" },
  4: { sjtId: "SJT_07", no: 4, title: "Penyalahgunaan Aset Visual Milik Profesor Terkenal", question: "Menurut Anda, situasi ini lebih tentang hak cipta, etika, atau hal lain?" },
  5: { sjtId: "SJT_08", no: 5, title: "Kasus Perundungan Siber Halus di YouTube Kelas", question: "Bagian mana dari cerita yang menurut Anda menunjukkan perundungan? Apakah perundungan itu terlihat jelas?" },
  6: { sjtId: "SJT_09", no: 6, title: "Penolakan Agresif Teknologi Ujian oleh Guru Senior", question: "Apakah posisi Anda sebagai mahasiswa PLP di hadapan guru senior memengaruhi pilihan Anda?" },
  7: { sjtId: "SJT_13", no: 7, title: "Menghadapi Anggota Kelompok yang Pasif (Freerider)", question: "Apakah istilah freerider dipahami? Apa yang Anda bayangkan tentang anggota kelompok ini?" },
  8: { sjtId: "SJT_14", no: 8, title: "Konflik Tumpang Tindih Kewenangan Divisi Publikasi Digital", question: "Siapa yang menurut Anda berwenang memutuskan dalam situasi ini?" },
  9: { sjtId: "SJT_15", no: 9, title: "Menghindari Kekacauan Edit Bersama di Google Docs", question: "Apakah Anda pernah mengalami penyuntingan bersama yang kacau? Apakah situasi ini terasa nyata?" },
  10: { sjtId: "SJT_19", no: 10, title: "Desain Slide Pembelajaran Sains SD yang Interaktif", question: "Apa yang Anda pahami dari kata 'interaktif' dalam skenario ini?" },
  11: { sjtId: "SJT_20", no: 11, title: "Memotong Klip Video Sejarah Menggunakan Edpuzzle", question: "Apakah Anda mengenal Edpuzzle? Jika tidak, apakah Anda tetap dapat menilai opsi?" },
  12: { sjtId: "SJT_21", no: 12, title: "Menyediakan Takarir Video untuk Lingkungan Bising", question: "Apakah istilah 'takarir' dipahami? Apa padanan yang biasa Anda gunakan?" },
  13: { sjtId: "SJT_25", no: 13, title: "Tugas Mengolah 1000 Baris Data Nilai Rapor via Excel", question: "Apakah kemampuan Anda menggunakan rumus Excel memengaruhi pilihan Anda?" },
  14: { sjtId: "SJT_26", no: 14, title: "Gawat Darurat Internet Terputus Saat ANBK di Sekolah", question: "Apakah Anda mengenal ANBK? Apa peran Anda dalam skenario ini menurut pemahaman Anda?" },
  15: { sjtId: "SJT_27", no: 15, title: "Materi Literasi Digital di Sekolah Tanpa Listrik", question: "Apakah kondisi sekolah dalam skenario ini terasa realistis?" },
  16: { sjtId: "SJT_04", no: 16, title: "Mengelola File Referensi yang Menumpuk di Laptop", question: "Apakah Anda mengenal aplikasi pengelola referensi? Apakah istilah dalam opsi dipahami?" },
  17: { sjtId: "SJT_05", no: 17, title: "Menyaring Kebocoran Soal Palsu di Grup Angkatan", question: "Apa yang membuat Anda menyimpulkan informasi itu palsu atau asli?" },
  18: { sjtId: "SJT_06", no: 18, title: "Pengumpulan Data Kebutuhan E-Book Kelas", question: "Data apa yang menurut Anda perlu dikumpulkan sebelum memutuskan?" },
  19: { sjtId: "SJT_10", no: 19, title: "Penanganan Keluhan Dosen Mengenai Format Tugas di Email", question: "Apa yang Anda pahami tentang netiket dalam surel kepada dosen?" },
  20: { sjtId: "SJT_11", no: 20, title: "Menghubungi Guru Pamong yang Resisten via WhatsApp", question: "Apakah Anda merasakan perbedaan nada pesan antaropsi? Opsi mana yang terasa paling sopan dan efektif?" },
  21: { sjtId: "SJT_12", no: 21, title: "Menjawab Pertanyaan Sensitif Siswa di Forum Publik Daring", question: "Informasi apa dalam skenario ini yang menurut Anda sensitif? Mengapa?" },
  22: { sjtId: "SJT_16", no: 22, title: "Delegasi Tugas Projek Akhir yang Kompleks via Trello", question: "Apakah Anda mengenal Trello? Apakah ketidaktahuan tentang aplikasi itu menyulitkan Anda memilih?" },
  23: { sjtId: "SJT_17", no: 23, title: "Melacak Kontribusi Menggunakan Version History Docs", question: "Apakah istilah version history dipahami? Bagaimana Anda membayangkan cara kerjanya?" },
  24: { sjtId: "SJT_18", no: 24, title: "Berbagi Beban Kognitif saat Menyusun RPP Tematik Terpadu", question: "Apa yang Anda pahami dari frasa 'berbagi beban kognitif'? Apakah istilah ini perlu diganti?" },
  25: { sjtId: "SJT_22", no: 25, title: "Merancang Modul Biologi Adaptif untuk Berbagai Gaya Belajar", question: "Apa arti 'adaptif untuk berbagai gaya belajar' menurut Anda?" },
  26: { sjtId: "SJT_23", no: 26, title: "Merancang Modul Bencana Alam Bebas Hak Cipta", question: "Apakah Anda mengenal lisensi Creative Commons? Bagaimana Anda membedakan materi yang boleh dan tidak boleh dipakai?" },
  27: { sjtId: "SJT_24", no: 27, title: "Mengamankan Video Pembelajaran Menggunakan Watermark", question: "Apakah tujuan penggunaan watermark dalam skenario ini jelas?" },
  28: { sjtId: "SJT_28", no: 28, title: "Rencana Cadangan Saat Server Web Quizizz Tiba-tiba Down", question: "Sebelum melihat opsi, rencana cadangan apa yang terpikir oleh Anda?" },
  29: { sjtId: "SJT_29", no: 29, title: "Serangan Pop-Up Iklan Tak Senonoh saat Mengajar Daring", question: "Apa langkah pertama yang terpikir? Apakah redaksi skenario ini nyaman dibaca?" },
  30: { sjtId: "SJT_30", no: 30, title: "Laptop Dosen Penguji Tidak Kompatibel dengan File Presentasi", question: "Apa yang terpikir pertama kali ketika membaca masalah ini?" }
};

export default function ThinkAloudProtocolPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [probingStep, setProbingStep] = useState<number>(1); // 1, 2, 3
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"guidance" | "session">("guidance");

  // Audio & Speech-to-Text Verbatim state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/questions?type=madel5c', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data soal SJT:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [fetchQuestions]);

  const resetRecordingState = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setTranscriptText("");
    setUploadSuccess(false);
    setIsRecording(false);
    setRecordingTime(0);
  };

  const startRecording = async () => {
    resetRecordingState();
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
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      // Live Speech-to-Text Recognition (Verbatim Transkrip id-ID)
      if (typeof window !== "undefined") {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = "id-ID";

          recognitionRef.current.onresult = (event: any) => {
            let currentTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript;
            }
            setTranscriptText(currentTranscript);
          };

          recognitionRef.current.start();
        }
      }

      mediaRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Gagal mengaktifkan mikrofon:", err);
      alert("Izin akses mikrofon diperlukan untuk melakukan wawancara Think-Aloud Suara.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const uploadAudioToServer = async (questionTitle: string) => {
    if (!audioBlob) {
      alert("Silakan rekam suara Anda terlebih dahulu sebelum mengirim.");
      return;
    }
    setIsUploading(true);
    try {
      const userName = localStorage.getItem("userName") || "Mahasiswa Calon Guru";
      const userCampus = localStorage.getItem("userCampus") || "LPTK Universitas";
      const userId = localStorage.getItem("userId") || "user_anon";
      const currentQ = questions[currentIdx];
      const selectedOptIdx = selectedAnswers[currentIdx];
      const selectedOptText = (selectedOptIdx !== undefined && currentQ?.options[selectedOptIdx])
        ? `${String.fromCharCode(65 + selectedOptIdx)}. ${currentQ.options[selectedOptIdx].text}`
        : "Belum Memilih Opsi";

      const formData = new FormData();
      formData.append("audio", audioBlob, `ThinkAloud_Soal_${currentIdx + 1}_P${probingStep}.webm`);
      formData.append("userId", userId);
      formData.append("userName", userName);
      formData.append("userCampus", userCampus);
      formData.append("itemNo", (currentIdx + 1).toString());
      formData.append("sjtId", specialProbings[currentIdx + 1]?.sjtId || `SJT_${(currentIdx + 1).toString().padStart(2, "0")}`);
      formData.append("probingStep", probingStep.toString());
      formData.append("questionTitle", questionTitle);
      formData.append("selectedOption", selectedOptText);
      formData.append("duration", recordingTime.toString());
      formData.append("transcript", transcriptText || "Tidak ada transkrip teks");

      const res = await fetch("/api/think-aloud/audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccess(true);
        alert(`✅ Berhasil! Rekaman suara Pertanyaan ${probingStep} & Transkrip Verbatim tersimpan di Panel Admin.`);
      } else {
        alert("Gagal mengunggah rekaman ke server admin.");
      }
    } catch (err) {
      console.error("Gagal mengunggah rekaman suara:", err);
      alert("Terjadi kesalahan koneksi saat mengunggah rekaman.");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `ThinkAloud_Soal_${currentIdx + 1}_P${probingStep}_${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: optIdx });
    setProbingStep(1);
    resetRecordingState();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIdx];
  const itemNo = currentIdx + 1;
  const currentProbing = specialProbings[itemNo];
  const selectedOpt = selectedAnswers[currentIdx] !== undefined ? currentQ?.options[selectedAnswers[currentIdx]] : null;

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest text-rose-300">Memuat Skenario & Protokol Think-Aloud...</p>
    </div>
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col py-2.5 md:py-4 px-2.5 md:px-5"
      style={{
        backgroundImage: "url('/unj_bg_v2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <main className="relative z-10 w-full max-w-4xl mx-auto space-y-3">
        
        {/* RINGKAS TOP BAR & TAB SWITCHER (DESAIN FIT ON SCREEN) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-2 md:p-2.5 rounded-2xl border-2 border-slate-700 shadow-xl text-white">
          
          {/* TAB TABS (1. PANDUAN & RUJUKAN -> 2. SESI PENGERJAAN SOAL) */}
          <div className="flex items-center gap-1.5 flex-1">
            <button
              onClick={() => setActiveTab("guidance")}
              className={`flex-1 py-2 px-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "guidance"
                  ? "bg-rose-800 text-white shadow-md border-b-3 border-rose-950 scale-[1.02]"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-book-open text-rose-300"></i>
              <span>1. Panduan &amp; Rujukan</span>
            </button>

            <button
              onClick={() => setActiveTab("session")}
              className={`flex-1 py-2 px-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "session"
                  ? "bg-rose-800 text-white shadow-md border-b-3 border-rose-950 scale-[1.02]"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-circle-play text-rose-300"></i>
              <span>2. Sesi Pengerjaan Soal #{itemNo}</span>
            </button>
          </div>

          {/* DASHBOARD NAVIGATION BUTTON */}
          <button
            onClick={() => router.push("/dashboard")}
            className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/20 transition-all active:scale-95 shrink-0 self-end sm:self-auto"
          >
            <i className="fa-solid fa-arrow-left mr-1"></i> Dashboard
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* TAB 1: PANDUAN & RUJUKAN TIMBUL (SEKARANG NOMOR 1) */}
          {activeTab === "guidance" && (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="card-timbul p-4 md:p-6 rounded-[24px] bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 border-slate-300 border-b-4 border-b-slate-400 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm shrink-0">
                      <i className="fa-solid fa-bullseye"></i>
                    </div>
                    <div>
                      <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase">1. Panduan &amp; Rujukan Protokol Think-Aloud</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-500">Rujukan Teoretis: Ericsson &amp; Simon (1993); Willis (2005)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("session")}
                    className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white text-[10px] font-black uppercase rounded-xl shadow-md border-b-3 border-rose-950 transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Mulai Pengerjaan Soal</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>

                <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-slate-800 space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-rose-900 block">
                    Tujuan Wawancara Kognitif:
                  </span>
                  <p className="text-[11px] md:text-xs font-bold leading-relaxed">
                    Protokol Think-Aloud bertujuan memperoleh bukti validitas proses respons secara langsung: yaitu menguji apakah mahasiswa calon guru memahami skenario dan opsi sebagaimana dimaksud oleh pengembang instrumen MADEL-5C, serta apakah penalaran mereka selaras dengan kunci penskoran.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                    <span className="text-[9px] font-black text-rose-800 uppercase tracking-wider block">
                      Step 1: Baca Skenario
                    </span>
                    <p className="text-[10px] font-semibold text-slate-600 leading-snug">
                      Pahami dengan cermat skenario situasi nyata yang disajikan pada setiap butir SJT.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                    <span className="text-[9px] font-black text-rose-800 uppercase tracking-wider block">
                      Step 2: Pilih 1 Opsi
                    </span>
                    <p className="text-[10px] font-semibold text-slate-600 leading-snug">
                      Pilih 1 tindakan terbaik yang paling menggambarkan keputusan Anda sebagai calon guru.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
                    <span className="text-[9px] font-black text-rose-800 uppercase tracking-wider block">
                      Step 3: Suarakan Jawaban
                    </span>
                    <p className="text-[10px] font-semibold text-slate-600 leading-snug">
                      Jawab pertanyaan probing (P1, P2, P3) secara berurutan dengan merekam suara atau menuliskan verbatim.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab("session")}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-900 to-red-900 hover:from-rose-950 hover:to-red-950 text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-lg border-b-3 border-rose-950 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-play-circle text-xs"></i>
                    <span>Masuk ke Sesi Pengerjaan Soal (Butir #1)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SESI PENGERJAAN & PROBING SEQUENTIAL (FIT ON SCREEN) */}
          {activeTab === "session" && currentQ && (
            <motion.div
              key={`session-${currentIdx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* ITEM NAVIGATION SELECTOR BAR COMPACT TIMBUL */}
              <div className="card-timbul p-2.5 md:p-3 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white border-2 border-slate-300 border-b-4 border-b-slate-400 flex items-center justify-between shadow-md">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => { setCurrentIdx(currentIdx - 1); setProbingStep(1); resetRecordingState(); }}
                  className="px-3 py-1 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-800 rounded-xl text-[10px] font-black uppercase border-2 border-slate-300 border-b-3 border-b-slate-400 transition-all active:scale-95"
                >
                  <i className="fa-solid fa-arrow-left mr-1"></i> Sebelum
                </button>

                <div className="text-center">
                  <span className="text-[8px] md:text-[9px] font-black text-rose-800 uppercase tracking-widest block">
                    {currentProbing?.sjtId || `SJT_${itemNo.toString().padStart(2, "0")}`}
                  </span>
                  <span className="text-xs md:text-sm font-black text-slate-900 italic">
                    Butir #{itemNo} dari 30
                  </span>
                </div>

                <button
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => { setCurrentIdx(currentIdx + 1); setProbingStep(1); resetRecordingState(); }}
                  className="px-3 py-1 bg-rose-800 hover:bg-rose-900 disabled:opacity-30 text-white rounded-xl text-[10px] font-black uppercase border-2 border-rose-900 border-b-3 border-b-rose-950 transition-all active:scale-95 shadow-md"
                >
                  Lanjut <i className="fa-solid fa-arrow-right ml-1"></i>
                </button>
              </div>

              {/* 1. SKENARIO SITUASI NYATA COMPACT (KARTU HIJAU MINT) */}
              <div className="scenario-timbul p-3.5 md:p-4 rounded-2xl shadow-md border-2 border-emerald-300 bg-emerald-50/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                    <i className="fa-solid fa-book-bookmark text-emerald-700"></i> STEP 1: SKENARIO SITUASI NYATA
                  </span>
                  <span className="text-[9px] font-black text-emerald-950 bg-emerald-200/90 px-2 py-0.5 rounded-md border border-emerald-300">
                    {currentQ.dim || "5 Dimensi MADEL-5C"}
                  </span>
                </div>
                <p className="text-xs md:text-xs font-bold text-slate-900 leading-snug italic whitespace-pre-line">
                  &quot;{currentQ.scenario}&quot;
                </p>
              </div>

              {/* 2. PILIHAN JAWABAN (A, B, C, D, E) COMPACT */}
              <div className="card-timbul p-3.5 md:p-4 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 border-slate-300 border-b-3 border-b-slate-400 shadow-md space-y-2">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest block border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check text-rose-700"></i> STEP 2: PILIH 1 TINDAKAN TERBAIK
                </span>

                <div className="space-y-1.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentIdx] === idx;
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-2.5 md:p-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? "option-card-timbul-selected"
                            : "option-card-timbul hover:border-rose-400"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                              isSelected
                                ? "bg-white text-[#4B5320] shadow-sm"
                                : "bg-slate-100 text-slate-700 border border-slate-300"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="text-[11px] md:text-xs font-bold leading-tight pt-0.5">{opt.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. PERTANYAAN PROBING SEQUENTIAL (P1 -> P2 -> P3) COMPACT */}
              {selectedOpt ? (
                <div className="card-timbul p-3.5 md:p-4 rounded-2xl bg-gradient-to-b from-white via-rose-50/40 to-slate-50 border-2 border-rose-300 border-b-3 border-b-rose-400 shadow-md space-y-3">
                  
                  {/* STEP INDICATOR TABS */}
                  <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                    <span className="text-[9px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-1.5">
                      <i className="fa-solid fa-comments text-rose-700"></i> STEP 3: PROBING KOGNITIF (PERTANYAAN {probingStep} DARI 3)
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((stepNum) => (
                        <button
                          key={stepNum}
                          onClick={() => { setProbingStep(stepNum); resetRecordingState(); }}
                          className={`w-6 h-6 rounded-md text-[10px] font-black transition-all ${
                            probingStep === stepNum
                              ? "bg-rose-900 text-white shadow-md border-b border-rose-950 scale-105"
                              : "bg-slate-100 text-slate-600 hover:bg-rose-100"
                          }`}
                        >
                          P{stepNum}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PERTANYAAN 1: MENJAWAB PEMAHAMAN SITUASI & ALASAN PEMILIHAN JAWABAN */}
                  {probingStep === 1 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-rose-900 text-white rounded-xl border-2 border-rose-950 shadow-sm space-y-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-rose-300 block">
                          PERTANYAAN 1: PEMAHAMAN SITUASI &amp; ALASAN PEMILIHAN JAWABAN
                        </span>
                        <p className="text-[11px] md:text-xs font-bold text-white italic leading-snug">
                          &quot;Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa? Mengapa Anda memilih opsi ({String.fromCharCode(65 + (selectedAnswers[currentIdx] || 0))}) ini sebagai tindakan terbaik Anda?&quot;
                        </p>
                      </div>

                      {/* INTEGRATED RECORDING & VERBATIM FOR P1 */}
                      <AudioProbingRecorder
                        questionTitle="Pertanyaan 1: Pemahaman Situasi & Alasan Pemilihan Jawaban"
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                        audioUrl={audioUrl}
                        transcriptText={transcriptText}
                        setTranscriptText={setTranscriptText}
                        isUploading={isUploading}
                        uploadSuccess={uploadSuccess}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        uploadAudioToServer={() => uploadAudioToServer("Pertanyaan 1: Pemahaman Situasi & Alasan Pemilihan Jawaban")}
                        downloadAudio={downloadAudio}
                        formatTime={formatTime}
                        onNext={() => { setProbingStep(2); resetRecordingState(); }}
                        nextLabel="Lanjut ke Pertanyaan 2"
                      />
                    </div>
                  )}

                  {/* PERTANYAAN 2: MENJAWAB PROBING KHUSUS SKENARIO */}
                  {probingStep === 2 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-rose-900 text-white rounded-xl border-2 border-rose-950 shadow-sm space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-rose-300 block">
                          PERTANYAAN 2: PROBING KHUSUS SKENARIO #{itemNo} ({currentProbing?.title})
                        </span>
                        <p className="text-[11px] md:text-xs font-bold text-white italic leading-snug">
                          &quot;{currentProbing?.question}&quot;
                        </p>
                        <p className="text-[10px] font-bold text-rose-200 border-t border-rose-800/80 pt-1">
                          <em>Pertanyaan Tambahan:</em> &quot;Seberapa yakin Anda dengan pilihan Anda tadi dari skala 1 (tidak yakin) sampai 5 (sangat yakin)?&quot;
                        </p>
                      </div>

                      {/* INTEGRATED RECORDING & VERBATIM FOR P2 */}
                      <AudioProbingRecorder
                        questionTitle={`Pertanyaan 2: Probing Khusus (${currentProbing?.title})`}
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                        audioUrl={audioUrl}
                        transcriptText={transcriptText}
                        setTranscriptText={setTranscriptText}
                        isUploading={isUploading}
                        uploadSuccess={uploadSuccess}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        uploadAudioToServer={() => uploadAudioToServer(`Pertanyaan 2: Probing Khusus (${currentProbing?.title})`)}
                        downloadAudio={downloadAudio}
                        formatTime={formatTime}
                        onNext={() => { setProbingStep(3); resetRecordingState(); }}
                        nextLabel="Lanjut ke Pertanyaan 3 (Evaluasi)"
                      />
                    </div>
                  )}

                  {/* PERTANYAAN 3: MENGEVALUASI OPSI LAIN & KEJELASAN BAHASA */}
                  {probingStep === 3 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-rose-900 text-white rounded-xl border-2 border-rose-950 shadow-sm space-y-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-rose-300 block">
                          PERTANYAAN 3: EVALUASI OPSI LAIN &amp; KEJELASAN BAHASA
                        </span>
                        <p className="text-[11px] md:text-xs font-bold text-white italic leading-snug">
                          &quot;Menurut Anda, opsi mana yang paling TIDAK tepat dan apa alasannya? Adakah kata atau istilah dalam skenario ini yang membingungkan atau terasa asing bagi Anda?&quot;
                        </p>
                      </div>

                      {/* INTEGRATED RECORDING & VERBATIM FOR P3 */}
                      <AudioProbingRecorder
                        questionTitle="Pertanyaan 3: Evaluasi Opsi Lain & Kejelasan Bahasa"
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                        audioUrl={audioUrl}
                        transcriptText={transcriptText}
                        setTranscriptText={setTranscriptText}
                        isUploading={isUploading}
                        uploadSuccess={uploadSuccess}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        uploadAudioToServer={() => uploadAudioToServer("Pertanyaan 3: Evaluasi Opsi Lain & Kejelasan Bahasa")}
                        downloadAudio={downloadAudio}
                        formatTime={formatTime}
                        onNext={() => {
                          if (currentIdx < questions.length - 1) {
                            setCurrentIdx(currentIdx + 1);
                            setProbingStep(1);
                            resetRecordingState();
                          } else {
                            alert("Selamat! Anda telah menyelesaikan seluruh 30 butir Think-Aloud Suara.");
                          }
                        }}
                        nextLabel={currentIdx < questions.length - 1 ? `Lanjut ke Soal SJT #${itemNo + 1}` : "Selesai Seluruh Sesi"}
                      />
                    </div>
                  )}

                </div>
              ) : (
                <div className="p-3.5 bg-amber-50 rounded-xl border-2 border-amber-300 text-center shadow-sm">
                  <p className="text-[11px] font-black text-amber-950 uppercase tracking-wide">
                    <i className="fa-solid fa-arrow-up mr-1.5 text-amber-700"></i> Silakan pilih 1 tindakan terbaik di Step 2 untuk membuka Pertanyaan Probing
                  </p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

{/* COMPONENT PEREKAM SUARA & VERBATIM UNDER EACH QUESTION */}
function AudioProbingRecorder({
  questionTitle,
  isRecording,
  recordingTime,
  audioUrl,
  transcriptText,
  setTranscriptText,
  isUploading,
  uploadSuccess,
  startRecording,
  stopRecording,
  uploadAudioToServer,
  downloadAudio,
  formatTime,
  onNext,
  nextLabel
}: {
  questionTitle: string;
  isRecording: boolean;
  recordingTime: number;
  audioUrl: string | null;
  transcriptText: string;
  setTranscriptText: (t: string) => void;
  isUploading: boolean;
  uploadSuccess: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  uploadAudioToServer: () => void;
  downloadAudio: () => void;
  formatTime: (s: number) => string;
  onNext: () => void;
  nextLabel: string;
}) {
  const handleSendAndProceed = async () => {
    // If there is audio recorded and not yet uploaded, trigger upload first
    if (audioUrl && !uploadSuccess) {
      await uploadAudioToServer();
    }
    onNext();
  };

  return (
    <div className="p-4 md:p-5 bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-2xl border-2 border-slate-300 border-b-4 border-b-slate-400 shadow-xl space-y-4">
      
      {/* HEADER STATUS PEREKAM */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base transition-all border-2 shadow-inner ${
              isRecording
                ? "bg-rose-600 border-rose-400 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.8)]"
                : "bg-rose-100 border-rose-300 text-rose-800"
            }`}
          >
            <i className={`fa-solid ${isRecording ? "fa-circle-dot" : "fa-microphone"}`}></i>
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-rose-800 block">
              OPSI JAWABAN SUARA &amp; TRANSKRIP VERBATIM
            </span>
            <p className="text-xs font-black text-slate-900 font-mono">
              {isRecording ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                  MEREKAM SUARA... {formatTime(recordingTime)}
                </span>
              ) : uploadSuccess ? (
                <span className="text-emerald-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-cloud-check text-emerald-600"></i> Rekaman &amp; Transkrip Terkirim ke Admin
                </span>
              ) : audioUrl ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check text-emerald-600"></i> Rekaman Siap Dikirim ke Admin
                </span>
              ) : (
                "Silakan Rekam Suara atau Ketik Penjelasan Transkrip Anda"
              )}
            </p>
          </div>
        </div>

        {/* 2 OPSI SUARA UTAMA UNDER EACH QUESTION */}
        <div className="flex flex-wrap items-center gap-2">
          {/* OPSI 1: REKAM SUARA */}
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-3.5 py-2 bg-gradient-to-r from-rose-800 to-red-900 hover:from-rose-900 hover:to-red-950 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md border-b-3 border-rose-950 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-microphone text-xs"></i>
              <span>1. Rekam Suara</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md border-b-3 border-slate-950 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-square text-xs text-rose-400"></i>
              <span>Hentikan Rekaman</span>
            </button>
          )}

          {/* OPSI 2: KIRIM SUARA KE PANEL ADMIN */}
          <button
            onClick={uploadAudioToServer}
            disabled={isUploading || isRecording}
            className={`px-3.5 py-2 font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md border-b-3 transition-all active:scale-95 flex items-center gap-1.5 ${
              uploadSuccess
                ? "bg-emerald-600 text-white border-emerald-900"
                : "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-950 disabled:opacity-40"
            }`}
          >
            {isUploading ? (
              <><i className="fa-solid fa-spinner animate-spin text-xs"></i> Mengirim...</>
            ) : uploadSuccess ? (
              <><i className="fa-solid fa-cloud-check text-xs"></i> Terkirim ke Admin</>
            ) : (
              <><i className="fa-solid fa-paper-plane text-xs"></i> 2. Kirim Suara ke Admin</>
            )}
          </button>
        </div>
      </div>

      {/* AUDIO PLAYER & DOWNLOAD BUTTON IF RECORDED */}
      {audioUrl && !isRecording && (
        <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-emerald-900 uppercase">Pratinjau Suara:</span>
            <audio controls src={audioUrl} className="h-8 max-w-[200px] rounded-lg shadow-sm" />
          </div>
          <button
            onClick={downloadAudio}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-[9px] font-black uppercase rounded-lg border border-slate-300 transition-all active:scale-95 shadow-sm"
          >
            <i className="fa-solid fa-download mr-1 text-emerald-700"></i> Unduh File Audio
          </button>
        </div>
      )}

      {/* VERBATIM TRANSCRIPT TEXTAREA (AUTO SPEECH-TO-TEXT / EDITABLE) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
            <i className="fa-solid fa-file-signature text-rose-700"></i> Teks Verbatim (Transkrip Suara Otomatis):
          </label>
          {transcriptText && (
            <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <i className="fa-solid fa-check-double mr-1"></i> Transkrip Terisi
            </span>
          )}
        </div>
        <textarea
          rows={3}
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          placeholder="Hasil transkrip verbatim otomatis dari rekaman suara Anda akan tampil di sini secara real-time. Anda juga dapat menyunting atau mengetik langsung..."
          className="w-full p-3 text-xs font-bold text-slate-900 bg-white rounded-xl border-2 border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none leading-relaxed shadow-inner"
        />
      </div>

      {/* TOMBOL MENGIRIM JAWABAN & LANJUT KE PERTANYAAN/BUTIR NEXT */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
        <span className="text-[9px] font-bold text-slate-500 italic">
          Tekan tombol di kanan untuk mengirim jawaban &amp; membuka pertanyaan berikutnya
        </span>

        <button
          onClick={handleSendAndProceed}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 hover:from-rose-950 hover:to-red-950 text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-lg border-b-4 border-rose-950 transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <i className="fa-solid fa-paper-plane text-xs"></i>
          <span>Kirim Jawaban &amp; {nextLabel}</span>
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

    </div>
  );
}
