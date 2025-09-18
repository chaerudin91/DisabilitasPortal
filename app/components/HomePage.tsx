import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Users, 
  Target, 
  Award, 
  CheckCircle, 
  Play, 
  Eye,
  Hand,
  MessageSquare,
  ArrowRight,
  BookOpen,
  Briefcase,
  Heart,
  Zap,
  Shield,
  Star,
  Clock,
  Globe,
  Accessibility,
  X,
  User,
  GraduationCap,
  TrendingUp,
  Brain,
  Smartphone,
  Volume2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
// Pastikan path './AssessmentModal' ini sudah benar sesuai struktur folder Anda
import AssessmentModal from './AssessmentModal';


const fiturUnggulan = [
  {
    title: "Portal Karir Terkurasi",
    description: "Temukan lowongan pekerjaan dari perusahaan terverifikasi yang ramah Tuli dan mengutamakan aksesibilitas.",
    icon: <Briefcase size={28} />,
    color: "from-indigo-500 to-purple-500",
    page: "job-portal"
  },
  {
    title: "Workshop Peningkatan Skill",
    description: "Ikuti kelas dan pelatihan yang dirancang dengan materi visual dan dukungan penuh Bahasa Isyarat Indonesia (Bisindo).",
    icon: <GraduationCap size={28} />,
    color: "from-blue-500 to-cyan-500",
    page: "workshop"
  },
  {
    title: "Dukungan Kesehatan Mental",
    description: "Dapatkan dukungan emosional kapan saja melalui chatbot AI yang dirancang khusus untuk memberikan ruang aman.",
    icon: <Heart size={28} />,
    color: "from-pink-500 to-red-500",
    page: "mental-health"
  },
  {
    title: "Alat Bantu Real-time",
    description: "Manfaatkan teknologi transkripsi suara-ke-teks untuk membantu komunikasi sehari-hari dan profesional Anda.",
    icon: <Zap size={28} />,
    color: "from-amber-500 to-orange-500",
    page: "tools"
  }
];

const testimoniPengguna = [
  {
    nama: "Budi Santoso",
    peran: "Graphic Designer di KreatifKita",
    kutipan: "Melalui platform ini, saya tidak hanya menemukan pekerjaan impian, tetapi juga workshop desain yang meningkatkan portofolio saya secara signifikan. Dukungan Bisindo-nya luar biasa!",
    rating: 5
  },
  {
    nama: "Citra Lestari",
    peran: "Mahasiswi & Aktivis Tuli",
    kutipan: "Fitur dukungan kesehatan mentalnya sangat membantu saya melewati masa-masa sulit. Saya merasa didengar dan tidak sendirian. Terima kasih!",
    rating: 5
  },
  {
    nama: "Agus Wijaya",
    peran: "Web Developer di TechNusantara",
    kutipan: "Awalnya saya ragu bisa berkarir di bidang teknologi. Tapi asesmen karir dan lowongan yang terverifikasi di sini membuka jalan bagi saya. Sangat direkomendasikan!",
    rating: 5
  }
];


// --- Komponen Utama ---

export default function HomePage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimoniPengguna.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);
  
  const handleAssessmentComplete = (results: Record<string, any>) => {
    setShowAssessment(false);
    // Logika untuk mengarahkan pengguna setelah asesmen selesai
    if (results.primaryGoal === 'Mencari Pekerjaan') {
      setCurrentPage('job-portal');
    } else if (results.primaryGoal === 'Belajar Skill Baru') {
      setCurrentPage('workshop');
    } else {
      setCurrentPage('job-portal'); // Default
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-full text-sm font-semibold mb-6 shadow-md border border-slate-200/50">
            <Accessibility className="w-4 h-4 mr-2" />
            Platform #1 untuk Komunitas Tuli Indonesia
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Memberdayakan Potensi,
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Membuka Peluang
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Satu-satunya platform terintegrasi di Indonesia untuk karir, edukasi, dan dukungan kesehatan mental yang dirancang sepenuhnya aksesibel bagi komunitas Tuli.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowAssessment(true)}
              className="group bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span>Mulai Asesmen Gratis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300 shadow-md border border-slate-200/80 transform hover:-translate-y-1"
            >
              Lihat Semua Fitur
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
                <p className="text-4xl font-bold text-indigo-600">2,500+</p>
                <p className="text-slate-500 mt-1">Pekerjaan Terverifikasi</p>
            </div>
            <div className="p-4">
                <p className="text-4xl font-bold text-purple-600">150+</p>
                <p className="text-slate-500 mt-1">Workshop Kejuruan</p>
            </div>
            <div className="p-4">
                <p className="text-4xl font-bold text-green-600">1,200+</p>
                <p className="text-slate-500 mt-1">Pengguna Aktif</p>
            </div>
            <div className="p-4">
                <p className="text-4xl font-bold text-blue-600">98%</p>
                <p className="text-slate-500 mt-1">Tingkat Kepuasan</p>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Satu Platform, Semua Kebutuhan Anda</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">Empat pilar utama kami yang dirancang untuk mendukung perjalanan karir dan personal Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {fiturUnggulan.map((fitur) => (
                    <div key={fitur.title} onClick={() => setCurrentPage(fitur.page)} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/50 group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${fitur.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                            {fitur.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{fitur.title}</h3>
                        <p className="text-slate-600 mb-4">{fitur.description}</p>
                        <span className="font-semibold text-indigo-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                            Jelajahi Fitur <ArrowRight size={16}/>
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Apa Kata Komunitas Kami</h2>
            <div className="relative h-48">
                <AnimatePresence>
                    <motion.div
                        key={currentTestimonial}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <blockquote className="text-xl md:text-2xl text-indigo-100 italic">"{testimoniPengguna[currentTestimonial].kutipan}"</blockquote>
                        <p className="mt-6 font-semibold text-white">{testimoniPengguna[currentTestimonial].nama}</p>
                        <p className="text-indigo-200">{testimoniPengguna[currentTestimonial].peran}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
             <div className="flex justify-center space-x-2 mt-8">
                {testimoniPengguna.map((_, index) => (
                    <button key={index} onClick={() => setCurrentTestimonial(index)} className={`h-2 rounded-full transition-all duration-300 ${currentTestimonial === index ? 'bg-white w-6' : 'bg-white/40 w-2 hover:bg-white/70'}`} />
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Siap Mengubah Masa Depan Anda?</h2>
            <p className="text-lg text-slate-600 mb-8">
                Bergabunglah dengan ribuan profesional Tuli yang telah menemukan karir dan meningkatkan skill bersama kami. Mulai dengan asesmen singkat untuk mendapatkan rekomendasi personal.
            </p>
            <button 
                onClick={() => setShowAssessment(true)}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
                <span>Ambil Asesmen Sekarang</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </section>

      {/* Assessment Modal */}
      <AnimatePresence>
          {showAssessment && (
              <AssessmentModal
                  isOpen={showAssessment}
                  onClose={() => setShowAssessment(false)}
                  onComplete={handleAssessmentComplete}
              />
          )}
      </AnimatePresence>
    </div>
  );
}