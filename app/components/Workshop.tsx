import React, { useState, useEffect } from 'react';
import {
  Clock, Users, Star, Calendar, CheckCircle, Play, BookOpen, Medal, Filter, Search, Video,
  FileText, MessageCircle, TrendingUp, Code, Palette, Megaphone, X, ArrowRight, Accessibility, Heart,
  Award, User, DollarSign, Check, Wrench, BarChart, Coffee, Hand, PlayCircle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- INTERFACES & DATA ---
interface WorkshopModule {
  title: string;
  description: string;
}
interface WorkshopReview {
  name: string;
  review: string;
  rating: number;
}
interface Workshop {
  id: number;
  title: string;
  instructor: string;
  instructorImage: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  thumbnail: string;
  category: string;
  price: string;
  enrolled: number;
  rating: number;
  skillTags: string[];
  deafFriendlyScore: number;
  language: string[];
  certificateIncluded: boolean;
  modules: WorkshopModule[];
  tools: string[];
  reviews: WorkshopReview[];
  learningOutcomes: string[];
}
interface EnrollmentStatus {
  workshopId: number;
  status: 'enrolled' | 'in-progress' | 'completed';
}

const enhancedWorkshops: Workshop[] = [
    {
    id: 1,
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Sarah Johnson",
    instructorImage: "https://i.pravatar.cc/150?u=sarah",
    duration: "12 Minggu",
    level: "Beginner",
    description: "Kuasai pengembangan web dari nol. Belajar HTML, CSS, JavaScript, React, dan Node.js dengan proyek dunia nyata dan dukungan penuh Bahasa Isyarat (ASL).",
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    category: "Technology",
    price: "Rp 2,500,000",
    enrolled: 245,
    rating: 4.9,
    skillTags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    deafFriendlyScore: 98,
    language: ["English", "ASL", "Indonesian"],
    certificateIncluded: true,
    tools: ["VS Code", "GitHub", "Figma"],
    learningOutcomes: ["Membangun website responsif", "Membuat aplikasi web", "Memahami framework modern"],
    modules: [
      { title: "Module 1: Intro to HTML & CSS", description: "Learn the basic building blocks of the web." },
      { title: "Module 2: JavaScript Fundamentals", description: "Master the logic of web interactivity." },
      { title: "Module 3: React & Modern Frontend", description: "Build dynamic user interfaces." },
      { title: "Module 4: Backend with Node.js", description: "Create servers and APIs." }
    ],
    reviews: [
      { name: "Andi", review: "Kelas terbaik! Instrukturnya sangat jelas dan visual.", rating: 5 },
      { name: "Bunga", review: "Dukungan ASL-nya sangat membantu saya.", rating: 5 }
    ]
  },
  {
    id: 4,
    title: "Desain UX/UI untuk Aksesibilitas",
    instructor: "Alex Thompson",
    instructorImage: "https://i.pravatar.cc/150?u=alex",
    duration: "6 Minggu",
    level: "Beginner",
    description: "Pelajari cara merancang pengalaman pengguna yang inklusif dan dapat diakses oleh semua orang, dengan fokus khusus pada kebutuhan Tuli.",
    thumbnail: "https://ideoworks.id/wp-content/uploads/2021/09/Artikel-31.png",
    category: "Design",
    price: "Rp 1,200,000",
    enrolled: 198,
    rating: 4.8,
    skillTags: ["Figma", "User Research", "Prototyping", "WCAG"],
    deafFriendlyScore: 99,
    language: ["English", "ASL"],
    certificateIncluded: true,
    tools: ["Figma", "Miro", "Maze"],
    learningOutcomes: ["Merancang antarmuka yang aksesibel", "Melakukan riset pengguna", "Membuat prototipe interaktif"],
    modules: [
      { title: "Week 1-2: Design Thinking", description: "Understanding user needs." },
      { title: "Week 3-4: Prototyping in Figma", description: "Bringing ideas to life." },
      { title: "Week 5-6: Usability Testing", description: "Testing with real users." }
    ],
    reviews: [
      { name: "Citra", review: "Membuka mata saya tentang pentingnya aksesibilitas.", rating: 5 },
    ]
  },
    {
    id: 7,
    title: "Digital Marketing & SEO",
    instructor: "Michael Chen",
    instructorImage: "https://i.pravatar.cc/150?u=michael",
    duration: "6 Minggu",
    level: "Intermediate",
    description: "Tingkatkan skill marketing Anda dengan strategi digital modern, termasuk SEO, social media marketing, dan analisis data, dengan interpretasi ASL penuh.",
    thumbnail: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
    category: "Marketing",
    price: "Rp 1,100,000",
    enrolled: 156,
    rating: 4.8,
    skillTags: ["SEO", "Social Media", "Google Analytics"],
    deafFriendlyScore: 95,
    language: ["English", "ASL", "Indonesian"],
    certificateIncluded: true,
    tools: ["Google Analytics", "SEMrush", "Canva"],
    learningOutcomes: ["Membuat kampanye marketing", "Menganalisa performa", "Membangun strategi brand"],
    modules: [
        { title: "SEO Foundation", description: "Learn search engine optimization." },
        { title: "Social Media Campaign", description: "Mastering social media ads." },
        { title: "Analytics & Reporting", description: "Understanding the data." },
    ],
    reviews: [
        { name: "Dian", review: "Studi kasusnya sangat relevan!", rating: 4.5 },
    ]
  },
];

const categories = [
    { id: 'all', name: 'Semua Kategori', icon: <BookOpen size={16}/> },
    { id: 'Technology', name: 'Teknologi', icon: <Code size={16}/> },
    { id: 'Design', name: 'Desain', icon: <Palette size={16}/> },
    { id: 'Marketing', name: 'Marketing', icon: <Megaphone size={16}/> },
];

const levels = ['Semua Level', 'Beginner', 'Intermediate', 'Advanced'];


// --- MAIN COMPONENT ---
export default function WorkshopMarketplace() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('Semua Level');
  const [enrollmentStatuses, setEnrollmentStatuses] = useState<EnrollmentStatus[]>([]);

  useEffect(() => {
    try {
      const savedEnrollments = localStorage.getItem('workshopEnrollmentsV3');
      if (savedEnrollments) setEnrollmentStatuses(JSON.parse(savedEnrollments));
    } catch (error) { console.error("Gagal memuat data pendaftaran:", error); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('workshopEnrollmentsV3', JSON.stringify(enrollmentStatuses));
    } catch (error) { console.error("Gagal menyimpan data pendaftaran:", error); }
  }, [enrollmentStatuses]);

  const handleEnroll = (workshop: Workshop) => {
    if (enrollmentStatuses.some(e => e.workshopId === workshop.id)) return;
    const newEnrollment: EnrollmentStatus = { workshopId: workshop.id, status: 'enrolled' };
    setEnrollmentStatuses(prev => [...prev, newEnrollment]);
    setSelectedWorkshop(null);
  };
  
  const filteredWorkshops = enhancedWorkshops.filter(workshop => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchLower === '' ||
        workshop.title.toLowerCase().includes(searchLower) ||
        workshop.instructor.toLowerCase().includes(searchLower) ||
        workshop.skillTags.some(tag => tag.toLowerCase().includes(searchLower));
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory;
    const matchesLevel = selectedLevel === 'Semua Level' || workshop.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="relative bg-indigo-600 p-8 md:p-12 rounded-2xl text-white text-center overflow-hidden mb-12">
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -right-4 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Temukan Skill Baru Anda</h1>
                <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-6">Workshop interaktif dengan dukungan penuh Bahasa Isyarat, dirancang untuk kesuksesan Anda.</p>
                <div className="relative max-w-lg mx-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari workshop impianmu..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      className="w-full pl-14 pr-4 py-3 border-0 bg-white rounded-full text-slate-800 shadow-lg focus:ring-4 focus:ring-purple-300 transition" 
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 sticky top-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
             <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 block mb-3">Kategori</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full flex items-center space-x-3 text-left p-2.5 rounded-lg transition-colors text-sm ${selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-100 text-slate-600'}`}>
                        {cat.icon}
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="level" className="text-base font-semibold text-slate-800 block mb-2">Level</label>
                  <select 
                    id="level" 
                    value={selectedLevel} 
                    onChange={e => setSelectedLevel(e.target.value)} 
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    {levels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
             </div>
          </aside>

          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{filteredWorkshops.length} Workshop Ditemukan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWorkshops.map(workshop => {
                  const isEnrolled = enrollmentStatuses.some(e => e.workshopId === workshop.id);
                  return <WorkshopCard key={workshop.id} workshop={workshop} onSelect={() => setSelectedWorkshop(workshop)} isEnrolled={isEnrolled} />;
              })}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedWorkshop && (
          <WorkshopDetailModal
            workshop={selectedWorkshop}
            onClose={() => setSelectedWorkshop(null)}
            onEnroll={() => handleEnroll(selectedWorkshop)}
            isEnrolled={enrollmentStatuses.some(e => e.workshopId === selectedWorkshop.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const WorkshopCard = ({ workshop, onSelect, isEnrolled }: { workshop: Workshop; onSelect: () => void; isEnrolled: boolean; }) => {
  return (
    <div onClick={onSelect} className="bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img src={workshop.thumbnail} alt={workshop.title} className="h-44 w-full object-cover"/>
        {isEnrolled && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                <CheckCircle size={14}/> Terdaftar
            </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">{workshop.category}</p>
            {workshop.language.includes('ASL') && 
                <div className="flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full" title="Dukungan Bahasa Isyarat">
                    <Hand size={12}/> ASL
                </div>
            }
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">{workshop.title}</h3>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <img src={workshop.instructorImage} alt={workshop.instructor} className="w-6 h-6 rounded-full" />
            <span>{workshop.instructor}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-slate-600 border-t pt-4">
            <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current"/> <span className="font-bold">{workshop.rating}</span> <span className="text-slate-500">({workshop.enrolled})</span></div>
            <div className="font-bold text-lg text-indigo-600">{workshop.price}</div>
        </div>
      </div>
    </div>
  );
};

const WorkshopDetailModal = ({ workshop, onClose, onEnroll, isEnrolled }: { workshop: Workshop; onClose: () => void; onEnroll: () => void; isEnrolled: boolean; }) => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-slate-50 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
                <header className="relative h-60 rounded-t-2xl">
                    <img src={workshop.thumbnail} alt={workshop.title} className="w-full h-full object-cover rounded-t-2xl"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors z-10"><X size={20} /></button>
                    <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-sm font-semibold">{workshop.category}</p>
                        <h2 className="text-3xl font-bold">{workshop.title}</h2>
                    </div>
                </header>
                
                <main className="flex-grow p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                             <div className="flex border-b border-slate-200 mb-6">
                                <TabButton name="overview" activeTab={activeTab} setActiveTab={setActiveTab}>Overview</TabButton>
                                <TabButton name="curriculum" activeTab={activeTab} setActiveTab={setActiveTab}>Kurikulum</TabButton>
                                <TabButton name="reviews" activeTab={activeTab} setActiveTab={setActiveTab}>Ulasan</TabButton>
                            </div>
                            
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'overview' && (
                                        <div className="space-y-4 text-slate-600">
                                            <h3 className="font-semibold text-lg text-slate-800">Deskripsi Kelas</h3>
                                            <p>{workshop.description}</p>
                                            <h3 className="font-semibold text-lg text-slate-800 pt-4">Yang Akan Kamu Pelajari</h3>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                                {workshop.learningOutcomes.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0"/>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {activeTab === 'curriculum' && (
                                        <div className="space-y-4">
                                            {workshop.modules.map((module, i) => (
                                                <div key={i} className="p-4 border rounded-lg bg-white">
                                                    <p className="font-semibold text-slate-800">{`Modul ${i+1}: ${module.title}`}</p>
                                                    <p className="text-sm text-slate-600">{module.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === 'reviews' && (
                                        <div className="space-y-4">
                                            {workshop.reviews.map((review, i) => (
                                                <div key={i} className="p-4 border rounded-lg bg-white">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-semibold text-slate-800">{review.name}</p>
                                                        <div className="flex items-center gap-1 text-sm"><Star size={16} className="text-yellow-400 fill-current"/> {review.rating.toFixed(1)}</div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 italic">"{review.review}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="md:col-span-1">
                            <div className="bg-white p-5 rounded-xl border sticky top-0">
                                <div className="text-3xl font-bold text-indigo-600 mb-4">{workshop.price}</div>
                                {isEnrolled ? (
                                    <button className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md">
                                        <PlayCircle size={18}/> Lanjutkan Belajar
                                    </button>
                                ) : (
                                    <button onClick={onEnroll} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                                        Daftar di Kelas Ini
                                    </button>
                                )}
                                <div className="space-y-3 text-sm pt-4 mt-4 border-t">
                                    <InfoItem icon={<Medal size={16}/>} label="Level" value={workshop.level} />
                                    <InfoItem icon={<Clock size={16}/>} label="Durasi" value={workshop.duration} />
                                    <InfoItem icon={<Hand size={16}/>} label="Bahasa" value={workshop.language.join(', ')} />
                                    <InfoItem icon={<Award size={16}/>} label="Sertifikat" value={workshop.certificateIncluded ? 'Termasuk' : 'Tidak ada'} />
                                    <InfoItem icon={<Wrench size={16}/>} label="Tools" value={workshop.tools.join(', ')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </motion.div>
        </motion.div>
    );
};

const TabButton = ({ name, activeTab, setActiveTab, children }: { name: string; activeTab: string; setActiveTab: (name: string) => void; children: React.ReactNode }) => (
  <button onClick={() => setActiveTab(name)} className={`px-1 pb-2 mr-6 text-sm font-semibold transition-colors ${activeTab === name ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
    {children}
  </button>
);

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex justify-between items-center text-slate-600">
        <span className="flex items-center gap-2.5 font-medium text-slate-700">{icon} {label}</span>
        <span className="text-right">{value}</span>
    </div>
);