"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Menghindari timeout saat build di VPS
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [campus, setCampus] = useState("");
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const [gender, setGender] = useState<string>("");
  const [origin, setOrigin] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState<string>("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (loginType === "student") {
        if (!name || !gender || !campus || !origin || !specialNeeds) {
           setError("Mohon lengkapi semua data identitas!");
           setIsLoading(false);
           return;
        }
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, campus, gender, origin, specialNeeds })
        });
        if (res.ok) {
           const data = await res.json();
           localStorage.setItem("userId", data.userId);
           localStorage.setItem("userName", name);
           localStorage.setItem("userGender", gender);
           localStorage.setItem("userCampus", campus);
           localStorage.setItem("userOrigin", origin);
           localStorage.setItem("userSpecialNeeds", specialNeeds);
           router.push("/dashboard");
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.error || "Gagal terhubung.");
          setIsLoading(false);
        }
      } else {
        if (!adminUsername || !adminPassword) {
          setError("Masukkan username dan password.");
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
          setError("Akses ditolak.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-8 px-4 overflow-x-hidden"
         style={{ backgroundImage: "url('/unj_bg_v2.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      
      <div className="w-full max-w-sm md:max-w-md relative z-10">
        {/* LOGO BRAND TIMBUL */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xl border-b-4 border-amber-700">
            <i className="fa-solid fa-graduation-cap text-[#2E3314] text-3xl md:text-4xl"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] uppercase tracking-tight italic">
            HDAP PORTAL
          </h1>
          <p className="text-[10px] md:text-xs font-black text-amber-300 uppercase tracking-widest drop-shadow">
            E-Assessment System Responden
          </p>
        </div>

        {/* KARTU LOGIN TIMBUL 3D */}
        <div className="card-timbul p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-white/95 backdrop-blur-md">
          {/* TAB RESPONDEN / ADMIN TIMBUL */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200 shadow-inner">
            <button 
              type="button"
              onClick={() => setLoginType("student")} 
              className={`flex-1 py-2.5 md:py-3 text-[10px] md:text-xs font-black uppercase rounded-xl transition-all border-b-4 ${
                loginType === "student" 
                  ? "bg-gradient-to-r from-emerald-700 to-[#4B5320] text-white border-emerald-950 shadow-md scale-[1.02]" 
                  : "text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              <i className="fa-solid fa-user-graduate mr-1.5"></i> RESPONDEN
            </button>
            <button 
              type="button"
              onClick={() => setLoginType("admin")} 
              className={`flex-1 py-2.5 md:py-3 text-[10px] md:text-xs font-black uppercase rounded-xl transition-all border-b-4 ${
                loginType === "admin" 
                  ? "bg-gradient-to-r from-blue-700 to-indigo-800 text-white border-blue-950 shadow-md scale-[1.02]" 
                  : "text-slate-500 border-transparent hover:text-slate-800"
              }`}
            >
              <i className="fa-solid fa-user-shield mr-1.5"></i> ADMIN
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginType === "student" ? (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider block mb-1 ml-1">
                    Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Masukkan nama lengkap Anda" 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 md:py-3.5 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all shadow-inner" 
                  />
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider block mb-1 ml-1">
                    Nama Kampus / LPTK
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={campus} 
                    onChange={e => setCampus(e.target.value)} 
                    placeholder="Masukkan nama perguruan tinggi / LPTK" 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 md:py-3.5 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all shadow-inner" 
                  />
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider block mb-1 ml-1">
                    Asal Daerah
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={origin} 
                    onChange={e => setOrigin(e.target.value)} 
                    placeholder="Asal Daerah (e.g. Jawa, Sumatera, Bali, dll.)" 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 md:py-3.5 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-emerald-600 focus:bg-white outline-none transition-all shadow-inner" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider block ml-1">
                    Jenis Kelamin
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => setGender("male")} 
                      className={`py-3 rounded-xl border-2 border-b-4 text-[10px] md:text-xs font-black transition-all ${
                        gender === "male" 
                          ? "bg-[#4B5320] border-[#3B4219] border-b-[#2E3314] text-white shadow-md" 
                          : "bg-slate-50 border-slate-200 border-b-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      LAKI-LAKI
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setGender("female")} 
                      className={`py-3 rounded-xl border-2 border-b-4 text-[10px] md:text-xs font-black transition-all ${
                        gender === "female" 
                          ? "bg-[#4B5320] border-[#3B4219] border-b-[#2E3314] text-white shadow-md" 
                          : "bg-slate-50 border-slate-200 border-b-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      PEREMPUAN
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider block ml-1">
                    Berkebutuhan Khusus?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => setSpecialNeeds("ya")} 
                      className={`py-3 rounded-xl border-2 border-b-4 text-[10px] md:text-xs font-black transition-all ${
                        specialNeeds === "ya" 
                          ? "bg-amber-600 border-amber-700 border-b-amber-900 text-white shadow-md" 
                          : "bg-slate-50 border-slate-200 border-b-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      YA
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSpecialNeeds("tidak")} 
                      className={`py-3 rounded-xl border-2 border-b-4 text-[10px] md:text-xs font-black transition-all ${
                        specialNeeds === "tidak" 
                          ? "bg-[#4B5320] border-[#3B4219] border-b-[#2E3314] text-white shadow-md" 
                          : "bg-slate-50 border-slate-200 border-b-slate-300 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      TIDAK
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider block mb-1 ml-1">
                    Username Admin
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={adminUsername} 
                    onChange={e => setAdminUsername(e.target.value)} 
                    placeholder="Username Admin" 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 md:py-3.5 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner" 
                  />
                </div>

                <div>
                  <label className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wider block mb-1 ml-1">
                    Password
                  </label>
                  <input 
                    type="password" 
                    required 
                    value={adminPassword} 
                    onChange={e => setAdminPassword(e.target.value)} 
                    placeholder="Password Admin" 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 md:py-3.5 px-4 text-xs md:text-sm text-slate-900 font-bold focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner" 
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-black text-center animate-shake">
                <i className="fa-solid fa-triangle-exclamation mr-1.5"></i> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full font-black py-4 md:py-4.5 rounded-2xl text-white shadow-xl uppercase text-xs tracking-widest mt-6 border-b-4 transition-all active:scale-95 ${
                loginType === "student" 
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border-emerald-950" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 border-blue-950"
              }`}
            >
              {isLoading ? "MEMPROSES DATA..." : "MASUK PORTAL <i className='fa-solid fa-arrow-right ml-1.5'></i>"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
