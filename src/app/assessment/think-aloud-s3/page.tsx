"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";

type Lang = "id" | "en";

interface LocalizedString {
  id: string;
  en: string;
}

interface LocalizedOption {
  text: LocalizedString;
  score: number;
}

interface S3Question {
  id: number;
  sjtId: string;
  no: number;
  dim: LocalizedString;
  theme: LocalizedString;
  title: LocalizedString;
  scenario: LocalizedString;
  options: LocalizedOption[];
  probing1: LocalizedString;
  probing2: LocalizedString;
  probing3: LocalizedString;
}

// 15 BUTIR STRATEGIS BILINGUAL (INDONESIA & ENGLISH) KHUSUS PASCASARJANA (S2 & S3)
// 10 Butir Autentik dari Dokumen Resmi vps_version/S3 + 5 Butir Pelengkap Pascasarjana MADEL5C
const S3_QUESTIONS_DATA: S3Question[] = [
  {
    id: 1,
    sjtId: "TA_01",
    no: 1,
    dim: {
      id: "C1 — Contextual Understanding & Verification",
      en: "C1 — Contextual Understanding & Verification",
    },
    theme: {
      id: "Verifikasi Sitasi & Halusinasi AI Generatif",
      en: "Citation Verification & Generative AI Hallucination",
    },
    title: {
      id: "Rujukan dari AI yang Tidak Ditemukan",
      en: "Missing References from Generative AI (Hallucinated Citations)",
    },
    scenario: {
      id: "Anda memakai asisten AI generatif untuk menyusun tinjauan pustaka naskah akademik. AI menghasilkan teks yang rapi dan meyakinkan dengan 12 rujukan lengkap berisi nama penulis, tahun, dan tautan DOI. Namun, saat Anda menelusuri lima di antaranya pada basis data jurnal bereputasi, tiga rujukan ternyata tidak pernah ada (halusinasi AI) dan satu rujukan muncul dengan judul yang sama sekali berbeda. Naskah tersebut dijadwalkan harus dikirimkan kepada promotor besok pagi.\n\nApa yang Anda lakukan terhadap teks dan rujukan tersebut?",
      en: "You use a generative AI assistant to synthesize a literature review for an academic manuscript. The AI generates a fluent, convincing narrative with 12 complete references including author names, publication years, and DOI links. However, when you verify five of them in indexed scholarly databases (Scopus/Web of Science), three citations are completely non-existent (AI hallucinations) and one appears under an entirely different title. The manuscript is scheduled to be submitted to your dissertation promoter tomorrow morning.\n\nWhat do you do with the text and references?",
    },
    options: [
      {
        text: {
          id: "Menghapus seluruh rujukan yang tidak dapat diverifikasi dan menulis ulang bagian tersebut menggunakan rujukan primer yang valid dari basis data terindeks (Scopus/Web of Science), meskipun harus meminta izin perpanjangan tenggat waktu.",
          en: "Remove all unverified references and rewrite the relevant sections using verified primary sources from indexed databases (Scopus/WoS), even if it requires requesting a deadline extension.",
        },
        score: 5,
      },
      {
        text: {
          id: "Mengganti rujukan palsu tersebut dengan rujukan nyata yang topiknya mendekati, namun tetap mempertahankan alur teks sintesis hasil buatan AI.",
          en: "Replace the fake citations with real references covering similar topics, while preserving the AI-generated synthetic narrative to meet the submission deadline.",
        },
        score: 3,
      },
      {
        text: {
          id: "Mengirimkan naskah apa adanya kepada promotor sambil melampirkan catatan kaki bahwa beberapa referensi AI masih dalam proses penelusuran manual.",
          en: "Send the manuscript as-is to your promoter with a footnote indicating that several AI-generated DOIs are still pending manual verification.",
        },
        score: 2,
      },
      {
        text: {
          id: "Meminta bantuan rekan sesama mahasiswa doktoral untuk mencarikan teks lengkap rujukan tersebut di repositori kampus lain tanpa memverifikasi keaslian DOI.",
          en: "Ask fellow doctoral students to locate the full text of those references in other institutional repositories without verifying DOI validity.",
        },
        score: 2,
      },
      {
        text: {
          id: "Menunda pengiriman draf hingga promotor menagih progres, lalu menjelaskan bahwa asisten AI mengalami kekeliruan sitasi.",
          en: "Postpone sending the manuscript until the promoter inquires about progress, then explain that the AI assistant experienced citation inaccuracies.",
        },
        score: 1,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Apa masalah utama dalam situasi ini, mengapa Anda memilih tindakan tersebut, dan bagaimana prosedur Anda biasanya dalam memverifikasi keabsahan rujukan ilmiah?",
      en: "What is the primary dilemma in this situation, why did you choose that course of action, and what is your typical procedure for verifying scholarly citation authenticity?",
    },
    probing3: {
      id: "Pernahkah Anda atau rekan Anda menghadapi situasi serupa? Apakah situasi ini realistis bagi mahasiswa S3 calon dosen, dan dukungan apa yang masih Anda perlukan?",
      en: "Have you or your peers ever encountered a similar situation? Is this scenario realistic for doctoral candidates preparing to become university lecturers, and what institutional support is needed?",
    },
  },
  {
    id: 2,
    sjtId: "TA_02",
    no: 2,
    dim: {
      id: "C2 — Communication & Academic Ethics",
      en: "C2 — Communication & Academic Ethics",
    },
    theme: {
      id: "Etika Kepengarangan & Gift Authorship",
      en: "Authorship Ethics & Gift Authorship",
    },
    title: {
      id: "Tawaran Nama sebagai Penulis Kedua",
      en: "Offer for Co-Authorship Without Contribution (Gift Authorship)",
    },
    scenario: {
      id: "Seorang dosen senior yang berpengaruh di kampus Anda menawarkan bantuan untuk mengurus proses korespondensi dan negosiasi ke sebuah jurnal terakreditasi internasional, dengan syarat namanya wajib dicantumkan sebagai penulis kedua (co-author). Dalam kenyataannya, beliau sama sekali tidak terlibat dalam perumusan gagasan, perancangan metodologi, pengumpulan data, maupun penulisan naskah penelitian Anda.\n\nBagaimana Anda menanggapi tawaran ini?",
      en: "An influential senior professor at your university offers to facilitate the journal submission and correspondence process for an international indexed journal, on the condition that their name must be listed as the second author (co-author). In reality, the professor was not involved in conceptualizing the research design, developing methodology, gathering data, or drafting the manuscript.\n\nHow do you respond to this offer?",
    },
    options: [
      {
        text: {
          id: "Menolak tawaran secara santun dan profesional dengan menjelaskan standar integritas kepengarangan (COPE/ICMJE), serta menawarkan apresiasi kontribusi beliau pada bagian Acknowledgements (Ucapan Terima Kasih).",
          en: "Politely decline the offer by referencing established scholarly authorship guidelines (COPE/ICMJE), and offer to acknowledge their institutional support in the Acknowledgements section.",
        },
        score: 5,
      },
      {
        text: {
          id: "Mengajukan kompromi akademik dengan meminta dosen senior tersebut memberikan telaah kritis dan masukan substansial pada draf naskah agar memenuhi kriteria kontribusi intelektual kepengarangan.",
          en: "Propose an academic compromise by requesting the senior professor to provide substantial critical review and intellectual revisions so they meet authentic authorship criteria.",
        },
        score: 4,
      },
      {
        text: {
          id: "Menerima tawaran tersebut demi menjaga relasi hierarkis di kampus dan memperbesar peluang naskah diterima melalui jaringan beliau.",
          en: "Accept the offer to preserve hierarchical department relationships and enhance the manuscript's acceptance likelihood through their academic network.",
        },
        score: 2,
      },
      {
        text: {
          id: "Mengkonsultasikan tawaran ini terlebih dahulu kepada promotor utama untuk meminta arahan etis sebelum memberikan jawaban kepada dosen senior tersebut.",
          en: "Consult your primary promoter first to obtain ethical and institutional guidance before giving a definitive response to the senior professor.",
        },
        score: 4,
      },
      {
        text: {
          id: "Menghindari percakapan langsung dan memilih mengurus korespondensi jurnal secara mandiri secara diam-diam.",
          en: "Avoid direct conversation and quietly proceed with journal correspondence independently to prevent friction.",
        },
        score: 3,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Menurut Anda, apa kriteria ilmiah yang membuat seseorang berhak dicantumkan sebagai penulis artikel jurnal, dan bagaimana Anda menyikapi relasi kuasa dalam penulisan ilmiah?",
      en: "According to your understanding, what academic criteria entitle someone to journal co-authorship, and how do you navigate power dynamics in scholarly publishing?",
    },
    probing3: {
      id: "Apakah praktik 'gift authorship' ini sering Anda jumpai di lingkungan akademik? Bagaimana dampaknya terhadap integritas calon dosen pascasarjana?",
      en: "Is the practice of 'gift authorship' prevalent in your academic sphere? How does it impact the professional integrity of future university faculty members?",
    },
  },
  {
    id: 3,
    sjtId: "TA_03",
    no: 3,
    dim: {
      id: "C3 — Constructive Digital Collaboration",
      en: "C3 — Constructive Digital Collaboration",
    },
    theme: {
      id: "Tata Kelola Repositori, Domain, & Hosting Pihak Ketiga",
      en: "Repository Governance, Domain, & Third-Party Hosting",
    },
    title: {
      id: "Domain dan Repositori atas Nama Pengembang",
      en: "Domain & Code Repository Registered Under Developer's Name",
    },
    scenario: {
      id: "Pengembang perangkat lunak pihak ketiga mengabarkan bahwa aplikasi evaluasi pembelajaran yang Anda pesan sudah selesai dan kini mulai diujicobakan kepada mahasiswa. Saat memeriksa detail teknis, Anda baru menyadari bahwa nama domain, sewa server hosting, dan repositori kode sumber (source code) seluruhnya terdaftar atas nama pribadi pengembang. Anda hanya diberikan akun login dengan hak akses 'admin' terbatas tanpa akses root atau master repository.\n\nApa yang Anda pikirkan dan lakukan?",
      en: "A third-party software developer informs you that your dissertation learning evaluation web application is completed and being piloted with university students. Upon inspecting technical credentials, you discover that the domain name, cloud hosting account, and master Git source code repository are all registered under the developer's personal name. You are only provided a restricted 'admin' user account with limited privileges.\n\nWhat do you think and do?",
    },
    options: [
      {
        text: {
          id: "Segera menegosiasikan serah terima kepemilikan akun domain, master cloud hosting, dan repositori kode sumber resmi kepada akun institusi/Anda sebelum pelunasan pembayaran akhir.",
          en: "Immediately negotiate the transfer of ownership of the domain name, master hosting account, and source code repository to your/university's official account before releasing the final payment.",
        },
        score: 5,
      },
      {
        text: {
          id: "Menyusun addendum kontrak tertulis yang mewajibkan penyerahan seluruh dokumentasi arsitektur sistem dan transfer hak akses penuh (owner/administrator).",
          en: "Draft a formal written contract addendum mandating full architectural documentation transfer and root ownership privileges.",
        },
        score: 4,
      },
      {
        text: {
          id: "Membiarkan pengelolaan teknis tetap dipegang pengembang asalkan aplikasi dapat berjalan stabil dan pengembang menjamin bantuan jika terjadi eror.",
          en: "Allow the developer to maintain technical administration as long as the application runs smoothly and on-call support is guaranteed.",
        },
        score: 2,
      },
      {
        text: {
          id: "Mengunduh cadangan (backup) database yang dapat diakses secara berkala dan meminta unit Pustik/IT kampus mendampingi negosiasi teknis.",
          en: "Regularly download accessible database backups and request the university IT/security unit to assist in technical negotiations.",
        },
        score: 4,
      },
      {
        text: {
          id: "Melaporkan pengembang ke pimpinan fakultas atas dugaan penguasaan aset digital penelitian secara sepihak.",
          en: "Report the developer to the faculty deanery for unilateral unauthorized control of institutional research assets.",
        },
        score: 2,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Apa risiko hukum dan operasional jangka panjang bagi peneliti jika domain dan repositori kode dikuasai sepihak oleh pengembang pihak ketiga?",
      en: "What legal and operational long-term risks confront researchers if domains and repositories are unilaterally controlled by external vendors?",
    },
    probing3: {
      id: "Pengetahuan teknis atau pendampingan legal apa yang paling krusial dibutuhkan oleh mahasiswa pascasarjana saat mengelola proyek aplikasi digital?",
      en: "What technical knowledge or legal institutional counsel is most critical for postgraduate researchers managing digital application projects?",
    },
  },
  {
    id: 4,
    sjtId: "TA_04",
    no: 4,
    dim: {
      id: "C4 — Content Creation & Intellectual Property",
      en: "C4 — Content Creation & Intellectual Property",
    },
    theme: {
      id: "Klausul Kontrak & Kepemilikan Hak Cipta Perangkat Lunak",
      en: "Contractual Clauses & Software Copyright Ownership",
    },
    title: {
      id: "Kontrak Pengembangan Aplikasi dari Gagasan Sendiri",
      en: "Software Development Contract for Original Research Concepts",
    },
    scenario: {
      id: "Anda merancang aplikasi evaluasi pembelajaran digital berbasis disertasi Anda. Seluruh konseptualisasi pedagogis, alur instrumen, dan indikator penilaian sepenuhnya merupakan gagasan orisinal Anda. Seorang programmer menawarkan pembuatan aplikasi dengan biaya terjangkau dan menyodorkan draf surat perjanjian kerja sama sederhana yang hanya memuat klausul nominal biaya dan tenggat waktu penyelesaian (tanpa klausul hak kekayaan intelektual/HKI).\n\nApa yang Anda lakukan sebelum menandatangani kontrak tersebut?",
      en: "You design a digital learning evaluation platform derived from your doctoral dissertation. The pedagogical conceptualization, diagnostic assessment flow, and evaluation rubrics originate entirely from your original scholarship. A web developer offers an affordable building fee and presents a basic contract specifying only price and delivery deadline, omitting all intellectual property (IP) clauses.\n\nWhat do you do before signing this contract?",
    },
    options: [
      {
        text: {
          id: "Menambahkan klausul eksplisit bahwa seluruh hak kekayaan intelektual, hak cipta atas produk, rancangan pedagogis, dan kepemilikan kode sumber program (source code) adalah milik Anda sepenuhnya.",
          en: "Introduce explicit contractual clauses stipulating that all intellectual property, copyright, pedagogical designs, and full source code ownership belong entirely to you upon payment.",
        },
        score: 5,
      },
      {
        text: {
          id: "Membawa draf kontrak tersebut ke Sentra HKI atau bagian hukum kampus untuk ditinjau dan disesuaikan dengan standar perlindungan aset intelektual universitas.",
          en: "Submit the contract draft to the university's Intellectual Property / Legal Center for formal review and standardization.",
        },
        score: 5,
      },
      {
        text: {
          id: "Menandatangani kontrak tersebut secara langsung agar pembuatan prototipe aplikasi segera berjalan mengingat harga yang ditawarkan programmer sangat murah.",
          en: "Sign the contract immediately so prototype construction can start promptly given the affordable pricing.",
        },
        score: 1,
      },
      {
        text: {
          id: "Membuat kesepakatan lisan secara kekeluargaan dengan programmer bahwa karya tersebut adalah hak milik disertasi Anda.",
          en: "Make an informal verbal agreement with the developer that the software remains your dissertation property.",
        },
        score: 2,
      },
      {
        text: {
          id: "Menunda pembuatan aplikasi dan memilih belajar memprogram sendiri secara otodidak untuk menghindari sengketa hak cipta.",
          en: "Postpone development and attempt to self-teach programming to avoid intellectual property disputes.",
        },
        score: 2,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Menurut pemahaman Anda, setelah sebuah aplikasi selesai dan dibayar lunas, siapa yang secara hukum berhak atas kode program dan rancangan tersebut jika tidak ada klausul tertulis?",
      en: "In your understanding, upon software completion and payment, who legally owns the source code and design if no explicit written clause exists?",
    },
    probing3: {
      id: "Seberapa siap Anda sebagai calon dosen dalam menyusun atau menelaah klausul legal terkait hak cipta dan kekayaan intelektual produk digital?",
      en: "How prepared do you feel as a future university lecturer to draft or audit contractual clauses regarding digital intellectual property?",
    },
  },
  {
    id: 5,
    sjtId: "TA_05",
    no: 5,
    dim: {
      id: "C5 — Computational Thinking & Problem Solving",
      en: "C5 — Computational Thinking & Problem Solving",
    },
    theme: {
      id: "Penyelesaian Vendor Lock-in & Kegagalan Sistem",
      en: "Vendor Lock-in Resolution & Source Code Handover",
    },
    title: {
      id: "Pengembang Meminta Biaya Tambahan",
      en: "Developer Demanding Extra Licensing Fees (Vendor Lock-in)",
    },
    scenario: {
      id: "Dua tahun lalu aplikasi digital hasil riset Anda dikembangkan oleh sebuah vendor perangkat lunak dan saat ini telah aktif digunakan oleh ratusan mahasiswa di tiga fakultas. Akhir-akhir ini server aplikasi sering mengalami crash/down dan Anda berencana memindahkan pemeliharaan ke pengembang baru yang lebih responsif. Namun, pengembang awal menolak menyerahkan repositori dan kode sumber kecuali Anda membayar biaya lisensi tambahan yang besar, sementara kontrak awal tidak memiliki klausul serah terima kode.\n\nApa langkah strategis Anda?",
      en: "Two years ago, your research application was built by an external software vendor and is currently utilized by hundreds of students across three faculties. Recently, the server has experienced frequent downtime and crashes, prompting you to migrate maintenance to a more responsive vendor. However, the original developer refuses to release the source code repository unless an exorbitant licensing fee is paid, while the initial contract lacked a code handover clause.\n\nWhat is your strategic move?",
    },
    options: [
      {
        text: {
          id: "Mengumpulkan seluruh rekam jejak percakapan, bukti pembayaran, dan spesifikasi awal, lalu meminta mediasi resmi melalui pimpinan fakultas atau konsultan hukum institusi.",
          en: "Compile all communication records, payment receipts, and original specifications, then request institutional legal mediation through university leadership.",
        },
        score: 5,
      },
      {
        text: {
          id: "Menegosiasikan biaya kompromi yang wajar untuk serah terima paket kode sumber final demi kelangsungan operasional perkuliahan di tiga fakultas.",
          en: "Negotiate a reasonable compromise fee to obtain the final source code package to ensure academic continuity across the three faculties.",
        },
        score: 4,
      },
      {
        text: {
          id: "Merekrut pengembang baru untuk membangun ulang sistem (re-engineering) dari nol berdasarkan arsitektur dan basis data yang ada.",
          en: "Hire a new development team to re-engineer the system from scratch using existing database structures and workflows.",
        },
        score: 3,
      },
      {
        text: {
          id: "Mengajukan somasi hukum kepada vendor atas dasar pengabaian layanan publik dan ancaman kelangsungan sistem pendidikan kampus.",
          en: "Issue a formal legal notice alleging public service disruption and threat to university educational operations.",
        },
        score: 3,
      },
      {
        text: {
          id: "Menyerah dan tetap terikat dengan vendor lama meskipun kinerja server buruk untuk menghindari konflik.",
          en: "Yield to the original vendor and remain with their poor maintenance service to avoid conflict.",
        },
        score: 1,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Apa langkah investigasi awal yang perlu Anda lakukan sebelum berhadapan dengan vendor yang menolak menyerahkan kode sumber (vendor lock-in)?",
      en: "What preliminary factual audit should a researcher perform before confronting a vendor who refuses to release source code (vendor lock-in)?",
    },
    probing3: {
      id: "Bagaimana institusi pascasarjana seharusnya mempersiapkan mahasiswa doktoral agar terhindar dari jebakan vendor lock-in dalam riset terapan?",
      en: "How should postgraduate programs equip doctoral candidates to prevent vendor lock-in traps during applied educational research?",
    },
  },
  {
    id: 6,
    sjtId: "TA_06",
    no: 6,
    dim: {
      id: "C1 — Contextual Understanding & Verification",
      en: "C1 — Contextual Understanding & Verification",
    },
    theme: {
      id: "Tata Kelola Kepemilikan Data Riset Hibah Bersama",
      en: "Data Governance & Funded Research Asset Ownership",
    },
    title: {
      id: "Data Proyek Bersama yang Ingin Dipakai Teman",
      en: "Grant Project Dataset Requested by Peer for Personal Publication",
    },
    scenario: {
      id: "Anda dipercaya mengelola basis data survei skala besar dari proyek riset hibah yang dipimpin oleh promotor Anda. Seorang rekan sesama mahasiswa S3 meminta salinan basis data tersebut untuk diolah menjadi artikel jurnal pribadinya tanpa melibatkan promotor, dengan alasan: 'Toh datanya ada di laptopmu dan kita bisa saling bantu sesama mahasiswa S3 agar cepat lulus.'\n\nBagaimana Anda menanggapi ajakan tersebut?",
      en: "You are entrusted with managing a large-scale survey dataset from a government research grant led by your doctoral promoter. A fellow doctoral peer asks for a copy of the raw dataset to analyze for their independent journal article without involving your promoter, arguing: 'The data is already on your laptop, and we should help each other graduate quickly.'\n\nHow do you handle this request?",
    },
    options: [
      {
        text: {
          id: "Menolak memberikan data secara tegas dan menjelaskan bahwa data survei tersebut merupakan aset terikat proyek hibah yang memerlukan izin resmi dari Ketua Tim Peneliti (Promotor).",
          en: "Firmly decline to share the dataset, explaining that funded project data requires formal written authorization from the Principal Investigator (Promoter).",
        },
        score: 5,
      },
      {
        text: {
          id: "Mengajak rekan tersebut menghadap bersama promotor untuk memaparkan proposal analisis lanjutannya dan memohon izin penggunaan data sekunder secara etis.",
          en: "Invite the peer to meet with your promoter together to present their secondary analysis proposal and request ethical data access.",
        },
        score: 5,
      },
      {
        text: {
          id: "Memberikan sebagian kecil variabel data yang tidak sensitif dengan syarat nama Anda dicantumkan sebagai penulis kedua di artikelnya.",
          en: "Share non-sensitive variables on the condition that your name is included as second author on their publication.",
        },
        score: 2,
      },
      {
        text: {
          id: "Memberikan data secara diam-diam asalkan rekan tersebut berjanji mengubah konteks judul dan lokasi penelitian.",
          en: "Disclose the data discreetly as long as the peer promises to disguise research variables and location.",
        },
        score: 1,
      },
      {
        text: {
          id: "Menghindari rekan tersebut dan menyarankan agar ia mengambil data survei sendiri dari lapangan.",
          en: "Avoid the peer and suggest they collect their own primary empirical data from the field.",
        },
        score: 3,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Secara hukum etika penelitian, siapa sesungguhnya pemilik data riset yang didanai hibah, dan apa konsekuensi jika data tersebut disalahgunakan tanpa izin ketua peneliti?",
      en: "Under research governance principles, who officially owns grant-funded empirical data, and what are the repercussions of unauthorized secondary dissemination?",
    },
    probing3: {
      id: "Bagaimana Anda memelihara batas profesionalisme dan integritas data ketika menghadapi tekanan sosial atau relasi pertemanan di jenjang pascasarjana?",
      en: "How do you preserve professional boundaries and data stewardship when confronting collegial peer pressure in postgraduate education?",
    },
  },
  {
    id: 7,
    sjtId: "TA_07",
    no: 7,
    dim: {
      id: "C2 — Communication & Academic Ethics",
      en: "C2 — Communication & Academic Ethics",
    },
    theme: {
      id: "Negosiasi Profesional Hak Akses Kode & Dokumentasi",
      en: "Professional Negotiation for Technical Documentation & Code",
    },
    title: {
      id: "“Itu Dapur Kami”",
      en: "“That's Our Secret Kitchen”: Proprietary Code Evasion",
    },
    scenario: {
      id: "Anda sedang bernegosiasi dengan seorang pengembang perangkat lunak independen untuk membuat platform latihan interaktif hasil riset Anda. Ketika Anda menanyakan komitmen penyerahan kode sumber (source code) dan buku dokumentasi arsitektur sistem, pihak pengembang menjawab: 'Itu adalah dapur rahasia kami. Yang penting bagi Anda aplikasinya jalan lancar; kalau ada eror nanti tinggal telepon kami.'\n\nBagaimana Anda menanggapi jawaban tersebut dan melanjutkan negosiasi?",
      en: "During negotiations with a freelance software developer to build your interactive assessment platform, you inquire about source code delivery and architecture documentation. The developer replies: 'That is our proprietary secret kitchen. What matters to you is that the web app runs smoothly; if errors arise, just call us.'\n\nHow do you address this response and proceed?",
    },
    options: [
      {
        text: {
          id: "Menjelaskan secara lugas bahwa sebagai luaran penelitian akademik dan aset perguruan tinggi, keterbukaan kode dan dokumentasi sistem adalah prasyarat mutlak yang tidak dapat dikompromikan.",
          en: "Explain diplomatically that as an academic research output and institutional asset, code transparency and technical documentation are non-negotiable requirements.",
        },
        score: 5,
      },
      {
        text: {
          id: "Menolak melanjutkan kerja sama dan mencari pengembang lain yang mematuhi standar transparansi kode dan bersedia menyerahkan source code penuh.",
          en: "Terminate negotiations and seek an alternative developer who adheres to code transparency and full source code handover.",
        },
        score: 4,
      },
      {
        text: {
          id: "Menerima alasan pengembang tersebut karena menganggap kode program memang hak rahasia dagang profesional programmer.",
          en: "Accept the developer's rationale, considering source code to be the programmer's proprietary trade secret.",
        },
        score: 1,
      },
      {
        text: {
          id: "Mengusulkan klausul perjanjian kerahasiaan (Non-Disclosure Agreement / NDA) agar pengembang merasa aman menyerahkan dokumentasi dan kode kepada peneliti.",
          en: "Propose a Non-Disclosure Agreement (NDA) so the developer feels protected when transferring code and documentation.",
        },
        score: 4,
      },
      {
        text: {
          id: "Meminta bantuan konsultan IT fakultas untuk memimpin proses negosiasi teknis dengan bahasa yang lebih tegas.",
          en: "Request university IT staff to participate in and lead the technical negotiation.",
        },
        score: 4,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Kalimat komunikasi seperti apa yang akan Anda sampaikan untuk membongkar dalih 'dapur rahasia' pengembang tanpa memicu pertengkaran?",
      en: "What communicative phrasing would you employ to deconstruct the vendor's 'secret kitchen' excuse without escalating confrontation?",
    },
    probing3: {
      id: "Mengapa kemampuan negosiasi kontrak teknologi menjadi salah satu kecakapan literasi digital yang vital bagi calon dosen di era modern?",
      en: "Why has technological contractual negotiation become an indispensable digital literacy competency for 21st-century academics?",
    },
  },
  {
    id: 8,
    sjtId: "TA_08",
    no: 8,
    dim: {
      id: "C3 — Constructive Digital Collaboration",
      en: "C3 — Constructive Digital Collaboration",
    },
    theme: {
      id: "Konflik Kepemilikan HKI Produk Disertasi",
      en: "Institutional IP Conflicts & Dissertation Product Rights",
    },
    title: {
      id: "Aplikasi Disertasi: Milik Siapa?",
      en: "Dissertation Application: Who Owns the Intellectual Property?",
    },
    scenario: {
      id: "Aplikasi pembelajaran hasil inovasi disertasi doktoral Anda mulai diimplementasikan di dua fakultas. Pimpinan program studi menuntut agar hak cipta aplikasi dicatatkan atas nama aset institusi kampus karena Anda menempuh studi dengan beasiswa dan memakai fasilitas universitas. Di saat bersamaan, promotor Anda menuntut namanya dicantumkan sebagai Pencipta Pertama (Utama). Padahal seluruh gagasan awal, rancangan pedagogis, dan pengembangan sistem murni inisiatif Anda.\n\nBagaimana Anda menyelesaikan konflik kewenangan kepemilikan aset ini?",
      en: "Your dissertation learning platform is being deployed across two university faculties. Department leadership demands that copyright be assigned to the university because you studied under an institutional scholarship and used campus servers. Simultaneously, your promoter insists on being named the Lead Creator (Primary Author), despite the original conceptualization and system development being entirely your initiative.\n\nHow do you address this institutional authority conflict?",
    },
    options: [
      {
        text: {
          id: "Memfasilitasi forum mediasi resmi bersama Sentra HKI kampus untuk merumuskan formulasi pencatatan HKI proporsional: Mahasiswa sebagai Pencipta Utama, Promotor sebagai Pendamping, dan Universitas sebagai Pemegang Hak Cipta.",
          en: "Facilitate a formal tripartite mediation with the University IP Center to establish an equitable IP registration structure: Student as Lead Creator (Moral Rights), Promoter as Co-Creator, and University as Copyright Holder.",
        },
        score: 5,
      },
      {
        text: {
          id: "Mendaftarkan hak cipta secara pribadi ke DJKI terlebih dahulu secara sepihak sebelum pihak kampus dan promotor mengajukan permohonan.",
          en: "Unilaterally file for personal copyright with the national IP office before the university or promoter can act.",
        },
        score: 2,
      },
      {
        text: {
          id: "Menyerahkan seluruh hak cipta kepada kampus dan promotor demi kelancaran ujian promosi doktor dan menghindari friksi relasi akademik.",
          en: "Surrender all copyright claims to the university and promoter to avoid conflict and ensure a smooth dissertation defense.",
        },
        score: 2,
      },
      {
        text: {
          id: "Menolak kedua tuntutan dengan mengutip regulasi perundang-undangan bahwa hak moral pencipta tidak dapat dialihkan oleh institusi mana pun.",
          en: "Reject both demands by citing statutory copyright law that an author's moral rights cannot be involuntarily alienated.",
        },
        score: 4,
      },
      {
        text: {
          id: "Menghentikan pengembangan aplikasi agar tidak diperebutkan oleh berbagai pihak di kampus.",
          en: "Cease software maintenance so that the product is no longer contested among parties.",
        },
        score: 1,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Sejauh mana Anda memahami perbedaan antara 'Hak Moral Pencipta' dengan 'Hak Ekonomi/Pemegang Hak Cipta' dalam konteks produk riset perguruan tinggi?",
      en: "To what extent do you understand the statutory distinction between an author's Moral Rights versus an Economic Copyright Holder in university research outputs?",
    },
    probing3: {
      id: "Bagaimana institusi pendidikan pascasarjana dapat membangun regulasi internal yang adil untuk melindungi hak kekayaan intelektual mahasiswa bimbingan?",
      en: "How can graduate institutions design fair governance bylaws that protect student researchers' intellectual ownership?",
    },
  },
  {
    id: 9,
    sjtId: "TA_09",
    no: 9,
    dim: {
      id: "C4 — Content Creation & Intellectual Property",
      en: "C4 — Content Creation & Intellectual Property",
    },
    theme: {
      id: "Transparansi Penggunaan AI & Hak Cipta Penerbitan",
      en: "AI Disclosure, Originality Warranties, & Publisher Policies",
    },
    title: {
      id: "Buku Ajar dengan Ilustrasi Buatan AI",
      en: "Digital Textbook with Generative AI Illustrations",
    },
    scenario: {
      id: "Anda menulis sebuah draf buku ajar digital inovatif. Untuk mempercantik tampilan visual, Anda memanfaatkan alat AI generatif (Midjourney/DALL-E) untuk membuat seluruh ilustrasi diagram dan konsep, serta memakai ChatGPT untuk memperhalus teks pengantar bab. Pihak penerbit buku menanyakan konfirmasi tertulis apakah seluruh naskah dan ilustrasi merupakan 'karya orisinal' dan terbebas dari sengketa hak cipta pihak ketiga.\n\nBagaimana Anda merespons pertanyaan penerbit dan menyiapkan naskah?",
      en: "You write a digital textbook and utilize generative AI tools (Midjourney/DALL-E) to produce conceptual diagrams, while using ChatGPT to refine chapter introduction texts. The publisher requests written warranty confirming whether the entire manuscript and visuals are 'original works' completely free from third-party copyright claims.\n\nHow do you respond to the publisher and prepare your manuscript?",
    },
    options: [
      {
        text: {
          id: "Menyatakan secara transparan dan tertulis penggunaan alat AI pada bagian kolofon/pengantar naskah, melampirkan dokumentasi prompt, dan memastikan kepatuhan lisensi komersial dari penyedia AI.",
          en: "Formally disclose AI tool usage in the book's colophon/preface, document prompt methodologies, and ensure commercial license compliance.",
        },
        score: 5,
      },
      {
        text: {
          id: "Menyatakan bahwa karya tersebut 100% orisinal ciptaan pribadi tanpa menyebut keterlibatan AI generatif agar proses penerbitan tidak terhambat.",
          en: "Certify the work as 100% human-original without mentioning AI assistance to prevent publication delays.",
        },
        score: 1,
      },
      {
        text: {
          id: "Mengganti seluruh ilustrasi AI dengan foto dokumentasi pribadi berlisensi terbuka Creative Commons (CC-BY) dan menulis ulang teks pengantar secara mandiri.",
          en: "Replace all AI illustrations with personal photographs under Creative Commons (CC-BY) licenses and manually rewrite introductory texts.",
        },
        score: 4,
      },
      {
        text: {
          id: "Meminta penerbit menyediakan klausul adendum khusus mengenai batasan tanggung jawab hukum atas konten hasil generasi kecerdasan buatan.",
          en: "Request the publisher provide a tailored addendum clarifying legal liabilities for AI-assisted scholarship.",
        },
        score: 4,
      },
      {
        text: {
          id: "Menghapus teks pengantar AI namun tetap mempertahankan ilustrasi visual tanpa atribusi apa pun.",
          en: "Remove AI text passages while retaining AI illustrations without attribution.",
        },
        score: 2,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Menurut Anda, siapa pemegang hak cipta atas ilustrasi yang dihasilkan oleh AI generatif, dan mengapa kejujuran akademik mengenai penggunaan AI sangat krusial?",
      en: "In your view, who legally holds copyright over generative AI illustrations, and why is academic transparency regarding AI usage pivotal?",
    },
    probing3: {
      id: "Kebijakan editorial seperti apa yang menurut Anda ideal diterapkan oleh perguruan tinggi terhadap buku ajar yang dibantu teknologi AI?",
      en: "What editorial policies should universities institute regarding AI-assisted textbooks and educational media?",
    },
  },
  {
    id: 10,
    sjtId: "TA_10",
    no: 10,
    dim: {
      id: "C5 — Computational Thinking & Problem Solving",
      en: "C5 — Computational Thinking & Problem Solving",
    },
    theme: {
      id: "Kemandirian Belajar Regulasi HKI & Hilirisasi Inovasi",
      en: "Self-Directed Learning in Patent Filing & Downstream Technology",
    },
    title: {
      id: "Ditugaskan Menyusun Proposal Hilirisasi",
      en: "Assigned to Draft an Innovation Commercialization Proposal",
    },
    scenario: {
      id: "Pimpinan fakultas mengapresiasi produk prototipe digital hasil disertasi Anda dan menugaskan Anda memimpin penyusunan proposal hibah hilirisasi ke kementerian, termasuk pendaftaran paten atau hak cipta produk tersebut dalam tenggat waktu 2 bulan. Anda menyadari bahwa Anda belum pernah memiliki pengalaman mengurus pendaftaran HKI maupun menyusun roadmap komersialisasi teknologi.\n\nBagaimana strategi Anda mempersiapkan diri dan mencari informasi?",
      en: "Faculty leadership commends your digital dissertation prototype and appoints you to lead a ministerial technology downstreaming grant proposal, including filing for patent or copyright registration within a 2-month deadline. You have zero prior experience in patent drafting or technology transfer roadmaps.\n\nWhat is your strategy to prepare yourself and acquire necessary guidance?",
    },
    options: [
      {
        text: {
          id: "Segera proaktif menghubungi Sentra HKI/LPPM kampus untuk pendampingan regulasi, mempelajari panduan e-HakCipta/paten DJKI secara mandiri, dan membentuk tim kerja lintas bidang.",
          en: "Proactively engage the University IP/Technology Transfer Center for regulatory mentorship, self-study official e-Copyright/Patent filing guidelines, and assemble an interdisciplinary team.",
        },
        score: 5,
      },
      {
        text: {
          id: "Membayar biro konsultan eksternal komersial untuk menyelesaikan seluruh dokumen pendaftaran secara kilat tanpa melibatkan proses belajar tim.",
          en: "Contract an expensive external commercial agency to assemble all filing paperwork without engaging the research team.",
        },
        score: 2,
      },
      {
        text: {
          id: "Memohon pengunduran tenggat waktu kepada dekanat dengan dalih materi pendaftaran HKI belum pernah diajarkan pada kurikulum perkuliahan S3.",
          en: "Request a deadline extension from the deanery citing that intellectual property filing is not taught in the doctoral curriculum.",
        },
        score: 1,
      },
      {
        text: {
          id: "Mempelajari berkas proposal hilirisasi milik dosen senior yang pernah lolos hibah dan mengadaptasi sistematika dokumennya secara teliti.",
          en: "Study successful grant proposals from senior faculty members and adapt their organizational frameworks.",
        },
        score: 4,
      },
      {
        text: {
          id: "Mendelegasikan tugas penyusunan proposal HKI kepada asisten peneliti atau mahasiswa bimbingan.",
          en: "Delegate patent proposal assembly to graduate research assistants.",
        },
        score: 2,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Bagian mana dari proses pendaftaran HKI dan hilirisasi yang Anda rasakan paling asing, dan rujukan tepercaya apa yang akan Anda akses pertama kali?",
      en: "Which aspect of the patent registration or technology transfer pipeline feels most unfamiliar to you, and what authoritative resources will you consult first?",
    },
    probing3: {
      id: "Bagaimana Anda melihat relevansi kompetensi pendaftaran HKI dan hilirisasi teknologi bagi karier jangka panjang seorang dosen pascasarjana?",
      en: "How do you assess the strategic value of intellectual property management skills for the long-term career of a university professor?",
    },
  },
  {
    id: 11,
    sjtId: "TA_11",
    no: 11,
    dim: {
      id: "C1 — Contextual Understanding & Verification",
      en: "C1 — Contextual Understanding & Verification",
    },
    theme: {
      id: "Verifikasi Kelayakan Etik & Metrik Open Dataset",
      en: "Open Science Ethics & Data Reusability",
    },
    title: {
      id: "Validasi Kelayakan Etik Basis Data Terbuka (Open Dataset)",
      en: "Ethical Clearance Verification for Public Open Datasets",
    },
    scenario: {
      id: "Untuk menguji model komputasi pada bab analisis disertasi, Anda mengunduh dataset sekunder berskala nasional dari sebuah portal web terbuka. Ketika meneliti berkas metadata, Anda tidak menemukan adanya nomor persetujuan komite etik (Institutional Review Board / IRB) maupun dokumentasi prosedur informed consent dari subjek penelitian di masa lalu.\n\nBagaimana sikap Anda terhadap penggunaan dataset tersebut?",
      en: "To calibrate a computational model for your dissertation analysis, you download a national open dataset from a public data repository. Upon examining metadata, you find no Institutional Review Board (IRB) approval number or documented informed consent procedures from historical subjects.\n\nHow do you handle the utilization of this open dataset?",
    },
    options: [
      {
        text: {
          id: "Menelusuri kontak pengunggah dataset untuk memverifikasi dokumen ethical clearance; jika tidak dapat diverifikasi, beralih ke repositori data ilmiah terakreditasi (Zenodo/Mendeley Data).",
          en: "Contact the dataset repository author to verify ethical clearance documentation; if unavailable, switch to verified certified repositories (Zenodo/Mendeley Data).",
        },
        score: 5,
      },
      {
        text: {
          id: "Tetap menggunakan dataset tersebut karena telah tersedia bebas di internet dan dapat diakses publik tanpa perlu izin khusus.",
          en: "Use the dataset regardless, since it is publicly accessible online without gatekeeping.",
        },
        score: 2,
      },
      {
        text: {
          id: "Menggunakan dataset tersebut semata-mata untuk kalibrasi algoritma awal, bukan sebagai temuan data empiris yang dilaporkan di naskah disertasi.",
          en: "Utilize the dataset solely for preliminary algorithmic testing rather than reporting it as empirical findings in the dissertation.",
        },
        score: 4,
      },
      {
        text: {
          id: "Mengaburkan nama variabel dan identitas institusi pada dataset agar tidak memicu pertanyaan reviewer mengenai izin etik.",
          en: "Anonymize variable names to avoid reviewer inquiries regarding institutional ethics clearance.",
        },
        score: 1,
      },
      {
        text: {
          id: "Menanyakan pertimbangan etik kepada komisi etik kampus mengenai batas legalitas pemanfaatan open data tanpa IRB tertulis.",
          en: "Consult the university research ethics board regarding regulatory standards for secondary open data.",
        },
        score: 5,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Mengapa izin etik (IRB) tetap menjadi isu krusial meskipun data telah diunduh dari repositori publik terbuka?",
      en: "Why does institutional ethical clearance (IRB) remain paramount even when data is retrieved from open-access web repositories?",
    },
    probing3: {
      id: "Seberapa sering isu kelayakan etik dataset terbuka dibahas dalam perkuliahan metodologi penelitian pascasarjana di lingkungan Anda?",
      en: "How frequently are ethical considerations surrounding open-source datasets examined in graduate research methodology curricula?",
    },
  },
  {
    id: 12,
    sjtId: "TA_12",
    no: 12,
    dim: {
      id: "C2 — Communication & Academic Ethics",
      en: "C2 — Communication & Academic Ethics",
    },
    theme: {
      id: "Perlindungan Kerahasiaan Responden vs Permintaan Reviewer",
      en: "Participant Privacy vs Open Science Data Mandates",
    },
    title: {
      id: "Permintaan Unggah Data Rekaman Mentah oleh Reviewer Jurnal",
      en: "Reviewer Mandate for Raw Audio and Unedited Transcripts",
    },
    scenario: {
      id: "Reviewer dari jurnal bereputasi Q1 tempat Anda mengirimkan artikel disertasi memberikan keputusan 'Minor Revision', namun dengan satu syarat wajib: Anda harus mengunggah seluruh rekaman audio wawancara mentah dan transkrip lengkap partisipan ke repositori publik terbuka (Open Science Framework). Padahal lembar persetujuan (informed consent) Anda menjanjikan kerahasiaan penuh kepada partisipan penelitian.\n\nBagaimana Anda merespons tuntutan reviewer tersebut?",
      en: "Reviewers from a top-tier Q1 journal issue a 'Minor Revision' on your dissertation paper, with one non-negotiable mandate: upload all raw interview audio recordings and unedited participant transcripts to an open public repository (OSF). However, your study's Informed Consent explicitly promised strict confidentiality to human subjects.\n\nHow do you address the reviewer's demand?",
    },
    options: [
      {
        text: {
          id: "Menulis tanggapan bantahan ilmiah (rebuttal letter) yang santun dengan mengutip klausul Informed Consent dan kode etik kerahasiaan subjek, serta menawarkan data transkrip yang telah dianonimkan ketat.",
          en: "Write a polite, evidenced rebuttal quoting Informed Consent commitments and subject protection regulations, offering strictly de-identified transcripts with restricted access.",
        },
        score: 5,
      },
      {
        text: {
          id: "Mengunggah seluruh rekaman audio dan transkrip mentah apa adanya demi memastikan artikel lolos terbit di jurnal Q1 impian.",
          en: "Upload raw audio files and unedited transcripts as requested to guarantee acceptance in the target Q1 journal.",
        },
        score: 1,
      },
      {
        text: {
          id: "Menarik naskah (withdrawal) dari jurnal tersebut karena menganggap permintaan reviewer melanggar kode etik riset.",
          en: "Withdraw the manuscript from the journal on ethical grounds.",
        },
        score: 3,
      },
      {
        text: {
          id: "Mengunggah file rekaman yang disamarkan suaranya (voice distortion) tanpa berkonsultasi terlebih dahulu dengan dewan etik kampus.",
          en: "Upload voice-distorted audio files without consulting the university ethics committee.",
        },
        score: 3,
      },
      {
        text: {
          id: "Menghubungi Editor-in-Chief jurnal untuk menjelaskan pertentangan etik antara kebijakan open data jurnal dengan hukum perlindungan data pribadi subjek.",
          en: "Contact the Editor-in-Chief directly to explain the ethical conflict between journal open-data policy and human subject privacy law.",
        },
        score: 5,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Bagaimana Anda menyeimbangkan tuntutan transparansi Open Science dengan kewajiban etis menjaga privasi subjek penelitian kualitatif?",
      en: "How do you reconcile the imperative of Open Science reproducibility with the ethical mandate to protect human participant confidentiality?",
    },
    probing3: {
      id: "Keterampilan argumentasi apa yang paling dibutuhkan oleh calon doktor saat menghadapi permintaan reviewer yang bertentangan dengan komitmen etik?",
      en: "What rhetorical and ethical reasoning skills are most indispensable for doctoral candidates defending confidentiality commitments against reviewer mandates?",
    },
  },
  {
    id: 13,
    sjtId: "TA_13",
    no: 13,
    dim: {
      id: "C3 — Constructive Digital Collaboration",
      en: "C3 — Constructive Digital Collaboration",
    },
    theme: {
      id: "Dual-Licensing Produk Digital Konsorsium Antar-Kampus",
      en: "Collaborative Governance & Public Benefit vs Royalties",
    },
    title: {
      id: "Negosiasi Lisensi Terbuka (Open Access) vs Hak Cipta Komersial",
      en: "Negotiating Dual-Licensing (Open Access vs Commercial) in Consortia",
    },
    scenario: {
      id: "Anda memimpin tim lintas perguruan tinggi dalam mengembangkan sistem modul evaluasi pembelajaran digital adaptif. Mitra dari kampus lain bersikeras mendaftarkan modul tersebut dengan lisensi hak cipta komersial berbayar untuk meraih royalti. Sementara itu, Anda menginginkan lisensi terbuka (Creative Commons CC-BY-NC) agar dapat diakses gratis oleh guru-guru di daerah tertinggal (3T).\n\nBagaimana Anda menyelesaikan perselisihan visi lisensi ini secara konstruktif?",
      en: "You lead a multi-university consortium developing an adaptive digital learning module. Partner university representatives insist on registering commercial proprietary copyright to generate revenue. Conversely, you advocate for an open Creative Commons (CC-BY-NC) license so educators in remote underdeveloped regions (3T) can access it free of charge.\n\nHow do you constructively resolve this licensing disagreement?",
    },
    options: [
      {
        text: {
          id: "Memediasi perbedaan melalui skema lisensi ganda (dual-licensing): lisensi terbuka non-komersial (CC-BY-NC) untuk satuan pendidikan 3T dan lisensi komersial untuk korporasi industri.",
          en: "Broker a dual-licensing compromise: open non-commercial licensing (CC-BY-NC) for schools and educational institutions, paired with commercial licensing for corporate entities.",
        },
        score: 5,
      },
      {
        text: {
          id: "Mengalah dan menyetujui lisensi komersial berbayar demi menjaga keutuhan kerja sama antar-kampus dan menghindari perpecahan konsorsium.",
          en: "Yield to the commercial licensing demand to maintain consortium cohesion and secure royalties.",
        },
        score: 2,
      },
      {
        text: {
          id: "Menarik seluruh materi kontribusi Anda dari modul dan menerbitkannya sendiri secara independen dengan lisensi terbuka.",
          en: "Withdraw your intellectual contributions from the module and publish them independently under an open license.",
        },
        score: 3,
      },
      {
        text: {
          id: "Melibatkan pimpinan LPPM dari kedua universitas untuk merumuskan addendum Nota Kesepahaman (MoU) yang mengakomodasi misi sosial riset.",
          en: "Refer the dispute to research leadership (LPPM) from both institutions to negotiate an official Memorandum of Understanding (MoU).",
        },
        score: 4,
      },
      {
        text: {
          id: "Membocorkan modul tersebut ke forum internet guru agar publik dapat mengunduhnya sebelum sistem berbayar diluncurkan.",
          en: "Publicly leak the module online so teachers can download it before the paywall is erected.",
        },
        score: 1,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Sejauh mana Anda memahami variasi lisensi Creative Commons (CC) dan penerapannya dalam produk kolaborasi akademik?",
      en: "To what extent are you familiar with Creative Commons (CC) licensing tiers and their operational deployment in scholarly collaboration?",
    },
    probing3: {
      id: "Bagaimana strategi Anda dalam mengelola kolaborasi digital agar misi pengabdian masyarakat tidak tergeser oleh motif komersialisasi sepihak?",
      en: "What governance mechanisms help ensure that university social service commitments are not superseded by unilateral commercial motives?",
    },
  },
  {
    id: 14,
    sjtId: "TA_14",
    no: 14,
    dim: {
      id: "C4 — Content Creation & Intellectual Property",
      en: "C4 — Content Creation & Intellectual Property",
    },
    theme: {
      id: "Etika Kepengarangan atas Modul Inovasi Mahasiswa Bimbingan",
      en: "Authorship Ethics in Faculty-Student Collaborative Projects",
    },
    title: {
      id: "Pengakuan Hak Intelektual Fitur Inovasi Mahasiswa Bimbingan",
      en: "Recognizing Mentee Innovation & Algorithm Authorship",
    },
    scenario: {
      id: "Seorang mahasiswa sarjana (S1) yang Anda bimbing berhasil memprogram fitur algoritma penilai esai otomatis yang sangat inovatif saat mengerjakan skripsi di laboratorium Anda. Anda berniat mengintegrasikan algoritma tersebut ke dalam artikel jurnal utama disertasi Anda sebagai luaran wajib kelulusan doktor.\n\nBagaimana Anda menempatkan kontribusi mahasiswa tersebut secara etis dan profesional?",
      en: "An undergraduate mentee in your research lab successfully programs a novel automated essay-grading algorithm for their thesis. You plan to incorporate this algorithm into the primary journal article of your doctoral dissertation as a requisite graduation publication.\n\nHow do you ethically credit the student's contribution?",
    },
    options: [
      {
        text: {
          id: "Menempatkan mahasiswa tersebut sebagai salah satu penulis pendamping (co-author) artikel jurnal dan meminta izin tertulis resmi atas integrasi kode algoritmanya.",
          en: "Include the student as a formal co-author on the journal article and secure written permission to integrate their code into your dissertation publication.",
        },
        score: 5,
      },
      {
        text: {
          id: "Cukup mencantumkan nama mahasiswa pada catatan kaki ucapan terima kasih (Acknowledgements) tanpa hak kepengarangan karena ia berstatus mahasiswa bimbingan Anda.",
          en: "Acknowledge the student in the Acknowledgments section without authorship status because they conducted the work under your supervision.",
        },
        score: 2,
      },
      {
        text: {
          id: "Menempatkan mahasiswa tersebut sebagai penulis pertama (first author) dan Anda sebagai corresponding author jika kontribusi teknis algoritma tersebut mendominasi naskah.",
          en: "Assign the student as first author while you serve as corresponding author if the algorithm represents the primary contribution of the paper.",
        },
        score: 4,
      },
      {
        text: {
          id: "Memberikan imbalan uang sebagai pengganti hak cipta kode program tanpa perlu mencantumkan namanya di artikel jurnal.",
          en: "Provide monetary compensation in exchange for intellectual property rights without author attribution.",
        },
        score: 1,
      },
      {
        text: {
          id: "Mendorong mahasiswa tersebut menerbitkan artikel tersendiri mengenai algoritmanya dan Anda mengutip artikelnya sebagai rujukan primer di disertasi.",
          en: "Support the student to publish their algorithm independently while you cite their publication as a primary reference.",
        },
        score: 5,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "Menurut pandangan etika akademik Anda, di mana batas antara hak dosen pembimbing dengan hak intelektual mahasiswa bimbingan atas karya digital yang dibuat?",
      en: "In your ethical appraisal, where lies the line between mentor supervisory claims versus mentee intellectual ownership over novel algorithms?",
    },
    probing3: {
      id: "Bagaimana pengalaman Anda selama ini dalam memposisikan hak kepengarangan mahasiswa dalam proyek riset dosen?",
      en: "What has been your experience navigating student co-authorship recognition within faculty research pipelines?",
    },
  },
  {
    id: 15,
    sjtId: "TA_15",
    no: 15,
    dim: {
      id: "C5 — Computational Thinking & Problem Solving",
      en: "C5 — Computational Thinking & Problem Solving",
    },
    theme: {
      id: "Mitigasi Insiden Keamanan Siber & Kebocoran Data Responden",
      en: "Cybersecurity Incident Management & Data Protection Compliance",
    },
    title: {
      id: "Respons Insiden Anomali Keamanan & Perlindungan Data Responden",
      en: "Responding to Cyber Security Anomalies & Respondent Data Breaches",
    },
    scenario: {
      id: "Platform website evaluasi digital disertasi Anda saat ini menyimpan data pribadi, profil, dan rekam jejak jawaban asesmen dari 800 guru sekolah dasar. Pagi ini sistem mencatat ribuan upaya login paksa (brute force) dan injeksi data mencurigakan dari alamat IP luar negeri yang berusaha menyalin basis data pengguna. Anda tidak memiliki latar belakang spesialis keamanan siber.\n\nLangkah mitigasi darurat dan sistemik apa yang Anda ambil pertama kali?",
      en: "Your dissertation web assessment platform currently stores personal profiles and test performance data for 800 primary school educators. This morning, server logs reveal thousands of brute-force login attempts and suspicious injection queries originating from foreign IP addresses attempting database exfiltration. You possess no formal cybersecurity background.\n\nWhat immediate and systematic mitigation steps do you take?",
    },
    options: [
      {
        text: {
          id: "Segera mengaktifkan mode pemeliharaan (maintenance mode) untuk memutus akses luar, mengamankan cadangan data terenkripsi, memperbarui kredensial server, dan melapor ke unit Keamanan Siber/Pustik universitas.",
          en: "Immediately trigger maintenance mode to sever external access, secure encrypted backups, rotate server credentials, and report the incident to the university Cybersecurity/IT unit.",
        },
        score: 5,
      },
      {
        text: {
          id: "Membiarkan website tetap online sambil menunggu apakah upaya peretasan tersebut berhasil menembus sistem atau tidak.",
          en: "Leave the platform online to monitor whether the intrusion attempts succeed in breaching the database.",
        },
        score: 1,
      },
      {
        text: {
          id: "Mengunduh database ke laptop pribadi lalu langsung menghapus basis data di server tanpa menganalisis jejak log forensik serangan.",
          en: "Download database records to a personal laptop and delete server databases without conducting forensic log analysis.",
        },
        score: 2,
      },
      {
        text: {
          id: "Mengirim email massal kepanikan kepada 800 guru bahwa data mereka kemungkinan telah bocor sebelum investigasi teknis dipastikan.",
          en: "Broadcast an alarming mass email to all 800 teachers claiming their data was compromised before technical verification.",
        },
        score: 2,
      },
      {
        text: {
          id: "Memasang plugin firewall otomatis secara terburu-buru tanpa memeriksa kompatibilitasnya dengan integritas data penelitian yang sedang berjalan.",
          en: "Install an unvetted firewall plugin without evaluating its impact on live research data integrity.",
        },
        score: 3,
      },
    ],
    probing1: {
      id: "Dengan kata-kata Anda sendiri, situasi ini menceritakan tentang apa, dan seberapa yakin Anda dengan pilihan tindakan Anda (skala 1=Sangat Ragu sampai 5=Sangat Yakin)?",
      en: "In your own words, what is this situation about, and how confident are you in your chosen action (scale 1=Very Unsure to 5=Very Confident)?",
    },
    probing2: {
      id: "SOP darurat apa yang paling esensial dilakukan peneliti untuk menjaga integritas data riset sekaligus mematuhi Undang-Undang Perlindungan Data Pribadi (UU PDP)?",
      en: "What immediate standard operating procedure must researchers execute to safeguard research integrity while complying with Personal Data Protection statutes?",
    },
    probing3: {
      id: "Seberapa krusial pemahaman dasar keamanan siber (cybersecurity literacy) bagi seorang dosen peneliti di era ekosistem riset serba digital?",
      en: "How vital is foundational cybersecurity awareness for modern faculty researchers operating within digital academic ecosystems?",
    },
  },
];

// DIGITAL SIGNATURE CANVAS COMPONENT
function SignaturePad({
  lang,
  onSave,
  onClear,
  currentSignature,
}: {
  lang: Lang;
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
    ctx.strokeStyle = "#4338ca"; // Royal Indigo Ink
  }, []);

  // When currentSignature is updated from outside/upload, render it cleanly onto canvas
  useEffect(() => {
    if (!currentSignature) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
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
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    <div className="space-y-2">
      <div className="relative border-2 border-dashed border-purple-300 rounded-2xl bg-white overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          className="w-full h-40 touch-none cursor-crosshair relative z-10"
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
            <i className="fa-solid fa-signature text-purple-600 text-2xl mb-1"></i>
            <span>
              {lang === "en"
                ? "✍️ Draw your digital signature here (Touchscreen / Mouse / Trackpad) or Upload File Below"
                : "✍️ Goreskan Tanda Tangan Anda di sini (Layar Sentuh HP / Mouse Laptop) atau Unggah Foto TTD di bawah"}
            </span>
          </div>
        )}
        {currentSignature && (
          <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow-md pointer-events-none">
            <i className="fa-solid fa-circle-check"></i>
            <span>{lang === "en" ? "Signature Ready" : "TTD Berhasil Dimuat"}</span>
          </div>
        )}
      </div>

      {/* PREVIEW THUMBNAIL IF SIGNATURE IS ACTIVE */}
      {currentSignature && (
        <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-20 h-10 bg-white border border-purple-300 rounded-lg overflow-hidden flex items-center justify-center shadow-xs p-1">
              <img src={currentSignature} alt="TTD Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <p className="text-[11px] font-black text-purple-950 flex items-center gap-1">
                <i className="fa-solid fa-pen-nib text-purple-700"></i>
                {lang === "en" ? "Digital Signature Active" : "Tanda Tangan Digital Terpasang"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {lang === "en" ? "Ready for Informed Consent verification" : "Siap diverifikasi pada lembar persetujuan (Informed Consent)"}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-black flex items-center gap-1 shrink-0">
            <i className="fa-solid fa-check-double text-emerald-600"></i> {lang === "en" ? "Verified" : "Terverifikasi"}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={clearCanvas}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-700 border border-slate-300 transition active:scale-95 flex items-center gap-1 font-bold"
        >
          <i className="fa-solid fa-rotate-left"></i> {lang === "en" ? "Clear Signature" : "Bersihkan TTD"}
        </button>
        <label className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 cursor-pointer transition active:scale-95 flex items-center gap-1.5 font-bold shadow-xs">
          <i className="fa-solid fa-file-arrow-up text-purple-700"></i>
          <span>{lang === "en" ? "Upload Signature Image (PNG/JPG)" : "Unggah File Gambar TTD (PNG/JPG)"}</span>
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

export default function ThinkAloudS3ProtocolPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("id"); // "id" (Indonesian) or "en" (English)
  const [itemIdx, setItemIdx] = useState<number>(0); // 0 to 14 (15 items)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [confidenceLevels, setConfidenceLevels] = useState<Record<number, number>>({});
  const [probingStep, setProbingStep] = useState<number>(1); // 1, 2, 3
  
  // Track completed steps per question ID: { [qId]: [1, 2, 3] }
  const [completedSteps, setCompletedSteps] = useState<Record<number, number[]>>({});
  const [activeTab, setActiveTab] = useState<"profile" | "guidance" | "consent" | "session">("profile");

  // TEXT-TO-SPEECH (TTS AUDIO READER)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingType, setSpeakingType] = useState<"scenario" | "probing" | "practice" | null>(null);

  // INFORMED CONSENT STATE (9 MANDATORY + 3 OPTIONAL)
  const [consentApproved, setConsentApproved] = useState(false);
  const [consentSignature, setConsentSignature] = useState<string | null>(null);
  const [mandatoryConsents, setMandatoryConsents] = useState<Record<number, boolean>>({
    1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false
  });
  const [optionalConsents, setOptionalConsents] = useState<Record<number, boolean>>({
    10: false, 11: false, 12: false
  });

  // USER PROFILE PASCASARJANA
  const [userName, setUserName] = useState("Dr. (Cand.) Responden S3");
  const [respondentLevel, setRespondentLevel] = useState<"S3" | "S2">("S3");
  const [studyProgram, setStudyProgram] = useState("Pendidikan Dasar / PEP / Teknologi Pendidikan");
  const [userCampus, setUserCampus] = useState("Pascasarjana Universitas");
  const [userNim, setUserNim] = useState("S3_MADEL_01");
  const [teachingExp, setTeachingExp] = useState("3 Tahun / 3 Years");
  const [showProfileModal, setShowProfileModal] = useState(false);

  // AUDIO RECORDER & LIVE VISUALIZER STATE
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // PRACTICE SIMULATION MODE STATE IN GUIDANCE TAB
  const [practiceText, setPracticeText] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const finalTranscriptRef = useRef<string>("");

  // STOP TEXT-TO-SPEECH AUDIO
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingType(null);
  }, []);

  // TEXT-TO-SPEECH AUDIO READER (BAHASA INDONESIA / ENGLISH ADAPTIVE)
  const speakText = (textToSpeak: string, type: "scenario" | "probing" | "practice") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(
        lang === "en"
          ? "Sorry, your browser does not support Speech Synthesis (Text-to-Speech)."
          : "Maaf, peramban (browser) Anda belum mendukung fitur pembaca suara Text-to-Speech."
      );
      return;
    }

    if (isSpeaking && speakingType === type) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const cleanText = textToSpeak.replace(/<[^>]*>?/gm, "").replace(/\n/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "en" ? "en-US" : "id-ID";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) =>
      lang === "en" ? v.lang.includes("en") || v.lang.includes("EN") : v.lang.includes("id") || v.lang.includes("ID")
    );
    if (targetVoice) utterance.voice = targetVoice;

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("s3_lang");
      if (savedLang === "id" || savedLang === "en") setLang(savedLang);

      const savedName = localStorage.getItem("s3_userName");
      if (!savedName) {
        // Belum login lewat form terpisah -> arahkan ke form login khusus S2/S3
        router.push("/login/think-aloud-s3");
        return;
      }

      const savedLevel = localStorage.getItem("s3_respondentLevel");
      const savedProdi = localStorage.getItem("s3_studyProgram");
      const savedCampus = localStorage.getItem("s3_userCampus");
      const savedNim = localStorage.getItem("s3_userNim");
      const savedConsent = localStorage.getItem("s3_consentApproved");

      if (savedName) setUserName(savedName);
      if (savedLevel === "S2" || savedLevel === "S3") setRespondentLevel(savedLevel);
      if (savedProdi) setStudyProgram(savedProdi);
      if (savedCampus) setUserCampus(savedCampus);
      if (savedNim) setUserNim(savedNim);
      if (savedConsent === "true") {
        setConsentApproved(true);
        setActiveTab("session");
      }
    }
    return () => {
      stopSpeaking();
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, [stopSpeaking]);

  useEffect(() => {
    stopSpeaking();
  }, [itemIdx, probingStep, lang, stopSpeaking]);

  const toggleLanguage = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("s3_lang", newLang);
    }
    stopSpeaking();
  };

  const currentQ = S3_QUESTIONS_DATA[itemIdx];

  const resetRecordingState = useCallback(() => {
    isRecordingRef.current = false;
    setAudioLevel(0);
    finalTranscriptRef.current = "";

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch(e) {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        }
      } catch (e) {}
      mediaRecorderRef.current = null;
    }

    setAudioUrl(null);
    setAudioBlob(null);
    setTranscriptText("");
    setUploadSuccess(false);
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  const startRecording = async () => {
    resetRecordingState();
    finalTranscriptRef.current = "";
    setTranscriptText("");
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: true },
        });
      }

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!isRecordingRef.current || !analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (e) {
        console.warn("Audio meter init notice:", e);
      }

      const options = typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? { mimeType: "audio/webm;codecs=opus" }
        : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm")
        ? { mimeType: "audio/webm" }
        : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/mp4")
        ? { mimeType: "audio/mp4" }
        : {};

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const mimeType = (mediaRecorderRef.current as any)?.mimeType || options.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        if (stream) {
          try {
            stream.getTracks().forEach((track) => track.stop());
          } catch (e) {}
        }
      };

      mediaRecorderRef.current.start(250);
      setIsRecording(true);
      isRecordingRef.current = true;

      // SPEECH-TO-TEXT VERBATIM REAL-TIME TRANSCRIPTION (LANG ADAPTIVE)
      if (typeof window !== "undefined") {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          try {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
              } catch (e) {}
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            recognition.lang = lang === "en" ? "en-US" : "id-ID";

            recognition.onresult = (event: any) => {
              let newlyFinal = "";
              let currentInterim = "";

              for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                  newlyFinal += event.results[i][0].transcript.trim() + ". ";
                } else {
                  currentInterim += event.results[i][0].transcript;
                }
              }

              if (newlyFinal) {
                finalTranscriptRef.current += newlyFinal;
              }

              const fullText = (finalTranscriptRef.current + " " + currentInterim).trim();
              if (fullText) {
                setTranscriptText(fullText);
              }
            };

            recognition.onerror = (event: any) => {
              console.warn("Speech recognition notice:", event.error);
            };

            recognition.onend = () => {
              if (isRecordingRef.current) {
                try {
                  recognition.start();
                } catch (e) {}
              }
            };

            recognitionRef.current = recognition;
            recognition.start();
          } catch (err) {
            console.warn("Speech recognition error on start:", err);
          }
        }
      }

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Gagal mengaktifkan mikrofon:", err);
      alert(
        lang === "en"
          ? "⚠️ Microphone not detected or blocked by browser. Please allow microphone permissions, or TYPE DIRECTLY in the transcript box below!"
          : "⚠️ Mikrofon tidak terdeteksi atau diblokir browser. Harap izinkan akses Mikrofon pada setelan peramban Anda, atau Anda dapat MENGETIK LANGSUNG jawaban pada kotak transkrip!"
      );
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setAudioLevel(0);

    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch(e){}
      audioContextRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch (e) {}
    }

    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const uploadAudioToServer = async (questionTitle: string) => {
    const hasAudio = !!audioBlob;
    const hasText = transcriptText.trim().length > 0;

    if (!hasAudio && !hasText) {
      alert(
        lang === "en"
          ? "⚠️ Please record your voice OR type your response in the transcript box first!"
          : "⚠️ Silakan rekam suara Anda ATAU ketik teks elaborasi jawaban Anda pada kotak transkrip terlebih dahulu!"
      );
      return;
    }
    if (!currentQ) return;

    setIsUploading(true);
    try {
      const userId = localStorage.getItem("s3_userId") || `s3_resp_${Date.now()}`;
      const selectedOptIdx = selectedAnswers[currentQ.id];
      const selectedOptText =
        selectedOptIdx !== undefined && currentQ.options[selectedOptIdx]
          ? `${String.fromCharCode(65 + selectedOptIdx)}. ${currentQ.options[selectedOptIdx].text[lang]}`
          : "Belum Memilih Opsi / No Option Selected";

      const confidenceVal = confidenceLevels[currentQ.id];
      const confidenceText = confidenceVal !== undefined ? `${confidenceVal}/5` : (lang === "en" ? "Not rated" : "Belum dinilai");
      const finalTranscript = transcriptText.trim()
        ? `[Tingkat Keyakinan / Confidence: ${confidenceText} | Lang: ${lang.toUpperCase()}] — ${transcriptText.trim()}`
        : `[Tingkat Keyakinan / Confidence: ${confidenceText} | Lang: ${lang.toUpperCase()}] — [Respon Suara Terkirim / Voice Response Sent]`;

      const fileToUpload = audioBlob
        ? audioBlob
        : new Blob(["[Respon Teks Manual Tanpa Berkas Audio]"], { type: "audio/webm" });

      const respondentLevelLabel =
        respondentLevel === "S3"
          ? "S2/S3 Pascasarjana (Doktoral S3)"
          : "S2/S3 Pascasarjana (Magister S2)";

      const formData = new FormData();
      formData.append("audio", fileToUpload, `ThinkAloud_S3_Soal${itemIdx + 1}_P${probingStep}_${lang}.webm`);
      formData.append("isTextOnly", audioBlob ? "false" : "true");
      formData.append("userId", userId);
      formData.append("userName", userName);
      formData.append("userCampus", userCampus);
      formData.append("respondentLevel", respondentLevelLabel);
      formData.append("studyProgram", studyProgram);
      formData.append("sessionNo", itemIdx < 5 ? "1" : itemIdx < 10 ? "2" : "3");
      formData.append("itemNo", (itemIdx + 1).toString());
      formData.append("sjtId", currentQ.sjtId);
      formData.append("probingStep", probingStep.toString());
      formData.append("questionTitle", questionTitle);
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
        markStepCompleted(currentQ.id, probingStep);

        if (probingStep < 3) {
          const nextStep = probingStep + 1;
          alert(
            lang === "en"
              ? `✅ Probing Question ${probingStep} response successfully saved to Admin Panel!\nProceeding to Probing Question ${nextStep}.`
              : `✅ Respon Pertanyaan Probing ${probingStep} Berhasil Disimpan ke Panel Admin!\nOtomatis beralih ke Pertanyaan Probing ${nextStep}.`
          );
          setProbingStep(nextStep);
          resetRecordingState();
        } else {
          alert(
            lang === "en"
              ? `🎉 Congratulations! All 3 probing stages for Item #${itemIdx + 1} (${currentQ.sjtId}) are fully completed and synchronized with the Admin Panel!`
              : `🎉 Selamat! Seluruh 3 tahap probing untuk Butir #${itemIdx + 1} (${currentQ.sjtId}) telah lengkap tersimpan di Panel Admin!`
          );
        }
      } else {
        alert(lang === "en" ? "❌ Failed to submit response to admin server." : "❌ Gagal mengunggah respon ke server admin. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Gagal mengunggah respon:", err);
      alert(lang === "en" ? "❌ Network error occurred while submitting response." : "❌ Terjadi kesalahan koneksi saat mengunggah respon.");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl || !currentQ) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `ThinkAloud_S3_Item${itemIdx + 1}_${currentQ.sjtId}_P${probingStep}_${lang}.webm`;
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

    if (selectedAnswers[currentQ.id] === undefined) {
      alert(
        lang === "en"
          ? "⚠️ You must select one course of action (A/B/C/D/E) first!"
          : "⚠️ Anda wajib memilih salah satu opsi tindakan (A/B/C/D/E) terlebih dahulu!"
      );
      return;
    }

    if (!isStepCompleted(currentQ.id, probingStep)) {
      alert(
        lang === "en"
          ? `🔒 You MUST record your voice or type your response for Probing Question ${probingStep} and click "Submit to Admin" before proceeding!`
          : `🔒 Anda WAJIB merekam suara atau mengetik teks jawaban untuk Pertanyaan Probing ${probingStep} lalu menekan tombol "Kirim Jawaban ke Admin" sebelum melanjutkan!`
      );
      return;
    }

    if (probingStep < 3) {
      setProbingStep((prev) => prev + 1);
      resetRecordingState();
    } else {
      if (itemIdx < S3_QUESTIONS_DATA.length - 1) {
        setItemIdx((prev) => prev + 1);
        setProbingStep(1);
        resetRecordingState();
      } else {
        alert(
          lang === "en"
            ? "🎉 Congratulations! You have completed all 15 items of the Postgraduate MADEL5C Think-Aloud Instrument! All responses are archived in the Admin Panel."
            : "🎉 Selamat! Anda telah menyelesaikan seluruh 15 Butir Instrumen Think-Aloud Pascasarjana MADEL5C! Data telah terkoneksi penuh di Panel Admin."
        );
      }
    }
  };

  const handleSaveProfile = () => {
    if (!userName.trim()) {
      alert(lang === "en" ? "⚠️ Please enter your Full Name." : "⚠️ Harap masukkan Nama Lengkap Anda.");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("s3_userName", userName);
      localStorage.setItem("s3_respondentLevel", respondentLevel);
      localStorage.setItem("s3_studyProgram", studyProgram);
      localStorage.setItem("s3_userCampus", userCampus);
      localStorage.setItem("s3_userNim", userNim);
    }
    setShowProfileModal(false);
    if (!consentApproved) {
      setActiveTab("consent");
    } else {
      setActiveTab("session");
    }
  };

  // CHECK IF ALL 9 MANDATORY CONSENTS ARE CHECKED
  const allMandatoryChecked = Object.values(mandatoryConsents).every((val) => val === true);

  const handleCheckAllMandatory = () => {
    const newVal = !allMandatoryChecked;
    const updated: Record<number, boolean> = {};
    for (let i = 1; i <= 9; i++) {
      updated[i] = newVal;
    }
    setMandatoryConsents(updated);
  };

  const handleApproveConsent = async () => {
    if (!allMandatoryChecked) {
      alert(
        lang === "en"
          ? "⚠️ You must check all 9 Mandatory Statements to participate!"
          : "⚠️ Anda wajib mencentang seluruh 9 Pernyataan Wajib Informed Consent untuk dapat berpartisipasi!"
      );
      return;
    }
    if (!consentSignature) {
      alert(
        lang === "en"
          ? "⚠️ Please provide your Digital Signature (draw on canvas or upload signature image)!"
          : "⚠️ Harap berikan Tanda Tangan Digital Anda (goreskan di kanvas atau unggah gambar TTD)!"
      );
      return;
    }

    const userId = localStorage.getItem("s3_userId") || `s3_${Date.now()}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("s3_userId", userId);
      localStorage.setItem("s3_consentApproved", "true");
    }

    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          userCampus,
          userNim,
          respondentLevel:
            respondentLevel === "S3"
              ? "S2/S3 Pascasarjana (Doktoral S3)"
              : "S2/S3 Pascasarjana (Magister S2)",
          studyProgram,
          sessionNo: 1,
          signatureDataUrl: consentSignature,
        }),
      });
    } catch (err) {
      console.error("Gagal mengirim Informed Consent ke server:", err);
    }

    setConsentApproved(true);
    setActiveTab("session");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.round(
    (Object.keys(completedSteps).filter((k) => isItemCompleted(Number(k))).length / 15) * 100
  );

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col py-6 px-3 md:px-8 font-sans bg-[#FAF6EE]"
      style={{
        backgroundImage: "url('/batik_pattern.svg')",
        backgroundSize: "140px 140px",
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <main className="relative z-10 w-full max-w-4xl mx-auto space-y-4">
        
        {/* HEADER BAR 3D TIMBUL WARM CREAM & ROYAL PURPLE/INDIGO FOR PASCASARJANA */}
        <div className="bg-white/95 backdrop-blur-xl p-4 md:p-5 rounded-3xl border-2 border-purple-200 border-b-6 border-b-purple-400 shadow-2xl text-slate-900 space-y-3">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-purple-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 flex items-center justify-center shadow-lg border-b-2 border-purple-950 text-white shrink-0">
                <i className="fa-solid fa-graduation-cap text-2xl text-amber-300"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400 text-slate-950 shadow-sm">
                    {lang === "en" ? "POSTGRADUATE EXCLUSIVE (S2 & S3)" : "KHUSUS PASCASARJANA (S2 & S3)"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-300">
                    {lang === "en" ? "15 STRATEGIC ITEMS" : "15 BUTIR STRATEGIS"}
                  </span>
                </div>
                <h1 className="text-base md:text-lg font-black tracking-tight uppercase text-purple-950 mt-0.5">
                  {lang === "en"
                    ? "MADEL5C THINK-ALOUD PROTOCOL (POSTGRADUATE)"
                    : "PROTOKOL THINK-ALOUD MADEL5C PASCASARJANA"}
                </h1>
                <p className="text-[11px] text-purple-800 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span>
                    {lang === "en" ? "Participant: " : "Partisipan: "}
                    <strong className="text-slate-900">{userName}</strong> ({respondentLevel} — {studyProgram})
                  </span>
                  <button 
                    onClick={() => setShowProfileModal(true)} 
                    className="text-purple-600 hover:text-purple-900 underline font-bold ml-1 text-[10px]"
                  >
                    [{lang === "en" ? "Edit Profile" : "Ganti Profil"}]
                  </button>
                </p>
              </div>
            </div>

            {/* BILINGUAL LANGUAGE SWITCHER & TAB NAVIGATION */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0">
              
              {/* LANGUAGE TOGGLE (INDONESIA / ENGLISH) DENGAN PETUNJUK JELAS */}
              <div className="flex flex-col items-start sm:items-end gap-1 bg-gradient-to-r from-purple-50 to-indigo-50 p-2 rounded-2xl border-2 border-purple-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-purple-950">
                  <span className="text-sm">🌐</span>
                  <span>{lang === "en" ? "Select Language:" : "Pilih Bahasa:"}</span>
                  <span className="text-[10px] text-purple-700 font-semibold normal-case">
                    {lang === "en" ? "(ID / EN)" : "(ID / EN)"}
                  </span>
                </div>
                <div className="flex items-center bg-white p-0.5 rounded-xl border border-purple-300 shadow-inner">
                  <button
                    type="button"
                    onClick={() => toggleLanguage("id")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all flex items-center gap-1.5 ${
                      lang === "id"
                        ? "bg-purple-700 text-white shadow-md border-b-2 border-purple-950 scale-102"
                        : "text-slate-600 hover:text-purple-900 hover:bg-purple-50"
                    }`}
                    title="Pilih Bahasa Indonesia"
                  >
                    <span>🇮🇩</span>
                    <span>Indonesia (ID)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLanguage("en")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all flex items-center gap-1.5 ${
                      lang === "en"
                        ? "bg-purple-700 text-white shadow-md border-b-2 border-purple-950 scale-102"
                        : "text-slate-600 hover:text-purple-900 hover:bg-purple-50"
                    }`}
                    title="Select English Language"
                  >
                    <span>🇬🇧</span>
                    <span>English (EN)</span>
                  </button>
                </div>
              </div>

              {/* TAB SWITCHER */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setActiveTab("guidance")}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === "guidance"
                      ? "bg-purple-700 text-white shadow-md border-b-2 border-purple-950"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300"
                  }`}
                  title="Buka Panduan: PROTOKOL THINK-ALOUD MADEL5C PASCASARJANA"
                >
                  <i className="fa-solid fa-book-open text-amber-600"></i>
                  <span>{lang === "en" ? "Guidance" : "Panduan"}</span>
                </button>
                <button
                  onClick={() => setActiveTab(consentApproved ? "session" : "consent")}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab !== "guidance" && activeTab !== "profile"
                      ? "bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-black shadow-md border-b-2 border-purple-950"
                      : "text-slate-600 hover:text-purple-900"
                  }`}
                >
                  <i className="fa-solid fa-clipboard-question"></i> {lang === "en" ? "15 Items" : "Lembar Soal (15 Butir)"}
                </button>
              </div>
            </div>
          </div>

          {/* BANNER PENUNJUK & PANAH ARAH KE PANDUAN PROTOKOL */}
          <div className="p-3.5 bg-gradient-to-r from-amber-100 via-amber-50 to-purple-100 rounded-2xl border-2 border-amber-400 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-md animate-bounce">
                👉
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs">
                    {lang === "en" ? "INSTRUCTION" : "PETUNJUK"}
                  </span>
                  <span className="text-xs font-black text-amber-950">
                    {lang === "en"
                      ? "Click guidance below to view full instructions:"
                      : "Silakan klik panduan untuk membaca instruksi & prosedur lengkap:"}
                  </span>
                </div>
                <p className="text-xs md:text-sm font-black text-purple-950 tracking-tight mt-0.5 flex items-center gap-1.5">
                  <i className="fa-solid fa-book-open text-purple-700"></i>
                  <span>
                    {lang === "en"
                      ? "GUIDANCE: MADEL5C THINK-ALOUD PROTOCOL (POSTGRADUATE)"
                      : "PANDUAN: PROTOKOL THINK-ALOUD MADEL5C PASCASARJANA"}
                  </span>
                </p>
              </div>
            </div>

            {/* BUTTON WITH DIRECTIONAL ARROW */}
            <button
              type="button"
              onClick={() => setActiveTab("guidance")}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 border-b-2 shrink-0 ${
                activeTab === "guidance"
                  ? "bg-purple-800 text-white border-purple-950 ring-2 ring-amber-400"
                  : "bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white border-purple-950 hover:shadow-xl"
              }`}
            >
              <span>
                {activeTab === "guidance"
                  ? (lang === "en" ? "✓ Guidance Currently Open" : "✓ Panduan Sedang Terbuka")
                  : (lang === "en" ? "Klik Panduan: PROTOKOL THINK-ALOUD" : "Klik Panduan: PROTOKOL THINK-ALOUD MADEL5C PASCASARJANA")}
              </span>
              <span className="text-lg font-black text-amber-300 animate-pulse">➔</span>
            </button>
          </div>

          {/* PROGRESS BAR 15 BUTIR */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-black uppercase text-purple-900 shrink-0">
              {Object.keys(completedSteps).filter(k => isItemCompleted(Number(k))).length} / 15 {lang === "en" ? "Completed" : "Selesai"} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* MODAL: PROFIL PASCASARJANA */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white border-2 border-purple-300 rounded-3xl p-6 max-w-lg w-full text-slate-900 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center text-white font-bold">
                    <i className="fa-solid fa-user-graduate"></i>
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-purple-950">
                    {lang === "en" ? "Postgraduate Respondent Identity (S2 / S3)" : "Identitas Responden Pascasarjana (S2 / S3)"}
                  </h3>
                </div>
                <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-800 text-sm">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "en" ? "Full Name & Degree:" : "Nama Lengkap & Gelar:"}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Contoh: Dr. (Cand.) Ahmad Fauzi, M.Pd."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {lang === "en" ? "Study Level:" : "Jenjang Studi:"}
                    </label>
                    <select
                      value={respondentLevel}
                      onChange={(e) => setRespondentLevel(e.target.value as "S3" | "S2")}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-purple-900 font-bold focus:outline-none focus:border-purple-600"
                    >
                      <option value="S3">Doktoral (S3 / Ph.D. Candidate)</option>
                      <option value="S2">Magister (S2 / Master Candidate)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {lang === "en" ? "Student ID / NIM:" : "NIM / NPM:"}
                    </label>
                    <input
                      type="text"
                      value={userNim}
                      onChange={(e) => setUserNim(e.target.value)}
                      placeholder="Contoh: 1201823001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "en" ? "Postgraduate Study Program:" : "Program Studi Pascasarjana:"}
                  </label>
                  <input
                    type="text"
                    value={studyProgram}
                    onChange={(e) => setStudyProgram(e.target.value)}
                    placeholder="Contoh: S3 Pendidikan Dasar / S3 PEP / S2 Teknologi Pendidikan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "en" ? "University / Institution:" : "Perguruan Tinggi / Instansi:"}
                  </label>
                  <input
                    type="text"
                    value={userCampus}
                    onChange={(e) => setUserCampus(e.target.value)}
                    placeholder="Contoh: Pascasarjana Universitas Negeri Jakarta (UNJ)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {lang === "en" ? "Teaching Experience (Years):" : "Pengalaman Mengajar / Asisten (Tahun):"}
                  </label>
                  <input
                    type="text"
                    value={teachingExp}
                    onChange={(e) => setTeachingExp(e.target.value)}
                    placeholder="Contoh: 3 Tahun / 3 Years"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border-b-2 border-purple-950 transition active:scale-95"
                >
                  <i className="fa-solid fa-floppy-disk mr-1.5"></i> {lang === "en" ? "Save Profile" : "Simpan Profil Responden"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* TAB CONTENT 1: PANDUAN PELAKSANAAN BILINGUAL (SUARA VS KETIK & BACA MANUAL VS TTS) */}
        {activeTab === "guidance" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-6 md:p-8 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-purple-200 border-b-8 border-b-purple-300 shadow-xl space-y-6 text-slate-900">
              
              {/* HEADER PANDUAN */}
              <div className="flex items-center gap-3 border-b border-purple-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-bold text-xl shadow-md border-b-2 border-purple-950">
                  <i className="fa-solid fa-book-open-reader"></i>
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase text-purple-950 tracking-tight">
                    {lang === "en"
                      ? "Detailed Think-Aloud Protocol Guidance (15 Strategic Items)"
                      : "Panduan Detail Protokol Think-Aloud Pascasarjana (15 Butir)"}
                  </h3>
                  <p className="text-xs text-purple-800 font-semibold">
                    {lang === "en"
                      ? "Complete Interaction Guidance: Voice vs Direct Typing & Manual Reading vs Text-to-Speech"
                      : "Petunjuk Lengkap Interaksi Fleksibel: Suara vs Mengetik Langsung & Baca Manual vs Text-to-Speech"}
                  </p>
                </div>
              </div>

              {/* CARD 1: CARA MEMBACA SOAL (DUA CARA FLEKSIBEL) */}
              <div className="p-5 bg-gradient-to-br from-[#FFFDF9] to-[#F9F5EC] rounded-2xl border-2 border-amber-300/80 shadow-md space-y-3">
                <div className="flex items-center gap-2.5 font-black text-amber-950 text-sm uppercase tracking-wide">
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-sm">
                    1
                  </span>
                  <span>
                    {lang === "en"
                      ? "How to Read Scenarios & Questions (Two Flexible Options)"
                      : "Cara Membaca Skenario Soal (Dua Pilihan Fleksibel)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-800 pt-1">
                  <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-sm">
                    <h5 className="font-black text-purple-900 flex items-center gap-1.5 uppercase text-[11px]">
                      <i className="fa-solid fa-eye text-amber-600"></i> {lang === "en" ? "Option A: Manual Reading" : "Pilihan A: Membaca Mandiri (Manual)"}
                    </h5>
                    <p className="text-slate-700">
                      {lang === "en"
                        ? "You can read the case scenario, ethical dilemma, and 5 action choices directly on your screen at your own preferred reading pace."
                        : "Anda dapat langsung membaca teks skenario kasus, butir masalah, dan 5 pilihan tindakan yang tersaji di layar secara manual dengan kecepatan membaca Anda sendiri."}
                    </p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-sm">
                    <h5 className="font-black text-purple-900 flex items-center gap-1.5 uppercase text-[11px]">
                      <i className="fa-solid fa-volume-high text-amber-600"></i> {lang === "en" ? "Option B: Text-to-Speech (TTS Audio)" : "Pilihan B: Memutar Suara Otomatis (TTS)"}
                    </h5>
                    <p className="text-slate-700">
                      {lang === "en"
                        ? "Simply click the button \"🔊 Listen to Scenario & Options\". The browser Text-to-Speech (TTS) engine will narrate the text aloud with natural intonation so you can listen without manual reading."
                        : "Cukup klik tombol \"🔊 Dengarkan Skenario & Opsi\". Sistem Text-to-Speech (TTS) pintar akan membacakan teks soal dengan intonasi jelas, sehingga Anda cukup mendengarkannya tanpa perlu membaca teks manual."}
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 2: CARA MENJAWAB SOAL (DUA CARA FLEKSIBEL: BERSUARA ATAU KETIK LANGSUNG) */}
              <div className="p-5 bg-gradient-to-br from-[#F5F3FF] to-[#FAF8FF] rounded-2xl border-2 border-purple-300 shadow-md space-y-3">
                <div className="flex items-center gap-2.5 font-black text-purple-950 text-sm uppercase tracking-wide">
                  <span className="w-7 h-7 rounded-xl bg-purple-700 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    2
                  </span>
                  <span>
                    {lang === "en"
                      ? "How to Respond (Voice Recording OR Direct Manual Typing)"
                      : "Cara Menjawab Soal (Bisa Bersuara ATAU Mengetik Langsung)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-800 pt-1">
                  <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-1.5 shadow-sm">
                    <h5 className="font-black text-rose-700 flex items-center gap-1.5 uppercase text-[11px]">
                      <i className="fa-solid fa-microphone-lines text-rose-600"></i> {lang === "en" ? "Method 1: Speak into Microphone (Voice)" : "Cara 1: Menjawab dengan Bersuara (Audio)"}
                    </h5>
                    <p className="text-slate-700">
                      {lang === "en"
                        ? "1. Click the red \"1. Record Your Voice\" button.\n2. Speak aloud your candid thoughts, rationales, and considerations.\n3. The system automatically transcribes your voice to verbatim text.\n4. Click \"Stop Recording\", then click \"2. Submit Answer to Admin\"."
                        : "1. Klik tombol merah \"1. Rekam Suara Anda\".\n2. Ucapkan pemikiran spontan Anda mengenai alasan dan pertimbangan Anda.\n3. Sistem otomatis mentranskripsikan ucapan Anda ke kotak teks secara verbatim.\n4. Klik \"Hentikan Rekaman\", lalu klik \"2. Kirim Jawaban ke Admin\"."}
                    </p>
                  </div>
                  <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-1.5 shadow-sm">
                    <h5 className="font-black text-indigo-700 flex items-center gap-1.5 uppercase text-[11px]">
                      <i className="fa-solid fa-keyboard text-indigo-600"></i> {lang === "en" ? "Method 2: Type Directly in the Text Box" : "Cara 2: Mengetik Langsung (Manual di Teks)"}
                    </h5>
                    <p className="text-slate-700">
                      {lang === "en"
                        ? "1. If in a quiet/noisy venue or if you prefer writing, you can type your thoughts and analytical justifications directly into the transcript box.\n2. Edit or elaborate freely.\n3. Click \"2. Submit Answer to Admin\" to save your response directly into the database!"
                        : "1. Jika Anda berada di tempat yang bising, hening, atau mikrofon laptop/HP tidak aktif, Anda dapat langsung mengetikkan pemikiran dan alasan Anda pada kotak transkrip teks.\n2. Anda bebas mengedit atau menambahkan kalimat.\n3. Klik tombol \"2. Kirim Jawaban ke Admin\" untuk langsung menyimpan ke database!"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 3: 3 TAHAP PROBING & SKALA KEYAKINAN 1-5 */}
              <div className="p-5 bg-gradient-to-br from-[#ECFDF5] to-[#F0FDF4] rounded-2xl border-2 border-emerald-300 shadow-md space-y-3">
                <div className="flex items-center gap-2.5 font-black text-emerald-950 text-sm uppercase tracking-wide">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    3
                  </span>
                  <span>
                    {lang === "en"
                      ? "3 Probing Stages & Cognitive Confidence Scale (1–5)"
                      : "3 Tahap Probing & Skala Keyakinan Kognitif (1–5)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-slate-800 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <span className="font-black text-emerald-900 block uppercase text-[10px]">
                      {lang === "en" ? "Stage 1: Answering" : "Tahap 1: Menjawab"}
                    </span>
                    <p className="text-slate-600 leading-snug">
                      {lang === "en"
                        ? "State your chosen action and rate your confidence (1=Very Unsure to 5=Very Confident)."
                        : "Menyatakan tindakan pilihan dan menilai tingkat keyakinan (1=Sangat Ragu s/d 5=Sangat Yakin)."}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <span className="font-black text-emerald-900 block uppercase text-[10px]">
                      {lang === "en" ? "Stage 2: Explaining" : "Tahap 2: Menjelaskan"}
                    </span>
                    <p className="text-slate-600 leading-snug">
                      {lang === "en"
                        ? "Elaborate the primary ethical dilemma, arguments, and technical knowledge underpinning your choice."
                        : "Mengelaborasi masalah utama, argumen etis, dan pengetahuan teknis di balik keputusan Anda."}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <span className="font-black text-emerald-900 block uppercase text-[10px]">
                      {lang === "en" ? "Stage 3: Evaluating" : "Tahap 3: Mengevaluasi"}
                    </span>
                    <p className="text-slate-600 leading-snug">
                      {lang === "en"
                        ? "Evaluate scenario realism for doctoral faculty candidates, lived experiences, and needed institutional support."
                        : "Menilai realisme situasi bagi calon dosen, pengalaman nyata, dan kebutuhan dukungan institusi."}
                    </p>
                  </div>
                </div>
              </div>

              {/* SIMULASI LATIHAN INTERAKTIF (PRACTICE SIMULATION) */}
              <div className="p-5 bg-white rounded-2xl border-2 border-purple-200 shadow-inner space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <h4 className="font-black text-purple-950 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-flask text-amber-500"></i>
                    {lang === "en"
                      ? "Interactive Practice Simulation (Test TTS Audio & Manual Typing):"
                      : "Latihan Sederhana Think-Aloud (Uji Coba Suara TTS & Ketik Teks):"}
                  </h4>
                  <button
                    onClick={() =>
                      speakText(
                        lang === "en"
                          ? "Practice scenario. You receive an email invitation from a new open-access journal offering rapid and free publication of your article with zero APC fees. What do you do? State your spontaneous thoughts while deciding."
                          : "Latihan sederhana. Anda menerima undangan dari sebuah jurnal baru yang meminta Anda mengirim artikel dengan imbalan terbit cepat dan gratis. Apa yang Anda lakukan? Ceritakan apa yang Anda pikirkan sambil memutuskan.",
                        "practice"
                      )
                    }
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition border ${
                      isSpeaking && speakingType === "practice"
                        ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black"
                        : "bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100"
                    }`}
                  >
                    <i className={`fa-solid ${isSpeaking && speakingType === "practice" ? "fa-volume-xmark" : "fa-volume-high"} mr-1`}></i>
                    <span>
                      {isSpeaking && speakingType === "practice"
                        ? lang === "en" ? "Stop Practice Audio" : "Hentikan Suara Latihan"
                        : lang === "en" ? "🔊 Test TTS Audio" : "🔊 Uji Coba Suara TTS"}
                    </span>
                  </button>
                </div>
                <p className="text-slate-800 italic bg-[#FAF8F5] p-3 rounded-xl border border-amber-200">
                  {lang === "en"
                    ? "\"Example Case: You receive an email solicitation from an unindexed journal promising immediate publication without APC fees. What do you do? Speak your thoughts or type below.\""
                    : "\"Contoh Situasi: Anda menerima undangan email dari sebuah jurnal baru yang menawarkan penerbitan artikel cepat dan gratis tanpa biaya APC. Apa yang Anda lakukan? Ucapkan apa yang ada di benak Anda atau ketik di bawah.\""}
                </p>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block text-[11px]">
                    {lang === "en" ? "Try Typing Manually into the Response Box:" : "Uji Coba Ketik Manual di Kotak Respon:"}
                  </label>
                  <textarea
                    rows={2}
                    value={practiceText}
                    onChange={(e) => setPracticeText(e.target.value)}
                    placeholder={
                      lang === "en"
                        ? "Type your practice response here to get familiar with direct typing..."
                        : "Ketik latihan jawaban Anda di sini untuk membiasakan diri mengetik langsung..."
                    }
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* NAVIGATION BUTTON */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab(consentApproved ? "session" : "consent")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl border-b-4 border-purple-950 transition active:scale-95 flex items-center gap-2"
                >
                  <span>{lang === "en" ? "Proceed to Informed Consent" : "Lanjutkan ke Lembar Persetujuan (Informed Consent)"}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 2: INFORMED CONSENT BILINGUAL */}
        {activeTab === "consent" && !consentApproved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-6 md:p-8 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-purple-200 border-b-8 border-b-purple-300 shadow-xl space-y-5 text-slate-900">
              
              {/* HEADER CONSENT */}
              <div className="flex items-center gap-3 border-b border-purple-100 pb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md border-b-2 border-amber-800">
                  <i className="fa-solid fa-file-contract"></i>
                </div>
                <div>
                  <h3 className="font-black text-base md:text-lg uppercase text-purple-950 tracking-tight">
                    {lang === "en" ? "Participant Informed Consent Form" : "Lembar Persetujuan Partisipan (Informed Consent)"}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {lang === "en"
                      ? "Research Ethics Protocol for Postgraduate Think-Aloud Assessment (Personal Data Protection Act / UU PDP No. 27/2022)"
                      : "Etika Penelitian Protokol Think-Aloud Pascasarjana MADEL5C (UU PDP No. 27 Tahun 2022)"}
                  </p>
                </div>
              </div>

              {/* INFORMASI SINGKAT BAGIAN A */}
              <div className="p-4 bg-gradient-to-br from-[#FFFDF9] to-[#F9F5EC] rounded-2xl border border-amber-200 text-xs leading-relaxed space-y-2 text-slate-800 max-h-40 overflow-y-auto custom-scrollbar">
                <h5 className="font-black text-purple-950 uppercase text-[11px]">
                  {lang === "en" ? "Study Information Summary:" : "Ringkasan Informasi Penelitian:"}
                </h5>
                <p>
                  {lang === "en"
                    ? "This investigation explores cognitive decision-making processes of doctoral and master candidates (prospective faculty members) concerning digital literacy and intellectual asset stewardship. There are no right or wrong answers; this session does not evaluate your individual academic performance."
                    : "Penelitian ini bertujuan menggali proses kognitif mahasiswa pascasarjana (S2 & S3 calon dosen) dalam pengambilan keputusan literasi digital dan pengelolaan aset intelektual digital. Tidak ada jawaban benar atau salah; penelitian ini bukan penilaian akademik personal Anda."}
                </p>
                <p>
                  {lang === "en"
                    ? "Voice recordings and typed verbatim transcripts are encrypted on research servers, strictly anonymized, and accessed solely by the research team for qualitative analysis and scholarly publications."
                    : "Rekaman suara dan/atau teks respon Anda disimpan terenkripsi di server penelitian, dianonimkan secara ketat, dan hanya diakses oleh tim peneliti untuk analisis kualitatif dan publikasi ilmiah bereputasi."}
                </p>
              </div>

              {/* 9 PERNYATAAN WAJIB */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-purple-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px]">9</span>
                    {lang === "en" ? "Mandatory Statements (All Required):" : "Pernyataan Wajib (Wajib Disetujui Seluruhnya):"}
                  </h4>
                  <button
                    type="button"
                    onClick={handleCheckAllMandatory}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline"
                  >
                    {allMandatoryChecked
                      ? lang === "en" ? "Uncheck All" : "Batal Centang Semua"
                      : lang === "en" ? "Check All Mandatory" : "Centang Semua Wajib"}
                  </button>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800">
                  {[
                    {
                      id: "1. Saya telah membaca dan memahami Lembar Informasi tentang penelitian ini, dan telah diberi kesempatan bertanya.",
                      en: "1. I have read and understood the Participant Information Sheet and have been given the opportunity to ask questions.",
                    },
                    {
                      id: "2. Saya memahami bahwa partisipasi saya sukarela dan saya boleh berhenti, melewati pertanyaan, atau mengundurkan diri kapan saja tanpa alasan dan tanpa konsekuensi.",
                      en: "2. I understand that my participation is voluntary and that I may pause, skip questions, or withdraw at any time without penalty.",
                    },
                    {
                      id: "3. Saya memahami bahwa penelitian ini berfokus pada wawancara think-aloud dengan 15 butir skenario situasional strategis.",
                      en: "3. I understand that this study centers on a think-aloud protocol comprising 15 strategic scenario items.",
                    },
                    {
                      id: "4. Saya memahami bahwa tidak ada jawaban benar atau salah dan bahwa jawaban saya bukan penilaian terhadap kemampuan akademik saya.",
                      en: "4. I understand that there are no right or wrong answers and that my responses are not an evaluation of my academic competence.",
                    },
                    {
                      id: "5. Saya menyetujui sesi direkam dalam bentuk audio atau teks verbatim langsung, ditranskripsikan oleh sistem website, dan dianalisis oleh tim peneliti.",
                      en: "5. I consent to sessions being recorded via audio or direct verbatim text, transcribed by the platform, and analyzed by the research team.",
                    },
                    {
                      id: "6. Saya memahami bahwa data saya akan diberi kode, dianonimkan, disimpan secara aman, dan hanya diakses oleh tim peneliti.",
                      en: "6. I understand that my data will be pseudonymized, securely encrypted, and accessible solely to authorized researchers.",
                    },
                    {
                      id: "7. Saya memahami bahwa saya tidak perlu menyebut nama orang atau lembaga dalam cerita saya.",
                      en: "7. I understand that I do not need to disclose specific personal names or institutions in my narratives.",
                    },
                    {
                      id: "8. Saya memahami bahwa kutipan jawaban saya dapat muncul dalam laporan disertasi atau publikasi jurnal tanpa identitas.",
                      en: "8. I understand that anonymized quotes from my responses may appear in dissertation reports or scholarly publications.",
                    },
                    {
                      id: "9. Saya berusia 18 tahun atau lebih dan bersedia berpartisipasi dalam penelitian ini.",
                      en: "9. I am 18 years of age or older and willingly agree to participate in this research.",
                    },
                  ].map((stmt, idx) => {
                    const no = idx + 1;
                    return (
                      <label key={no} className="flex items-start gap-2.5 cursor-pointer font-medium hover:text-purple-950">
                        <input
                          type="checkbox"
                          checked={mandatoryConsents[no] || false}
                          onChange={(e) =>
                            setMandatoryConsents({ ...mandatoryConsents, [no]: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-purple-400 text-purple-600 focus:ring-purple-500 mt-0.5 shrink-0"
                        />
                        <span className="leading-snug">{stmt[lang]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3 PERNYATAAN PILIHAN (OPSIONAL) */}
              <div className="space-y-2">
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px]">3</span>
                  {lang === "en" ? "Optional Statements (Voluntary):" : "Pernyataan Pilihan (Opsional):"}
                </h4>
                <div className="space-y-1.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
                  {[
                    {
                      no: 10,
                      id: "10. Saya bersedia data saya yang telah dianonimkan dipakai untuk penelitian lanjutan oleh tim peneliti yang sama.",
                      en: "10. I agree that my anonymized data may be used for subsequent studies by the same research group.",
                    },
                    {
                      no: 11,
                      id: "11. Saya bersedia data saya yang telah dianonimkan dibagikan kepada peneliti lain atas permintaan yang wajar.",
                      en: "11. I agree that my anonymized data may be shared with external researchers upon reasonable request.",
                    },
                    {
                      no: 12,
                      id: "12. Saya bersedia dihubungi kembali untuk klarifikasi jawaban atau undangan penelitian lanjutan.",
                      en: "12. I agree to be re-contacted for answer clarification or follow-up research invitations.",
                    },
                  ].map(({ no, id, en }) => (
                    <label key={no} className="flex items-start gap-2.5 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={optionalConsents[no] || false}
                        onChange={(e) =>
                          setOptionalConsents({ ...optionalConsents, [no]: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-slate-400 text-purple-600 focus:ring-purple-500 mt-0.5 shrink-0"
                      />
                      <span className="leading-snug">{lang === "en" ? en : id}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* TANDA TANGAN DIGITAL CANVAS */}
              <div className="space-y-2 pt-2">
                <label className="font-black text-xs uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                  <i className="fa-solid fa-pen-nib text-purple-600"></i>
                  {lang === "en" ? "Participant Digital Signature:" : "Tanda Tangan Digital Partisipan:"}
                </label>
                <SignaturePad
                  lang={lang}
                  currentSignature={consentSignature}
                  onSave={(dataUrl) => setConsentSignature(dataUrl)}
                  onClear={() => setConsentSignature(null)}
                />
              </div>

              {/* BUTTON APPROVE CONSENT */}
              <div className="pt-3 border-t border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="text-[11px] font-bold text-slate-600">
                  {allMandatoryChecked && consentSignature ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                      {lang === "en"
                        ? "9 Mandatory Statements & Digital Signature completed. You may begin!"
                        : "9 Pernyataan Wajib & Tanda Tangan Lengkap. Anda siap memulai!"}
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-exclamation text-rose-500 text-sm"></i>
                      {lang === "en"
                        ? "Check all 9 mandatory boxes and draw your signature to proceed."
                        : "Lengkapi centang 9 pernyataan wajib dan goreskan tanda tangan digital."}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleApproveConsent}
                  disabled={!allMandatoryChecked || !consentSignature}
                  className={`px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2 shrink-0 ${
                    allMandatoryChecked && consentSignature
                      ? "bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white shadow-xl border-b-4 border-purple-950"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <i className="fa-solid fa-circle-check"></i>
                  <span>{lang === "en" ? "I Agree & Begin 15 Items" : "Saya Setuju & Mulai Sesi 15 Butir"}</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB CONTENT 3: MAIN THINK-ALOUD QUESTION & PROBING AUDIO FLOW (15 BUTIR BILINGUAL) */}
        {(activeTab === "session" || consentApproved) && currentQ && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            
            {/* 15 ITEM BADGES BAR (CREAM THEME) */}
            <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border-2 border-purple-200 shadow-md flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
              {S3_QUESTIONS_DATA.map((q, idx) => {
                const isCurrent = idx === itemIdx;
                const isDone = isItemCompleted(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      if (idx > itemIdx && !isItemCompleted(currentQ.id)) {
                        alert(
                          lang === "en"
                            ? "🔒 Please complete the current item and all 3 probing stages before moving to the next item!"
                            : "🔒 Selesaikan butir saat ini dan seluruh 3 tahap probing terlebih dahulu sebelum pindah ke butir berikutnya!"
                        );
                        return;
                      }
                      setItemIdx(idx);
                      setProbingStep(1);
                      resetRecordingState();
                    }}
                    className={`flex-1 min-w-[38px] py-2 rounded-xl text-[10px] font-black transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      isCurrent
                        ? "bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-lg ring-2 ring-purple-400 font-black"
                        : isDone
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-slate-100 text-slate-600 border border-slate-200 hover:border-purple-400"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isDone && <i className="fa-solid fa-check text-[8px] text-emerald-600"></i>}
                  </button>
                );
              })}
            </div>

            {/* QUICK REMINDER BANNER */}
            <div className="p-3 bg-gradient-to-r from-amber-50 via-purple-50 to-amber-50 rounded-2xl border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-800">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-amber-600 text-base shrink-0"></i>
                <span className="font-bold">
                  <strong>{lang === "en" ? "Flexible Interaction:" : "Pilihan Fleksibel:"}</strong>{" "}
                  {lang === "en"
                    ? "Read manually or listen via TTS. Speak via microphone OR type directly in the transcript box below!"
                    : "Anda bebas membaca manual atau memutar suara (TTS), serta dapat bersuara (rekam mic) ATAU mengetik langsung pada kotak transkrip!"}
                </span>
              </div>
              <button
                onClick={() => setActiveTab("guidance")}
                className="text-[10px] font-black uppercase text-purple-800 hover:text-purple-950 underline shrink-0"
              >
                [{lang === "en" ? "Open Full Guidance" : "Buka Panduan Lengkap"}]
              </button>
            </div>

            {/* MAIN QUESTION CARD (3D TIMBUL CREAM & PURPLE ACCENTS) */}
            <div className="p-6 md:p-7 rounded-3xl border-2 border-purple-200 border-b-8 border-b-purple-300 bg-white/95 backdrop-blur-xl shadow-2xl space-y-5 text-slate-900">
              
              {/* SCENARIO HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-400 text-slate-950 shadow-sm">
                      {lang === "en" ? `Item ${itemIdx + 1} of 15` : `Butir ${itemIdx + 1} dari 15`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-300">
                      ID: {currentQ.sjtId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {currentQ.dim[lang]}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-purple-950 tracking-tight leading-snug">
                    {currentQ.title[lang]}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold italic">
                    {lang === "en" ? "Theme: " : "Tema: "} {currentQ.theme[lang]}
                  </span>
                </div>
              </div>

              {/* SKENARIO TEXT BOX WITH TTS AUDIO READER (WARM CREAM PALETTE) */}
              <div className="p-5 bg-gradient-to-b from-[#FDFBF7] to-[#F7F3EA] rounded-2xl border-2 border-amber-200/80 shadow-inner space-y-3 text-xs md:text-sm leading-relaxed text-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
                  <div className="flex items-center gap-2 font-black text-purple-900 text-[11px] uppercase tracking-wider">
                    <i className="fa-solid fa-book-open-reader text-amber-600"></i>
                    {lang === "en"
                      ? "Postgraduate Digital Literacy Scenario:"
                      : "Skenario Kasus Literasi Digital Pascasarjana:"}
                  </div>

                  {/* FITUR AUDIO READER (TEXT-TO-SPEECH) */}
                  <button
                    onClick={() =>
                      speakText(
                        `${currentQ.scenario[lang]}. ${
                          lang === "en" ? "Action Choices. " : "Pilihan tindakan. "
                        }${currentQ.options
                          .map((o, idx) => `${lang === "en" ? "Option" : "Opsi"} ${String.fromCharCode(65 + idx)}: ${o.text[lang]}`)
                          .join(". ")}`,
                        "scenario"
                      )
                    }
                    className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 border shadow-sm ${
                      isSpeaking && speakingType === "scenario"
                        ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black"
                        : "bg-white hover:bg-purple-50 text-purple-900 border-purple-300"
                    }`}
                  >
                    <i className={`fa-solid ${isSpeaking && speakingType === "scenario" ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
                    <span>
                      {isSpeaking && speakingType === "scenario"
                        ? lang === "en" ? "Stop Scenario Audio" : "Hentikan Suara Skenario"
                        : lang === "en" ? "🔊 Listen to Scenario (TTS)" : "🔊 Dengarkan Skenario & Opsi (TTS)"}
                    </span>
                  </button>
                </div>

                <p className="whitespace-pre-line font-medium text-slate-900">{currentQ.scenario[lang]}</p>
              </div>

              {/* OPTIONS LIST (A, B, C, D, E) */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check text-purple-700"></i>
                  {lang === "en"
                    ? "Your Action Decision (Select One Option First):"
                    : "Pilihan Tindakan Anda (Pilih Satu Opsi Terlebih Dahulu):"}
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQ.id] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all active:scale-[0.99] flex items-start gap-3.5 text-xs md:text-sm font-medium ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-100 border-purple-600 text-purple-950 shadow-md ring-2 ring-purple-300"
                            : "bg-white border-slate-200 hover:border-purple-300 text-slate-800 hover:bg-purple-50/40"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-purple-700 border-purple-800 text-white"
                              : "bg-slate-100 border-slate-300 text-slate-600"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="leading-snug pt-0.5">{opt.text[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* THREE-STEP PROBING AUDIO / TYPING SECTION */}
              {selectedAnswers[currentQ.id] !== undefined && (
                <div className="pt-4 border-t-2 border-purple-100 space-y-4">
                  
                  {/* PROBING STEP INDICATOR TABS (P1 -> P2 -> P3) */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { step: 1, title: lang === "en" ? "1. Answering & Confidence" : "1. Menjawab & Keyakinan" },
                      { step: 2, title: lang === "en" ? "2. Explaining Rationale" : "2. Menjelaskan Alasan" },
                      { step: 3, title: lang === "en" ? "3. Evaluating Realism" : "3. Mengevaluasi Realisme" },
                    ].map(({ step, title }) => {
                      const isActive = probingStep === step;
                      const isDone = isStepCompleted(currentQ.id, step);
                      return (
                        <button
                          key={step}
                          onClick={() => {
                            if (step > 1 && !isStepCompleted(currentQ.id, step - 1)) {
                              alert(
                                lang === "en"
                                  ? `🔒 Complete Probing Question ${step - 1} first!`
                                  : `🔒 Selesaikan Pertanyaan Probing ${step - 1} terlebih dahulu!`
                              );
                              return;
                            }
                            setProbingStep(step);
                            resetRecordingState();
                          }}
                          className={`py-2.5 px-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center justify-center gap-1.5 ${
                            isActive
                              ? "bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white border-purple-900 shadow-md font-black"
                              : isDone
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span>{title}</span>
                          {isDone && <i className="fa-solid fa-check-circle text-emerald-600"></i>}
                        </button>
                      );
                    })}
                  </div>

                  {/* PROBING QUESTION BOX BASED ON STEP + TTS PLAYER */}
                  <div className="p-4 bg-gradient-to-r from-purple-50/90 to-amber-50/90 rounded-2xl border-2 border-purple-200 space-y-2 text-xs md:text-sm">
                    {probingStep === 1 && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-purple-950 font-black text-xs uppercase">
                          <span>
                            <i className="fa-solid fa-circle-question mr-1 text-purple-700"></i>
                            {lang === "en" ? "Stage 1: Answering & Decision Confidence" : "Tahap 1: Menjawab & Skala Keyakinan"}
                          </span>
                          <button
                            onClick={() =>
                              speakText(
                                `${lang === "en" ? "Stage 1 Question. " : "Pertanyaan Tahap 1. "}${currentQ.probing1[lang]}`,
                                "probing"
                              )
                            }
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase transition border ${
                              isSpeaking && speakingType === "probing"
                                ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black"
                                : "bg-white text-purple-900 border-purple-300 hover:bg-purple-100"
                            }`}
                          >
                            <i className={`fa-solid ${isSpeaking && speakingType === "probing" ? "fa-volume-xmark" : "fa-volume-high"} mr-1`}></i>
                            <span>{isSpeaking && speakingType === "probing" ? (lang === "en" ? "Stop" : "Hentikan") : (lang === "en" ? "🔊 Listen" : "🔊 Dengarkan")}</span>
                          </button>
                        </div>
                        <p className="font-extrabold text-purple-950 text-sm leading-relaxed">
                          "{currentQ.probing1[lang]}"
                        </p>

                        {/* SKALA KEYAKINAN 1 SAMPAI 5 */}
                        <div className="p-3 bg-white/90 rounded-xl border border-purple-200 space-y-1.5 pt-2 shadow-xs">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                            <span>
                              {lang === "en"
                                ? "How confident are you with your chosen decision? (1 = Very Unsure, 5 = Very Confident)"
                                : "Berapa skor keyakinan Anda terhadap keputusan di atas? (1 = Sangat Ragu, 5 = Sangat Yakin)"}
                            </span>
                            {confidenceLevels[currentQ.id] !== undefined ? (
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                                {lang === "en" ? `Selected: Level ${confidenceLevels[currentQ.id]}` : `Terpilih: Skor ${confidenceLevels[currentQ.id]}`}
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 italic">
                                {lang === "en" ? "(Optional: Click 1 to 5 to rate)" : "(Belum dipilih - klik salah satu angka)"}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((lvl) => {
                              const isSelectedLvl = confidenceLevels[currentQ.id] === lvl;
                              return (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => setConfidenceLevels({ ...confidenceLevels, [currentQ.id]: lvl })}
                                  className={`flex-1 py-1.5 rounded-lg font-black text-xs border transition ${
                                    isSelectedLvl
                                      ? "bg-purple-700 text-white border-purple-900 shadow-md ring-2 ring-purple-300"
                                      : "bg-white hover:bg-purple-50 text-slate-700 border-slate-300 shadow-xs"
                                  }`}
                                >
                                  {lvl} {lvl === 1 ? (lang === "en" ? "(Unsure)" : "(Ragu)") : lvl === 5 ? (lang === "en" ? "(Confident)" : "(Yakin)") : ""}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {probingStep === 2 && (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-purple-950 font-black text-xs uppercase">
                          <span>
                            <i className="fa-solid fa-circle-question mr-1 text-purple-700"></i>
                            {lang === "en" ? "Stage 2: Explaining Underlying Rationale" : "Tahap 2: Menjelaskan Alasan & Landasan Keputusan"}
                          </span>
                          <button
                            onClick={() =>
                              speakText(
                                `${lang === "en" ? "Stage 2 Question. " : "Pertanyaan Tahap 2. "}${currentQ.probing2[lang]}`,
                                "probing"
                              )
                            }
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase transition border ${
                              isSpeaking && speakingType === "probing"
                                ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black"
                                : "bg-white text-purple-900 border-purple-300 hover:bg-purple-100"
                            }`}
                          >
                            <i className={`fa-solid ${isSpeaking && speakingType === "probing" ? "fa-volume-xmark" : "fa-volume-high"} mr-1`}></i>
                            <span>{isSpeaking && speakingType === "probing" ? (lang === "en" ? "Stop" : "Hentikan") : (lang === "en" ? "🔊 Listen" : "🔊 Dengarkan")}</span>
                          </button>
                        </div>
                        <p className="font-extrabold text-purple-950 text-sm leading-relaxed">
                          "{currentQ.probing2[lang]}"
                        </p>
                      </div>
                    )}

                    {probingStep === 3 && (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-purple-950 font-black text-xs uppercase">
                          <span>
                            <i className="fa-solid fa-circle-question mr-1 text-purple-700"></i>
                            {lang === "en" ? "Stage 3: Evaluating Realism & Support Needs" : "Tahap 3: Mengevaluasi Realisme & Kebutuhan Dukungan"}
                          </span>
                          <button
                            onClick={() =>
                              speakText(
                                `${lang === "en" ? "Stage 3 Question. " : "Pertanyaan Tahap 3. "}${currentQ.probing3[lang]}`,
                                "probing"
                              )
                            }
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase transition border ${
                              isSpeaking && speakingType === "probing"
                                ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse font-black"
                                : "bg-white text-purple-900 border-purple-300 hover:bg-purple-100"
                            }`}
                          >
                            <i className={`fa-solid ${isSpeaking && speakingType === "probing" ? "fa-volume-xmark" : "fa-volume-high"} mr-1`}></i>
                            <span>{isSpeaking && speakingType === "probing" ? (lang === "en" ? "Stop" : "Hentikan") : (lang === "en" ? "🔊 Listen" : "🔊 Dengarkan")}</span>
                          </button>
                        </div>
                        <p className="font-extrabold text-purple-950 text-sm leading-relaxed">
                          "{currentQ.probing3[lang]}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AUDIO RECORDER & TEXT INPUT PANEL (CREAM & CLEAN THEME) */}
                  <div className="p-4 bg-slate-50/95 rounded-2xl border-2 border-slate-200 space-y-3">
                    
                    {/* BUTTON ACTIONS: REKAM SUARA ATAU LANGSUNG KIRIM */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {!isRecording ? (
                          <button
                            onClick={startRecording}
                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border-b-2 border-rose-900 transition active:scale-95 flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-microphone text-sm animate-bounce"></i>
                            <span>{lang === "en" ? "1. Record Your Voice" : "1. Rekam Suara Anda"}</span>
                          </button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border-b-2 border-amber-800 animate-pulse transition active:scale-95 flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-square text-sm"></i>
                            <span>{lang === "en" ? "Stop Recording" : "Hentikan Rekaman"} ({formatTime(recordingTime)})</span>
                          </button>
                        )}

                        <button
                          onClick={() => uploadAudioToServer(currentQ.title[lang] || `Probing S3 P${probingStep}`)}
                          disabled={isUploading || isRecording || (!audioBlob && !transcriptText.trim())}
                          className={`px-4 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border transition active:scale-95 flex items-center gap-1.5 ${
                            uploadSuccess || isStepCompleted(currentQ.id, probingStep)
                              ? "bg-emerald-600 text-white border-emerald-700"
                              : "bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white border-b-2 border-purple-950 disabled:opacity-40 disabled:cursor-not-allowed"
                          }`}
                        >
                          {isUploading ? (
                            <><i className="fa-solid fa-spinner animate-spin"></i> {lang === "en" ? "Submitting..." : "Mengirim..."}</>
                          ) : uploadSuccess || isStepCompleted(currentQ.id, probingStep) ? (
                            <><i className="fa-solid fa-circle-check"></i> {lang === "en" ? "Response Saved to Admin" : "Jawaban Terkirim ke Admin"}</>
                          ) : (
                            <><i className="fa-solid fa-paper-plane"></i> {lang === "en" ? "2. Submit Response (Voice / Text) to Admin" : "2. Kirim Jawaban (Suara / Teks) ke Admin"}</>
                          )}
                        </button>
                      </div>

                      {audioUrl && !isRecording && (
                        <div className="flex items-center gap-2">
                          <audio controls src={audioUrl} className="h-8 max-w-[180px] rounded-lg shadow-sm" />
                          <button
                            onClick={downloadAudio}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold rounded-lg border border-slate-300 transition"
                          >
                            <i className="fa-solid fa-download mr-1 text-purple-700"></i> {lang === "en" ? "Download" : "Unduh"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* LIVE MIC SENSITIVITY LEVEL METER */}
                    {isRecording && (
                      <div className="w-full bg-white border border-slate-200 rounded-xl p-2.5 flex items-center gap-2 shadow-inner">
                        <i className="fa-solid fa-microphone-lines text-xs text-rose-500 animate-pulse shrink-0"></i>
                        <span className="text-[10px] font-bold text-slate-700 shrink-0">
                          {lang === "en" ? "Live Voice Signal Meter:" : "Indikator Sinyal Suara:"}
                        </span>
                        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-full transition-all duration-75"
                            style={{ width: `${audioLevel}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-purple-900 font-bold w-9 text-right">{audioLevel}%</span>
                      </div>
                    )}

                    {/* TRANSCRIPT VERBATIM TEXT BOX (AUTO SPEECH-TO-TEXT & MANUAL DIRECT TYPING) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span className="flex items-center gap-1.5 text-purple-900">
                          <i className="fa-solid fa-closed-captioning text-purple-700"></i>
                          {lang === "en"
                            ? "Verbatim Response Box (Auto Transcribed from Voice OR Type Directly Here):"
                            : "Transkrip Verbatim (Otomatis dari Rekaman Suara ATAU Ketik Langsung di Sini):"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {transcriptText.length} {lang === "en" ? "characters" : "karakter"}
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder={
                          lang === "en"
                            ? "Speak your thoughts into the microphone or type your critical analysis directly here without recording..."
                            : "Ucapkan respon Anda melalui mikrofon atau ketik langsung pemikiran/alasan kritis Anda di sini tanpa perlu merekam suara..."
                        }
                        className="w-full p-3 bg-white border-2 border-purple-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 shadow-inner"
                      />
                    </div>
                  </div>

                  {/* BOTTOM ACTION NAVIGATION */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        if (probingStep > 1) {
                          setProbingStep(probingStep - 1);
                          resetRecordingState();
                        } else if (itemIdx > 0) {
                          setItemIdx(itemIdx - 1);
                          setProbingStep(3);
                          resetRecordingState();
                        }
                      }}
                      disabled={itemIdx === 0 && probingStep === 1}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition"
                    >
                      <i className="fa-solid fa-chevron-left mr-1"></i> {lang === "en" ? "Previous" : "Sebelumnya"}
                    </button>

                    <button
                      onClick={handleNextStepOrQuestion}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg border-b-2 border-purple-950 transition active:scale-95 flex items-center gap-2"
                    >
                      <span>
                        {probingStep < 3
                          ? lang === "en" ? `Next to Probing ${probingStep + 1}` : `Lanjut ke Probing ${probingStep + 1}`
                          : itemIdx < S3_QUESTIONS_DATA.length - 1
                          ? lang === "en" ? `Proceed to Item #${itemIdx + 2}` : `Lanjut ke Butir #${itemIdx + 2}`
                          : lang === "en" ? "Finish & Lock Results" : "Selesai & Kunci Hasil"}
                      </span>
                      <i className="fa-solid fa-chevron-right text-xs"></i>
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
