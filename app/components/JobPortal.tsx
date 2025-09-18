import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Briefcase, 
  Accessibility,
  Star,
  Building,
  DollarSign,
  Users,
  Eye,
  Heart,
  Share2,
  Send,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Globe,
  Zap,
  Shield,
  Code,
  Palette,
  BookOpen,
  Stethoscope,
  Calculator,
  Megaphone,
  ChevronDown,
  X,
  ExternalLink,
  Download,
  FileText,
  ArrowRight,
  Target,
  ChevronRight,
  ChevronLeft,
  Coffee,
  Camera,
  Scissors,
  Home,
  Utensils,
  Shirt,
  Car,
  Laptop,
  Package,
  Headphones,
  UploadCloud,
  Check
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- INTERFACES & DATA ---
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  accessibility: string;
  posted: string;
  logo?: string;
  rating?: number;
  employees?: string;
  benefits?: string[];
  category: string;
  experienceLevel: string;
  isRemote: boolean;
  urgency: 'low' | 'medium' | 'high';
  companyEmail: string;
  applicationDeadline: string;
  tags: string[];
  isAccessibilityVerified: boolean;
  deafFriendlyScore: number;
  recommendationScore?: number;
}

interface ApplicationStatus {
  jobId: number;
  status: 'applied' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  appliedDate: Date;
  lastUpdate: Date;
}

// NOTE: Please re-insert your full `enhancedJobs` data array here.
const enhancedJobs: Job[] = [
  {
    id: 1,
    title: "Interior Designer",
    company: "Modern Living Studio",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "Rp 8,000,000 - Rp 12,000,000",
    description: "Create stunning interior designs for residential and commercial spaces. Work with diverse clients to transform their vision into reality using visual design tools and 3D modeling software.",
    requirements: ["AutoCAD", "SketchUp", "3D Max", "Interior Design Certificate", "Portfolio", "Color Theory"],
    accessibility: "Visual collaboration tools, design presentations via screen sharing, written client communication, flexible meeting formats",
    posted: "1 day ago",
    rating: 4.8,
    employees: "20-50",
    benefits: ["Health Insurance", "Design Software License", "Creative Freedom", "Portfolio Building", "Flexible Schedule"],
    category: "Design",
    experienceLevel: "Mid",
    isRemote: false,
    urgency: "high",
    companyEmail: "careers@modernliving.co.id",
    applicationDeadline: "October 20, 2025",
    tags: ["Interior Design", "3D Modeling", "AutoCAD", "Creative", "Portfolio"],
    isAccessibilityVerified: true,
    deafFriendlyScore: 88
  },
  {
    id: 2,
    title: "Graphic Designer",
    company: "Creative Agency Hub",
    location: "Bandung, Indonesia",
    type: "Full-time",
    salary: "Rp 5,500,000 - Rp 8,000,000",
    description: "Design visual content for digital and print media. Create logos, brochures, social media graphics, and marketing materials for various clients.",
    requirements: ["Adobe Creative Suite", "Photoshop", "Illustrator", "InDesign", "Typography", "Brand Design"],
    accessibility: "Visual design tools, written feedback systems, screen-sharing presentations, email communication preferred",
    posted: "3 days ago",
    rating: 4.6,
    employees: "10-30",
    benefits: ["Adobe License", "Creative Projects", "Portfolio Development", "Flexible Hours", "Health Benefits"],
    category: "Design",
    experienceLevel: "Entry",
    isRemote: true,
    urgency: "medium",
    companyEmail: "jobs@creativehub.co.id",
    applicationDeadline: "October 25, 2025",
    tags: ["Graphic Design", "Adobe", "Creative", "Remote", "Digital Design"],
    isAccessibilityVerified: true,
    deafFriendlyScore: 85
  },
  {
    id: 7,
    title: "Junior Web Developer",
    company: "TechStart Indonesia",
    location: "Jakarta, Indonesia / Remote",
    type: "Full-time",
    salary: "Rp 7,000,000 - Rp 10,000,000",
    description: "Develop and maintain websites using modern technologies. Work with a supportive team to build responsive web applications and learn from experienced developers.",
    requirements: ["HTML", "CSS", "JavaScript", "React.js", "Git", "Responsive Design"],
    accessibility: "Remote work options, written communication, code review systems, accessible development tools",
    posted: "2 days ago",
    rating: 4.9,
    employees: "50-100",
    benefits: ["Remote Work", "Learning Budget", "Health Insurance", "Tech Equipment", "Career Development"],
    category: "Technology",
    experienceLevel: "Entry",
    isRemote: true,
    urgency: "high",
    companyEmail: "careers@techstart.co.id",
    applicationDeadline: "October 25, 2025",
    tags: ["Web Development", "JavaScript", "React", "Remote", "Junior Level"],
    isAccessibilityVerified: true,
    deafFriendlyScore: 95
  },
];


const categories = [
  { id: 'all', name: 'All Categories', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'Design', name: 'Design & Creative', icon: <Palette className="w-4 h-4" /> },
  { id: 'Technology', name: 'Technology', icon: <Code className="w-4 h-4" /> },
];


export default function JobPortalPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(enhancedJobs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [applications, setApplications] = useState<ApplicationStatus[]>([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [currentApplicationJob, setCurrentApplicationJob] = useState<Job | null>(null);

  // Load and save application state to localStorage
  useEffect(() => {
    const savedApps = localStorage.getItem('jobApplications');
    if (savedApps) setApplications(JSON.parse(savedApps));
  }, []);

  useEffect(() => {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
  }, [applications]);

  const filteredJobs = enhancedJobs.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    return (searchLower === '' || 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower)) &&
        (selectedCategory === 'all' || job.category === selectedCategory);
  });

  const handleApplyNow = (job: Job) => {
    setCurrentApplicationJob(job);
    setShowApplicationModal(true);
  };
  
  const submitApplication = () => {
    if (currentApplicationJob) {
      const newApplication: ApplicationStatus = {
        jobId: currentApplicationJob.id,
        status: 'applied',
        appliedDate: new Date(),
        lastUpdate: new Date(),
      };
      setApplications(prev => [...prev, newApplication]);
      // The modal will handle closing itself
    }
  };

  const getApplicationStatus = (jobId: number) => {
    return applications.find(app => app.jobId === jobId);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 relative">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Temukan Pekerjaan Impian Anda
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Jelajahi lowongan kerja yang ramah Tuli dan aksesibel di seluruh Indonesia.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* KOLOM KIRI: FILTER & LIST PEKERJAAN */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    {/* --- PERBAIKAN DI SINI --- */}
                    <input 
                      type="text" 
                      placeholder="Cari pekerjaan atau perusahaan..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition" 
                    />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
                    <h3 className="font-semibold mb-2">Kategori</h3>
                    <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                    </div>
                </div>
                <div className="flex-grow space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                    {filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} isSelected={selectedJob?.id === job.id} onSelect={() => setSelectedJob(job)} />
                    ))}
                </div>
            </div>

            {/* KOLOM KANAN: DETAIL PEKERJAAN */}
            <div className="lg:col-span-2 sticky top-6">
                {selectedJob ? (
                    <JobDetail job={selectedJob} onApplyNow={() => handleApplyNow(selectedJob)} applicationStatus={getApplicationStatus(selectedJob.id)} />
                ) : (
                    <div className="bg-white h-[80vh] flex flex-col items-center justify-center rounded-xl shadow-sm border text-center p-8">
                        <Briefcase size={48} className="text-slate-300 mb-4"/>
                        <h3 className="text-xl font-bold text-slate-800">Pilih Pekerjaan untuk Dilihat</h3>
                        <p className="text-slate-500">Detail lengkap akan muncul di sini.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      
      <AnimatePresence>
        {showApplicationModal && currentApplicationJob && (
          <ApplicationModal
            job={currentApplicationJob}
            onClose={() => setShowApplicationModal(false)}
            onSubmit={submitApplication}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const JobCard = ({ job, isSelected, onSelect }: { job: Job; isSelected: boolean; onSelect: () => void; }) => (
    <div onClick={onSelect} className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${isSelected ? 'bg-white border-indigo-500 shadow-lg' : 'bg-white/80 border-transparent hover:border-indigo-300 hover:bg-white'}`}>
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building size={24} className="text-slate-500"/>
            </div>
            <div className="flex-grow">
                <p className="text-sm font-semibold text-indigo-600">{job.company}</p>
                <h3 className="font-bold text-slate-800">{job.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={12}/>{job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/>{job.type}</span>
                </div>
            </div>
        </div>
    </div>
);

const JobDetail = ({ job, onApplyNow, applicationStatus }: { job: Job; onApplyNow: () => void; applicationStatus?: ApplicationStatus; }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
        <p className="text-lg font-medium text-indigo-600">{job.company}</p>
        <div className="flex items-center gap-4 text-sm text-slate-500 my-4">
            <span className="flex items-center gap-1.5"><MapPin size={14}/>{job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={14}/>{job.type}</span>
            <span className="flex items-center gap-1.5"><DollarSign size={14}/>{job.salary}</span>
        </div>
        
        {applicationStatus ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center justify-center gap-2 font-semibold mb-6">
                <CheckCircle size={18}/> Anda telah melamar pada {applicationStatus.appliedDate.toLocaleDateString()}
            </div>
        ) : (
            <button onClick={onApplyNow} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-center mb-6">
                Lamar Sekarang
            </button>
        )}

        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-slate-800 mb-2">Deskripsi Pekerjaan</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
            </div>
            <div>
                <h3 className="font-semibold text-slate-800 mb-2">Kualifikasi</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                    {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Accessibility size={18}/> Dukungan Aksesibilitas</h3>
                <p className="text-blue-700 text-sm">{job.accessibility}</p>
            </div>
        </div>
    </div>
);

const ApplicationModal = ({ job, onClose, onSubmit }: { job: Job; onClose: () => void; onSubmit: () => void; }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmit();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
      return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-500/30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl">
                  <CheckCircle size={56} className="text-green-500 mx-auto mb-4"/>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Aplikasi Terkirim!</h2>
                  <p className="text-slate-600 mb-6">Lamaran Anda untuk posisi {job.title} telah berhasil dikirim. Semoga berhasil!</p>
                  <button onClick={onClose} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                      Tutup
                  </button>
              </motion.div>
          </motion.div>
      );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-500/30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <header className="p-6 border-b flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Lamar untuk: {job.title}</h2>
            <p className="text-sm text-slate-500">di {job.company}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-600"/></button>
        </header>
        
        <div className="p-6 flex-shrink-0">
            <div className="flex items-center justify-between gap-4 mb-2">
                {[1, 2, 3].map(s => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center flex-grow">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {step > s ? <Check size={20}/> : s}
                            </div>
                            <span className={`text-xs mt-2 ${step >= s ? 'font-semibold text-indigo-600' : 'text-slate-500'}`}>
                                {s === 1 && "Informasi Pribadi"}
                                {s === 2 && "Unggah Dokumen"}
                                {s === 3 && "Tinjau & Kirim"}
                            </span>
                        </div>
                        {s < 3 && <div className={`flex-grow h-1 transition-colors rounded-full ${step > s ? 'bg-indigo-600' : 'bg-slate-200'} w-full`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <main className="flex-grow p-6 overflow-y-auto bg-slate-50">
          <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 job={job} />}
              </motion.div>
          </AnimatePresence>
        </main>

        <footer className="p-6 border-t bg-white flex justify-between items-center rounded-b-2xl flex-shrink-0">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-6 py-2 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
            <span className="flex items-center gap-1"><ChevronLeft size={16}/> Kembali</span>
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(s => Math.min(3, s + 1))} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              <span className="flex items-center gap-1">Lanjutkan <ChevronRight size={16}/></span>
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
              <span className="flex items-center gap-1">Kirim Lamaran <Send size={16}/></span>
            </button>
          )}
        </footer>
      </motion.div>
    </motion.div>
  );
};

const Step1 = () => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800">1. Informasi Pribadi</h3>
        <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input type="text" id="fullName" placeholder="Masukkan nama lengkap Anda" className="bg-white w-full p-2.5 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900"/>
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" id="email" placeholder="contoh@domain.com" className="bg-white w-full p-2.5 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900"/>
        </div>
         <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
            <input type="tel" id="phone" placeholder="+62 812 3456 7890" className="bg-white w-full p-2.5 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900"/>
        </div>
    </div>
);
const Step2 = () => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800">2. Unggah Dokumen</h3>
         <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Unggah CV/Resume Anda (.pdf, .docx)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-white hover:border-indigo-500 transition-all">
                <div className="space-y-1 text-center">
                    <UploadCloud size={48} className="mx-auto text-slate-400 mb-2"/>
                    <div className="flex text-sm text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                            <span>Unggah file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                        </label>
                        <p className="pl-1">atau tarik dan lepas</p>
                    </div>
                    <p className="text-xs text-slate-500">PDF, DOCX hingga 10MB</p>
                </div>
            </div>
        </div>
        <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-slate-700 mb-1">Surat Lamaran (Opsional)</label>
            <textarea id="coverLetter" rows={5} placeholder="Tulis surat lamaran Anda di sini atau lampirkan file terpisah..." className="bg-white w-full p-2.5 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900"/>
        </div>
    </div>
);
const Step3 = ({ job }: { job: Job }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800">3. Tinjau & Kirim</h3>
        <p className="text-slate-700">Harap tinjau kembali informasi Anda sebelum mengirimkan lamaran untuk posisi **{job.title}** di **{job.company}**.</p>
        
        <div className="p-5 bg-indigo-50 rounded-lg space-y-3 text-sm text-slate-800 border border-indigo-200">
            <p className="font-semibold text-base">Detail Lamaran Anda:</p>
            <p><strong>Posisi:</strong> {job.title}</p>
            <p><strong>Perusahaan:</strong> {job.company}</p>
            <p className="mt-4"><strong>Nama:</strong> [Nama Pengguna]</p>
            <p><strong>Email:</strong> [Email Pengguna]</p>
            <p><strong>Nomor Telepon:</strong> [Nomor Telepon Pengguna]</p>
            <p><strong>CV/Resume:</strong> [Nama File CV]</p>
            <p><strong>Surat Lamaran:</strong> [Isi Surat Lamaran atau 'Tidak Ada']</p>
            <AlertCircle size={16} className="inline-block mr-2 text-yellow-600"/>
            <span className="text-xs text-slate-600">
                Detail di atas adalah contoh. Pastikan data yang Anda masukkan pada langkah sebelumnya sudah benar.
            </span>
        </div>
        <div className="flex items-start gap-2 pt-4">
            <input type="checkbox" id="confirm" className="mt-1 accent-indigo-600 w-4 h-4"/>
            <label htmlFor="confirm" className="text-sm text-slate-700 cursor-pointer">Saya menyatakan bahwa informasi yang saya berikan adalah benar dan akurat.</label>
        </div>
    </div>
);