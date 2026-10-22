"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ART_QUESTIONS, ArtQuestion, ArtOption } from "./art_questions";

export const dynamic = "force-dynamic";

interface SessionInfo {
  sessionNo: 1 | 2 | 3;
  title: string;
  subtitle: string;
  themeDesc: string;
  itemsRange: string;
  colorHeader: string;
  badgeBg: string;
  accentBorder: string;
  bgGlow: string;
}

const SESSION_DETAILS: Record<1 | 2 | 3, SessionInfo> = {
  1: {
    sessionNo: 1,
    title: "SESI 1 — Capaian Pembelajaran, Bernyanyi & Perencanaan Modul",
    subtitle: "Eksplorasi Pemahaman Kurikulum & Kesiapan Awal Mengajar Seni SD",
    themeDesc: "Fokus pada butir M01 s/d M05 (Pemahaman CP, bernyanyi tanpa alat musik, mengajar seni tanpa latar belakang seni, modul ajar, dan muatan perkuliahan PPG).",
    itemsRange: "Butir 1 s/d 5 (M01 – M05)",
    colorHeader: "from-emerald-950 via-teal-900 to-emerald-900 border-emerald-500/50 text-emerald-200",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    accentBorder: "border-emerald-500/40",
    bgGlow: "rgba(16, 185, 129, 0.15)",
  },
  2: {
    sessionNo: 2,
    title: "SESI 2 — Dinamika Kelas, Pencampuran Warna & Bahan Kolase",
    subtitle: "Eksplorasi Keterampilan Praktik, Manajemen Kelas & Sumber Daya Terbatas",
    themeDesc: "Fokus pada butir M06 s/d M10 (Pencampuran warna, teknik menggambar, manajemen kegaduhan musik, bahan kolase alternatif, dan advokasi jadwal seni PLP).",
    itemsRange: "Butir 6 s/d 10 (M06 – M10)",
    colorHeader: "from-lime-950 via-emerald-900 to-teal-900 border-lime-500/50 text-lime-200",
    badgeBg: "bg-lime-500/20 text-lime-300 border-lime-400/40",
    accentBorder: "border-lime-500/40",
    bgGlow: "rgba(132, 204, 22, 0.15)",
  },
  3: {
    sessionNo: 3,
    title: "SESI 3 — Diferensiasi Gerak, Seni Peran & Asesmen Portofolio",
    subtitle: "Eksplorasi Seni Pertunjukan, Umpan Balik Kritis & Pemanfaatan Media Digital",
    themeDesc: "Fokus pada butir M11 s/d M15 (Diferensiasi gerak & lagu, bermain peran, umpan balik membangun pada karya, rubrik patung tanah liat, dan refleksi media digital).",
    itemsRange: "Butir 11 s/d 15 (M11 – M15)",
    colorHeader: "from-teal-950 via-cyan-900 to-emerald-900 border-cyan-500/50 text-cyan-200",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    accentBorder: "border-cyan-500/40",
    bgGlow: "rgba(6, 182, 212, 0.15)",
  },
};

// DIGITAL SIGNATURE CANVAS COMPONENT
function ArtSignaturePad({
  onSave,
  onClear,
  currentSignature,
}: {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
  currentSignature: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isInternalDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#10b981"; // Vibrant Emerald Green Ink
  }, []);

  useEffect(() => {
    if (!currentSignature) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    if (isInternalDrawingRef.current) {
      isInternalDrawingRef.current = false;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio, 1);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );
    };
    img.src = currentSignature;
  }, [currentSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    isInternalDrawingRef.current = true;
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
      isInternalDrawingRef.current = true;
      onSave(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (!result) return;
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio, 1);
          const centerShiftX = (canvas.width - img.width * ratio) / 2;
          const centerShiftY = (canvas.height - img.height * ratio) / 2;
          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShiftX,
            centerShiftY,
            img.width * ratio,
            img.height * ratio
          );
          const dataUrl = canvas.toDataURL("image/png");
          isInternalDrawingRef.current = false;
          onSave(dataUrl);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative border-2 border-dashed border-emerald-400/50 rounded-2xl bg-slate-950/90 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={520}
          height={160}
          className="w-full h-36 touch-none cursor-crosshair relative z-10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!currentSignature && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 text-xs font-semibold p-4 text-center z-0">
            <i className="fa-solid fa-signature text-emerald-400 text-2xl mb-1.5 animate-pulse"></i>
            <span>✍️ Goreskan Tanda Tangan Anda di sini (Layar Sentuh HP / Mouse Komputer) atau Unggah Foto di Bawah</span>
          </div>
        )}
        {currentSignature && (
          <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md pointer-events-none">
            <i className="fa-solid fa-circle-check"></i>
            <span>Tanda Tangan Siap</span>
          </div>
        )}
      </div>

      {currentSignature && (
        <div className="p-2.5 bg-slate-900/90 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-16 h-8 bg-slate-950 border border-emerald-500/40 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
              <img src={currentSignature} alt="TTD Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <span className="text-xs font-medium text-emerald-200">Tanda Tangan Digital Terverifikasi</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <i className="fa-solid fa-check-double"></i> Sah
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={clearCanvas}
          className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-rose-300 border border-slate-700 transition active:scale-95 flex items-center gap-1.5 font-bold"
        >
          <i className="fa-solid fa-rotate-left"></i> Bersihkan
        </button>
        <label className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 cursor-pointer transition active:scale-95 flex items-center gap-1.5 font-bold">
          <i className="fa-solid fa-upload"></i> Unggah Gambar TTD (PNG/JPG)
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

export default function ThinkAloudArtPage() {
  const router = useRouter();

  // FLOW & NAVIGATION STATE
  const [activeSession, setActiveSession] = useState<1 | 2 | 3>(1);
  const [sessionItemIdx, setSessionItemIdx] = useState<number>(0); // 0 to 4 within current session
  const [probingStep, setProbingStep] = useState<number>(1); // 1: Menjawab, 2: Menjelaskan & Spesifik, 3: Kebutuhan & Hambatan, 4: Evaluasi Butir
  const [activeTab, setActiveTab] = useState<"profile" | "guidance" | "consent" | "session">("profile");

  // SESSION UNLOCK & TRANSITION STATE
  // Session 1 is always unlocked. Session 2 & 3 unlocked automatically upon completion of previous session!
  const [unlockedSessions, setUnlockedSessions] = useState<Record<number, boolean>>({ 1: true, 2: false, 3: false });
  const [showSessionTransitionModal, setShowSessionTransitionModal] = useState<null | { fromSession: 1 | 2; toSession: 2 | 3 }>(null);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState<boolean>(false);

  // PARTICIPANT PROFILE
  const [userName, setUserName] = useState("Calon Guru Seni PPG");
  const [userNim, setUserNim] = useState("");
  const [userCampus, setUserCampus] = useState("Universitas Pendidikan Indonesia");
  const [userStudyProgram, setUserStudyProgram] = useState("Pendidikan Guru Sekolah Dasar (PGSD) / Seni");
  const [userTeachingExp, setUserTeachingExp] = useState("Sedang menempuh PLP PPG Prajabatan");

  // INFORMED CONSENT STATE (ONLY FILLED ONCE IN SESSION 1)
  const [consentApproved, setConsentApproved] = useState(false);
  const [consentSignature, setConsentSignature] = useState<string | null>(null);
  const [mandatoryConsents, setMandatoryConsents] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

  // PARTICIPANT ANSWERS & PROGRESS
  // Option choice per question: { [qId]: 'A' | 'B' | 'C' | 'D' | 'E' }
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  // Confidence scale 1-5 per question: { [qId]: 1..5 }
  const [confidenceRatings, setConfidenceRatings] = useState<Record<number, number>>({});
  // Completed probing steps: { [qId]: [1, 2, 3, 4] }
  const [completedSteps, setCompletedSteps] = useState<Record<number, number[]>>({});

  // AUDIO & RECORDING STATE
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // TEXT-TO-SPEECH (TTS) NARRATION
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingType, setSpeakingType] = useState<"scenario" | "probing" | null>(null);

  // REFS
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const finalTranscriptRef = useRef<string>("");

  // LOAD CACHED STATE ON MOUNT
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedConsent = localStorage.getItem("art_consentApproved");
      if (savedConsent === "true") {
        setConsentApproved(true);
      }
      const savedName = localStorage.getItem("art_userName");
      if (savedName) setUserName(savedName);
      const savedCampus = localStorage.getItem("art_userCampus");
      if (savedCampus) setUserCampus(savedCampus);
      const savedNim = localStorage.getItem("art_userNim");
      if (savedNim) setUserNim(savedNim);

      const savedS2 = localStorage.getItem("art_session2_unlocked");
      if (savedS2 === "true") setUnlockedSessions((prev) => ({ ...prev, 2: true }));
      const savedS3 = localStorage.getItem("art_session3_unlocked");
      if (savedS3 === "true") setUnlockedSessions((prev) => ({ ...prev, 3: true }));
    }
  }, []);

  // CURRENT ACTIVE QUESTIONS IN CURRENT SESSION
  const currentSessionQuestions = ART_QUESTIONS.filter((q) => q.session === activeSession);
  const currentQ: ArtQuestion | undefined = currentSessionQuestions[sessionItemIdx];

  // TOTAL GLOBAL PROGRESS
  const totalCompletedQuestions = Object.keys(completedSteps).filter(
    (qIdStr) => (completedSteps[parseInt(qIdStr, 10)] || []).length >= 2
  ).length;

  // STOP TEXT-TO-SPEECH
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingType(null);
  }, []);

  // TEXT-TO-SPEECH NARRATOR
  const speakText = (textToSpeak: string, type: "scenario" | "probing") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Peramban Anda belum mendukung Text-to-Speech.");
      return;
    }

    if (isSpeaking && speakingType === type) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const cleanText = textToSpeak.replace(/<[^>]*>?/gm, "").replace(/\n/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "id-ID";
    utterance.rate = 0.93;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.includes("id") || v.lang.includes("ID"));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingType(type);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingType(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingType(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // STEP HELPERS
  const markStepDone = (qId: number, stepNum: number) => {
    setCompletedSteps((prev) => {
      const existing = prev[qId] || [];
      if (!existing.includes(stepNum)) {
        return { ...prev, [qId]: [...existing, stepNum] };
      }
      return prev;
    });
  };

  const isStepDone = (qId: number, stepNum: number) => {
    return (completedSteps[qId] || []).includes(stepNum);
  };

  const isQuestionComplete = (qId: number) => {
    const steps = completedSteps[qId] || [];
    return steps.includes(1) && steps.includes(2);
  };

  // CHECK ALL MANDATORY CONSENTS
  const allMandatoryChecked = Object.values(mandatoryConsents).every((v) => v === true);

  // APPROVE CONSENT (SESSION 1 ONLY)
  const handleApproveConsent = async () => {
    if (!allMandatoryChecked) {
      alert("Mohon centang seluruh butir persetujuan Informed Consent.");
      return;
    }
    if (!consentSignature) {
      alert("Mohon bubuhkan tanda tangan digital Anda terlebih dahulu.");
      return;
    }

    try {
      localStorage.setItem("art_consentApproved", "true");
      localStorage.setItem("art_userName", userName);
      localStorage.setItem("art_userCampus", userCampus);
      localStorage.setItem("art_userNim", userNim);

      // Save consent to server
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userNim || `art_${Date.now()}`,
          userName: userName || "Calon Guru Seni PPG",
          userCampus: userCampus,
          userNim: userNim,
          sessionNo: 1,
          respondentLevel: "Mahasiswa PPG Pendidikan Seni",
          studyProgram: userStudyProgram,
          signatureDataUrl: consentSignature,
        }),
      });
    } catch (err) {
      console.warn("Gagal sinkron consent ke server:", err);
    }

    setConsentApproved(true);
    setActiveTab("session");
  };

  // AUDIO RECORDING FUNCTIONS
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      finalTranscriptRef.current = "";
      setTranscriptText("");
      setAudioBlob(null);
      setAudioUrl(null);
      setUploadSuccess(false);

      // Audio Analyzer for Visualizer
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!isRecordingRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 255) * 100)));
          requestAnimationFrame(updateLevel);
        };
        requestAnimationFrame(updateLevel);
      } catch (e) {
        console.warn("Analyser init error:", e);
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      // Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "id-ID";

        recognition.onresult = (event: any) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += event.results[i][0].transcript + " ";
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setTranscriptText(finalTranscriptRef.current + interim);
        };

        recognition.onerror = (e: any) => console.warn("SpeechRec error:", e);
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      console.error("Gagal akses mikrofon:", err);
      alert("Izin akses mikrofon diperlukan untuk merekam respons verbal Think-Aloud.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});

    setIsRecording(false);
    isRecordingRef.current = false;
    setAudioLevel(0);

    if (currentQ) {
      markStepDone(currentQ.id, probingStep);
    }
  };

  const resetRecordingState = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscriptText("");
    setUploadSuccess(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  // UPLOAD AUDIO & TRANSCRIPT DIRECTLY TO ADMIN PANEL (ALIGNED WITH S3 WORKFLOW)
  const uploadAudioToServer = async () => {
    const hasAudio = !!audioBlob || audioChunksRef.current.length > 0;
    const hasText = transcriptText.trim().length > 0;

    if (!hasAudio && !hasText) {
      alert("⚠️ Silakan rekam suara Anda ATAU ketik teks elaborasi jawaban Anda pada kotak transkrip terlebih dahulu sebelum mengirim!");
      return;
    }
    if (!currentQ) return;

    setIsUploading(true);
    try {
      const selectedOpt = selectedOptions[currentQ.id];
      const selectedOptObj = currentQ.options.find((o) => o.label === selectedOpt);
      const selectedOptText = selectedOpt && selectedOptObj
        ? `${selectedOpt}. ${selectedOptObj.text}`
        : selectedOpt || "Belum Memilih Opsi";

      const confidenceVal = confidenceRatings[currentQ.id];
      const confidenceText = confidenceVal ? `${confidenceVal}/5` : "Belum dinilai";
      const finalTranscript = transcriptText.trim()
        ? `[Tingkat Keyakinan: ${confidenceText}] — ${transcriptText.trim()}`
        : `[Tingkat Keyakinan: ${confidenceText}] — [Respon Suara Terkirim Langsung ke Panel Admin]`;

      const fileToUpload = audioBlob
        ? audioBlob
        : audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: "audio/webm" })
        : new Blob(["[Respon Teks Manual Tanpa Berkas Audio]"], { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", fileToUpload, `ThinkAloud_Art_S${activeSession}_Q${currentQ.code}_P${probingStep}.webm`);
      formData.append("isTextOnly", hasAudio ? "false" : "true");
      formData.append("userId", userNim || `art_resp_${Date.now()}`);
      formData.append("userName", userName || "Calon Guru Seni PPG");
      formData.append("userCampus", userCampus || "LPTK Universitas");
      formData.append("respondentLevel", "Mahasiswa PPG Pendidikan Seni");
      formData.append("studyProgram", userStudyProgram || "Pendidikan Guru Sekolah Dasar (PGSD) / Seni");
      formData.append("sessionNo", activeSession.toString());
      formData.append("itemNo", (sessionItemIdx + 1).toString());
      formData.append("sjtId", currentQ.code);
      formData.append("probingStep", probingStep.toString());
      formData.append("questionTitle", activeProbing.title);
      formData.append("selectedOption", selectedOptText);
      formData.append("duration", recordingTime.toString());
      formData.append("transcript", finalTranscript);

      const res = await fetch("/api/think-aloud/audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccess(true);
        if (data.record?.transcript && !data.record.transcript.includes("[Respon Suara Terkirim")) {
          setTranscriptText(data.record.transcript);
        }
        markStepDone(currentQ.id, probingStep);

        if (probingStep < 4) {
          const nextStep = probingStep + 1;
          alert(`✅ Respon Pertanyaan Probing ${probingStep} Berhasil Terkirim Langsung ke Panel Admin!\nOtomatis beralih ke Pertanyaan Probing ${nextStep}.`);
          setProbingStep(nextStep);
          resetRecordingState();
        } else {
          alert(`🎉 Selamat! Seluruh tahap probing untuk Butir #${sessionItemIdx + 1} (${currentQ.code}) telah lengkap terkirim ke Panel Admin!`);
          if (sessionItemIdx < currentSessionQuestions.length - 1) {
            setSessionItemIdx((idx) => idx + 1);
            setProbingStep(1);
            resetRecordingState();
          } else {
            checkSessionCompletion();
          }
        }
      } else {
        alert("❌ Gagal mengirim respon ke server admin. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Gagal mengirim respon:", err);
      alert("❌ Terjadi kesalahan koneksi saat mengirim respon ke server admin.");
    } finally {
      setIsUploading(false);
    }
  };

  // CHECK SESSION COMPLETION & ADVANCE
  const checkSessionCompletion = () => {
    // Check if all 5 questions in current session are complete
    const currentSessionIds = currentSessionQuestions.map((q) => q.id);
    const allDone = currentSessionIds.every((id) => isQuestionComplete(id));

    if (allDone) {
      if (activeSession === 1) {
        localStorage.setItem("art_session2_unlocked", "true");
        setUnlockedSessions((prev) => ({ ...prev, 2: true }));
        setShowSessionTransitionModal({ fromSession: 1, toSession: 2 });
      } else if (activeSession === 2) {
        localStorage.setItem("art_session3_unlocked", "true");
        setUnlockedSessions((prev) => ({ ...prev, 3: true }));
        setShowSessionTransitionModal({ fromSession: 2, toSession: 3 });
      } else if (activeSession === 3) {
        setShowFinalCompletionModal(true);
      }
    }
  };

  // PROCEED TO NEXT ITEM OR NEXT STEP
  const handleNextStep = async () => {
    stopSpeaking();
    if (!currentQ) return;

    // Jika responden merekam audio atau mengisi transkrip tapi belum klik kirim, otomatis kirim ke admin
    const hasUnsent = (audioBlob || audioChunksRef.current.length > 0 || transcriptText.trim().length > 0) && !uploadSuccess;
    if (hasUnsent) {
      await uploadAudioToServer();
      return;
    }

    markStepDone(currentQ.id, probingStep);

    if (probingStep < 4) {
      setProbingStep((s) => s + 1);
      resetRecordingState();
    } else {
      if (sessionItemIdx < currentSessionQuestions.length - 1) {
        setSessionItemIdx((idx) => idx + 1);
        setProbingStep(1);
        resetRecordingState();
      } else {
        checkSessionCompletion();
      }
    }
  };

  // SWITCH SESSION WITH TRANSITION BUTTON
  const handleTransitionToSession = (nextSession: 2 | 3) => {
    stopSpeaking();
    setShowSessionTransitionModal(null);
    setActiveSession(nextSession);
    setSessionItemIdx(0);
    setProbingStep(1);
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscriptText("");
    setUploadSuccess(false);
    setRecordingTime(0);
    // CRITICAL REQUIREMENT: Informed consent is NOT asked again! We remain in 'session' tab directly.
    setActiveTab("session");
  };

  // PROBING STEP CONTENT HELPER
  const getProbingContent = () => {
    if (!currentQ) return { title: "", prompt: "", subtitle: "" };
    switch (probingStep) {
      case 1:
        return {
          title: "Tahap 1: Membaca & Memilih Opsi Tindakan",
          subtitle: "Verbalisasi Kognitif Spontan (Think-Aloud)",
          prompt: currentQ.probings.step1,
        };
      case 2:
        return {
          title: "Tahap 2: Menjelaskan Alasan & Probing Spesifik",
          subtitle: "Pemaknaan Pedagogik Seni & Argumen Pilihan",
          prompt: `${currentQ.probings.step2_explain}\n\n🔍 Pertanyaan Khusus Butir:\n"${currentQ.probings.step2_specific}"`,
        };
      case 3:
        return {
          title: "Tahap 3: Kebutuhan Dukungan & Hambatan di PLP",
          subtitle: "Refleksi Kontekstual di Sekolah Dasar",
          prompt: currentQ.probings.step3_needs,
        };
      case 4:
        return {
          title: "Tahap 4: Evaluasi Kejelasan & Realisme Butir",
          subtitle: "Validasi Ekologis Instrumen Seni",
          prompt: currentQ.probings.step4_eval,
        };
      default:
        return { title: "", prompt: "", subtitle: "" };
    }
  };

  const activeProbing = getProbingContent();
  const sessionConfig = SESSION_DETAILS[activeSession];

  return (
    <div className="min-h-screen bg-[#071311] text-slate-100 font-sans selection:bg-lime-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* ─── VIBRANT ARTISTIC AMBIENT BACKGROUND (NOT STIFF / DINAMIS & KREATIF) ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glowing artistic radial meshes */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-35 transition-colors duration-1000"
          style={{ backgroundColor: sessionConfig.bgGlow }}
        />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[150px] opacity-25 bg-lime-500/20" />
        <div className="absolute -bottom-40 left-1/4 w-[700px] h-[600px] rounded-full blur-[160px] opacity-25 bg-teal-500/20" />

        {/* Artistic Motif SVG: Floating Palette, Easel & Waves */}
        <svg
          className="w-full h-full opacity-[0.06] mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="artStudioGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1.5" fill="#84cc16" />
              <path d="M 0,40 L 80,40 M 40,0 L 40,80" stroke="#10b981" strokeWidth="0.4" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#artStudioGrid)" />
        </svg>

        {/* Floating Decorative Art Elements */}
        <div className="hidden xl:block absolute top-28 right-12 opacity-30 text-lime-400/80 animate-pulse text-6xl">
          <i className="fa-solid fa-palette"></i>
        </div>
        <div className="hidden xl:block absolute bottom-24 left-10 opacity-25 text-emerald-400/80 text-5xl">
          <i className="fa-solid fa-paintbrush"></i>
        </div>
      </div>

      {/* ─── TOP NAVBAR ─── */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20 px-4 md:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-lime-400 text-emerald-400 hover:text-lime-300 transition-all active:scale-95 flex items-center justify-center shadow-lg"
              title="Kembali ke Beranda"
            >
              <i className="fa-solid fa-arrow-left text-sm"></i>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-lime-500/20">
                <i className="fa-solid fa-palette"></i>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg font-black tracking-tight bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                    THINK A LOUD ART
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                    15 BUTIR SENI
                  </span>
                </div>
                <span className="text-[10px] md:text-[11px] font-semibold text-slate-400">
                  Wawancara Kognitif Think-Aloud Mahasiswa PPG Guru Seni SD
                </span>
              </div>
            </div>
          </div>

          {/* Session Switcher Pills */}
          <div className="hidden md:flex items-center gap-2">
            {[1, 2, 3].map((sNum) => {
              const isUnlocked = unlockedSessions[sNum];
              const isCurrent = activeSession === sNum;
              return (
                <button
                  key={sNum}
                  onClick={() => {
                    if (isUnlocked) {
                      setActiveSession(sNum as 1 | 2 | 3);
                      setSessionItemIdx(0);
                      setProbingStep(1);
                      if (!consentApproved) setActiveTab("consent");
                      else setActiveTab("session");
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-950 shadow-md shadow-lime-500/30 scale-105"
                      : isUnlocked
                      ? "bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/80 hover:border-emerald-500/50"
                      : "bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed opacity-60"
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      isUnlocked ? (isCurrent ? "fa-circle-dot" : "fa-circle-check") : "fa-lock text-[10px]"
                    }`}
                  ></i>
                  <span>Sesi {sNum}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-lime-400 text-slate-200 text-xs font-bold transition flex items-center gap-2"
            >
              <i className="fa-solid fa-user-graduate text-lime-400"></i>
              <span className="hidden sm:inline max-w-[120px] truncate">{userName || "Profil"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* TAB 1: USER PROFILE FORM */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Identitas Mahasiswa PPG Calon Guru Seni</h2>
                <p className="text-xs text-slate-400">
                  Data ini digunakan untuk verifikasi instrumen riset dan dokumen informed consent.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Partisipan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Contoh: Bima Arya Putra, S.Pd."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-lime-400 rounded-xl text-white outline-none font-semibold transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    NIM / No. Peserta PPG <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={userNim}
                    onChange={(e) => setUserNim(e.target.value)}
                    placeholder="Contoh: 2026110293"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-lime-400 rounded-xl text-white outline-none font-semibold transition"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    LPTK / Perguruan Tinggi <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={userCampus}
                    onChange={(e) => setUserCampus(e.target.value)}
                    placeholder="Contoh: Universitas Negeri Jakarta"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-lime-400 rounded-xl text-white outline-none font-semibold transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-300 uppercase tracking-wider mb-1.5">
                  Program Studi & Rombel PPG
                </label>
                <input
                  type="text"
                  value={userStudyProgram}
                  onChange={(e) => setUserStudyProgram(e.target.value)}
                  placeholder="Contoh: PPG Guru Kelas SD / Seni Budaya"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-lime-400 rounded-xl text-white outline-none font-semibold transition"
                />
              </div>

              <div>
                <label className="block font-black text-slate-300 uppercase tracking-wider mb-1.5">
                  Pengalaman Mengajar / Status PLP Saat Ini
                </label>
                <input
                  type="text"
                  value={userTeachingExp}
                  onChange={(e) => setUserTeachingExp(e.target.value)}
                  placeholder="Contoh: Sedang PLP di SDN 01 Pagi / Pengalaman 1 semester"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-lime-400 rounded-xl text-white outline-none font-semibold transition"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!userName.trim()) {
                    alert("Mohon lengkapi Nama Anda terlebih dahulu.");
                    return;
                  }
                  setActiveTab("guidance");
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-lime-500/20 active:scale-95 transition flex items-center gap-2"
              >
                <span>Lanjutkan ke Petunjuk</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: GUIDANCE / PETUNJUK PROTOKOL THINK-ALOUD */}
        {activeTab === "guidance" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Petunjuk Pelaksanaan Think-Aloud Art</h2>
                <p className="text-xs text-slate-400">
                  Bagaimana menyuarakan pikiran secara spontan selama menyelesaikan instrumen situasi seni.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 font-black text-emerald-400">
                  <i className="fa-solid fa-microphone-lines text-base"></i>
                  <span>1. Suarakan Pikiran (Think Aloud)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Bacalah skenario dengan lantang. Ucapkan apa pun yang melintas di kepala Anda: keraguan, pertimbangan, alasan menolak opsi lain, hingga Anda menentukan pilihan akhir.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-lime-500/20 space-y-2">
                <div className="flex items-center gap-2 font-black text-lime-400">
                  <i className="fa-solid fa-comments text-base"></i>
                  <span>2. Jawab Probing Pedagogik Seni</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Setelah memilih opsi, jawab pertanyaan probing spesifik seputar capaian pembelajaran, teknik seni, manajemen kelas bising, dan adaptasi media di PLP.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-teal-500/20 space-y-2">
                <div className="flex items-center gap-2 font-black text-teal-400">
                  <i className="fa-solid fa-shield-halved text-base"></i>
                  <span>3. Informed Consent Cukup Sekali</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Persetujuan informed consent hanya dilakukan satu kali pada Sesi 1 sebelum mulai. Sesi 2 dan 3 tidak akan meminta tanda tangan kembali.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 font-black text-cyan-400">
                  <i className="fa-solid fa-unlock-keyhole text-base"></i>
                  <span>4. Pembukaan Sesi Otomatis</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Sesi 2 dan Sesi 3 akan terbuka otomatis begitu sesi sebelumnya selesai, ditandai tombol navigasi langsung tanpa hambatan.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Kembali ke Profil
              </button>
              <button
                type="button"
                onClick={() => {
                  if (consentApproved) {
                    setActiveTab("session");
                  } else {
                    setActiveTab("consent");
                  }
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-lime-500/20 active:scale-95 transition flex items-center gap-2"
              >
                <span>{consentApproved ? "Masuk ke Sesi Soal" : "Lanjut ke Informed Consent (Sesi 1)"}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 3: INFORMED CONSENT (MANDATORY IN SESSION 1 ONLY) */}
        {activeTab === "consent" && !consentApproved && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-lg">
                <i className="fa-solid fa-file-contract"></i>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider mb-1">
                  Khusus Sesi Pertama Sebelum Mulai
                </div>
                <h2 className="text-xl font-black text-white">Lembar Persetujuan Partisipan (Informed Consent)</h2>
                <p className="text-xs text-slate-400">
                  Riset Analisis Kognitif Probing Pembelajaran Seni Siswa Sekolah Dasar
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                Anda diundang berpartisipasi dalam riset kognitif pengembangan instrumen situasi pembelajaran seni bagi mahasiswa PPG Calon Guru Sekolah Dasar. Data rekaman suara dan transkrip verbal Anda akan digunakan semata-mata untuk kepentingan penelitian akademik dan perbaikan butir instrumen, dengan jaminan anonimitas penuh.
              </p>
            </div>

            {/* Checklist Pernyataan Persetujuan */}
            <div className="space-y-3">
              <span className="block font-black text-xs text-emerald-300 uppercase tracking-wider">
                Pernyataan Kesediaan Partisipan (Wajib Dicentu):
              </span>

              {[
                { no: 1, text: "Saya telah membaca dan memahami tujuan penelitian wawancara kognitif Think-Aloud Art ini." },
                { no: 2, text: "Saya bersedia menyuarakan pikiran saya (think-aloud) saat membaca skenario dan memilih tindakan." },
                { no: 3, text: "Saya menyetujui respons suara saya direkam dan ditranskripkan untuk analisis ilmiah." },
                { no: 4, text: "Saya mengerti bahwa keikutsertaan saya bersifat sukarela dan tidak memengaruhi kelulusan PPG." },
                { no: 5, text: "Saya memahami bahwa data identitas saya akan dijaga kerahasiaannya (dianonimkan)." },
                { no: 6, text: "Persetujuan ini berlaku untuk seluruh rangkaian butir Sesi 1, 2, dan 3 tanpa perlu mengisi lembar persetujuan ulang." },
              ].map((item) => (
                <label
                  key={item.no}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition select-none"
                >
                  <input
                    type="checkbox"
                    checked={mandatoryConsents[item.no] || false}
                    onChange={(e) =>
                      setMandatoryConsents({ ...mandatoryConsents, [item.no]: e.target.checked })
                    }
                    className="mt-0.5 w-4 h-4 rounded text-lime-500 focus:ring-lime-400 accent-lime-500 shrink-0"
                  />
                  <span className="text-xs text-slate-200 leading-snug">{item.text}</span>
                </label>
              ))}
            </div>

            {/* Digital Signature Pad */}
            <div className="space-y-2 pt-2">
              <span className="block font-black text-xs text-emerald-300 uppercase tracking-wider">
                Tanda Tangan Digital Partisipan <span className="text-rose-400">*</span>
              </span>
              <ArtSignaturePad
                currentSignature={consentSignature}
                onSave={(dataUrl) => setConsentSignature(dataUrl)}
                onClear={() => setConsentSignature(null)}
              />
            </div>

            {/* Approve Button */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("guidance")}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleApproveConsent}
                disabled={!allMandatoryChecked || !consentSignature}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition flex items-center gap-2 ${
                  allMandatoryChecked && consentSignature
                    ? "bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 shadow-lime-500/25 active:scale-95 cursor-pointer"
                    : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                }`}
              >
                <i className="fa-solid fa-signature"></i>
                <span>Setujui & Mulai Sesi 1</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 4: ACTIVE ASSESSMENT SESSION (SESI 1, 2, 3) */}
        {(activeTab === "session" || consentApproved) && currentQ && (
          <div className="space-y-6">
            {/* ─── SESSION HEADER BANNER ─── */}
            <div
              className={`p-4 md:p-6 rounded-3xl bg-gradient-to-r ${sessionConfig.colorHeader} border backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${sessionConfig.badgeBg}`}>
                    Sesi {activeSession} dari 3
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/60 text-slate-300 border border-slate-700 text-[10px] font-bold">
                    {sessionConfig.itemsRange}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/60 text-lime-300 border border-lime-500/30 text-[10px] font-bold">
                    Butir ke-{sessionItemIdx + 1} dari 5
                  </span>
                </div>
                <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
                  {sessionConfig.title}
                </h1>
                <p className="text-xs text-slate-300/90">{sessionConfig.subtitle}</p>
              </div>

              {/* Progress Counters */}
              <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">Progres Sesi</span>
                  <span className="text-sm font-black text-lime-400">
                    {sessionItemIdx + 1} / {currentSessionQuestions.length} Butir
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
                  {Math.round(((sessionItemIdx + 1) / currentSessionQuestions.length) * 100)}%
                </div>
              </div>
            </div>

            {/* ─── QUESTION CAROUSEL / ITEMS NAVIGATION BAR ─── */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
              <div className="flex items-center gap-2">
                {currentSessionQuestions.map((q, idx) => {
                  const isCurrent = idx === sessionItemIdx;
                  const isDone = isQuestionComplete(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        stopSpeaking();
                        setSessionItemIdx(idx);
                        setProbingStep(1);
                        setAudioBlob(null);
                        setAudioUrl(null);
                        setTranscriptText("");
                        setUploadSuccess(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                        isCurrent
                          ? "bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-950 shadow-md shadow-lime-500/30 ring-2 ring-lime-300"
                          : isDone
                          ? "bg-slate-900/90 text-emerald-400 border border-emerald-500/50 hover:bg-slate-800"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <i className={`fa-solid ${isDone ? "fa-circle-check" : "fa-circle text-[9px]"}`}></i>
                      <span>{q.code}</span>
                    </button>
                  );
                })}
              </div>

              {/* TTS Voice Narrator Button */}
              <button
                type="button"
                onClick={() =>
                  speakText(
                    `${currentQ.title}. ${currentQ.scenario}. ${currentQ.questionPrompt}`,
                    "scenario"
                  )
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md shrink-0 ${
                  isSpeaking && speakingType === "scenario"
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-slate-900 border border-emerald-500/30 hover:border-lime-400 text-emerald-300"
                }`}
                title="Dengarkan Narasi Skenario Seni"
              >
                <i className={`fa-solid ${isSpeaking && speakingType === "scenario" ? "fa-stop" : "fa-volume-high"}`}></i>
                <span>{isSpeaking && speakingType === "scenario" ? "Hentikan Suara" : "Dengarkan Narasi"}</span>
              </button>
            </div>

            {/* ─── MAIN QUESTION & PROBING SPLIT PANEL ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: SCENARIO & OPTIONS (6 or 7 COLS) */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-5">
                {/* Scenario Card */}
                <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-lime-400/20 text-lime-300 border border-lime-400/40 text-xs font-black">
                        {currentQ.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {currentQ.dimensi}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                        Lensa: {currentQ.lensa}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base md:text-lg font-black text-white leading-tight">
                      {currentQ.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-1 italic font-medium">
                      Indikator: {currentQ.indikator}
                    </p>
                  </div>

                  {/* Scenario Narrative Box */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
                    {currentQ.scenario}
                  </div>

                  {/* Question Prompt */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs md:text-sm font-bold flex items-start gap-2.5">
                    <i className="fa-solid fa-question-circle text-lime-400 text-base mt-0.5 shrink-0"></i>
                    <span>{currentQ.questionPrompt}</span>
                  </div>
                </div>

                {/* Options Selection Card */}
                <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-list-check"></i>
                      <span>Pilihan Tindakan Calon Guru:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 italic">Pilih satu opsi paling tepat</span>
                  </div>

                  <div className="space-y-2.5">
                    {currentQ.options.map((opt: ArtOption) => {
                      const isSelected = selectedOptions[currentQ.id] === opt.label;
                      return (
                        <div
                          key={opt.label}
                          onClick={() => {
                            setSelectedOptions((prev) => ({ ...prev, [currentQ.id]: opt.label }));
                            markStepDone(currentQ.id, 1);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isSelected
                              ? "bg-gradient-to-r from-emerald-950/90 to-slate-900 border-lime-400 ring-2 ring-lime-400/40 shadow-lg shadow-lime-500/10"
                              : "bg-slate-950/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950/90"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                              isSelected
                                ? "bg-lime-400 text-slate-950 shadow-md"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {opt.label}
                          </div>
                          <span className={`text-xs leading-relaxed font-medium ${isSelected ? "text-white font-semibold" : "text-slate-300"}`}>
                            {opt.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Confidence Rating Scale */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <i className="fa-solid fa-gauge-high text-lime-400"></i>
                      <span>Tingkat Keyakinan Anda:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isChosen = confidenceRatings[currentQ.id] === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() =>
                              setConfidenceRatings((prev) => ({ ...prev, [currentQ.id]: val }))
                            }
                            className={`w-8 h-8 rounded-xl font-black text-xs transition ${
                              isChosen
                                ? "bg-lime-400 text-slate-950 shadow-md scale-110"
                                : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                            }`}
                            title={
                              val === 1
                                ? "Sangat Ragu"
                                : val === 5
                                ? "Sangat Yakin"
                                : `Skala ${val}`
                            }
                          >
                            {val}
                          </button>
                        );
                      })}
                      <span className="text-[10px] text-slate-400 ml-1">
                        {confidenceRatings[currentQ.id] === 5
                          ? "Sangat Yakin"
                          : confidenceRatings[currentQ.id] === 1
                          ? "Sangat Ragu"
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE THINK-ALOUD RECORDER & PROBING STAGES (6 or 5 COLS) */}
              <div className="lg:col-span-6 xl:col-span-5 space-y-5">
                {/* Probing Stage Tabs */}
                <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-black text-xs text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-brain"></i>
                      <span>Probing Kognitif Think-Aloud</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Tahap {probingStep} dari 4
                    </span>
                  </div>

                  {/* Stage Step Pills */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((stepNum) => {
                      const isStepActive = probingStep === stepNum;
                      const isCompleted = isStepDone(currentQ.id, stepNum);
                      return (
                        <button
                          key={stepNum}
                          type="button"
                          onClick={() => {
                            stopSpeaking();
                            setProbingStep(stepNum);
                            setAudioBlob(null);
                            setAudioUrl(null);
                            setTranscriptText("");
                            setUploadSuccess(false);
                          }}
                          className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase text-center transition flex flex-col items-center gap-0.5 ${
                            isStepActive
                              ? "bg-lime-400 text-slate-950 shadow-md scale-105"
                              : isCompleted
                              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                              : "bg-slate-950 text-slate-500 border border-slate-800"
                          }`}
                        >
                          <i className={`fa-solid ${isCompleted ? "fa-circle-check" : "fa-circle text-[8px]"}`}></i>
                          <span>Tahap {stepNum}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Probing Prompt Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-emerald-950/50 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-lime-400">{activeProbing.title}</span>
                      <button
                        type="button"
                        onClick={() => speakText(activeProbing.prompt, "probing")}
                        className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1"
                        title="Dengarkan Pertanyaan Probing"
                      >
                        <i className={`fa-solid ${isSpeaking && speakingType === "probing" ? "fa-stop text-rose-400" : "fa-volume-low"}`}></i>
                        <span>{isSpeaking && speakingType === "probing" ? "Stop" : "Dengarkan"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold leading-relaxed whitespace-pre-line">
                      {activeProbing.prompt}
                    </p>
                  </div>

                  {/* ─── LIVE AUDIO RECORDER & VISUALIZER ─── */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-300 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-rose-500 animate-ping" : "bg-slate-600"}`} />
                        <span>{isRecording ? "Sedang Merekam Suara..." : "Perekam Suara Verbal"}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-lime-400">
                        {Math.floor(recordingTime / 60)
                          .toString()
                          .padStart(2, "0")}
                        :
                        {(recordingTime % 60).toString().padStart(2, "0")}
                      </span>
                    </div>

                    {/* Live Waveform Level Bar */}
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400 rounded-full transition-all duration-75"
                        style={{ width: `${isRecording ? Math.max(8, audioLevel) : 0}%` }}
                      />
                    </div>

                    {/* Controls Record & Stop */}
                    <div className="flex items-center gap-2">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 active:scale-95 transition"
                        >
                          <i className="fa-solid fa-microphone"></i>
                          <span>Mulai Bicara (Rekam)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 active:scale-95 transition animate-pulse"
                        >
                          <i className="fa-solid fa-stop"></i>
                          <span>Selesai Bicara (Stop)</span>
                        </button>
                      )}
                    </div>

                    {/* Audio Player Preview */}
                    {audioUrl && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 block">Dengar Ulang Rekaman Anda:</span>
                        <audio src={audioUrl} controls className="w-full h-8 rounded-lg" />
                      </div>
                    )}

                    {/* Live Verbatim Speech Transcript Field */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400">
                          Transkrip Ucapan (Otomatis & Dapat Diedit):
                        </span>
                        {uploadSuccess && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <i className="fa-solid fa-cloud-arrow-up"></i> Tersimpan
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Ucapan Anda saat merekam akan tertulis otomatis di sini, atau Anda dapat mengetik langsung pandangan Anda..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-lime-400 rounded-xl text-xs text-white outline-none resize-none font-medium leading-relaxed transition"
                      />
                    </div>

                    {/* Tombol Kirim Langsung ke Panel Admin (Sesuai Alur Think-Aloud) */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={uploadAudioToServer}
                        disabled={isUploading}
                        className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
                          isUploading
                            ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 shadow-lime-500/25 active:scale-95 cursor-pointer"
                        }`}
                      >
                        <i className={`fa-solid ${isUploading ? "fa-spinner fa-spin" : "fa-paper-plane"}`}></i>
                        <span>{isUploading ? "Mengirim ke Panel Admin..." : "Kirim Respon ke Panel Admin"}</span>
                      </button>
                      <p className="text-[10px] text-slate-400 text-center mt-1.5 font-medium">
                        Respon suara atau transkrip Anda akan dikirim langsung ke Panel Admin dan otomatis lanjut ke tahap probing berikutnya.
                      </p>
                    </div>
                  </div>

                  {/* ─── NAVIGATION CONTROLS (NEXT STEP / NEXT QUESTION) ─── */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={probingStep === 1 && sessionItemIdx === 0}
                      onClick={() => {
                        stopSpeaking();
                        if (probingStep > 1) {
                          setProbingStep((s) => s - 1);
                        } else if (sessionItemIdx > 0) {
                          setSessionItemIdx((idx) => idx - 1);
                          setProbingStep(4);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-arrow-left mr-1"></i> Sebelumnya
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-lime-500/20 active:scale-95 transition flex items-center gap-1.5"
                    >
                      <span>
                        {probingStep < 4
                          ? `Lanjut ke Tahap ${probingStep + 1}`
                          : sessionItemIdx < currentSessionQuestions.length - 1
                          ? "Lanjut ke Butir Berikutnya"
                          : `Selesaikan Sesi ${activeSession}`}
                      </span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL 1: CELEBRATION & SESSION TRANSITION (SESI 1 -> SESI 2, SESI 2 -> SESI 3) ─── */}
      <AnimatePresence>
        {showSessionTransitionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-slate-900 border-2 border-lime-400/50 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-5 relative overflow-hidden"
            >
              {/* Artistic decorative glow */}
              <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-lime-400/20 blur-3xl pointer-events-none" />

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-lime-400 to-emerald-600 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-lime-500/30">
                <i className="fa-solid fa-trophy animate-bounce"></i>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/40 text-xs font-black uppercase tracking-wider">
                  🎉 Sesi {showSessionTransitionModal.fromSession} Selesai Sempurna!
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-3">
                  Sesi {showSessionTransitionModal.toSession} Terbuka Otomatis
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Luar biasa! Anda telah menyelesaikan 5 butir pertama seputar perencanaan kurikulum seni. Persetujuan informed consent Anda telah tercatat dan{" "}
                  <strong className="text-lime-300">tidak perlu diulang</strong>. Silakan langsung lanjutkan ke Sesi {showSessionTransitionModal.toSession}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-compass"></i>
                  <span>Fokus Pembelajaran Sesi {showSessionTransitionModal.toSession}:</span>
                </div>
                <p className="text-slate-400 leading-snug">
                  {SESSION_DETAILS[showSessionTransitionModal.toSession].themeDesc}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSessionTransitionModal(null)}
                  className="w-full sm:w-1/3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Tinjau Sesi Ini
                </button>
                <button
                  type="button"
                  onClick={() => handleTransitionToSession(showSessionTransitionModal.toSession)}
                  className="w-full sm:w-2/3 py-3.5 bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400 hover:from-lime-300 hover:to-emerald-300 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl shadow-lime-500/30 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>Lanjutkan ke Sesi {showSessionTransitionModal.toSession}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 2: FINAL COMPLETION MODAL (ALL 3 SESSIONS COMPLETED) ─── */}
      <AnimatePresence>
        {showFinalCompletionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-xl w-full bg-slate-900 border-2 border-emerald-400/50 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-lime-400 via-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-emerald-500/40">
                <i className="fa-solid fa-award"></i>
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-wider">
                  🏆 SELURUH SESI SELESAI
                </span>
                <h3 className="text-2xl font-black text-white mt-3">
                  Terima Kasih, Rekan Calon Guru Seni!
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Anda telah menuntaskan seluruh 15 butir skenario (Sesi 1, 2, dan 3) instrumen wawancara kognitif Think-Aloud Art. Kontribusi pemikiran dan suara Anda sangat berharga dalam kalibrasi psikometrik dan validasi butir pembelajaran seni SD.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Total Butir</span>
                  <span className="text-base font-black text-lime-400">15 Butir</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Total Sesi</span>
                  <span className="text-base font-black text-emerald-400">3 Sesi</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Consent</span>
                  <span className="text-base font-black text-teal-400">Sah Digital</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFinalCompletionModal(false)}
                  className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                >
                  Tinjau Seluruh Jawaban
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full sm:w-1/2 py-3.5 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl shadow-lime-500/30 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-house"></i>
                  <span>Kembali ke Beranda</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
