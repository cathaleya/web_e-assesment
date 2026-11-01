"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MAGER_QUESTIONS, MagerQuestion, MagerOption } from "./mager_questions";

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
    title: "SESI 1 — Dukungan Pedagogis & Kolaborasi Akademik Komunitas S3",
    subtitle: "Eksplorasi Kemandirian Riset, Modul Panduan & Ruang Diskusi Doktoral",
    themeDesc: "Fokus pada butir D1.1 s/d D2.5 (Peta jalan riset mandiri, kurasi basis data literatur, kebuntuan metodologi, beban administratif vs substansial, dan jejaring komunitas riset antar-kampus).",
    itemsRange: "Butir 1 s/d 10 (D1.1 – D2.5)",
    colorHeader: "from-indigo-950 via-slate-900 to-purple-950 border-purple-500/50 text-purple-200",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    accentBorder: "border-purple-500/40",
    bgGlow: "rgba(168, 85, 247, 0.15)",
  },
  2: {
    sessionNo: 2,
    title: "SESI 2 — Aksesibilitas Teknologi, Tata Kelola & Etika Digital/AI",
    subtitle: "Eksplorasi Keandalan Platform, Keamanan Data Riset & Regulasi GenAI",
    themeDesc: "Fokus pada butir D3.1 s/d D4.5 (Sinkronisasi cloud, akses basis data bereputasi, antarmuka inklusif, perlindungan data mentah, dan pedoman pemanfaatan AI yang transparan).",
    itemsRange: "Butir 11 s/d 20 (D3.1 – D4.5)",
    colorHeader: "from-slate-950 via-blue-950 to-indigo-950 border-cyan-500/50 text-cyan-200",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
    accentBorder: "border-cyan-500/40",
    bgGlow: "rgba(6, 182, 212, 0.15)",
  },
  3: {
    sessionNo: 3,
    title: "SESI 3 — Tugas Autentik, Umpan Balik Formatif & Supervisi Pembimbingan",
    subtitle: "Eksplorasi Akselerasi Disertasi, Publikasi Scopus & Kelancaran Bimbingan",
    themeDesc: "Fokus pada butir D5.1 s/d D6.5 (Integrasi tugas perkuliahan ke draf disertasi, target publikasi Scopus/Sinta 1, transparansi rubrik kelayakan, riwayat revisi, dan mitigasi kemacetan bimbingan).",
    itemsRange: "Butir 21 s/d 30 (D5.1 – D6.5)",
    colorHeader: "from-zinc-950 via-purple-950 to-amber-950 border-amber-500/50 text-amber-200",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    accentBorder: "border-amber-500/40",
    bgGlow: "rgba(245, 158, 11, 0.15)",
  },
};

// DIGITAL SIGNATURE CANVAS COMPONENT
function MagerSignaturePad({
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
    ctx.strokeStyle = "#a855f7"; // Vibrant Royal Purple
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
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = currentSignature;
  }, [currentSignature]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    isInternalDrawingRef.current = true;
    onSave(canvas.toDataURL("image/png"));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
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
      <div className="relative border-2 border-dashed border-purple-400/50 rounded-2xl bg-slate-950/90 overflow-hidden shadow-inner">
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
            <i className="fa-solid fa-signature text-purple-400 text-2xl mb-1.5 animate-pulse"></i>
            <span>✍️ Goreskan Tanda Tangan Anda di sini (Layar Sentuh HP / Mouse Komputer) atau Unggah Foto di Bawah</span>
          </div>
        )}
        {currentSignature && (
          <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-full bg-purple-500/90 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md pointer-events-none">
            <i className="fa-solid fa-circle-check"></i>
            <span>Tanda Tangan Siap</span>
          </div>
        )}
      </div>

      {currentSignature && (
        <div className="p-2.5 bg-slate-900/90 border border-purple-500/30 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-16 h-8 bg-slate-950 border border-purple-500/40 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
              <img src={currentSignature} alt="TTD Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <span className="text-xs font-medium text-purple-200">Tanda Tangan Digital Terverifikasi</span>
          </div>
          <span className="text-[11px] text-purple-400 font-bold flex items-center gap-1">
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
        <label className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-500/30 cursor-pointer transition active:scale-95 flex items-center gap-1.5 font-bold">
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

export default function ThinkAloudMagerPage() {
  const router = useRouter();

  // FLOW & NAVIGATION STATE
  const [activeSession, setActiveSession] = useState<1 | 2 | 3>(1);
  const [sessionItemIdx, setSessionItemIdx] = useState<number>(0); // 0 to 9 within current session (10 items)
  const [probingStep, setProbingStep] = useState<number>(1); // 1: Menentukan Skor Likert & Verbalisasi, 2: Tier 1 Semantic, 3: Tier 2 Retrieval, 4: Tier 3 Construct & Confidence
  const [activeTab, setActiveTab] = useState<"profile" | "guidance" | "consent" | "session">("profile");

  // SESSION UNLOCK & TRANSITION STATE
  const [unlockedSessions, setUnlockedSessions] = useState<Record<number, boolean>>({ 1: true, 2: false, 3: false });
  const [showSessionTransitionModal, setShowSessionTransitionModal] = useState<null | { fromSession: 1 | 2; toSession: 2 | 3 }>(null);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState<boolean>(false);

  // PARTICIPANT PROFILE (S3 DOKTORAL)
  const [userName, setUserName] = useState("Kandidat Doktor S3");
  const [userNim, setUserNim] = useState("");
  const [userCampus, setUserCampus] = useState("Universitas Negeri Jakarta");
  const [userStudyProgram, setUserStudyProgram] = useState("S3 Penelitian dan Evaluasi Pendidikan (PEP)");
  const [userResearchTopic, setUserResearchTopic] = useState("Pengembangan Model Pengukuran Lingkungan Belajar Digital Doktoral");

  // INFORMED CONSENT STATE
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
  // Option choice per question: { [qId]: '1' | '2' | '3' | '4' | '5' }
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
  const [speakingType, setSpeakingType] = useState<"statement" | "probing" | null>(null);

  // REFS
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recMimeRef = useRef<string>("audio/webm");
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const finalTranscriptRef = useRef<string>("");

  // RESTORE SESSION UNLOCKS FROM LOCALSTORAGE
  useEffect(() => {
    try {
      const s2 = localStorage.getItem("mager_session2_unlocked") === "true";
      const s3 = localStorage.getItem("mager_session3_unlocked") === "true";
      if (s2 || s3) {
        setUnlockedSessions({ 1: true, 2: s2, 3: s3 });
      }

      const savedName = localStorage.getItem("mager_userName");
      const savedCampus = localStorage.getItem("mager_userCampus");
      const savedNim = localStorage.getItem("mager_userNim");
      const savedProgram = localStorage.getItem("mager_userStudyProgram");
      const savedTopic = localStorage.getItem("mager_userResearchTopic");
      const savedConsent = localStorage.getItem("mager_consentApproved") === "true";

      if (savedName) setUserName(savedName);
      if (savedCampus) setUserCampus(savedCampus);
      if (savedNim) setUserNim(savedNim);
      if (savedProgram) setUserStudyProgram(savedProgram);
      if (savedTopic) setUserResearchTopic(savedTopic);
      if (savedConsent) setConsentApproved(true);
    } catch (e) {
      console.warn("Storage access notice:", e);
    }
  }, []);

  // CURRENT QUESTIONS FOR ACTIVE SESSION
  const currentSessionQuestions = MAGER_QUESTIONS.filter((q) => q.session === activeSession);
  const currentQ: MagerQuestion | undefined = currentSessionQuestions[sessionItemIdx];

  // ACTIVE PROBING DETAILS
  const getActiveProbingDetails = () => {
    if (!currentQ) return { title: "", text: "", badge: "", tier: 1 };
    switch (probingStep) {
      case 1:
        return {
          title: "Tahap 1: Penilaian Skala Likert 1–5 & Berpikir Nyaring",
          text: currentQ.probings.step1,
          badge: "Step 1: Pilihan Skor",
          tier: 1,
        };
      case 2:
        return {
          title: "Tahap 2: Probing Tier 1 (Semantic & Comprehension Clarity)",
          text: currentQ.probings.step2_tier1,
          badge: "Tier 1: Makna & Istilah",
          tier: 1,
        };
      case 3:
        return {
          title: "Tahap 3: Probing Tier 2 (Experiential Retrieval & Justification)",
          text: currentQ.probings.step3_tier2,
          badge: "Tier 2: Pengalaman Nyata S3",
          tier: 2,
        };
      case 4:
        return {
          title: "Tahap 4: Probing Tier 3 (Construct Representation & Confidence)",
          text: currentQ.probings.step4_tier3,
          badge: "Tier 3: Keyakinan & Konstruk",
          tier: 3,
        };
      default:
        return { title: "", text: "", badge: "", tier: 1 };
    }
  };

  const activeProbing = getActiveProbingDetails();

  // TTS UTILITY
  const speakText = (text: string, type: "statement" | "probing") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Browser ini belum mendukung sintesis suara Text-To-Speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingType(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

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

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingType(null);
    }
  };

  // STEP & QUESTION PROGRESS HELPERS
  const markStepDone = (qId: number, stepNum: number) => {
    setCompletedSteps((prev) => {
      const current = prev[qId] || [];
      if (!current.includes(stepNum)) {
        return { ...prev, [qId]: [...current, stepNum] };
      }
      return prev;
    });
  };

  const isStepDone = (qId: number, stepNum: number) => {
    return (completedSteps[qId] || []).includes(stepNum);
  };

  const isQuestionComplete = (qId: number) => {
    const steps = completedSteps[qId] || [];
    return steps.length > 0 || (selectedOptions[qId] !== undefined);
  };

  // CHECK ALL MANDATORY CONSENTS
  const allMandatoryChecked = Object.values(mandatoryConsents).every((v) => v === true);

  // APPROVE CONSENT
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
      localStorage.setItem("mager_consentApproved", "true");
      localStorage.setItem("mager_userName", userName);
      localStorage.setItem("mager_userCampus", userCampus);
      localStorage.setItem("mager_userNim", userNim);
      localStorage.setItem("mager_userStudyProgram", userStudyProgram);
      localStorage.setItem("mager_userResearchTopic", userResearchTopic);

      // Save consent to server
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userNim || `mager_${Date.now()}`,
          userName: userName || "Kandidat Doktor S3",
          userCampus: userCampus,
          userNim: userNim,
          sessionNo: 1,
          respondentLevel: "Mahasiswa Doktoral S3 (MAGER)",
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

  // AUDIO RECORDING FUNCTIONS (EXACTLY ALIGNED WITH MADEL5C ENGINE)
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

      // MediaRecorder dengan mimeType yang didukung browser
      const options: MediaRecorderOptions =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? { mimeType: "audio/webm;codecs=opus" }
        : MediaRecorder.isTypeSupported("audio/webm") ? { mimeType: "audio/webm" }
        : MediaRecorder.isTypeSupported("audio/mp4") ? { mimeType: "audio/mp4" }
        : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      recMimeRef.current = mediaRecorder.mimeType || options.mimeType || "audio/webm";

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recMimeRef.current });
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

      // Web Speech API Live Voice-to-Text
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
      alert("Izin akses mikrofon diperlukan untuk merekam respons verbal Think-Aloud. Anda juga dapat mengetikkan teks tanggapan secara manual pada kotak transkrip.");
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {}
    if (recognitionRef.current) {
      try { recognitionRef.current.onend = null; recognitionRef.current.stop(); } catch (e) {}
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});

    setIsRecording(false);
    isRecordingRef.current = false;
    setAudioLevel(0);
  };

  const resetRecordingState = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscriptText("");
    setUploadSuccess(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  // UPLOAD AUDIO & TRANSCRIPT DIRECTLY TO ADMIN PANEL (SAFE & ROBUST)
  const uploadAudioToServer = async () => {
    // KUNCI KEAMANAN: Hentikan perekaman otomatis jika responden lupa klik stop sebelum submit
    if (isRecording || (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive")) {
      stopRecording();
      // Berikan jeda 300ms agar event onstop selesai membentuk audio chunk
      await new Promise((r) => setTimeout(r, 300));
    }

    const recordedBlob: Blob | null =
      audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: recMimeRef.current })
        : audioBlob;
    const hasAudio = !!recordedBlob && recordedBlob.size > 0;
    const hasText = transcriptText.trim().length > 0;

    if (!hasAudio && !hasText) {
      alert("⚠️ Silakan rekam suara Anda ATAU ketik teks tanggapan elaborasi pada kotak transkrip terlebih dahulu sebelum mengirim!");
      return;
    }
    if (!currentQ) return;

    setIsUploading(true);
    try {
      const selectedOptVal = selectedOptions[currentQ.id];
      const selectedOptObj = currentQ.options.find((o) => o.label === selectedOptVal);
      const selectedOptText = selectedOptVal && selectedOptObj
        ? `Skor ${selectedOptVal} — ${selectedOptObj.name} (${selectedOptObj.text})`
        : selectedOptVal ? `Skor ${selectedOptVal}` : "Belum Memilih Skor";

      const confidenceVal = confidenceRatings[currentQ.id];
      const confidenceText = confidenceVal ? `${confidenceVal}/5` : "Belum dinilai";
      const finalTranscript = transcriptText.trim()
        ? `[Tingkat Keyakinan: ${confidenceText}] — ${transcriptText.trim()}`
        : `[Tingkat Keyakinan: ${confidenceText}] — [Respon Suara Terkirim Langsung ke Panel Admin]`;

      const fileToUpload = hasAudio && recordedBlob
        ? recordedBlob
        : new Blob(["[Respon Teks Manual Tanpa Berkas Audio]"], { type: "audio/webm" });
      const ext = recMimeRef.current.includes("mp4") ? "m4a" : "webm";

      const formData = new FormData();
      formData.append("audio", fileToUpload, `ThinkAloud_MAGER_S${activeSession}_${currentQ.code}_P${probingStep}.${ext}`);
      formData.append("isTextOnly", hasAudio ? "false" : "true");
      formData.append("userId", userNim || `mager_resp_${Date.now()}`);
      formData.append("userName", userName || "Kandidat Doktor S3");
      formData.append("userCampus", userCampus || "LPTK Universitas");
      formData.append("respondentLevel", "Mahasiswa Doktoral S3 (MAGER)");
      formData.append("studyProgram", userStudyProgram || "S3 Penelitian dan Evaluasi Pendidikan (PEP)");
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

      let data: any = null;
      try { data = await res.json(); } catch { data = null; }
      if (res.ok && data?.success) {
        setUploadSuccess(true);
        markStepDone(currentQ.id, probingStep);

        // Kosongkan buffer rekaman agar pertanyaan probing berikutnya bersih
        finalTranscriptRef.current = "";
        resetRecordingState();

        if (probingStep < 4) {
          const nextStep = probingStep + 1;
          alert(`✅ Respon Pertanyaan Probing ${probingStep} Berhasil Terkirim Langsung ke Panel Admin!\nOtomatis beralih ke Pertanyaan Probing ${nextStep}.`);
          setProbingStep(nextStep);
        } else {
          alert(`🎉 Selamat! Seluruh tahap probing untuk Butir #${sessionItemIdx + 1} (${currentQ.code}) telah lengkap terkirim ke Panel Admin!`);
          if (sessionItemIdx < currentSessionQuestions.length - 1) {
            setSessionItemIdx((idx) => idx + 1);
            setProbingStep(1);
          } else {
            checkSessionCompletion();
          }
        }
      } else {
        const reason = res.status === 413
          ? "Ukuran rekaman terlalu besar untuk server (batas upload Nginx)."
          : data?.error || "Silakan coba lagi.";
        alert(`❌ Gagal mengirim respon ke server admin (HTTP ${res.status}).\n${reason}`);
      }
    } catch (err) {
      console.error("Gagal mengirim respon:", err);
      alert(`❌ Pengiriman terputus sebelum sampai ke server.\nDetail: ${(err as any)?.message || err}`);
    } finally {
      setIsUploading(false);
    }
  };

  // CHECK SESSION COMPLETION & ADVANCE
  const checkSessionCompletion = () => {
    if (activeSession === 1) {
      localStorage.setItem("mager_session2_unlocked", "true");
      setUnlockedSessions((prev) => ({ ...prev, 2: true }));
      setShowSessionTransitionModal({ fromSession: 1, toSession: 2 });
    } else if (activeSession === 2) {
      localStorage.setItem("mager_session3_unlocked", "true");
      setUnlockedSessions((prev) => ({ ...prev, 3: true }));
      setShowSessionTransitionModal({ fromSession: 2, toSession: 3 });
    } else if (activeSession === 3) {
      setShowFinalCompletionModal(true);
    }
  };

  // PROCEED TO NEXT ITEM OR NEXT STEP
  const handleNextStep = async () => {
    stopSpeaking();
    if (!currentQ) return;

    const hasUnsent = (audioBlob || audioChunksRef.current.length > 0 || transcriptText.trim().length > 0) && !uploadSuccess;
    if (hasUnsent) {
      const confirmSend = window.confirm("Anda memiliki respon suara/teks yang belum dikirim ke Admin. Apakah ingin mengirimkannya sekarang?");
      if (confirmSend) {
        await uploadAudioToServer();
        return;
      }
    }

    if (probingStep < 4) {
      setProbingStep((s) => s + 1);
      resetRecordingState();
    } else if (sessionItemIdx < currentSessionQuestions.length - 1) {
      setSessionItemIdx((idx) => idx + 1);
      setProbingStep(1);
      resetRecordingState();
    } else {
      checkSessionCompletion();
    }
  };

  const handlePrevStep = () => {
    stopSpeaking();
    if (probingStep > 1) {
      setProbingStep((s) => s - 1);
      resetRecordingState();
    } else if (sessionItemIdx > 0) {
      setSessionItemIdx((idx) => idx - 1);
      setProbingStep(4);
      resetRecordingState();
    }
  };

  const activeSessionDetail = SESSION_DETAILS[activeSession];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white pb-20">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-purple-500/20 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/80 text-purple-300 flex items-center justify-center transition active:scale-95 shadow-md"
            title="Kembali ke Beranda"
          >
            <i className="fa-solid fa-arrow-left text-sm"></i>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[9px] uppercase tracking-wider shadow-sm">
                S3 Doktoral
              </span>
              <span className="text-[11px] font-black text-purple-300 uppercase tracking-widest hidden sm:inline">
                Fase 2 Pembakuan Disertasi
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
              <span>THINK A LOUD MAGER</span>
              <span className="text-purple-400 font-extrabold text-xs hidden md:inline">
                · Skala Lingkungan Belajar Digital Doktoral (LBD-S3)
              </span>
            </h1>
          </div>
        </div>

        {/* TOP STATUS TABS */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-purple-500/30 text-xs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-user-graduate text-[11px]"></i>
            <span className="hidden sm:inline">Profil</span>
          </button>
          <button
            onClick={() => setActiveTab("guidance")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "guidance"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-book-open-reader text-[11px]"></i>
            <span className="hidden sm:inline">Panduan</span>
          </button>
          <button
            onClick={() => setActiveTab("consent")}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "consent"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-file-signature text-[11px]"></i>
            <span className="hidden sm:inline">Informed Consent</span>
            {consentApproved && <i className="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>}
          </button>
          <button
            onClick={() => {
              if (!consentApproved) {
                alert("Mohon setujui dan tanda tangani Informed Consent terlebih dahulu sebelum memulai sesi wawancara.");
                setActiveTab("consent");
                return;
              }
              setActiveTab("session");
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "session"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-microphone-lines text-[11px]"></i>
            <span>Mulai Sesi</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: PARTICIPANT PROFILE */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-purple-500/30 shadow-2xl relative overflow-hidden">
                <div className="max-w-2xl">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
                    <i className="fa-solid fa-id-card"></i> Identitas Responden Wawancara Doktoral (S3)
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Pengisian Data Partisipan Think-Aloud Protocol MAGER
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
                    Data identitas ini digunakan untuk pemetaan demografis dan verifikasi proses wawancara kognitif kualitatif pada instrumen <b>Lingkungan Belajar Digital Doktoral (LBD-S3 / MADEL-S3)</b>. Seluruh data dijamin kerahasiaannya sesuai kode etik penelitian akademik.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 md:p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 shadow-xl space-y-4">
                  <h3 className="text-sm font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-user-tie"></i> Data Akademik Mahasiswa
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Nama Lengkap & Gelar (jika ada):
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Contoh: Bima Ardiansyah, S.Pd., M.Pd."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-purple-400 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      NIM / NPM / ID Mahasiswa S3:
                    </label>
                    <input
                      type="text"
                      value={userNim}
                      onChange={(e) => setUserNim(e.target.value)}
                      placeholder="Contoh: 1107722001"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-purple-400 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Universitas / Perguruan Tinggi Penyelenggara S3:
                    </label>
                    <input
                      type="text"
                      value={userCampus}
                      onChange={(e) => setUserCampus(e.target.value)}
                      placeholder="Contoh: Universitas Negeri Jakarta (UNJ)"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-purple-400 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="p-5 md:p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                      <i className="fa-solid fa-graduation-cap"></i> Program Studi & Fokus Disertasi
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Program Studi S3:
                      </label>
                      <input
                        type="text"
                        value={userStudyProgram}
                        onChange={(e) => setUserStudyProgram(e.target.value)}
                        placeholder="Contoh: S3 Penelitian dan Evaluasi Pendidikan (PEP)"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-purple-400 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Topik / Judul Sementara Disertasi:
                      </label>
                      <textarea
                        rows={3}
                        value={userResearchTopic}
                        onChange={(e) => setUserResearchTopic(e.target.value)}
                        placeholder="Contoh: Pengembangan Instrumen Lingkungan Belajar Digital Doktoral..."
                        className="w-full px-4 py-2 bg-slate-950 border border-purple-500/30 focus:border-purple-400 rounded-xl text-xs md:text-sm font-medium text-white placeholder-slate-500 outline-none transition resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setActiveTab("guidance")}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40 transition active:scale-95 flex items-center gap-2"
                    >
                      <span>Simpan &amp; Lanjut ke Panduan</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: GUIDANCE / PROTOCOL BRIEF */}
          {activeTab === "guidance" && (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-purple-500/30 shadow-2xl">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
                  <i className="fa-solid fa-compass"></i> Panduan Protokol Wawancara Think-Aloud &amp; 3-Tier Probing
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Tata Cara Pelaksanaan Think-Aloud Protocol Doktoral (LBD-S3 / MAGER)
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
                  Metode ini bertujuan menelusuri proses mental (*cognitive processing*) kandidat doktor saat merespons butir-butir instrumen evaluasi lingkungan belajar digital doktoral.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center font-black text-lg">
                    1
                  </div>
                  <h3 className="font-bold text-sm text-white">Prinsip Berpikir Nyaring</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Bacalah pernyataan dengan suara lantang dan suarakan apa pun yang muncul di benak Anda secara spontan, tanpa perlu ragu atau menyaring kata-kata.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-black text-lg">
                    2
                  </div>
                  <h3 className="font-bold text-sm text-white">Arsitektur Probing 3-Tier</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Setiap butir dieksplorasi melalui 3 lapis pertanyaan mendalam: <b>Tier 1</b> (Kejelasan Semantik), <b>Tier 2</b> (Pengalaman Empiris S3), dan <b>Tier 3</b> (Kecukupan Skala &amp; Keyakinan).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-black text-lg">
                    3
                  </div>
                  <h3 className="font-bold text-sm text-white">Fleksibilitas Rekam &amp; Teks</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sistem dilengkapi perekam suara otomatis, transkripsi live AI, serta kotak teks manual yang dapat diedit langsung bila perangkat Anda tidak memiliki mikrofon aktif.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-shield-halved text-purple-400 text-2xl"></i>
                  <div>
                    <h4 className="text-sm font-bold text-white">Kerahasiaan &amp; Hak Partisipan</h4>
                    <p className="text-xs text-slate-300">Seluruh rekaman suara dan transkrip hanya digunakan untuk pembakuan instrumen disertasi doktoral.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("consent")}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 shadow-lg shadow-purple-900/40"
                >
                  <span>Lanjut ke Informed Consent</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: INFORMED CONSENT & DIGITAL SIGNATURE */}
          {activeTab === "consent" && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-purple-500/30 shadow-2xl">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
                  <i className="fa-solid fa-certificate"></i> Dokumen Legal Penelitian Disertasi Doktoral
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  LEMBAR PERSETUJUAN PARTISIPASI (INFORMED CONSENT)
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
                  Judul Riset: <b>Pengembangan Skala Pengukuran Lingkungan Belajar Digital Doktoral (LBD-S3 / MADEL-S3) Berbasis Website</b><br />
                  Peneliti: Tim Pengembang Disertasi Doktor Pascasarjana Universitas Negeri Jakarta (UNJ).
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-4">
                <h3 className="text-sm font-black text-purple-300 uppercase tracking-wider">
                  Butir Persetujuan Partisipan:
                </h3>

                <div className="space-y-3">
                  {[
                    { id: 1, text: "Saya memahami bahwa penelitian ini bertujuan menguji keterbacaan, kejelasan semantik, dan validitas proses kognitif butir instrumen LBD-S3 / MADEL-S3." },
                    { id: 2, text: "Saya bersedia berpartisipasi secara sukarela dan menyuarakan apa yang saya pikirkan (Think-Aloud Protocol) saat membaca dan menjawab butir-butir instrumen." },
                    { id: 3, text: "Saya memberikan izin kepada peneliti untuk merekam suara dan mencatat respons verbal saya selama proses wawancara kognitif 3 sesi berlangsung." },
                    { id: 4, text: "Saya mengetahui bahwa identitas personal dan institusi saya akan disamarkan (anonim) dalam laporan akhir disertasi dan publikasi artikel ilmiah." },
                    { id: 5, text: "Saya berhak mengajukan pertanyaan, memberikan masukan kritis, atau meminta jeda istirahat kapan saja bila mengalami kelelahan kognitif." },
                    { id: 6, text: "Data rekaman audio dan transkrip disimpan dalam repositori server terenkripsi dan hanya diakses oleh tim peneliti disertasi." },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={mandatoryConsents[item.id] || false}
                        onChange={(e) =>
                          setMandatoryConsents((prev) => ({ ...prev, [item.id]: e.target.checked }))
                        }
                        className="mt-0.5 accent-purple-600 rounded w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300 font-medium leading-relaxed">
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-pen-nib"></i> Tanda Tangan Digital Partisipan
                  </h4>
                  <p className="text-xs text-slate-400">
                    Bubuhkan tanda tangan digital Anda pada bidang kanvas di bawah ini menggunakan sentuhan jari (di HP) atau kursor mouse (di laptop), atau unggah foto tanda tangan Anda.
                  </p>

                  <MagerSignaturePad
                    onSave={(dataUrl) => setConsentSignature(dataUrl)}
                    onClear={() => setConsentSignature(null)}
                    currentSignature={consentSignature}
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={handleApproveConsent}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/40 transition active:scale-95 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Setujui Informed Consent &amp; Mulai Sesi 1</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: THINK-ALOUD ASSESSMENT SESSION */}
          {activeTab === "session" && (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* SESSION SELECTOR BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/20 shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-purple-300 uppercase tracking-wider px-2">
                    Pilih Sesi:
                  </span>
                  {[1, 2, 3].map((sNum) => {
                    const isUnlocked = unlockedSessions[sNum];
                    const isActive = activeSession === sNum;
                    return (
                      <button
                        key={sNum}
                        onClick={() => {
                          if (!isUnlocked) {
                            alert(`Sesi ${sNum} masih terkunci. Mohon selesaikan Sesi ${sNum - 1} terlebih dahulu untuk membuka sesi ini.`);
                            return;
                          }
                          stopSpeaking();
                          setActiveSession(sNum as 1 | 2 | 3);
                          setSessionItemIdx(0);
                          setProbingStep(1);
                          resetRecordingState();
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400"
                            : isUnlocked
                            ? "bg-slate-800 text-purple-200 hover:bg-slate-700"
                            : "bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed"
                        }`}
                      >
                        {isUnlocked ? (
                          <i className="fa-solid fa-unlock-keyhole text-[10px]"></i>
                        ) : (
                          <i className="fa-solid fa-lock text-[10px]"></i>
                        )}
                        <span>Sesi {sNum}</span>
                        <span className="text-[9px] opacity-80">(10 Butir)</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                  <span>Progres Sesi {activeSession}:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/30 font-black">
                    Butir {sessionItemIdx + 1} / {currentSessionQuestions.length}
                  </span>
                </div>
              </div>

              {/* SESSION BANNER */}
              <div
                className={`p-5 rounded-2xl bg-gradient-to-r ${activeSessionDetail.colorHeader} border shadow-lg relative overflow-hidden`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${activeSessionDetail.badgeBg} inline-block mb-1`}>
                      {activeSessionDetail.itemsRange}
                    </span>
                    <h3 className="text-base md:text-lg font-black text-white tracking-tight">
                      {activeSessionDetail.title}
                    </h3>
                    <p className="text-xs text-purple-100/90 mt-0.5 font-medium">
                      {activeSessionDetail.subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-purple-200 block">Kandidat Doktor:</span>
                    <span className="text-xs font-black text-white">{userName}</span>
                  </div>
                </div>
              </div>

              {/* QUESTION CARD */}
              {currentQ && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/95 border border-purple-500/30 shadow-2xl space-y-6">
                  {/* QUESTION HEADER & METADATA */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-xl bg-purple-600 text-white font-black text-xs tracking-wider shadow-md">
                        {currentQ.code}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 border border-purple-500/20 text-xs font-bold">
                        {currentQ.dimensi}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          currentQ.isReversed
                            ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                        }`}
                      >
                        {currentQ.polarity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(currentQ.statement, "statement")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                          isSpeaking && speakingType === "statement"
                            ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black"
                            : "bg-slate-800 text-purple-200 border-purple-500/30 hover:bg-slate-700"
                        }`}
                        title="Dengarkan pembacaan teks pernyataan via suara robot Bahasa Indonesia"
                      >
                        <i className={`fa-solid ${isSpeaking && speakingType === "statement" ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
                        <span>{isSpeaking && speakingType === "statement" ? "Hentikan Suara" : "Dengarkan Pernyataan"}</span>
                      </button>
                    </div>
                  </div>

                  {/* STATEMENT DISPLAY */}
                  <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-purple-500/30 relative">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-2">
                      Teks Pernyataan Butir Instrumen:
                    </span>
                    <blockquote className="text-base md:text-lg font-extrabold text-white leading-relaxed">
                      "{currentQ.statement}"
                    </blockquote>
                    <div className="mt-3 pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span><b>Rujukan Stimulus:</b> {currentQ.contextRef}</span>
                      <span className="text-purple-300 font-bold">Skala Likert: 1 (STS) s.d. 5 (SS)</span>
                    </div>
                  </div>

                  {/* LIKERT OPTION SELECTOR (1 to 5) */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-list-check text-purple-400"></i>
                      <span>Pilih Respons Skor Likert Anda:</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                      {currentQ.options.map((opt) => {
                        const isSelected = selectedOptions[currentQ.id] === opt.label;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => {
                              setSelectedOptions((prev) => ({ ...prev, [currentQ.id]: opt.label }));
                              markStepDone(currentQ.id, 1);
                            }}
                            className={`p-3 rounded-2xl border text-center transition active:scale-95 flex flex-col items-center justify-center gap-1 ${
                              isSelected
                                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-300 shadow-xl shadow-purple-900/50 scale-[1.02]"
                                : "bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-purple-500/40"
                            }`}
                          >
                            <span className="w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center font-black text-sm border border-purple-400/40 text-purple-200">
                              {opt.label}
                            </span>
                            <span className="font-black text-xs tracking-wider">{opt.name}</span>
                            <span className="text-[10px] opacity-80 leading-tight">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PROBING 4 STEPS PROGRESS INDICATOR */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>Tahap Probing Berjalan:</span>
                      <span className="text-purple-300 font-black">{activeProbing.title}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((stepNum) => {
                        const isActive = probingStep === stepNum;
                        const isDone = isStepDone(currentQ.id, stepNum);
                        const labels = ["1. Pilihan Skor", "2. Tier 1 Semantic", "3. Tier 2 Retrieval", "4. Tier 3 Construct"];
                        return (
                          <button
                            key={stepNum}
                            onClick={() => {
                              stopSpeaking();
                              setProbingStep(stepNum);
                              resetRecordingState();
                            }}
                            className={`py-2 px-2.5 rounded-xl text-center text-[10px] md:text-xs font-black uppercase tracking-wider transition border ${
                              isActive
                                ? "bg-purple-600 text-white border-purple-300 shadow-md"
                                : isDone
                                ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                                : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              {isDone ? <i className="fa-solid fa-circle-check text-emerald-400"></i> : null}
                              <span>{labels[stepNum - 1]}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE PROBING QUESTION BOX */}
                  <div className="p-5 md:p-6 rounded-2xl bg-purple-950/40 border-2 border-purple-500/40 shadow-inner space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-black uppercase tracking-wider">
                        {activeProbing.badge}
                      </span>
                      <button
                        onClick={() => speakText(activeProbing.text, "probing")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                          isSpeaking && speakingType === "probing"
                            ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black"
                            : "bg-slate-900 text-purple-200 border-purple-500/30 hover:bg-slate-800"
                        }`}
                      >
                        <i className={`fa-solid ${isSpeaking && speakingType === "probing" ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
                        <span>{isSpeaking && speakingType === "probing" ? "Hentikan Suara" : "Dengarkan Pertanyaan"}</span>
                      </button>
                    </div>

                    <p className="text-sm md:text-base font-extrabold text-white leading-relaxed">
                      "{activeProbing.text}"
                    </p>

                    {/* CONFIDENCE RATING FOR STEP 4 */}
                    {probingStep === 4 && (
                      <div className="pt-3 border-t border-purple-500/20 flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-slate-300">
                          Derajat Keyakinan Skor (1=Sangat Ragu s.d. 5=Sangat Yakin):
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setConfidenceRatings((prev) => ({ ...prev, [currentQ.id]: star }))}
                              className={`w-8 h-8 rounded-lg font-black text-xs transition ${
                                (confidenceRatings[currentQ.id] || 0) >= star
                                  ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                                  : "bg-slate-800 text-slate-400 hover:text-white"
                              }`}
                            >
                              {star}★
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AUDIO RECORDER & LIVE TRANSCRIPT BOX */}
                  <div className="p-5 md:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-microphone text-purple-400"></i>
                        <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                          Perekam Suara Verbal &amp; Transkrip Jawaban
                        </span>
                      </div>

                      {isRecording && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black animate-pulse">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <span>Merekam: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}</span>
                        </div>
                      )}
                    </div>

                    {/* DECIBEL LEVEL BAR */}
                    {isRecording && (
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-full transition-all duration-75"
                          style={{ width: `${Math.max(5, audioLevel)}%` }}
                        ></div>
                      </div>
                    )}

                    {/* RECORDING CONTROLS */}
                    <div className="flex flex-wrap items-center gap-3">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-900/30 flex items-center gap-2 active:scale-95 transition"
                        >
                          <i className="fa-solid fa-microphone"></i>
                          <span>Mulai Bicara (Rekam)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-900/30 flex items-center gap-2 active:scale-95 transition animate-pulse"
                        >
                          <i className="fa-solid fa-stop"></i>
                          <span>Selesai Bicara (Stop)</span>
                        </button>
                      )}

                      {audioUrl && !isRecording && (
                        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                          <audio src={audioUrl} controls className="h-9 w-full max-w-sm rounded-lg" />
                        </div>
                      )}
                    </div>

                    {/* TRANSCRIPT TEXTAREA (CAN BE EDITED / MANUALLY TYPED) */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-bold">
                        <span>Transkrip Verbatim (Bisa diedit atau diketik manual):</span>
                        <span className="text-[10px] text-slate-500">Live Voice-to-Text didukung Google Web Speech API</span>
                      </div>
                      <textarea
                        rows={3}
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Hasil rekaman suara akan otomatis tertranskripsi di sini. Anda juga dapat mengetikkan atau melengkapi teks jawaban Anda secara manual bila mikrofon tidak tersedia..."
                        className="w-full px-4 py-2.5 bg-slate-900 border border-purple-500/30 focus:border-purple-400 rounded-xl text-xs md:text-sm font-medium text-white placeholder-slate-500 outline-none transition resize-none"
                      />
                    </div>

                    {/* SUBMIT BUTTON ROW */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-400">
                        {uploadSuccess && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>Respon tahap ini telah berhasil tersimpan di panel admin!</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={uploadAudioToServer}
                        disabled={isUploading}
                        className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 shadow-lg ${
                          uploadSuccess
                            ? "bg-slate-800 text-emerald-300 border border-emerald-500/40"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40"
                        } disabled:opacity-50`}
                      >
                        {isUploading ? (
                          <>
                            <i className="fa-solid fa-spinner animate-spin"></i>
                            <span>Mengirim ke Server Admin...</span>
                          </>
                        ) : uploadSuccess ? (
                          <>
                            <i className="fa-solid fa-arrow-rotate-right"></i>
                            <span>Kirim Ulang Pembaruan</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-paper-plane"></i>
                            <span>Kirim Respon ke Panel Admin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* BOTTOM STEP NAVIGATION (PREV & NEXT) */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={handlePrevStep}
                      disabled={sessionItemIdx === 0 && probingStep === 1}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
                    >
                      <i className="fa-solid fa-chevron-left text-[10px]"></i>
                      <span>Sebelumnya</span>
                    </button>

                    <div className="text-center text-xs text-slate-400 font-bold hidden sm:block">
                      Butir {sessionItemIdx + 1} dari {currentSessionQuestions.length} · Probing Step {probingStep}/4
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40 transition active:scale-95 flex items-center gap-2"
                    >
                      <span>
                        {probingStep < 4
                          ? `Lanjut ke Probing ${probingStep + 1}`
                          : sessionItemIdx < currentSessionQuestions.length - 1
                          ? `Lanjut ke Butir #${sessionItemIdx + 2}`
                          : activeSession < 3
                          ? `Selesaikan Sesi ${activeSession}`
                          : "Selesaikan Keseluruhan Wawancara"}
                      </span>
                      <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── MODAL: SESSION TRANSITION MODAL (1 -> 2 or 2 -> 3) ── */}
      {showSessionTransitionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 md:p-8 rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center font-black text-2xl mx-auto shadow-lg">
              <i className="fa-solid fa-trophy"></i>
            </div>

            <h3 className="text-xl font-black text-white">
              Sesi {showSessionTransitionModal.fromSession} Selesai!
            </h3>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Seluruh 10 butir pada Sesi {showSessionTransitionModal.fromSession} telah berhasil Anda respons dan tersimpan di database admin. Sesi {showSessionTransitionModal.toSession} kini telah terbuka secara otomatis.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  const nextSession = showSessionTransitionModal.toSession;
                  setShowSessionTransitionModal(null);
                  setActiveSession(nextSession);
                  setSessionItemIdx(0);
                  setProbingStep(1);
                  resetRecordingState();
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-900/50 transition active:scale-95"
              >
                <span>Mulai Sesi {showSessionTransitionModal.toSession} Sekarang</span>
              </button>

              <button
                onClick={() => setShowSessionTransitionModal(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs uppercase transition"
              >
                <span>Istirahat Sejenak</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: FINAL COMPLETION MODAL ── */}
      {showFinalCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 md:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-xl">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>

            <h3 className="text-xl font-black text-white">
              Selamat, Seluruh Sesi Selesai!
            </h3>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Terima kasih atas dedikasi dan waktu Anda, <b>{userName}</b>. Seluruh rekaman suara verbal, transkrip verbatim, dan persetujuan informed consent telah tersimpan secara permanen di database server admin untuk keperluan pembakuan disertasi doktoral LBD-S3 / MADEL-S3.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => router.push("/")}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/50 transition active:scale-95"
              >
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

