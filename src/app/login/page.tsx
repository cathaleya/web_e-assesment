"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [campus, setCampus] = useState("");
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [gender, setGender] = useState<string>("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Deeper, high-contrast Army Green
  const armyGreen = "#2D3410"; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (loginType === "student") {
        if (!name || !gender || !campus) {
           setError("Mohon lengkapi semua data identitas!");
           setIsLoading(false);
           return;
        }

        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, campus, gender })
        });
        
        if (res.ok) {
           const data = await res.json();
           localStorage.setItem("userId", data.userId);
           localStorage.setItem("userName", name);
           localStorage.setItem("userGender", gender);
           localStorage.setItem("userCampus", campus);
           router.push("/dashboard");
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || "Gagal terhubung ke server.");
          setIsLoading(false);
        }
      } else {
        if (!adminUsername || !adminPassword) {
          setError("Masukkan username dan password admin.");
          setIsLoading(false);
          return;
        }
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: adminUsername, password: adminPassword })
        });
        if (res.ok) {
          localStorage.setItem("userName", "Administrator");
          localStorage.setItem("isAdmin", "true");
          router.push("/admin");
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Akses ditolak.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-100"
         style={{ 
           backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url('/unj_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      <div className="w-full max-w-md px-4 sm:px-6 relative z-10 py-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-[#2D3410]">
            <i className="fa-solid fa-graduation-cap text-[#2D3410] text-3xl sm:text-4xl"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl font-[900] text-[#2D3410] tracking-tighter uppercase italic leading-none drop-shadow-sm">HDAP Portal</h1>
          <p className="text-[#2D3410] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] mt-2">S3 UNJ Dissertation Research</p>
        </div>

        {/* SOLID WHITE CARD - NO TRANSPARENCY FOR MAXIMUM READABILITY */}
        <div className="bg-white rounded-[35px] p-6 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-2 border-slate-100">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
            <button onClick={() => setLoginType("student")} 
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${loginType === "student" ? "bg-[#2D3410] text-white shadow-lg" : "text-[#2D3410]/50"}`}>
              RESPONDEN
            </button>
            <button onClick={() => setLoginType("admin")} 
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${loginType === "admin" ? "bg-[#2D3410] text-white shadow-lg" : "text-[#2D3410]/50"}`}>
              ADMIN
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginType === "student" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#2D3410] uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <i className="fa-solid fa-user absolute left-5 top-3.5 text-[#2D3410]/30 text-sm"></i>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan Nama..." className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-[#2D3410] font-bold focus:border-[#2D3410] outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#2D3410] uppercase tracking-widest mb-2 ml-1">Kampus / Instansi</label>
                  <div className="relative">
                    <i className="fa-solid fa-university absolute left-5 top-3.5 text-[#2D3410]/30 text-sm"></i>
                    <input type="text" required value={campus} onChange={e => setCampus(e.target.value)} placeholder="Masukkan Kampus..." className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-[#2D3410] font-bold focus:border-[#2D3410] outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#2D3410] uppercase tracking-widest mb-2 ml-1">Jenis Kelamin</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setGender("male")} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[10px] font-black transition-all ${gender === "male" ? "bg-[#2D3410] border-[#2D3410] text-white shadow-md" : "bg-white border-slate-200 text-[#2D3410]/40"}`}>
                      <i className="fa-solid fa-mars text-sm"></i> LAKI-LAKI
                    </button>
                    <button type="button" onClick={() => setGender("female")} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[10px] font-black transition-all ${gender === "female" ? "bg-[#2D3410] border-[#2D3410] text-white shadow-md" : "bg-white border-slate-200 text-[#2D3410]/40"}`}>
                      <i className="fa-solid fa-venus text-sm"></i> PEREMPUAN
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <i className="fa-solid fa-shield-halved absolute left-5 top-3.5 text-[#2D3410]/30 text-sm"></i>
                  <input type="text" required value={adminUsername} onChange={e => setAdminUsername(e.target.value)} placeholder="Username Admin" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-[#2D3410] font-bold focus:border-[#2D3410] outline-none transition-all" />
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-5 top-3.5 text-[#2D3410]/30 text-sm"></i>
                  <input type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Password Admin" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm text-[#2D3410] font-bold focus:border-[#2D3410] outline-none transition-all" />
                </div>
              </div>
            )}

            {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-black rounded-xl border border-red-200 text-center">{error}</div>}

            <button type="submit" disabled={isLoading} className="w-full font-black py-4.5 rounded-2xl bg-[#2D3410] hover:bg-black text-white shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 mt-4">
              <span>{isLoading ? "PROSES..." : "MASUK KE DASHBOARD"}</span>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-[#2D3410] text-[9px] font-black uppercase tracking-[0.4em] drop-shadow-sm">&copy; 2026 Riset Disertasi BIMA UNJ</p>
        </div>
      </div>
    </div>
  );
}
