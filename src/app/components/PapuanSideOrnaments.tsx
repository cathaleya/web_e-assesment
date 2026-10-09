"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// TRANSPARENT IMAGE CUTOUT COMPONENT (REMOVES WHITE BACKGROUND PIXELS AUTOMATICALLY)
export function TransparentImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [cleanSrc, setCleanSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setCleanSrc(src);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 215 && g > 215 && b > 215) {
          data[i + 3] = 0;
        } else if (r > 185 && g > 185 && b > 185) {
          const avg = (r + g + b) / 3;
          const factor = (215 - avg) / 30;
          data[i + 3] = Math.max(0, Math.min(255, Math.floor(255 * factor)));
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setCleanSrc(canvas.toDataURL("image/png"));
    };
    img.onerror = () => setCleanSrc(src);
  }, [src]);

  return (
    <img
      src={cleanSrc || src}
      alt={alt}
      className={className}
    />
  );
}

export default function PapuanSideOrnaments() {
  return (
    <>
      {/* PANEL ORNAMEN TIMBUL SISIPAN KIRI: CENDERAWASIH JANTAN & BETINA (ZIG-ZAG), MAHASISWA PAPUA, & TIFA PAPUA */}
      <div className="hidden xl:flex flex-col items-center justify-between fixed left-2 top-4 bottom-4 z-0 pointer-events-none w-56 text-center space-y-1">
        {/* PASANGAN BURUNG CENDERAWASIH (JANTAN & BETINA ZIG-ZAG ATAS KIRI) */}
        <div className="relative w-full flex flex-col items-center">
          {/* CENDERAWASIH JANTAN (UTAMA) */}
          <motion.div
            animate={{
              y: [0, -22, 14, -18, 0],
              x: [0, 16, -14, 18, 0],
              rotate: [-4, 6, -5, 4, -4],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="w-36 lg:w-44 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)] z-10"
          >
            <TransparentImage
              src="/cenderawasih_jantan.png"
              alt="Burung Cenderawasih Jantan Papua"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* CENDERAWASIH BETINA (PENDAMPING) */}
          <motion.div
            animate={{
              y: [0, 14, -18, 12, 0],
              x: [0, -12, 15, -10, 0],
              rotate: [3, -5, 4, -3, 3],
            }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 lg:w-34 h-auto drop-shadow-[0_15px_20px_rgba(0,0,0,0.25)] -mt-6 ml-6 opacity-90"
          >
            <TransparentImage
              src="/cenderawasih_betina.png"
              alt="Burung Cenderawasih Betina Papua"
              className="w-full h-auto object-contain"
            />
          </motion.div>
        </div>

        {/* MAHASISWA CALON GURU PAPUA (TENGAH KIRI) */}
        <div className="my-auto">
          <TransparentImage
            src="/papua_student_male.png"
            alt="Mahasiswa Calon Guru Papua"
            className="w-44 lg:w-52 h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)]"
          />
        </div>

        {/* ANIMASI TIFA PAPUA ZIG-ZAG (BAWAH KIRI) */}
        <motion.div
          animate={{
            y: [0, 16, -12, 15, 0],
            x: [0, -14, 16, -12, 0],
            rotate: [0, 6, -6, 4, 0],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 lg:w-36 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
        >
          <TransparentImage
            src="/tifa_papua.png"
            alt="Alat Musik Tifa Papua"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>

      {/* PANEL ORNAMEN TIMBUL SISIPAN KANAN: CENDERAWASIH JANTAN & BETINA (ZIG-ZAG), PENDIDIK PAPUA, & TIFA PAPUA */}
      <div className="hidden xl:flex flex-col items-center justify-between fixed right-2 top-4 bottom-4 z-0 pointer-events-none w-56 text-center space-y-1">
        {/* PASANGAN BURUNG CENDERAWASIH (JANTAN & BETINA ZIG-ZAG ATAS KANAN - SELARAS) */}
        <div className="relative w-full flex flex-col items-center">
          {/* CENDERAWASIH JANTAN (UTAMA - CERMIN) */}
          <motion.div
            animate={{
              y: [0, 18, -20, 14, 0],
              x: [0, -18, 15, -16, 0],
              rotate: [4, -6, 5, -4, 4],
            }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-36 lg:w-44 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)] z-10"
          >
            <TransparentImage
              src="/cenderawasih_jantan.png"
              alt="Burung Cenderawasih Jantan Papua"
              className="w-full h-auto object-contain -scale-x-100"
            />
          </motion.div>

          {/* CENDERAWASIH BETINA (PENDAMPING - CERMIN) */}
          <motion.div
            animate={{
              y: [0, -16, 18, -14, 0],
              x: [0, 14, -15, 12, 0],
              rotate: [-3, 5, -4, 3, -3],
            }}
            transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 lg:w-34 h-auto drop-shadow-[0_15px_20px_rgba(0,0,0,0.25)] -mt-6 mr-6 opacity-90"
          >
            <TransparentImage
              src="/cenderawasih_betina.png"
              alt="Burung Cenderawasih Betina Papua"
              className="w-full h-auto object-contain -scale-x-100"
            />
          </motion.div>
        </div>

        {/* PENDIDIK MASA DEPAN PAPUA (TENGAH KANAN) */}
        <div className="my-auto">
          <TransparentImage
            src="/papua_student_female.png"
            alt="Pendidik Masa Depan Papua"
            className="w-44 lg:w-52 h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)]"
          />
        </div>

        {/* ANIMASI TIFA PAPUA ZIG-ZAG (BAWAH KANAN - SELARAS) */}
        <motion.div
          animate={{
            y: [0, -14, 18, -12, 0],
            x: [0, 15, -16, 14, 0],
            rotate: [0, -5, 5, -3, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 lg:w-36 h-auto drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]"
        >
          <TransparentImage
            src="/tifa_papua.png"
            alt="Alat Musik Tifa Papua"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>
    </>
  );
}
