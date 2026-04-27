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

  const armyGreen = "#4B5320";

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ 
           backgroundImage: "linear-gradient(rgba(75, 83, 32, 0.4), rgba(75, 83, 32, 0.4)), url('/unj_bg.png')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}>
      
      <div className="w-full max-w-lg px-6 relative z-10">
        <div className="text-center mb-10 drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)]">
          <div className="w-24 h-24 bg-white rounded-[35px] flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-[#4B5320]/20">
            <i className="fa-solid fa-graduation-cap text-[#4B5320] text-5xl"></i>
          </div>
          <h1 className="text-4xl font-black text-[#4B5320] tracking-tighter uppercase italic leading-none">HDAP Portal</h1>
          <p className="text-[#4B5320] text-[10px] font-black uppercase tracking-[0.5em] mt-3">S3 UNJ Dissertation Research</p>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[60px] p-10 lg:p-14 shadow-2xl border-4 border-white">
          <div className="flex bg-slate-100 p-2 rounded-[25px] mb-10">
            <button onClick={() => setLoginType("student")} 
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-500 ${loginType === "student" ? "bg-[#4B5320] text-white shadow-xl" : "text-slate-400"}`}>
              RESPONDEN
            </button>
            <button onClick={() => setLoginType("admin")} 
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-500 ${loginType === "admin" ? "bg-[#4B5320] text-white shadow-xl" : "text-slate-400"}`}>
              ADMIN
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {loginType === "student" ? (
              <div className="space-y-6">
                <div className="relative group">
                  <i className="fa-solid fa-user absolute left-6 top-5 text-[#4B5320]/30"></i>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 pl-16 pr-6 text-sm text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all shadow-inner" />
                </div>
                <div className="relative group">
                  <i className="fa-solid fa-university absolute left-6 top-5 text-[#4B5320]/30"></i>
                  <input type="text" required value={campus} onChange={e => setCampus(e.target.value)} placeholder="Kampus / Instansi" className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 pl-16 pr-6 text-sm text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all shadow-inner" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setGender("male")} className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 text-xs font-black transition-all ${gender === "male" ? "bg-[#4B5320] border-[#4B5320] text-white" : "bg-white border-slate-100 text-slate-400"}`}>
                    LAKI-LAKI
                  </button>
                  <button type="button" onClick={() => setGender("female")} className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 text-xs font-black transition-all ${gender === "female" ? "bg-[#4B5320] border-[#4B5320] text-white" : "bg-white border-slate-100 text-slate-400"}`}>
                    PEREMPUAN
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <input type="text" required value={adminUsername} onChange={e => setAdminUsername(e.target.value)} placeholder="Username" className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 px-6 text-sm text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all shadow-inner" />
                <input type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Password" className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 px-6 text-sm text-[#4B5320] font-bold focus:border-[#4B5320] outline-none transition-all shadow-inner" />
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full font-black py-6 rounded-[30px] bg-[#4B5320] hover:bg-[#354B37] text-white shadow-2xl shadow-[#4B5320]/30 transition-all uppercase tracking-widest text-xs">
              {isLoading ? "LOADING..." : "MASUK KE DASHBOARD"}
            </button>
          </form>
        </div>

        <div className="text-center mt-12">
          <p className="text-white text-[10px] font-black uppercase tracking-[0.5em] drop-shadow-lg">&copy; 2026 Riset BIMA UNJ</p>
        </div>
      </div>
    </div>
  );
}
