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
  const [activeTab, setActiveTab] = useState<"session" | "guidance" | "all_items">("session");

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
      className="min-h-screen relative overflow-x-hidden flex flex-col py-4 md:py-8 px-3 md:px-6"
      style={{
        backgroundImage: "url('/unj_bg_v2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <main className="relative z-10 w-full max-w-4xl mx-auto space-y-4 md:space-y-6">
        
        {/* HEADER UTAMA TIMBUL TEBAL (ROSE & CRIMSON THEME) */}
        <div className="card-timbul p-5 md:p-7 rounded-[28px] md:rounded-[36px] bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 text-white border-2 border-rose-950 shadow-2xl">
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
                  Alur Berurutan: Skenario → Pilih Opsi → Pertanyaan 1 → Pertanyaan 2 → Pertanyaan 3
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
        </div>

        {/* TAB SWITCHER */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-300/80 rounded-2xl border-2 border-slate-400/80 shadow-inner">
          <button
            onClick={() => setActiveTab("session")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "session"
                ? "bg-rose-900 text-white shadow-md border-b-4 border-rose-950"
                : "bg-transparent text-slate-800 hover:bg-slate-300"
            }`}
          >
            <i className="fa-solid fa-play-circle mr-1.5"></i> 1. Sesi Pengerjaan Soal #{itemNo}
          </button>

          <button
            onClick={() => setActiveTab("guidance")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "guidance"
                ? "bg-rose-900 text-white shadow-md border-b-4 border-rose-950"
                : "bg-transparent text-slate-800 hover:bg-slate-300"
            }`}
          >
            <i className="fa-solid fa-book-open mr-1.5"></i> 2. Panduan & Rujukan
          </button>

          <button
            onClick={() => setActiveTab("all_items")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "all_items"
                ? "bg-rose-900 text-white shadow-md border-b-4 border-rose-950"
                : "bg-transparent text-slate-800 hover:bg-slate-300"
            }`}
          >
            <i className="fa-solid fa-grid-2 mr-1.5"></i> 3. Indeks 30 SJT
          </button>
        </div>

        {/* TAB 1: SESI PENGERJAAN & PROBING SEQUENTIAL */}
        <AnimatePresence mode="wait">
          {activeTab === "session" && currentQ && (
            <motion.div
              key={`session-${currentIdx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {/* ITEM NAVIGATION SELECTOR BAR TIMBUL */}
              <div className="card-timbul p-3.5 rounded-[22px] bg-gradient-to-r from-white via-slate-50 to-white border-2 border-slate-300 border-b-4 border-b-slate-400 flex items-center justify-between shadow-md">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => { setCurrentIdx(currentIdx - 1); setProbingStep(1); resetRecordingState(); }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-800 rounded-xl text-[10px] font-black uppercase border-2 border-slate-300 border-b-4 border-b-slate-400 transition-all active:scale-95"
                >
                  <i className="fa-solid fa-arrow-left mr-1"></i> Sebelum
                </button>

                <div className="text-center">
                  <span className="text-[9px] font-black text-rose-800 uppercase tracking-widest block">
                    {currentProbing?.sjtId || `SJT_${itemNo.toString().padStart(2, "0")}`}
                  </span>
                  <span className="text-xs md:text-sm font-black text-slate-900 italic">
                    Butir #{itemNo} dari 30
                  </span>
                </div>

                <button
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => { setCurrentIdx(currentIdx + 1); setProbingStep(1); resetRecordingState(); }}
                  className="px-3.5 py-1.5 bg-rose-800 hover:bg-rose-900 disabled:opacity-30 text-white rounded-xl text-[10px] font-black uppercase border-2 border-rose-900 border-b-4 border-b-rose-950 transition-all active:scale-95 shadow-md"
                >
                  Lanjut <i className="fa-solid fa-arrow-right ml-1"></i>
                </button>
              </div>

              {/* 1. SKENARIO SITUASI NYATA TIMBUL (KARTU HIJAU SOFT / MINT) */}
              <div className="scenario-timbul p-5 md:p-6 rounded-[26px] shadow-lg border-2 border-emerald-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                    <i className="fa-solid fa-book-bookmark text-emerald-700"></i> STEP 1: SKENARIO SITUASI NYATA
                  </span>
                  <span className="text-[9px] font-black text-emerald-950 bg-emerald-200/80 px-2.5 py-0.5 rounded-md border border-emerald-300">
                    {currentQ.dim || "5 Dimensi MADEL-5C"}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-900 font-bold leading-relaxed italic whitespace-pre-line">
                  &quot;{currentQ.scenario}&quot;
                </p>
              </div>

              {/* 2. PILIHAN JAWABAN (A, B, C, D, E) TIMBUL */}
              <div className="card-timbul p-5 md:p-6 rounded-[28px] bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 border-slate-300 border-b-4 border-b-slate-400 shadow-xl space-y-3">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest block border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check text-rose-700"></i> STEP 2: PILIH 1 TINDAKAN TERBAIK
                </span>

                <div className="space-y-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentIdx] === idx;
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3 md:p-3.5 rounded-2xl text-left transition-all ${
                          isSelected
                            ? "option-card-timbul-selected"
                            : "option-card-timbul hover:border-rose-400"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              isSelected
                                ? "bg-white text-[#4B5320] shadow-sm"
                                : "bg-slate-100 text-slate-700 border border-slate-300"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="text-xs font-bold leading-snug pt-0.5">{opt.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. PERTANYAAN PROBING SEQUENTIAL (PERTANYAAN 1 -> PERTANYAAN 2 -> PERTANYAAN 3) */}
              {selectedOpt ? (
                <div className="card-timbul p-5 md:p-6 rounded-[28px] bg-gradient-to-b from-white via-rose-50/40 to-slate-50 border-2 border-rose-300 border-b-4 border-b-rose-400 shadow-xl space-y-4">
                  
                  {/* STEP INDICATOR TABS */}
                  <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                    <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-1.5">
                      <i className="fa-solid fa-comments text-rose-700"></i> STEP 3: PROBING KOGNITIF (PERTANYAAN {probingStep} DARI 3)
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((stepNum) => (
                        <button
                          key={stepNum}
                          onClick={() => { setProbingStep(stepNum); resetRecordingState(); }}
                          className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                            probingStep === stepNum
                              ? "bg-rose-900 text-white shadow-md border-b-2 border-rose-950 scale-105"
                              : "bg-slate-100 text-slate-600 hover:bg-rose-100"
                          }`}
                        >
                          P{stepNum}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PERTANYAAN 1: ALASAN PEMILIHAN OPSI */}
                  {probingStep === 1 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-rose-900 text-white rounded-2xl border-2 border-rose-950 shadow-md space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-300 block">
                          PERTANYAAN 1: ALASAN PEMILIHAN & EVALUASI OPSI
                        </span>
                        <p className="text-xs md:text-sm font-bold text-white italic leading-relaxed">
                          &quot;Mengapa Anda memilih opsi ini ({String.fromCharCode(65 + (selectedAnswers[currentIdx] || 0))}) daripada opsi lain? Menurut Anda, opsi mana yang paling tidak tepat dan apa alasannya?&quot;
                        </p>
                      </div>

                      {/* INTEGRATED RECORDING & VERBATIM FOR P1 */}
                      <AudioProbingRecorder
                        questionTitle="Pertanyaan 1: Alasan Pemilihan & Evaluasi Opsi"
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                        audioUrl={audioUrl}
                        transcriptText={transcriptText}
                        setTranscriptText={setTranscriptText}
                        isUploading={isUploading}
                        uploadSuccess={uploadSuccess}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        uploadAudioToServer={() => uploadAudioToServer("Pertanyaan 1: Alasan Pemilihan Opsi")}
                        downloadAudio={downloadAudio}
                        formatTime={formatTime}
                        onNext={() => { setProbingStep(2); resetRecordingState(); }}
                        nextLabel="Lanjut ke Pertanyaan 2"
                      />
                    </div>
                  )}

                  {/* PERTANYAAN 2: PEMAHAMAN SITUASI & BAHASA */}
                  {probingStep === 2 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-rose-900 text-white rounded-2xl border-2 border-rose-950 shadow-md space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-300 block">
                          PERTANYAAN 2: PEMAHAMAN SITUASI & KEJELASAN BAHASA
                        </span>
                        <p className="text-xs md:text-sm font-bold text-white italic leading-relaxed">
                          &quot;Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa? Adakah kata atau istilah dalam skenario ini yang membingungkan atau terasa asing bagi Anda?&quot;
                        </p>
                      </div>

                      {/* INTEGRATED RECORDING & VERBATIM FOR P2 */}
                      <AudioProbingRecorder
                        questionTitle="Pertanyaan 2: Pemahaman Situasi & Kejelasan Bahasa"
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                        audioUrl={audioUrl}
                        transcriptText={transcriptText}
                        setTranscriptText={setTranscriptText}
                        isUploading={isUploading}
                        uploadSuccess={uploadSuccess}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        uploadAudioToServer={() => uploadAudioToServer("Pertanyaan 2: Pemahaman Situasi & Bahasa")}
                        downloadAudio={downloadAudio}
                        formatTime={formatTime}
                        onNext={() => { setProbingStep(3); resetRecordingState(); }}
                        nextLabel="Lanjut ke Pertanyaan 3"
                      />
                    </div>
                  )}

                  {/* PERTANYAAN 3: PERTANYAAN KHUSUS SKENARIO & KEYAKINAN */}
                  {probingStep === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-rose-900 text-white rounded-2xl border-2 border-rose-950 shadow-md space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-300 block">
                          PERTANYAAN 3: PROBING KHUSUS SKENARIO #{itemNo} ({currentProbing?.title})
                        </span>
                        <p className="text-xs md:text-sm font-bold text-white italic leading-relaxed mb-2">
                          &quot;{currentProbing?.question}&quot;
                        </p>
                        <p className="text-[11px] font-bold text-rose-200 border-t border-rose-800 pt-1.5">
                          <em>Pertanyaan Tambahan:</em> &quot;Seberapa yakin Anda dengan pilihan Anda tadi dari skala 1 (tidak yakin) sampai 5 (sangat yakin)?&quot;
                        </p>
                      </div>

                      {/* INTEGRATED RECORDING & VERBATIM FOR P3 */}
                      <AudioProbingRecorder
                        questionTitle={`Pertanyaan 3: Probing Khusus (${currentProbing?.title})`}
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                        audioUrl={audioUrl}
                        transcriptText={transcriptText}
                        setTranscriptText={setTranscriptText}
                        isUploading={isUploading}
                        uploadSuccess={uploadSuccess}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        uploadAudioToServer={() => uploadAudioToServer(`Pertanyaan 3: Probing Khusus (${currentProbing?.title})`)}
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
                <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-center">
                  <p className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    <i className="fa-solid fa-arrow-up mr-1.5 text-amber-700"></i> Silakan pilih 1 tindakan terbaik di Step 2 untuk membuka Pertanyaan Probing
                  </p>
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 2: PANDUAN & RUJUKAN TIMBUL */}
          {activeTab === "guidance" && (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="card-timbul p-5 md:p-6 rounded-[24px] bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 border-slate-300 border-b-4 border-b-slate-400 shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
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
              </div>
            </motion.div>
          )}

          {/* TAB 3: INDEKS 30 SJT TIMBUL */}
          {activeTab === "all_items" && (
            <motion.div
              key="all_items"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="card-timbul p-5 md:p-6 rounded-[24px] bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 border-slate-300 border-b-4 border-b-slate-400 shadow-xl space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase mb-1">
                  <i className="fa-solid fa-grid-2 text-rose-700 mr-1.5"></i> Indeks 30 Butir SJT Think-Aloud
                </h3>
                <p className="text-[10px] font-bold text-slate-600">
                  Klik pada butir mana saja untuk langsung membuka skenario dan pertanyaan probing khusus kognitifnya:
                </p>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-3">
                  {Array.from({ length: 30 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentIdx(idx); setProbingStep(1); setActiveTab("session"); resetRecordingState(); }}
                      className={`py-2.5 rounded-xl text-[10px] font-black transition-all border-2 border-b-4 ${
                        currentIdx === idx
                          ? "bg-rose-900 text-white border-rose-950 border-b-rose-950 shadow-md scale-105"
                          : "bg-white hover:bg-rose-100 text-slate-800 border-slate-300 border-b-slate-400"
                      }`}
                    >
                      #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
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
  return (
    <div className="p-4 bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-2xl border-2 border-slate-300 border-b-4 border-b-slate-400 shadow-lg space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 ${
              isRecording
                ? "bg-rose-600 border-rose-400 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.8)]"
                : "bg-rose-100 border-rose-300 text-rose-800"
            }`}
          >
            <i className={`fa-solid ${isRecording ? "fa-circle-dot" : "fa-microphone"}`}></i>
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-rose-800 block">
              Perekam Suara &amp; Speech-to-Text Verbatim
            </span>
            <p className="text-xs font-black text-slate-900 font-mono">
              {isRecording ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                  MEREKAM... {formatTime(recordingTime)}
                </span>
              ) : audioUrl ? (
                <span className="text-emerald-800 flex items-center gap-1">
                  <i className="fa-solid fa-circle-check text-emerald-600"></i> Rekaman Siap Dikirim
                </span>
              ) : (
                "Tekan Rekam Suara saat Menyuarakan Jawaban"
              )}
            </p>
          </div>
        </div>

        {/* REKAM / STOP BUTTONS */}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md border-b-3 border-rose-950 active:scale-95"
            >
              <i className="fa-solid fa-microphone mr-1.5"></i> Rekam Suara
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md border-b-3 border-slate-950 active:scale-95"
            >
              <i className="fa-solid fa-square mr-1.5"></i> Hentikan
            </button>
          )}
        </div>
      </div>

      {/* VERBATIM TRANSCRIPT TEXTAREA */}
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1">
          <i className="fa-solid fa-[#4B5320] text-rose-700"></i> Teks Verbatim (Transkrip Suara Otomatis):
        </label>
        <textarea
          rows={3}
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          placeholder="Hasil transkrip verbatim otomatis dari rekaman suara Anda akan tampil di sini..."
          className="w-full p-2.5 text-xs font-bold text-slate-900 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none leading-relaxed"
        />
      </div>

      {/* SUBMIT TO ADMIN & DOWNLOAD BUTTONS */}
      {audioUrl && !isRecording && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <audio controls src={audioUrl} className="h-8 max-w-[170px] rounded-lg shadow-sm" />
            <button
              onClick={downloadAudio}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[9px] font-black uppercase rounded-lg border border-slate-300 transition-all active:scale-95"
            >
              <i className="fa-solid fa-download mr-1"></i> Unduh
            </button>
          </div>

          <button
            onClick={uploadAudioToServer}
            disabled={isUploading}
            className={`px-4 py-2 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md border-b-3 transition-all active:scale-95 ${
              uploadSuccess
                ? "bg-emerald-600 border-emerald-900"
                : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border-emerald-950"
            }`}
          >
            {isUploading ? (
              <><i className="fa-solid fa-spinner animate-spin mr-1"></i> Mengirim ke Admin...</>
            ) : uploadSuccess ? (
              <><i className="fa-solid fa-cloud-check mr-1"></i> Terikirim ke Panel Admin</>
            ) : (
              <><i className="fa-solid fa-paper-plane mr-1.5"></i> Kirim Suara &amp; Transkrip ke Admin</>
            )}
          </button>
        </div>
      )}

      {/* NEXT STEP BUTTON */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onNext}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-800 to-red-900 hover:from-rose-900 hover:to-red-950 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md border-b-3 border-rose-950 transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>{nextLabel}</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
