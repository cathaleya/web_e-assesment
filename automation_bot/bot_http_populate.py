#!/usr/bin/env python3
import sys
import random
import math
import json
import time

try:
    import requests
except ImportError:
    print("Error: Library 'requests' tidak ditemukan. Silakan jalankan 'pip install requests' terlebih dahulu.")
    sys.exit(1)

# Daftar Nama Mahasiswa Indonesia untuk Simulasi Realistis
FIRST_NAMES = [
    "Ahmad", "Muhammad", "Rian", "Dwi", "Eko", "Budi", "Adi", "Agus", "Hendra", "Fauzi",
    "Siti", "Sri", "Dewi", "Indah", "Putri", "Lestari", "Mega", "Kartika", "Rina", "Dian",
    "Fikri", "Rangga", "Gilang", "Rizky", "Aditya", "Roni", "Yusuf", "Dimas", "Denny", "Aris",
    "Anisa", "Amalia", "Fitri", "Nanda", "Aulia", "Intan", "Nisa", "Rahma", "Wulan", "Sari"
]

LAST_NAMES = [
    "Fauzi", "Hidayat", "Prasetyo", "Santoso", "Wibowo", "Saputra", "Kurniawan", "Setiawan", "Utomo", "Nugroho",
    "Lestari", "Aminah", "Rahayu", "Fitriani", "Sari", "Utami", "Pertiwi", "Handayani", "Hartati", "Mulyani",
    "Arifin", "Subagyo", "Gunawan", "Susanto", "Budiman", "Syahputra", "Baskoro", "Wicaksono", "Pamungkas", "Siregar"
]

CAMPUSES = [
    "Universitas Negeri Jakarta (UNJ)",
    "Universitas Muhammadiyah Prof. DR. HAMKA (UHAMKA)",
    "Universitas Katolik Indonesia Atma Jaya (ATMAJAYA)"
]

GENDERS = ["Laki-laki", "Perempuan"]

# Fungsi Box-Muller transform untuk distribusi normal
def random_normal(mean=0.0, std_dev=1.0):
    u1 = 1.0 - random.random()
    u2 = 1.0 - random.random()
    rand_std_normal = math.sqrt(-2.0 * math.log(u1)) * math.sin(2.0 * math.pi * u2)
    return mean + std_dev * rand_std_normal

def clamp(val, min_val, max_val):
    return max(min_val, min(max_val, val))

def generate_covariance_scores():
    # Menghasilkan skor variabel laten berdasarkan model jalur CB-SEM teoretis MADEL5C:
    # C1 (Context) -> C2 (Communication)
    # C1 (Context) -> C3 (Collaboration)
    # C2 (Communication) -> C4 (Creation)
    # C3 (Collaboration) -> C4 (Creation)
    # C4 (Creation) -> C5 (Critical Thinking)
    
    # 1. C1 (Context): Baseline score (skala 1 - 5)
    c1 = random_normal(3.8, 0.5)
    c1 = clamp(c1, 1.0, 5.0)
    
    # 2. C2 (Communication): Dipengaruhi C1 (beta = 0.65)
    c2 = 0.65 * (c1 - 3.8) + 3.8 + random_normal(0, 0.4)
    c2 = clamp(c2, 1.0, 5.0)
    
    # 3. C3 (Collaboration): Dipengaruhi C1 (beta = 0.58)
    c3 = 0.58 * (c1 - 3.8) + 3.8 + random_normal(0, 0.4)
    c3 = clamp(c3, 1.0, 5.0)
    
    # 4. C4 (Creation): Dipengaruhi C2 (0.42) & C3 (0.48)
    c4 = 0.42 * (c2 - 3.8) + 0.48 * (c3 - 3.8) + 3.8 + random_normal(0, 0.3)
    c4 = clamp(c4, 1.0, 5.0)
    
    # 5. C5 (Critical Thinking): Dipengaruhi C4 (0.72) & C1 (0.35)
    c5 = 0.72 * (c4 - 3.8) + 0.35 * (c1 - 3.8) + 3.8 + random_normal(0, 0.3)
    c5 = clamp(c5, 1.0, 5.0)
    
    return [c1, c2, c3, c4, c5]

def generate_participant_data(idx):
    # 1. Identitas Responden
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    
    # Hindari nama duplikat persis jika digenerasi berdekatan
    name = f"{first_name} {last_name} {idx}" 
    campus = random.choice(CAMPUSES)
    gender = random.choice(GENDERS)
    
    # 2. Ambil skor laten laten dengan covariance terstruktur
    c_scores = generate_covariance_scores()
    
    # 3. Generasi data PDI-DL (20 Butir, 4 butir per dimensi)
    pdi_answers = {}
    pdi_total = 0
    # Map dimensi: C1 (0-3), C2 (4-7), C3 (8-11), C4 (12-15), C5 (16-19)
    for q_idx in range(20):
        dim_idx = q_idx // 4
        c_val = c_scores[dim_idx]
        score = round(c_val + random_normal(0, 0.5))
        score = clamp(score, 1, 5)
        pdi_answers[str(q_idx)] = score
        pdi_total += score
        
    # 4. Generasi data MADEL5C (75 Butir, 15 butir per dimensi)
    madel_answers = {}
    madel_total = 0
    # Map dimensi: C1 (0-14), C2 (15-29), C3 (30-44), C4 (45-59), C5 (60-74)
    for q_idx in range(75):
        dim_idx = q_idx // 15
        c_val = c_scores[dim_idx]
        score = round(c_val + random_normal(0, 0.5))
        score = clamp(score, 1, 5)
        madel_answers[str(q_idx)] = score
        madel_total += score
        
    # 5. Generasi data Survey/SUS (10 Butir, evaluasi kepuasan sistem)
    survey_answers = {}
    survey_total_score = 0
    # Skor kepuasan umumnya cenderung tinggi (asumsi sistem dinilai bagus, mean = 4.2)
    for q_idx in range(10):
        score = round(random_normal(4.2, 0.6))
        score = clamp(score, 1, 5)
        survey_answers[str(q_idx)] = score
        
        q_num = q_idx + 1
        if q_num % 2 != 0:
            survey_total_score += (score - 1)
        else:
            survey_total_score += (5 - score)
            
    feedbacks = [
        "Antarmuka sangat modern dan responsif.",
        "Sistem visualisasinya sangat membantu memahami skor.",
        "Pengisian bertahap MADEL5C membuat tidak lelah.",
        "Sangat bagus, pendaftaran dan pengisian sangat mulus.",
        "Desain dashboard-nya premium dan cepat sekali loadingnya.",
        "Bagus sekali untuk penelitian evaluasi digital.",
        "Petunjuk instrumennya sangat jelas."
    ]
    feedback = random.choice(feedbacks)
    
    return {
        "name": name,
        "campus": campus,
        "gender": gender,
        "pdi_total": pdi_total,
        "pdi_answers": pdi_answers,
        "madel_total": madel_total,
        "madel_answers": madel_answers,
        "survey_total": survey_total_score,
        "survey_answers": survey_answers,
        "feedback": feedback
    }

def main():
    print("====================================================")
    print("   AUTOMATION BOT - PLATFORM PENGISIAN HDAP         ")
    print("====================================================")
    
    # Parameter default
    BASE_URL = "http://localhost:3000"
    NUM_USERS = 100
    
    # Baca argumen command line
    if len(sys.argv) > 1:
        if sys.argv[1].startswith("http"):
            BASE_URL = sys.argv[1].rstrip('/')
        else:
            try:
                NUM_USERS = int(sys.argv[1])
            except ValueError:
                pass
                
    if len(sys.argv) > 2:
        try:
            NUM_USERS = int(sys.argv[2])
        except ValueError:
            pass
            
    print(f"Target Base URL: {BASE_URL}")
    print(f"Jumlah Responden: {NUM_USERS} user")
    print("Mulai mengisi instrumen...")
    print("----------------------------------------------------")
    
    success_count = 0
    
    for i in range(1, NUM_USERS + 1):
        participant = generate_participant_data(i)
        
        try:
            # Step 1: Registrasi User
            reg_url = f"{BASE_URL}/api/auth"
            reg_data = {
                "name": participant["name"],
                "campus": participant["campus"],
                "gender": participant["gender"]
            }
            reg_res = requests.post(reg_url, json=reg_data, timeout=10)
            if reg_res.status_code != 200:
                print(f"[{i}/{NUM_USERS}] Gagal register {participant['name']}: {reg_res.text}")
                continue
                
            user_id = reg_res.json().get("userId")
            if not user_id:
                print(f"[{i}/{NUM_USERS}] Gagal mendapatkan userId untuk {participant['name']}")
                continue
                
            # Step 2: Submit PDI-DL
            pdi_url = f"{BASE_URL}/api/assessment"
            pdi_data = {
                "userId": user_id,
                "type": "PDI-DL",
                "totalScore": participant["pdi_total"],
                "answersJson": participant["pdi_answers"]
            }
            pdi_res = requests.post(pdi_url, json=pdi_data, timeout=10)
            if pdi_res.status_code != 200:
                print(f"[{i}/{NUM_USERS}] Gagal submit PDI-DL untuk {participant['name']}: {pdi_res.text}")
                
            # Step 3: Submit MADEL5C
            madel_url = f"{BASE_URL}/api/assessment"
            madel_data = {
                "userId": user_id,
                "type": "MADEL5C",
                "totalScore": participant["madel_total"],
                "answersJson": participant["madel_answers"]
            }
            madel_res = requests.post(madel_url, json=madel_data, timeout=10)
            if madel_res.status_code != 200:
                print(f"[{i}/{NUM_USERS}] Gagal submit MADEL5C untuk {participant['name']}: {madel_res.text}")
                continue
                
            # Step 4: Submit Survey
            survey_url = f"{BASE_URL}/api/survey"
            survey_data = {
                "userId": user_id,
                "totalScore": participant["survey_total"],
                "answersJson": participant["survey_answers"],
                "feedback": participant["feedback"]
            }
            survey_res = requests.post(survey_url, json=survey_data, timeout=10)
            if survey_res.status_code != 200:
                print(f"[{i}/{NUM_USERS}] Gagal submit Survey untuk {participant['name']}: {survey_res.text}")
                continue
                
            success_count += 1
            print(f"[{i}/{NUM_USERS}] SUKSES - {participant['name']} ({participant['campus']}) | PDI: {participant['pdi_total']} | MADEL: {participant['madel_total']} | SUS: {participant['survey_total']}")
            
            # Delay kecil agar server tidak terbebani
            time.sleep(0.05)
            
        except Exception as e:
            print(f"[{i}/{NUM_USERS}] Error sistem pada user {participant['name']}: {e}")
            
    print("----------------------------------------------------")
    print(f"Proses Selesai! Berhasil menginput {success_count} dari {NUM_USERS} responden.")
    print("Data terpopulasi dengan struktur covariance CB-SEM MADEL5C teoretis.")
    print("====================================================")

if __name__ == "__main__":
    main()
