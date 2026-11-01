"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MAGER_QUESTIONS,
  SESSION_DETAILS,
  DIMENSION_LABELS,
  MagerQuestion,
} from "./mager_questions";

// PROTOKOL 3-TIER DESKRIPSI
const TIER_DESCRIPTIONS = [
  {
    tier: 1,
    name: "Tier 1: Semantic & Comprehension Clarity",
    icon: "fa-book-open-reader",
    color: "purple",
    badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
    desc: "Mengevaluasi kejelasan makna kata, interpretasi istilah doktoral, dan apakah ada ambiguitas frasa dalam butir.",
    target: "Apakah makna butir ini langsung dapat Anda pahami tanpa multitafsir?",
  },
  {
    tier: 2,
    name: "Tier 2: Experiential Retrieval & Justification",
    icon: "fa-clock-rotate-left",
    color: "blue",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
    desc: "Menggali memori nyata, situasi riil riset disertasi, bimbingan promotor, dan penggunaan platform digital selama perkuliahan S3.",
    target: "Pengalaman nyata apa selama kuliah doktoral yang melandasi skor pilihan Anda?",
  },
  {
    tier: 3,
    name: "Tier 3: Construct Representation & Confidence",
    icon: "fa-certificate",
    color: "amber",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-200",
    desc: "Menilai sejauh mana butir mewakili dimensi lingkungan belajar digital doktoral dan tingkat keyakinan atas respon yang diberikan.",
    target: "Seberapa yakin Anda bahwa butir ini esensial mengukur kompetensi/lingkungan doktoral Anda?",
  },
];

// CANVAS TANDA TANGAN DIGITAL
function SignatureCanvas({
  onSave,
  currentSignature,
}: {
  onSave: (dataUrl: string) => void;
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
    ctx.strokeStyle = "#581c87"; // Deep Regal Purple
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
    onSave("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar (PNG/JPG) yang diperbolehkan.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const img = new Image();
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              onSave(dataUrl);
            };
            img.src = dataUrl;
          }
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-2.5">
      <div className="relative border-2 border-dashed border-purple-300 rounded-2xl bg-white overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={520}
          height={140}
          className="w-full h-32 touch-none cursor-crosshair relative z-10"
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
            <i className="fa-solid fa-signature text-purple-500 text-2xl mb-1"></i>
            <span>✍️ Goreskan Tanda Tangan Anda di sini (Layar Sentuh HP / Mouse Komputer)</span>
          </div>
        )}
        {currentSignature && (
          <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm pointer-events-none">
            <i className="fa-solid fa-circle-check"></i>
            <span>Tanda Tangan Siap</span>
          </div>
        )}
      </div>

      {currentSignature && (
        <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-14 h-7 bg-white border border-purple-200 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
              <img src={currentSignature} alt="TTD Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <span className="text-xs font-semibold text-purple-900">Tanda Tangan Digital Terpasang</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
            <i className="fa-solid fa-check-double"></i> Sah
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={clearCanvas}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-700 border border-slate-300 transition active:scale-95 flex items-center gap-1.5 font-bold text-[11px]"
        >
          <i className="fa-solid fa-rotate-left"></i> Bersihkan
        </button>
        <label className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 cursor-pointer transition active:scale-95 flex items-center gap-1.5 font-bold text-[11px]">
          <i className="fa-solid fa-upload"></i> Unggah TTD (PNG/JPG)
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
  const [probingStep, setProbingStep] = useState<number>(1); // 1: Likert & Verbalisasi, 2: Tier 1 Semantic, 3: Tier 2 Retrieval, 4: Tier 3 Construct
  const [activeTab, setActiveTab] = useState<"profile" | "guidance" | "consent" | "session">("profile");

  // SESSION UNLOCK & TRANSITION STATE
  const [unlockedSessions, setUnlockedSessions] = useState<Record<number, boolean>>({ 1: true, 2: false, 3: false });
  const [showSessionTransitionModal, setShowSessionTransitionModal] = useState<null | { fromSession: 1 | 2; toSession: 2 | 3 }>(null);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState<boolean>(false);

  // PARTICIPANT PROFILE (S3 DOKTORAL) — HARUS BENAR-BENAR KOSONG
  const [userName, setUserName] = useState("");
  const [userNim, setUserNim] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userCampus, setUserCampus] = useState("");
  const [userStudyProgram, setUserStudyProgram] = useState("");
  const [userResearchTopic, setUserResearchTopic] = useState("");

  // INFORMED CONSENT STATE — HARUS TIDAK TERISI AWAL
  const [consentApproved, setConsentApproved] = useState(false);
  const [consentSignature, setConsentSignature] = useState<string | null>(null);
  const [mandatoryConsents, setMandatoryConsents] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  // PARTICIPANT ANSWERS & PROGRESS
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [confidenceRatings, setConfidenceRatings] = useState<Record<number, number>>({});
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

  // RESTORE SESSION UNLOCKS & BERSIHKAN DATA DUMMY DARI LOCALSTORAGE
  useEffect(() => {
    try {
      // Bersihkan seluruh data dummy / test masa lalu agar form 100% kosong
      localStorage.removeItem("mager_userName");
      localStorage.removeItem("mager_userCampus");
      localStorage.removeItem("mager_userNim");
      localStorage.removeItem("mager_userStudyProgram");
      localStorage.removeItem("mager_userResearchTopic");
      localStorage.removeItem("mager_userGender");
      localStorage.removeItem("mager_consentApproved");

      const s2 = localStorage.getItem("mager_session2_unlocked") === "true";
      const s3 = localStorage.getItem("mager_session3_unlocked") === "true";
      if (s2 || s3) {
        setUnlockedSessions({ 1: true, 2: s2, 3: s3 });
      }
    } catch (e) {
      console.warn("Storage notice:", e);
    }
  }, []);

  // CURRENT QUESTIONS FILTERED BY ACTIVE SESSION
  const currentSessionQuestions = MAGER_QUESTIONS.filter((q) => q.session === activeSession);
  const currentQ: MagerQuestion | undefined = currentSessionQuestions[sessionItemIdx];

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

  // TTS SYNTHESIS
  const speakText = (text: string, type: "statement" | "probing") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Browser Anda tidak mendukung fitur sintesis suara (Text-to-Speech).");
      return;
    }

    if (isSpeaking && speakingType === type) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingType(null);
      return;
    }

    window.speechSynthesis.cancel();
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
    }
    setIsSpeaking(false);
    setSpeakingType(null);
  };

  // WEB SPEECH RECOGNITION SETUP
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "id-ID";

        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }
          const liveText = finalTranscriptRef.current + interimTranscript;
          setTranscriptText(liveText.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition notice:", event.error);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // START RECORDING
  const startRecording = async () => {
    try {
      stopSpeaking();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioMeter = () => {
            if (!isRecordingRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            requestAnimationFrame(updateAudioMeter);
          };
          requestAnimationFrame(updateAudioMeter);
        }
      } catch (e) {
        console.warn("Visualizer audio meter init optional skip:", e);
      }

      let mime = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mime = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mime = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
        mime = "audio/ogg";
      }
      recMimeRef.current = mime;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlobGenerated = new Blob(audioChunksRef.current, { type: recMimeRef.current });
        setAudioBlob(audioBlobGenerated);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(audioBlobGenerated));

        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(() => {});
          audioContextRef.current = null;
        }
        setAudioLevel(0);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingTime(0);
      setUploadSuccess(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      if (recognitionRef.current) {
        finalTranscriptRef.current = transcriptText ? transcriptText + " " : "";
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Speech recognition already active:", e);
        }
      }
    } catch (err: any) {
      console.error("Gagal mengakses mikrofon:", err);
      alert("Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin mikrofon pada browser Anda.");
    }
  };

  // STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const resetRecordingState = () => {
    stopRecording();
    stopSpeaking();
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setTranscriptText("");
    finalTranscriptRef.current = "";
    setRecordingTime(0);
    setUploadSuccess(false);
  };

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

  // UPLOAD AUDIO / TRANSKRIP KE BACKEND
  const uploadAudioToServer = async () => {
    if (!currentQ) return;
    if (isRecording) stopRecording();

    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));

      let payloadBlob = audioBlob;
      if (!payloadBlob && audioChunksRef.current.length > 0) {
        payloadBlob = new Blob(audioChunksRef.current, { type: recMimeRef.current });
      }

      const finalTranscript = transcriptText.trim() || finalTranscriptRef.current.trim();

      if (!payloadBlob || payloadBlob.size === 0) {
        if (!finalTranscript) {
          alert("Mohon rekam suara terlebih dahulu atau ketik transkrip pemikiran Anda sebelum mengirim.");
          setIsUploading(false);
          return;
        }
        payloadBlob = new Blob([finalTranscript], { type: "text/plain" });
      }

      const userId = userNim.trim() || userName.trim().toLowerCase().replace(/\s+/g, "_") || "mhs_doktor_s3";
      const formData = new FormData();
      const extension = payloadBlob.type.includes("webm")
        ? "webm"
        : payloadBlob.type.includes("mp4")
        ? "mp4"
        : payloadBlob.type.includes("ogg")
        ? "ogg"
        : "txt";

      formData.append("audio", payloadBlob, `think_aloud_mager_${userId}_item${currentQ.id}_step${probingStep}.${extension}`);
      formData.append("userId", userId);
      formData.append("userName", userName.trim() || "Kandidat Doktor S3");
      formData.append("userCampus", userCampus.trim() || "Universitas Doktoral");
      formData.append("studyProgram", userStudyProgram.trim() || "Doktoral S3");
      formData.append("gender", userGender);
      formData.append("respondentLevel", "Mahasiswa Doktoral S3 (MAGER)");
      formData.append("sessionNo", activeSession.toString());
      formData.append("itemNo", currentQ.id.toString());
      formData.append("sjtId", currentQ.code);
      formData.append("probingStep", probingStep.toString());
      formData.append("selectedOption", selectedOptions[currentQ.id] || "-");
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

        finalTranscriptRef.current = "";
        resetRecordingState();

        if (probingStep < 4) {
          const nextStep = probingStep + 1;
          alert(`✅ Respon Pertanyaan Probing ${probingStep} Berhasil Terkirim ke Panel Admin!\nOtomatis beralih ke Pertanyaan Probing ${nextStep}.`);
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

  // VALIDASI KETAT PENGUNCIAN LANGKAH (TIDAK BOLEH MELOMPAT)
  const validateCurrentStepCompleted = (): boolean => {
    if (!currentQ) return false;

    // STEP 1: Wajib memilih skor Likert (1-5) dan wajib ada respon suara/transkrip
    if (probingStep === 1) {
      if (!selectedOptions[currentQ.id]) {
        alert("⚠️ Langkah Terkunci: Anda wajib menentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju) terlebih dahulu!");
        return false;
      }
      const hasResponse = isStepDone(currentQ.id, 1) || uploadSuccess || audioBlob || transcriptText.trim().length > 0;
      if (!hasResponse) {
        alert("⚠️ Langkah Terkunci: Anda wajib menyuarakan (rekam suara) atau mengetikkan pertimbangan kognitif yang melandasi pilihan skor Anda sebelum melanjutkan!");
        return false;
      }
      return true;
    }

    // STEP 2: Wajib ada respon Tier 1
    if (probingStep === 2) {
      const hasResponse = isStepDone(currentQ.id, 2) || uploadSuccess || audioBlob || transcriptText.trim().length > 0;
      if (!hasResponse) {
        alert("⚠️ Langkah Terkunci: Silakan suarakan pemahaman makna dan kejelasan istilah (Tier 1) sebelum melanjutkan ke langkah berikutnya!");
        return false;
      }
      return true;
    }

    // STEP 3: Wajib ada respon Tier 2
    if (probingStep === 3) {
      const hasResponse = isStepDone(currentQ.id, 3) || uploadSuccess || audioBlob || transcriptText.trim().length > 0;
      if (!hasResponse) {
        alert("⚠️ Langkah Terkunci: Silakan ceritakan pengalaman nyata situasi perkuliahan S3 Anda (Tier 2) sebelum melanjutkan ke langkah berikutnya!");
        return false;
      }
      return true;
    }

    // STEP 4: Wajib memilih tingkat keyakinan (1-5) dan ada respon Tier 3
    if (probingStep === 4) {
      if (!confidenceRatings[currentQ.id]) {
        alert("⚠️ Langkah Terkunci: Silakan tentukan rating keyakinan Anda (1 s.d. 5 Bintang) pada butir ini!");
        return false;
      }
      const hasResponse = isStepDone(currentQ.id, 4) || uploadSuccess || audioBlob || transcriptText.trim().length > 0;
      if (!hasResponse) {
        alert("⚠️ Langkah Terkunci: Silakan suarakan justifikasi representasi konstruk dan keyakinan Anda (Tier 3) sebelum menyelesaikan butir ini!");
        return false;
      }
      return true;
    }

    return true;
  };

  // PROCEED TO NEXT ITEM OR NEXT STEP
  const handleNextStep = async () => {
    stopSpeaking();
    if (!currentQ) return;

    // KUNCI: Validasi langkah tidak boleh dilompati
    if (!validateCurrentStepCompleted()) {
      return;
    }

    const hasUnsent = (audioBlob || audioChunksRef.current.length > 0 || transcriptText.trim().length > 0) && !uploadSuccess;
    if (hasUnsent) {
      const confirmSend = window.confirm("Anda memiliki respon suara/teks yang belum dikirim ke Admin. Apakah ingin mengirimkannya sekarang?");
      if (confirmSend) {
        await uploadAudioToServer();
        return;
      }
    }

    markStepDone(currentQ.id, probingStep);

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

  // NAVIGASI STEP LANGSUNG (DENGAN KUNCI PENGAMAN)
  const handleSelectProbingStep = (stepNum: number) => {
    if (!currentQ) return;
    // Boleh kembali ke langkah yang sudah pernah dilalui
    if (stepNum <= probingStep) {
      stopSpeaking();
      setProbingStep(stepNum);
      resetRecordingState();
      return;
    }
    // Jika ingin maju ke langkah berikutnya, wajib validasi langkah saat ini selesai
    if (stepNum === probingStep + 1) {
      if (validateCurrentStepCompleted()) {
        stopSpeaking();
        markStepDone(currentQ.id, probingStep);
        setProbingStep(stepNum);
        resetRecordingState();
      }
      return;
    }
    // Melompati lebih dari 1 langkah dilarang keras
    alert(`⚠️ Langkah Terkunci: Selesaikan terlebih dahulu Tahap ${probingStep} secara berurutan!`);
  };

  const allMandatoryChecked = Object.values(mandatoryConsents).every(Boolean);
  const activeSessionDetail = SESSION_DETAILS[activeSession];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans selection:bg-purple-600 selection:text-white pb-12">
      
      {/* ── TOP NAVBAR (SLIM & FIT TO SCREEN) ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push("/")}
            className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition border border-purple-200"
            title="Kembali ke Beranda"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">
                THINK A LOUD MAGER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-[8px] md:text-[9px] font-black uppercase">
                DOKTORAL S3 · 3-TIER
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold hidden sm:block">
              Instrumen Lingkungan Belajar Digital Doktoral (LBD-S3 / MADEL-S3)
            </span>
          </div>
        </div>

        {/* TAB STEPPER HEADER */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 text-[11px] ${
              activeTab === "profile"
                ? "bg-purple-700 text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <i className="fa-solid fa-id-card text-[10px]"></i>
            <span className="hidden sm:inline">1. Profil S3</span>
            {userName.trim() && userCampus.trim() && <i className="fa-solid fa-circle-check text-emerald-400 text-[9px]"></i>}
          </button>
          <button
            onClick={() => {
              if (!userName.trim() || !userGender.trim() || !userCampus.trim() || !userStudyProgram.trim()) {
                alert("Mohon lengkapi data profil Nama, Jenis Kelamin, Universitas, dan Program Studi terlebih dahulu!");
                setActiveTab("profile");
                return;
              }
              setActiveTab("guidance");
            }}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 text-[11px] ${
              activeTab === "guidance"
                ? "bg-purple-700 text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <i className="fa-solid fa-book text-[10px]"></i>
            <span className="hidden sm:inline">2. Panduan</span>
          </button>
          <button
            onClick={() => {
              if (!userName.trim() || !userGender.trim() || !userCampus.trim() || !userStudyProgram.trim()) {
                alert("Mohon lengkapi data profil terlebih dahulu!");
                setActiveTab("profile");
                return;
              }
              setActiveTab("consent");
            }}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 text-[11px] ${
              activeTab === "consent"
                ? "bg-purple-700 text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <i className="fa-solid fa-file-signature text-[10px]"></i>
            <span className="hidden sm:inline">3. Persetujuan</span>
            {consentApproved && <i className="fa-solid fa-circle-check text-emerald-400 text-[9px]"></i>}
          </button>
          <button
            onClick={() => {
              if (!consentApproved || !consentSignature) {
                alert("Mohon setujui dan bubuhkan tanda tangan Informed Consent terlebih dahulu sebelum memulai sesi wawancara.");
                setActiveTab("consent");
                return;
              }
              setActiveTab("session");
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 text-[11px] ${
              activeTab === "session"
                ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <i className="fa-solid fa-microphone-lines text-[10px]"></i>
            <span>4. Sesi Wawancara</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (COMPACT & FIT TO SCREEN) ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4">
        <AnimatePresence mode="wait">
          
          {/* ══════════════════════════════════════════════════════════
              TAB 1: PROFIL MAHASISWA DOKTORAL S3 (FORM BERSIH TANPA ISI AWAL)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 md:p-5 rounded-2xl bg-white border border-purple-200 shadow-sm relative overflow-hidden">
                <div className="max-w-3xl">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                    <i className="fa-solid fa-id-card"></i> Identitas Responden Wawancara Doktoral (S3)
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                    Pengisian Data Partisipan Think-Aloud Protocol MAGER
                  </h2>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Data identitas ini digunakan untuk pemetaan demografis dan verifikasi wawancara kognitif pada instrumen <b>Lingkungan Belajar Digital Doktoral (LBD-S3 / MADEL-S3)</b>. Seluruh data dijamin kerahasiaannya.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                    <i className="fa-solid fa-user-graduate text-purple-700"></i> Data Akademik Mahasiswa S3
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:bg-white focus:border-purple-600 rounded-xl text-xs md:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenis Kelamin: <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={userGender}
                      onChange={(e) => setUserGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:bg-white focus:border-purple-600 rounded-xl text-xs md:text-sm font-medium text-slate-900 outline-none transition cursor-pointer"
                    >
                      <option value="">-- Pilih Jenis Kelamin --</option>
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor Induk Mahasiswa (NIM / NPM):
                    </label>
                    <input
                      type="text"
                      value={userNim}
                      onChange={(e) => setUserNim(e.target.value)}
                      placeholder="Masukkan NIM doktoral Anda (opsional)..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:bg-white focus:border-purple-600 rounded-xl text-xs md:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Universitas / Pascasarjana: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userCampus}
                      onChange={(e) => setUserCampus(e.target.value)}
                      placeholder="Contoh: Universitas Negeri Jakarta / Universitas Indonesia..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:bg-white focus:border-purple-600 rounded-xl text-xs md:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>
                </div>

                <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                    <i className="fa-solid fa-graduation-cap text-purple-700"></i> Fokus Riset & Program Studi
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Program Studi Doktoral: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userStudyProgram}
                      onChange={(e) => setUserStudyProgram(e.target.value)}
                      placeholder="Contoh: S3 Penelitian & Evaluasi Pendidikan / S3 Ilmu Komputer..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:bg-white focus:border-purple-600 rounded-xl text-xs md:text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Topik Disertasi / Bidang Fokus Riset:
                    </label>
                    <textarea
                      rows={3}
                      value={userResearchTopic}
                      onChange={(e) => setUserResearchTopic(e.target.value)}
                      placeholder="Tuliskan gambaran singkat topik disertasi yang sedang Anda teliti..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:bg-white focus:border-purple-600 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (!userName.trim() || !userGender.trim() || !userCampus.trim() || !userStudyProgram.trim()) {
                          alert("Mohon lengkapi Nama, Jenis Kelamin, Universitas, dan Program Studi terlebih dahulu sebelum melanjutkan!");
                          return;
                        }
                        setActiveTab("guidance");
                      }}
                      className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>Simpan &amp; Lanjut ke Panduan</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: PANDUAN PROTOKOL THINK-ALOUD & 3-TIER
          ══════════════════════════════════════════════════════════ */}
          {activeTab === "guidance" && (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 mb-2">
                  <i className="fa-solid fa-book-open"></i> Petunjuk Pelaksanaan
                </span>
                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  Prosedur Wawancara Kognitif Think-Aloud 3-Tier
                </h2>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                  Dalam wawancara kognitif ini, Anda diminta untuk <b>menyuarakan secara spontan (berpikir nyaring)</b> segala pemikiran, pertimbangan, dan asosiasi pengalaman yang muncul saat merespon 30 butir instrumen.
                </p>
              </div>

              {/* 3 TIERS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TIER_DESCRIPTIONS.map((t) => (
                  <div key={t.tier} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${t.badgeBg}`}>
                          Tier {t.tier}
                        </span>
                        <i className={`fa-solid ${t.icon} text-purple-700 text-sm`}></i>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{t.desc}</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-purple-900 font-semibold italic bg-purple-50/50 p-2 rounded-lg">
                      "{t.target}"
                    </div>
                  </div>
                ))}
              </div>

              {/* ATURAN PELAKSANAAN */}
              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 shadow-sm text-amber-950 space-y-2">
                <h4 className="font-black text-xs uppercase tracking-wide flex items-center gap-1.5 text-amber-900">
                  <i className="fa-solid fa-triangle-exclamation"></i> 4 Aturan Emas Berpikir Nyaring:
                </h4>
                <ul className="text-xs space-y-1 font-medium list-disc list-inside">
                  <li><b>Jangan Menahan Pikiran:</b> Katakan apa saja yang Anda pikirkan, termasuk keraguan atau ketidaksesuaian kalimat.</li>
                  <li><b>Gunakan Fitur Suara:</b> Tekan tombol mikrofon untuk merekam suara, atau ketikkan transkrip jika mikrofon terkendala.</li>
                  <li><b>Berurutan Tanpa Melewatkan:</b> Setiap butir memiliki 4 tahap pertanyaan probing yang wajib dijawab secara runut.</li>
                  <li><b>Kirim Respon per Tahap:</b> Tekan tombol "Kirim Respon ke Panel Admin" agar data terekam aman di server.</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab("consent")}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>Lanjut ke Lembar Persetujuan (Informed Consent)</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 3: INFORMED CONSENT & TANDA TANGAN (KOSONG AWAL)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === "consent" && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 mb-2">
                  <i className="fa-solid fa-file-contract"></i> Hak Asasi &amp; Etika Partisipan
                </span>
                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  Lembar Persetujuan Partisipasi Riset (Informed Consent)
                </h2>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                  Sesuai standar etika penelitian, partisipasi Anda bersifat sukarela. Silakan baca dan centang 6 poin persetujuan di bawah ini, kemudian bubuhkan tanda tangan digital Anda.
                </p>
              </div>

              {/* 6 MANDATORY CONSENTS (SEMUA AWAL HARUS CENTANG MANUAL) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  Pernyataan Persetujuan Partisipan:
                </h4>

                {[
                  { id: 1, text: "Saya menyatakan bahwa data profil doktoral (S3) yang saya isikan adalah benar dan dapat dipertanggungjawabkan." },
                  { id: 2, text: "Saya bersedia menyuarakan seluruh pertimbangan kognitif (berpikir nyaring) selama proses telaah butir instrumen." },
                  { id: 3, text: "Saya mengizinkan rekaman suara dan transkrip verbatim saya disimpan secara aman dan dianalisis untuk keperluan riset doktoral." },
                  { id: 4, text: "Saya memahami bahwa kerahasiaan identitas dan data pribadi saya dijamin sepenuhnya (anonymized) dalam publikasi ilmiah." },
                  { id: 5, text: "Saya berpartisipasi secara sukarela dan berhak mengajukan keberatan jika terdapat hal yang bertentangan dengan etika." },
                  { id: 6, text: "Saya memahami bahwa instrumen ini terdiri dari 3 sesi (30 butir) dengan masing-masing 4 tahap probing terstruktur." },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={mandatoryConsents[item.id] || false}
                      onChange={(e) =>
                        setMandatoryConsents((prev) => ({ ...prev, [item.id]: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500 shrink-0"
                    />
                    <span className="text-xs text-slate-700 font-medium leading-snug">
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>

              {/* CANVAS TANDA TANGAN */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <i className="fa-solid fa-signature text-purple-700"></i>
                    <span>Tanda Tangan Digital Partisipan: <span className="text-rose-500">*</span></span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold">Wajib diisi</span>
                </div>

                <SignatureCanvas
                  onSave={(sigUrl) => setConsentSignature(sigUrl || null)}
                  currentSignature={consentSignature}
                />
              </div>

              {/* CHECKBOX KONFIRMASI FINAL & SUBMIT */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 shadow-sm space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentApproved}
                    onChange={(e) => setConsentApproved(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500 shrink-0"
                  />
                  <span className="text-xs font-bold text-purple-950 leading-snug">
                    Dengan mencentang kotak ini, saya menyetujui seluruh ketentuan di atas dan menyatakan kesiapan untuk melaksanakan Wawancara Think-Aloud Doktoral S3 MAGER.
                  </span>
                </label>

                <div className="flex justify-end pt-1">
                  <button
                    disabled={!allMandatoryChecked || !consentApproved || !consentSignature}
                    onClick={async () => {
                      if (!allMandatoryChecked || !consentApproved || !consentSignature) {
                        alert("Mohon centang seluruh 6 pernyataan persetujuan, centang konfirmasi, dan bubuhkan tanda tangan Anda!");
                        return;
                      }

                      // Kirim data consent ke server
                      try {
                        await fetch("/api/consent", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userId: userNim.trim() || userName.trim().toLowerCase().replace(/\s+/g, "_") || "mhs_doktor_s3",
                            userName: userName.trim() || "Kandidat Doktor S3",
                            userCampus: userCampus.trim(),
                            userNim: userNim.trim(),
                            gender: userGender,
                            studyProgram: userStudyProgram.trim(),
                            respondentLevel: "Mahasiswa Doktoral S3 (MAGER)",
                            sessionNo: activeSession,
                            signatureDataUrl: consentSignature,
                            agreedAt: new Date().toISOString(),
                          }),
                        });
                      } catch (e) {
                        console.warn("Gagal menyimpan consent ke server:", e);
                      }

                      try {
                        localStorage.setItem("mager_consentApproved", "true");
                      } catch (e) {}

                      alert("✅ Lembar Informed Consent Berhasil Disetujui! Selamat datang di Sesi 1 Wawancara Think-Aloud.");
                      setActiveTab("session");
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Setujui &amp; Buka Sesi 1 Wawancara</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 4: SESI WAWANCARA INSTRUMEN (FIT TO SCREEN 2-COLUMN GRID)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === "session" && currentQ && (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* TOP SESSION SELECTOR TABS (KOMPAK) */}
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {[1, 2, 3].map((sessNum) => {
                    const isCurrent = activeSession === sessNum;
                    const isUnlocked = unlockedSessions[sessNum];
                    return (
                      <button
                        key={sessNum}
                        onClick={() => {
                          if (!isUnlocked) {
                            alert(`Sesi ${sessNum} masih terkunci. Anda wajib menyelesaikan seluruh butir pada Sesi sebelumnya terlebih dahulu.`);
                            return;
                          }
                          stopSpeaking();
                          resetRecordingState();
                          setActiveSession(sessNum as 1 | 2 | 3);
                          setSessionItemIdx(0);
                          setProbingStep(1);
                        }}
                        disabled={!isUnlocked}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
                          isCurrent
                            ? "bg-purple-700 text-white shadow-sm"
                            : isUnlocked
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            : "bg-slate-50 text-slate-400 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <i className={`fa-solid ${isUnlocked ? "fa-folder-open" : "fa-lock"} text-[10px]`}></i>
                        <span>Sesi {sessNum}</span>
                        <span className="text-[9px] opacity-75">(10 Butir)</span>
                      </button>
                    );
                  })}
                </div>

                {/* PROGRESS COUNTER */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200 font-mono text-[11px]">
                    Butir #{sessionItemIdx + 1} / {currentSessionQuestions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px]">
                    Probing {probingStep}/4
                  </span>
                </div>
              </div>

              {/* ── SPLIT 2-COLUMN GRID (LEFT: STATEMENT & LIKERT; RIGHT: PROBING & RECORDER) ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                
                {/* ══ KOLOM KIRI (COL-SPAN-6): STIMULUS & SKALA LIKERT ══ */}
                <div className="lg:col-span-6 space-y-3">
                  
                  {/* INSTRUCTION BANNER KHUSUS TAHAP 1 */}
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 shadow-sm flex items-start gap-2.5">
                    <i className="fa-solid fa-bullhorn text-amber-700 text-sm mt-0.5 shrink-0"></i>
                    <div className="text-[11px] md:text-xs font-medium leading-relaxed">
                      <span className="font-black text-amber-900 block mb-0.5 uppercase tracking-wide text-[10px]">
                        Instruksi Berpikir Nyaring (Think-Aloud):
                      </span>
                      Bacalah pernyataan berikut dengan suara lantang dan beriakn jawaban anda, lalu tentukan skor pilihan Anda (1: Sangat Tidak Setuju s.d. 5: Sangat Setuju). Suarakan seluruh pertimbangan kognitif yang melandasi pilihan skor Anda.
                    </div>
                  </div>

                  {/* KARTU BUTIR PERNYATAAN */}
                  <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-black text-xs font-mono">
                          {currentQ.code}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700">
                          {DIMENSION_LABELS[currentQ.dimensi] || currentQ.dimensi}
                        </span>
                      </div>

                      {/* TTS TOMBOL DENGARKAN BUTIR */}
                      <button
                        type="button"
                        onClick={() => speakText(currentQ.statement, "statement")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                          isSpeaking && speakingType === "statement"
                            ? "bg-rose-600 text-white animate-pulse"
                            : "bg-slate-100 hover:bg-slate-200 text-purple-800"
                        }`}
                      >
                        <i className={`fa-solid ${isSpeaking && speakingType === "statement" ? "fa-stop" : "fa-volume-high"}`}></i>
                        <span>{isSpeaking && speakingType === "statement" ? "Hentikan" : "Dengarkan"}</span>
                      </button>
                    </div>

                    <blockquote className="text-xs md:text-sm font-bold text-slate-900 leading-snug italic bg-slate-50 p-3 rounded-xl border-l-4 border-purple-600">
                      "{currentQ.statement}"
                    </blockquote>

                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                      <span><b>Konteks:</b> {currentQ.contextRef}</span>
                      <span className="text-purple-700 font-bold">Skala: 1 (STS) - 5 (SS)</span>
                    </div>
                  </div>

                  {/* LIKERT 1-5 SELECTOR (BUTTONS HORIZONTAL) */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-list-check text-purple-600"></i>
                        <span>Pilih Skor Likert: <span className="text-rose-500">*</span></span>
                      </span>
                      {selectedOptions[currentQ.id] && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Skor Terpilih: {selectedOptions[currentQ.id]}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
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
                            className={`p-2 rounded-xl border text-center transition active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                              isSelected
                                ? "bg-purple-700 text-white border-purple-800 shadow-md font-bold scale-[1.02]"
                                : "bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200 hover:border-purple-300"
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                              isSelected ? "bg-white text-purple-900" : "bg-white text-slate-800 border"
                            }`}>
                              {opt.label}
                            </span>
                            <span className="text-[9px] font-bold leading-tight">{opt.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ITEM PAGINATION DOTS (1 TO 10) */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-slate-500 shrink-0">Butir Sesi {activeSession}:</span>
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {currentSessionQuestions.map((q, idx) => {
                        const isCur = idx === sessionItemIdx;
                        const isAnswered = Boolean(selectedOptions[q.id]);
                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              // Validasi jika ingin berpindah butir, pastikan langkah saat ini aman
                              stopSpeaking();
                              resetRecordingState();
                              setSessionItemIdx(idx);
                              setProbingStep(1);
                            }}
                            className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition ${
                              isCur
                                ? "bg-purple-700 text-white font-black shadow-sm"
                                : isAnswered
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* ══ KOLOM KANAN (COL-SPAN-6): PROBING TIER & AUDIO RECORDER ══ */}
                <div className="lg:col-span-6 space-y-3">
                  
                  {/* 4 PROBING STEPS SELECTOR (DENGAN PENGUNCIAN KETAT) */}
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span>Tahap Probing:</span>
                      <span className="text-purple-800 font-black">{activeProbing.badge}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((stepNum) => {
                        const isActive = probingStep === stepNum;
                        const isDone = isStepDone(currentQ.id, stepNum);
                        const isAccessible = stepNum <= probingStep || isDone;
                        const labels = ["1. Pilihan Skor", "2. Tier 1 Semantic", "3. Tier 2 Retrieval", "4. Tier 3 Construct"];
                        
                        return (
                          <button
                            key={stepNum}
                            onClick={() => handleSelectProbingStep(stepNum)}
                            className={`py-1.5 px-1 rounded-xl text-center text-[9px] md:text-[10px] font-black uppercase tracking-tight transition border flex flex-col items-center justify-center gap-0.5 ${
                              isActive
                                ? "bg-purple-700 text-white border-purple-800 shadow-sm"
                                : isDone
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : isAccessible
                                ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                                : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-50"
                            }`}
                          >
                            <span className="truncate w-full">{labels[stepNum - 1]}</span>
                            {isDone && <i className="fa-solid fa-check text-[8px] text-emerald-600"></i>}
                            {!isAccessible && <i className="fa-solid fa-lock text-[8px] text-slate-400"></i>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE PROBING QUESTION PROMPT */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between gap-2 border-b border-purple-200/60 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[10px] font-black flex items-center justify-center">
                          {probingStep}
                        </span>
                        <h4 className="text-xs font-black text-purple-950 uppercase tracking-tight">
                          {activeProbing.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => speakText(activeProbing.text, "probing")}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition flex items-center gap-1 ${
                          isSpeaking && speakingType === "probing"
                            ? "bg-rose-600 text-white animate-pulse"
                            : "bg-white hover:bg-slate-100 text-purple-800 border border-purple-200"
                        }`}
                      >
                        <i className={`fa-solid ${isSpeaking && speakingType === "probing" ? "fa-stop" : "fa-volume-high"}`}></i>
                        <span>{isSpeaking && speakingType === "probing" ? "Hentikan" : "Dengarkan"}</span>
                      </button>
                    </div>

                    <div className="text-xs font-bold text-slate-800 leading-snug">
                      "{activeProbing.text}"
                    </div>

                    {/* JIKA STEP 4: TAMPILKAN CONFIDENCE RATING 1-5 BINTANG */}
                    {probingStep === 4 && (
                      <div className="mt-2 pt-2 border-t border-purple-200/60 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-purple-900">
                          Tingkat Keyakinan atas Butir: <span className="text-rose-500">*</span>
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isRated = (confidenceRatings[currentQ.id] || 0) >= star;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setConfidenceRatings((prev) => ({ ...prev, [currentQ.id]: star }))}
                                className="p-1 text-sm transition hover:scale-125"
                                title={`Rating ${star} dari 5`}
                              >
                                <i className={`fa-star ${isRated ? "fa-solid text-amber-500" : "fa-regular text-slate-300"}`}></i>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AUDIO RECORDER & VERBATIM TRANSCRIPT (KOMPAK) */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                    
                    {/* TOP CONTROLS & STATUS */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-microphone text-xs"></i>
                            <span>Rekam Suara</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center gap-1.5 animate-pulse"
                          >
                            <i className="fa-solid fa-stop text-xs"></i>
                            <span>Selesai Rekam</span>
                          </button>
                        )}

                        {/* TIMER */}
                        {isRecording && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                            <span>{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}</span>
                          </div>
                        )}
                      </div>

                      {/* AUDIO PLAYBACK JIKA ADA */}
                      {audioUrl && !isRecording && (
                        <div className="flex items-center gap-1">
                          <audio src={audioUrl} controls className="h-7 max-w-[170px]" />
                          <button
                            type="button"
                            onClick={resetRecordingState}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
                            title="Hapus Rekaman"
                          >
                            <i className="fa-solid fa-trash text-[10px]"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* LIVE TRANSKRIP / EDITABLE TEXTAREA */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-bold">
                        <span>Transkrip Suara (Bisa diedit/diketik langsung):</span>
                        {isRecording && <span className="text-purple-700 animate-pulse">● Mendengarkan...</span>}
                      </div>
                      <textarea
                        rows={3}
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Hasil rekaman suara akan tertulis otomatis di sini. Anda juga bisa mengetikkan pertimbangan kognitif Anda secara manual..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:bg-white focus:border-purple-600 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition resize-none leading-relaxed"
                      />
                    </div>

                    {/* TOMBOL KIRIM RESPON KE PANEL ADMIN */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500">
                        {uploadSuccess ? "✅ Respon tersimpan di Admin" : "Wajib kirim sebelum lanjut"}
                      </span>

                      <button
                        type="button"
                        onClick={uploadAudioToServer}
                        disabled={isUploading}
                        className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 shadow-sm ${
                          uploadSuccess
                            ? "bg-emerald-600 text-white"
                            : "bg-purple-700 hover:bg-purple-800 text-white"
                        } disabled:opacity-50`}
                      >
                        {isUploading ? (
                          <>
                            <i className="fa-solid fa-spinner animate-spin text-[10px]"></i>
                            <span>Mengirim...</span>
                          </>
                        ) : uploadSuccess ? (
                          <>
                            <i className="fa-solid fa-check text-[10px]"></i>
                            <span>Terkirim (Perbarui)</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-paper-plane text-[10px]"></i>
                            <span>Kirim ke Admin</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* ── BOTTOM STEP NAVIGATION (PREV & NEXT) ── */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-sm">
                <button
                  onClick={handlePrevStep}
                  disabled={sessionItemIdx === 0 && probingStep === 1}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]"></i>
                  <span>Sebelumnya</span>
                </button>

                <div className="text-center text-xs text-slate-500 font-bold hidden sm:block">
                  Sesi {activeSession} · Butir {sessionItemIdx + 1} dari {currentSessionQuestions.length} · Probing Step {probingStep}/4
                </div>

                <button
                  onClick={handleNextStep}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center gap-1.5"
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

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── MODAL TRANSISI ANTAR SESI ── */}
      {showSessionTransitionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-purple-200 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl mx-auto shadow-sm">
              <i className="fa-solid fa-trophy text-emerald-600"></i>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900">
                Sesi {showSessionTransitionModal.fromSession} Selesai!
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Luar biasa! Anda telah menyelesaikan 10 butir dan 40 tahap probing pada Sesi {showSessionTransitionModal.fromSession}. Sesi {showSessionTransitionModal.toSession} telah terbuka secara otomatis.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveSession(showSessionTransitionModal.toSession);
                setSessionItemIdx(0);
                setProbingStep(1);
                setShowSessionTransitionModal(null);
                resetRecordingState();
              }}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Mulai Sesi {showSessionTransitionModal.toSession} Sekarang</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL KELULUSAN / SELESAI SELURUH SESI ── */}
      {showFinalCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-purple-200 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-3xl mx-auto shadow-sm">
              <i className="fa-solid fa-graduation-cap text-purple-700"></i>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase tracking-wider inline-block mb-2">
                Doktoral S3 MAGER Complete
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">
                Terima Kasih atas Partisipasi Anda!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Seluruh 30 butir instrumen (120 tahap probing kognitif) telah berhasil Anda selesaikan dan tersimpan utuh di Panel Admin. Kontribusi Anda sangat berharga bagi pengembangan model pengukuran lingkungan belajar digital doktoral.
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-left text-xs space-y-1">
              <div className="text-slate-500 font-medium">Partisipan: <b className="text-slate-900">{userName || "-"}</b></div>
              <div className="text-slate-500 font-medium">Universitas: <b className="text-slate-900">{userCampus || "-"}</b></div>
              <div className="text-slate-500 font-medium">Total Rekaman Suara: <b className="text-purple-800">120 Respon Kognitif Selesai</b></div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-house"></i>
              <span>Kembali ke Beranda Utama</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
