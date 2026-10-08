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
  id: number;
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

// 30 Special Probing Questions mapped directly to SJT Item IDs (1 to 30) matching official doc_3sesi.txt
const specialProbings: Record<number, SpecialProbing> = {
  1: { sjtId: "SJT_01", no: 1, title: "Validasi Modul Pembelajaran dari Blog Guru", question: "Menurut Anda, apa artinya memeriksa kelayakan modul dari blog? Langkah apa yang terpikir pertama kali?" },
  2: { sjtId: "SJT_02", no: 2, title: "Mengatasi Kebosanan Sejarah dengan Advanced Search", question: "Apakah Anda mengenal fitur Advanced Search? Apakah pengetahuan tentang fitur itu memengaruhi pilihan Anda?" },
  3: { sjtId: "SJT_03", no: 3, title: "Menyikapi Klaim Gamifikasi Instan di Media Sosial", question: "Bagian mana dari klaim 'gamifikasi 100% menjamin kelulusan tanpa membaca buku' di postingan Instagram tersebut yang membuat Anda ragu atau percaya? Mengapa?" },
  4: { sjtId: "SJT_04", no: 4, title: "Mengelola File Referensi yang Menumpuk di Laptop", question: "Apakah Anda mengenal aplikasi pengelola referensi? Apakah istilah dalam opsi dipahami?" },
  5: { sjtId: "SJT_05", no: 5, title: "Menyaring Kebocoran Soal Palsu di Grup Angkatan", question: "Apa yang membuat Anda menyimpulkan informasi isu bocoran soal itu palsu atau asli?" },
  6: { sjtId: "SJT_06", no: 6, title: "Pengumpulan Data Kebutuhan E-Book Kelas", question: "Data apa yang menurut Anda paling perlu dikumpulkan sebelum memutuskan alokasi anggaran e-book?" },
  7: { sjtId: "SJT_07", no: 7, title: "Penyalahgunaan Aset Visual Milik Profesor Terkenal", question: "Menurut Anda, situasi ini lebih tentang hak cipta, etika, atau hal lain?" },
  8: { sjtId: "SJT_08", no: 8, title: "Kasus Perundungan Siber Halus di YouTube Kelas", question: "Bagian mana dari cerita yang menurut Anda menunjukkan perundungan? Apakah perundungan itu terlihat jelas?" },
  9: { sjtId: "SJT_09", no: 9, title: "Penolakan Agresif Teknologi Ujian oleh Guru Senior", question: "Apakah posisi Anda sebagai mahasiswa PLP di hadapan guru senior memengaruhi pilihan Anda?" },
  10: { sjtId: "SJT_10", no: 10, title: "Penanganan Keluhan Dosen Mengenai Format Tugas di Email", question: "Apa yang Anda pahami tentang etika/netiket dalam surel (email) pengumpulan tugas kepada dosen?" },
  11: { sjtId: "SJT_11", no: 11, title: "Menhubungi Guru Pamong yang Resisten via WhatsApp", question: "Apakah Anda merasakan perbedaan nada pesan antaropsi? Opsi mana yang terasa paling sopan dan efektif?" },
  12: { sjtId: "SJT_12", no: 12, title: "Menjawab Pertanyaan Sensitif Siswa di Forum Publik Daring", question: "Informasi apa dalam skenario ini yang menurut Anda sensitif? Mengapa tidak boleh ditanggapi di forum publik?" },
  13: { sjtId: "SJT_13", no: 13, title: "Menghadapi Anggota Kelompok yang Pasif (Freerider)", question: "Apakah istilah freerider dipahami? Apa yang Anda bayangkan tentang anggota kelompok pasif ini?" },
  14: { sjtId: "SJT_14", no: 14, title: "Konflik Tumpang Tindih Kewenangan Divisi Publikasi Digital", question: "Siapa atau divisi mana yang menurut Anda berwenang memutuskan dalam situasi tumpang tindih ini?" },
  15: { sjtId: "SJT_15", no: 15, title: "Menghindari Kekacauan Edit Bersama di Google Docs", question: "Apakah Anda pernah mengalami penyuntingan dokumen bersama yang kacau? Apakah situasi ini terasa nyata?" },
  16: { sjtId: "SJT_16", no: 16, title: "Delegasi Tugas Projek Akhir via Trello", question: "Apakah Anda mengenal Trello? Apakah ketidaktahuan tentang aplikasi itu menyulitkan Anda memilih opsi?" },
  17: { sjtId: "SJT_17", no: 17, title: "Melacak Kontribusi Menggunakan Version History Docs", question: "Apakah istilah version history (riwayat versi) dipahami? Bagaimana Anda membayangkan cara kerjanya?" },
  18: { sjtId: "SJT_18", no: 18, title: "Berbagi Beban Kognitif saat Menyusun RPP Tematik Terpadu", question: "Apa yang Anda pahami dari frasa 'berbagi beban kognitif'? Apakah istilah ini perlu diganti?" },
  19: { sjtId: "SJT_19", no: 19, title: "Desain Slide Pembelajaran Sains SD yang Interaktif", question: "Apa yang Anda pahami dari kata 'interaktif' dalam skenario perancangan slide presentasi SD ini?" },
  20: { sjtId: "SJT_20", no: 20, title: "Memotong Klip Video Sejarah Menggunakan Edpuzzle", question: "Apakah Anda mengenal platform Edpuzzle? Jika tidak, apakah Anda tetap dapat menilai opsi tindakan?" },
  21: { sjtId: "SJT_21", no: 21, title: "Menyediakan Takarir Video untuk Lingkungan Bising", question: "Apakah istilah 'takarir' (subtitel) dipahami? Apa padanan kata yang biasa Anda gunakan?" },
  22: { sjtId: "SJT_22", no: 22, title: "Merancang Modul Biologi Adaptif untuk Berbagai Gaya Belajar", question: "Apa arti bahan ajar digital biologi yang 'adaptif untuk berbagai gaya belajar' menurut Anda?" },
  23: { sjtId: "SJT_23", no: 23, title: "Merancang Modul Bencana Alam Bebas Hak Cipta", question: "Apakah Anda mengenal lisensi Creative Commons? Bagaimana Anda membedakan materi yang boleh dan tidak boleh dipakai?" },
  24: { sjtId: "SJT_24", no: 24, title: "Mengamankan Video Pembelajaran Menggunakan Watermark", question: "Apakah tujuan penggunaan watermark dan pencantuman lisensi dalam skenario ini jelas bagi Anda?" },
  25: { sjtId: "SJT_25", no: 25, title: "Tugas Mengolah 1000 Baris Data Nilai Rapor via Excel", question: "Apakah kemampuan Anda menggunakan rumus Excel memengaruhi pilihan? Apakah Anda memilih berdasarkan pengetahuan rumus atau pertimbangan tindakan?" },
  26: { sjtId: "SJT_26", no: 26, title: "Gawat Darurat Internet Terputus Saat ANBK di Sekolah", question: "Apakah Anda mengenal ANBK? Apa peran Anda dalam skenario ini menurut pemahaman Anda?" },
  27: { sjtId: "SJT_27", no: 27, title: "Materi Literasi Digital di Sekolah Tanpa Listrik", question: "Apakah kondisi sekolah tanpa listrik/jaringan di daerah 3T dalam skenario ini terasa realistis bagi calon guru?" },
  28: { sjtId: "SJT_28", no: 28, title: "Rencana Cadangan Saat Server Web Quizizz Tiba-tiba Down", question: "Sebelum melihat opsi, rencana cadangan (backup plan) apa yang terpikir oleh Anda saat server kuis down mendadak?" },
  29: { sjtId: "SJT_29", no: 29, title: "Serangan Pop-Up Iklan Tak Senonoh saat Mengajar Daring", question: "Apa langkah pertama yang terpikir oleh Anda? Apakah redaksi skenario ini nyaman dibaca?" },
  30: { sjtId: "SJT_30", no: 30, title: "Laptop Dosen Penguji Tidak Kompatibel dengan File Presentasi", question: "Apa yang terpikir pertama kali ketika membaca masalah ini? Apakah istilah format berkas dalam opsi dipahami?" }
};

interface SessionConfig {
  id: number;
  title: string;
  badge: string;
  colorHeader: string;
  btnBg: string;
  borderTheme: string;
  bgGradient: string;
  sjtIds: number[];
}

const SESSION_CONFIGS: Record<number, SessionConfig> = {
  1: {
    id: 1,
    title: "SESI 1 — Validasi, Etika & Masalah Teknis",
    badge: "Sesi 1 (10 Butir)",
    colorHeader: "from-rose-950 via-pink-900 to-rose-900 border-rose-600/60 text-rose-200",
    btnBg: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50",
    borderTheme: "border-rose-500/80 shadow-rose-950/40",
    bgGradient: "from-rose-950/30 via-slate-900/90 to-slate-950/95",
    sjtIds: [1, 7, 13, 19, 25, 5, 9, 14, 20, 26],
  },
  2: {
    id: 2,
    title: "SESI 2 — Penelusuran, Netiket & Adaptasi 3T",
    badge: "Sesi 2 (10 Butir)",
    colorHeader: "from-indigo-950 via-violet-900 to-indigo-900 border-indigo-600/60 text-indigo-200",
    btnBg: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50",
    borderTheme: "border-indigo-500/80 shadow-indigo-950/40",
    bgGradient: "from-indigo-950/30 via-slate-900/90 to-slate-950/95",
    sjtIds: [2, 8, 15, 21, 27, 3, 10, 16, 24, 28],
  },
  3: {
    id: 3,
    title: "SESI 3 — Pengelolaan Referensi & Penanganan Darurat",
    badge: "Sesi 3 (10 Butir)",
    colorHeader: "from-emerald-950 via-teal-900 to-emerald-900 border-emerald-600/60 text-emerald-200",
    btnBg: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50",
    borderTheme: "border-emerald-500/80 shadow-emerald-950/40",
    bgGradient: "from-emerald-950/30 via-slate-900/90 to-slate-950/95",
    sjtIds: [4, 11, 17, 22, 29, 6, 12, 18, 23, 30],
  },
};

// DIGITAL SIGNATURE CANVAS COMPONENT
function SignaturePad({
  onSave,
  onClear,
  currentSignature,
}: {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
  currentSignature: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#38bdf8"; // Sky blue stroke
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    onClear();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSave(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-dashed border-sky-400/50 rounded-xl bg-slate-950/90 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          className="w-full h-36 touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!currentSignature && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 text-xs font-semibold p-4 text-center">
            <i className="fa-solid fa-signature text-sky-400 text-xl mb-1"></i>
            <span>✍️ Goreskan Tanda Tangan Anda di sini (Layar Sentuh HP / Mouse Laptop)</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={clearCanvas}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition active:scale-95 flex items-center gap-1 font-bold"
        >
          <i className="fa-solid fa-rotate-left"></i> Bersihkan TTD
        </button>
        <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 cursor-pointer transition active:scale-95 flex items-center gap-1 font-bold">
          <i className="fa-solid fa-upload"></i> Unggah File Gambar TTD
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
}

export default function ThinkAloudProtocolPage() {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeSession, setActiveSession] = useState<1 | 2 | 3>(1);
  const [sessionItemIdx, setSessionItemIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [probingStep, setProbingStep] = useState<number>(1); // 1, 2, 3
  
  // Track completed steps per question ID: { [qId]: [1, 2, 3] }
  const [completedSteps, setCompletedSteps] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"guidance" | "consent" | "session">("guidance");

  // INFORMED CONSENT STATE PER SESSION
  const [consentApproved, setConsentApproved] = useState<Record<number, boolean>>({});
  const [consentSignatures, setConsentSignatures] = useState<Record<number, string>>({});
  const [consentChecked, setConsentChecked] = useState(false);

  // USER PROFILE
  const [userName, setUserName] = useState("Mahasiswa Calon Guru");
  const [userCampus, setUserCampus] = useState("LPTK Universitas");
  const [userNim, setUserNim] = useState("2026_PLP_01");

  // AUDIO RECORDER STATE
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

  // STEP COMPLETION HELPERS
  const markStepCompleted = (qId: number, stepNum: number) => {
    setCompletedSteps((prev) => {
      const existing = prev[qId] || [];
      if (!existing.includes(stepNum)) {
        return { ...prev, [qId]: [...existing, stepNum] };
      }
      return prev;
    });
  };

  const isStepCompleted = (qId: number, stepNum: number) => {
    return (completedSteps[qId] || []).includes(stepNum);
  };

  const isItemCompleted = (qId: number) => {
    return isStepCompleted(qId, 1) && isStepCompleted(qId, 2) && isStepCompleted(qId, 3);
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questions?type=madel5c", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setAllQuestions(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data soal SJT:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("userName") || "Mahasiswa Calon Guru");
      setUserCampus(localStorage.getItem("userCampus") || "LPTK Universitas");
      setUserNim(localStorage.getItem("userNim") || "2026_PLP_01");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [fetchQuestions]);

  const config = SESSION_CONFIGS[activeSession];
  const currentSessionQuestions = config.sjtIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const currentQ = currentSessionQuestions[sessionItemIdx];
  const currentProbing = currentQ ? specialProbings[currentQ.id] : null;

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

      // Live Speech-to-Text Recognition (Verbatim Transkrip Bahasa Indonesia id-ID)
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
      alert("Izin akses mikrofon diperlukan untuk merekam respons audio Think-Aloud.");
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
      alert("⚠️ Silakan tekan 'Rekam Suara' dan suarakan jawaban Anda terlebih dahulu sebelum mengunggah!");
      return;
    }
    if (!currentQ) return;

    setIsUploading(true);
    try {
      const userId = localStorage.getItem("userId") || "user_anon";
      const selectedOptIdx = selectedAnswers[currentQ.id];
      const selectedOptText =
        selectedOptIdx !== undefined && currentQ.options[selectedOptIdx]
          ? `${String.fromCharCode(65 + selectedOptIdx)}. ${currentQ.options[selectedOptIdx].text}`
          : "Belum Memilih Opsi";

      const formData = new FormData();
      formData.append("audio", audioBlob, `ThinkAloud_Sesi${activeSession}_Soal_${currentQ.id}_P${probingStep}.webm`);
      formData.append("userId", userId);
      formData.append("userName", userName);
      formData.append("userCampus", userCampus);
      formData.append("sessionNo", activeSession.toString());
      formData.append("itemNo", (sessionItemIdx + 1).toString());
      formData.append("sjtId", currentProbing?.sjtId || `SJT_${currentQ.id.toString().padStart(2, "0")}`);
      formData.append("probingStep", probingStep.toString());
      formData.append("questionTitle", questionTitle);
      formData.append("selectedOption", selectedOptText);
      formData.append("duration", recordingTime.toString());
      formData.append("transcript", transcriptText || "Transkrip teks tidak tersedia");

      const res = await fetch("/api/think-aloud/audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccess(true);
        markStepCompleted(currentQ.id, probingStep);
        alert(`✅ Rekaman Audio Pertanyaan ${probingStep} & Transkrip Verbatim Berhasil Tersimpan ke Database Panel Admin!`);
      } else {
        alert("❌ Gagal mengunggah rekaman ke server admin. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Gagal mengunggah rekaman suara:", err);
      alert("❌ Terjadi kesalahan koneksi saat mengunggah rekaman.");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl || !currentQ) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `ThinkAloud_Sesi${activeSession}_SJT_${currentQ.id}_P${probingStep}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: optIdx });
    setProbingStep(1);
    resetRecordingState();
  };

  const handleNextStepOrQuestion = () => {
    if (!currentQ) return;

    // Check strict mandatory requirement
    if (selectedAnswers[currentQ.id] === undefined) {
      alert("⚠️ Anda wajib memilih salah satu opsi tindakan (A/B/C/D/E) sebelum melanjutkan!");
      return;
    }

    if (!isStepCompleted(currentQ.id, probingStep)) {
      alert(`🔒 Anda WAJIB merekam dan mengunggah suara respons audio untuk Pertanyaan ${probingStep} ke Panel Admin sebelum melanjutkan!`);
      return;
    }

    if (probingStep < 3) {
      setProbingStep((prev) => prev + 1);
      resetRecordingState();
    } else {
      // Step 3 complete -> Go to next question item in session
      if (sessionItemIdx < currentSessionQuestions.length - 1) {
        setSessionItemIdx((prev) => prev + 1);
        setProbingStep(1);
        resetRecordingState();
      } else {
        alert(`🎉 Selamat! Anda telah menyelesaikan seluruh 10 Butir SJT Think-Aloud untuk Sesi ${activeSession}!`);
      }
    }
  };

  const handleSelectSession = (sessNum: 1 | 2 | 3) => {
    setActiveSession(sessNum);
    setSessionItemIdx(0);
    setProbingStep(1);
    resetRecordingState();
    if (!consentApproved[sessNum]) {
      setActiveTab("consent");
    } else {
      setActiveTab("session");
    }
  };

  const handleApproveConsent = () => {
    if (!consentChecked) {
      alert("⚠️ Harap centang kotak persetujuan ketentuan Informed Consent!");
      return;
    }
    if (!consentSignatures[activeSession]) {
      alert("⚠️ Harap berikan Tanda Tangan Digital Anda (goreskan di kanvas atau unggah gambar TTD)!");
      return;
    }
    setConsentApproved({ ...consentApproved, [activeSession]: true });
    setActiveTab("session");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-14 h-14 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-rose-900/50"></div>
        <p className="font-black text-sm uppercase tracking-widest text-rose-300 animate-pulse">
          Memuat Protokol Wawancara Think-Aloud MADEL5C (3 Sesi)...
        </p>
      </div>
    );
  }

  const selectedOpt = currentQ && selectedAnswers[currentQ.id] !== undefined ? currentQ.options[selectedAnswers[currentQ.id]] : null;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col py-3 px-2 md:px-5 font-sans"
      style={{
        backgroundImage: "url('/unj_bg_v2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <main className="relative z-10 w-full max-w-5xl mx-auto space-y-3">
        
        {/* HEADER BAR & SESSION SWITCHER (3D TIMBUL FIT ON SCREEN) */}
        <div className="bg-slate-900/95 backdrop-blur-xl p-3 rounded-2xl border-2 border-slate-700/80 shadow-2xl text-white space-y-2.5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 flex items-center justify-center shadow-lg shadow-rose-900/50 text-white shrink-0">
                <i className="fa-solid fa-microphone-lines text-lg animate-pulse"></i>
              </div>
              <div>
                <h1 className="text-sm md:text-base font-black tracking-tight uppercase bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  INSTRUMEN THINK-ALOUD MADEL5C (3 SESI)
                </h1>
                <p className="text-[10px] md:text-xs text-rose-300 font-semibold flex items-center gap-1.5">
                  <i className="fa-solid fa-user-graduate text-slate-400"></i>
                  <span>Peneliti Utama: Ruslina Irianty (<a href="mailto:ruslinairianty7@gmail.com" className="underline text-sky-300">ruslinairianty7@gmail.com</a>)</span>
                </p>
              </div>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("guidance")}
                className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === "guidance"
                    ? "bg-slate-700 text-white shadow-md border border-slate-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <i className="fa-solid fa-book-open"></i> Panduan Sesi
              </button>
              <button
                onClick={() => setActiveTab(consentApproved[activeSession] ? "session" : "consent")}
                className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab !== "guidance"
                    ? `${config.btnBg} shadow-md`
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <i className="fa-solid fa-clipboard-check"></i> Lembar Soal Think-Aloud
              </button>
            </div>
          </div>

          {/* 3 SESSION SELECTION BUTTONS */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((sessNum) => {
              const sessConf = SESSION_CONFIGS[sessNum];
              const isSelected = activeSession === sessNum;
              const isApproved = consentApproved[sessNum];
              return (
                <button
                  key={sessNum}
                  onClick={() => handleSelectSession(sessNum as 1 | 2 | 3)}
                  className={`p-2 rounded-xl text-left border-2 transition-all active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-r ${sessConf.colorHeader} border-amber-400 shadow-lg`
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-600 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-black uppercase tracking-wider">{sessConf.badge}</span>
                    {isApproved ? (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded-md font-bold">
                        <i className="fa-solid fa-check mr-0.5"></i> Disetujui
                      </span>
                    ) : (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-md font-bold">
                        <i className="fa-solid fa-file-signature mr-0.5"></i> Perlu TTD
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold truncate mt-1">{sessConf.title.split("—")[1]}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* TAB CONTENT 1: PANDUAN & RUJUKAN PROTOKOL THINK-ALOUD */}
        {activeTab === "guidance" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-slate-900/95 backdrop-blur-xl p-4 md:p-6 rounded-2xl border-2 border-slate-700/80 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base md:text-lg font-black uppercase tracking-wide text-rose-300 flex items-center gap-2">
                  <i className="fa-solid fa-book-bookmark"></i> Panduan &amp; Etika Pelaksanaan Think-Aloud (3 Sesi)
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  Resmi 30 Butir SJT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-black uppercase text-[11px]">
                    <i className="fa-solid fa-1 text-sm"></i> Struktur 3 Sesi
                  </div>
                  <p className="text-slate-300">
                    Instrumen terdiri atas 30 butir SJT MADEL5C yang terbagi ke dalam 3 sesi terpisah (masing-masing 10 butir). Setiap sesi mencakup 5 dimensi kompetensi digital.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[11px]">
                    <i className="fa-solid fa-2 text-sm"></i> Tiga Pertanyaan Probing
                  </div>
                  <p className="text-slate-300">
                    Setiap butir wajib dijawab melalui 3 tahap probing audio berurutan: (P1) Menjawab &amp; Tingkat Keyakinan, (P2) Alasan &amp; Probing Khusus Skenario, dan (P3) Evaluasi Opsi Lain &amp; Kejelasan Bahasa.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[11px]">
                    <i className="fa-solid fa-3 text-sm"></i> Rekaman &amp; Verbatim
                  </div>
                  <p className="text-slate-300">
                    Suarakan apa pun yang Anda pikirkan saat membaca skenario dan memilih opsi. Seluruh rekaman suara &amp; transkrip verbatim otomatis tersimpan langsung ke Panel Admin Peneliti.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-rose-950/40 border border-rose-600/40 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
                <i className="fa-solid fa-shield-halved text-lg text-rose-400 shrink-0 mt-0.5"></i>
                <div>
                  <span className="font-black uppercase tracking-wider block text-rose-300">Jaminan Kerahasiaan Data (Informed Consent):</span>
                  <span>Seluruh hasil pengisian, rekaman suara, dan catatan wawancara dijaga kerahasiaannya dan hanya digunakan untuk keperluan riset ilmiah pengembangan asesmen literasi digital.</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab(consentApproved[activeSession] ? "session" : "consent")}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider ${config.btnBg} transition active:scale-95 flex items-center gap-2`}
                >
                  <span>Mulai Pengisian Sesi {activeSession}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 2: INFORMED CONSENT & DIGITAL SIGNATURE */}
        {activeTab === "consent" && !consentApproved[activeSession] && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-slate-900/95 backdrop-blur-xl p-4 md:p-6 rounded-2xl border-2 border-amber-500/60 shadow-2xl text-white space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base md:text-lg font-black uppercase tracking-wide text-amber-300 flex items-center gap-2">
                    <i className="fa-solid fa-file-contract text-amber-400"></i> Lembar Persetujuan Keikutsertaan (Informed Consent)
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold">{config.title}</p>
                </div>
                <span className="text-[10px] font-black uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-lg">
                  Wajib Diisi
                </span>
              </div>

              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed max-h-72 overflow-y-auto custom-scrollbar">
                <p className="font-bold text-white">
                  Saya yang bertanda tangan di bawah ini menyatakan secara sadar dan sukarela bersedia menjadi partisipan dalam uji coba wawancara Think-Aloud Instrumen MADEL5C (Sesi {activeSession}).
                </p>
                <div className="space-y-1.5 border-l-2 border-amber-500/60 pl-3">
                  <p><strong className="text-amber-200">Peneliti Utama:</strong> Ruslina Irianty (Pengemban Riset BIMA MADEL5C)</p>
                  <p><strong className="text-amber-200">Email Kontak Resmi:</strong> <a href="mailto:ruslinairianty7@gmail.com" className="underline text-sky-300">ruslinairianty7@gmail.com</a></p>
                  <p><strong className="text-amber-200">Tujuan Riset:</strong> Menganalisis proses berpikir, penalaran situasional, serta keterbacaan instrumen literasi digital mahasiswa calon guru.</p>
                </div>
                <p>
                  Saya memahami bahwa selama sesi berlangsung, suara saya akan direkam dan ditranskrip secara otomatis. Seluruh data identitas dan rekaman disimpan aman di database admin dan tidak akan dipublikasikan secara terbuka.
                </p>
              </div>

              {/* USER PROFILE INFO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Nama Partisipan:</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 bg-slate-950 rounded-lg border border-slate-700 text-white font-bold text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">LPTK / Universitas:</label>
                  <input
                    type="text"
                    value={userCampus}
                    onChange={(e) => setUserCampus(e.target.value)}
                    className="w-full p-2 bg-slate-950 rounded-lg border border-slate-700 text-white font-bold text-xs focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">NIM / NPM / ID:</label>
                  <input
                    type="text"
                    value={userNim}
                    onChange={(e) => setUserNim(e.target.value)}
                    className="w-full p-2 bg-slate-950 rounded-lg border border-slate-700 text-white font-bold text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* DIGITAL SIGNATURE CANVAS */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="block text-xs font-black uppercase tracking-wider text-sky-300">
                  <i className="fa-solid fa-pen-nib mr-1"></i> Tanda Tangan Digital (TTD) Partisipan:
                </label>
                <SignaturePad
                  currentSignature={consentSignatures[activeSession] || null}
                  onSave={(dataUrl) => setConsentSignatures({ ...consentSignatures, [activeSession]: dataUrl })}
                  onClear={() => {
                    const copy = { ...consentSignatures };
                    delete copy[activeSession];
                    setConsentSignatures(copy);
                  }}
                />
              </div>

              {/* CONSENT CHECKBOX & APPROVAL BUTTON */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 mt-0.5"
                  />
                  <span>Saya membaca, memahami, dan menyetujui Lembar Persetujuan Keikutsertaan ini secara sadar dan sukarela.</span>
                </label>

                <button
                  onClick={handleApproveConsent}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 shrink-0 ${
                    consentChecked && consentSignatures[activeSession]
                      ? "bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black shadow-lg shadow-amber-500/30"
                      : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  }`}
                >
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Saya Setuju &amp; Mulai Sesi {activeSession}</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 3: MAIN THINK-ALOUD QUESTION & PROBING AUDIO FLOW */}
        {(activeTab === "session" || consentApproved[activeSession]) && currentQ && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            
            {/* ITEM BADGES BAR (1 TO 10 FOR CURRENT SESSION) */}
            <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
              {currentSessionQuestions.map((q, idx) => {
                const isCurrent = idx === sessionItemIdx;
                const isDone = isItemCompleted(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      // Block jumping ahead if previous question not completed
                      if (idx > sessionItemIdx && !isItemCompleted(currentQ.id)) {
                        alert("🔒 Selesaikan soal saat ini dan seluruh 3 tahap probing audio terlebih dahulu sebelum pindah ke soal berikutnya!");
                        return;
                      }
                      setSessionItemIdx(idx);
                      setProbingStep(1);
                      resetRecordingState();
                    }}
                    className={`flex-1 min-w-[36px] py-1.5 rounded-lg text-[10px] font-black transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      isCurrent
                        ? `${config.btnBg} text-white shadow-md ring-2 ring-amber-400`
                        : isDone
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/50"
                        : "bg-slate-950/70 text-slate-400 border border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isDone && <i className="fa-solid fa-check text-[8px]"></i>}
                  </button>
                );
              })}
            </div>

            {/* MAIN QUESTION & SCENARIO CARD (3D TIMBUL STYLE) */}
            <div className={`p-4 md:p-5 rounded-2xl border-2 ${config.borderTheme} ${config.bgGradient} backdrop-blur-xl shadow-2xl space-y-4 text-white`}>
              
              {/* SCENARIO TITLE & DIMENSION */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Sesi {activeSession} • Soal {sessionItemIdx + 1} dari 10
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      ID: SJT_{currentQ.id.toString().padStart(2, "0")}
                    </span>
                    {currentQ.dim && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        {currentQ.dim}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-black text-white tracking-tight">
                    {currentProbing?.title || `SJT Butir ${currentQ.id}`}
                  </h3>
                </div>
              </div>

              {/* SKENARIO TEXT BOX */}
              <div className="p-3.5 md:p-4 bg-slate-950/90 rounded-xl border border-slate-800 shadow-inner space-y-2 text-xs md:text-sm leading-relaxed text-slate-200">
                <div className="flex items-center gap-2 font-black text-amber-300 text-[11px] uppercase tracking-wider">
                  <i className="fa-solid fa-book-open-reader"></i> Skenario Situasional:
                </div>
                <p className="whitespace-pre-line font-medium text-slate-100">{currentQ.scenario}</p>
              </div>

              {/* OPTIONS LIST (A, B, C, D, E) */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check"></i> Pilihan Tindakan (Pilih Satu Pilihan Terlebih Dahulu):
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3 rounded-xl text-left border-2 transition-all active:scale-[0.99] flex items-start gap-3 text-xs md:text-sm font-medium ${
                          isSelected
                            ? "bg-rose-950/90 border-rose-500 text-white shadow-lg shadow-rose-950/50 ring-2 ring-rose-400"
                            : "bg-slate-950/70 border-slate-800 hover:border-slate-600 text-slate-300 hover:bg-slate-900"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-rose-600 border-rose-400 text-white"
                              : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="leading-snug pt-0.5">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* THREE-STEP PROBING AUDIO SECTION */}
              {selectedAnswers[currentQ.id] !== undefined && (
                <div className="pt-3 border-t-2 border-slate-700/80 space-y-3">
                  
                  {/* PROBING STEP INDICATOR TABS (P1 -> P2 -> P3) */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { step: 1, title: "1. Pemahaman & Alasan" },
                      { step: 2, title: "2. Probing Khusus" },
                      { step: 3, title: "3. Evaluasi Opsi" },
                    ].map(({ step, title }) => {
                      const isActive = probingStep === step;
                      const isDone = isStepCompleted(currentQ.id, step);
                      return (
                        <button
                          key={step}
                          onClick={() => {
                            if (step > 1 && !isStepCompleted(currentQ.id, step - 1)) {
                              alert(`🔒 Selesaikan Pertanyaan ${step - 1} terlebih dahulu!`);
                              return;
                            }
                            setProbingStep(step);
                            resetRecordingState();
                          }}
                          className={`py-2 px-1 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-1.5 ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 border-amber-300 shadow-lg"
                              : isDone
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                              : "bg-slate-950/60 text-slate-500 border-slate-800"
                          }`}
                        >
                          <span>{title}</span>
                          {isDone && <i className="fa-solid fa-check-circle text-emerald-400"></i>}
                        </button>
                      );
                    })}
                  </div>

                  {/* PROBING QUESTION BOX BASED ON STEP */}
                  <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-700 space-y-2 text-xs md:text-sm">
                    {probingStep === 1 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-amber-300 font-black text-xs uppercase">
                          <span><i className="fa-solid fa-circle-question mr-1"></i> Pertanyaan Probing 1: Pemahaman Situasi</span>
                          <span className="text-[10px] text-slate-400">Wajib Dijawab Suara</span>
                        </div>
                        <p className="font-semibold text-slate-200">
                          "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan jawaban Anda (dari 1=Sangat Ragu sampai 5=Sangat Yakin)?"
                        </p>
                      </div>
                    )}

                    {probingStep === 2 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-rose-300 font-black text-xs uppercase">
                          <span><i className="fa-solid fa-circle-question mr-1"></i> Pertanyaan Probing 2: Probing Khusus Skenario</span>
                          <span className="text-[10px] text-slate-400">Wajib Dijawab Suara</span>
                        </div>
                        <p className="font-semibold text-slate-200">
                          "{currentProbing?.question || 'Mengapa Anda memilih tindakan itu daripada pilihan yang lain?'}"
                        </p>
                      </div>
                    )}

                    {probingStep === 3 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-emerald-300 font-black text-xs uppercase">
                          <span><i className="fa-solid fa-circle-question mr-1"></i> Pertanyaan Probing 3: Evaluasi Opsi &amp; Realisme</span>
                          <span className="text-[10px] text-slate-400">Wajib Dijawab Suara</span>
                        </div>
                        <p className="font-semibold text-slate-200">
                          "Apakah terdapat dua pilihan jawaban yang sulit dibedakan, adakah kata/istilah yang membingungkan, dan apakah situasi ini realistis bagi mahasiswa calon guru?"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AUDIO RECORDER & UPLOAD PANEL UNDER EACH QUESTION */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!isRecording ? (
                          <button
                            onClick={startRecording}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border border-rose-400 transition active:scale-95 flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-microphone text-sm animate-bounce"></i>
                            <span>1. Rekam Suara</span>
                          </button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border border-amber-300 animate-pulse transition active:scale-95 flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-square text-sm"></i>
                            <span>Hentikan Rekaman ({formatTime(recordingTime)})</span>
                          </button>
                        )}

                        <button
                          onClick={() => uploadAudioToServer(currentProbing?.title || `Probing P${probingStep}`)}
                          disabled={isUploading || isRecording || !audioBlob}
                          className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border transition active:scale-95 flex items-center gap-1.5 ${
                            uploadSuccess || isStepCompleted(currentQ.id, probingStep)
                              ? "bg-emerald-600 text-white border-emerald-400"
                              : "bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                          }`}
                        >
                          {isUploading ? (
                            <><i className="fa-solid fa-spinner animate-spin"></i> Mengirim...</>
                          ) : uploadSuccess || isStepCompleted(currentQ.id, probingStep) ? (
                            <><i className="fa-solid fa-circle-check"></i> Terkirim ke Admin</>
                          ) : (
                            <><i className="fa-solid fa-paper-plane"></i> 2. Kirim Suara ke Admin</>
                          )}
                        </button>
                      </div>

                      {audioUrl && !isRecording && (
                        <div className="flex items-center gap-2">
                          <audio controls src={audioUrl} className="h-8 max-w-[180px] rounded-lg shadow" />
                          <button
                            onClick={downloadAudio}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg border border-slate-700 transition"
                          >
                            <i className="fa-solid fa-download mr-1 text-emerald-400"></i> Unduh
                          </button>
                        </div>
                      )}
                    </div>

                    {/* VERBATIM TRANSCRIPT SPEECH-TO-TEXT AREA */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                        <span><i className="fa-solid fa-file-signature text-rose-400 mr-1"></i> Transkrip Teks Verbatim (Otomatis):</span>
                        {transcriptText && <span className="text-emerald-400 font-bold">✓ Terisi</span>}
                      </div>
                      <textarea
                        rows={2}
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Hasil transkrip otomatis ucapan Anda akan tampil di sini saat merekam..."
                        className="w-full p-2.5 bg-slate-900 rounded-lg border border-slate-700 text-xs text-white font-medium focus:border-rose-400 outline-none leading-relaxed"
                      />
                    </div>

                  </div>

                  {/* NAVIGATION CONTROL: NEXT STEP / NEXT QUESTION BUTTON */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      {!isStepCompleted(currentQ.id, probingStep)
                        ? `🔒 Rekam & Unggah suara Pertanyaan ${probingStep} untuk membuka tombol lanjut.`
                        : `✅ Pertanyaan ${probingStep} Selesai! Silakan tekan tombol di kanan.`}
                    </span>

                    <button
                      onClick={handleNextStepOrQuestion}
                      disabled={!isStepCompleted(currentQ.id, probingStep)}
                      className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 ${
                        isStepCompleted(currentQ.id, probingStep)
                          ? `${config.btnBg} text-white shadow-lg`
                          : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      }`}
                    >
                      <span>
                        {probingStep < 3
                          ? `Lanjut ke Pertanyaan ${probingStep + 1}`
                          : sessionItemIdx < currentSessionQuestions.length - 1
                          ? "Lanjut ke Soal Berikutnya"
                          : `Selesaikan Sesi ${activeSession}`}
                      </span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>

                </div>
              )}

            </div>

          </motion.div>
        )}

      </main>
    </div>
  );
}
