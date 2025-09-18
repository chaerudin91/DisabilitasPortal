import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, User, Briefcase, GraduationCap, Code, Palette, Megaphone, CheckCircle, Check } from 'lucide-react'; // Tambah ikon Check

const steps = [
  { id: 1, name: 'Info Pribadi' },
  { id: 2, name: 'Minat & Keahlian' },
  { id: 3, name: 'Tujuan Utama' },
  { id: 4, name: 'Ringkasan' }
];

const interestOptions = [
    { name: 'Teknologi', icon: <Code/> },
    { name: 'Desain Kreatif', icon: <Palette/> },
    { name: 'Marketing', icon: <Megaphone/> },
    { name: 'Karir Lainnya', icon: <Briefcase/> }
];

const goalOptions = [
    { name: 'Mencari Pekerjaan', icon: <Briefcase/> },
    { name: 'Belajar Skill Baru', icon: <GraduationCap/> }
];

export default function AssessmentModal({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: (results: any) => void; }) {
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    experienceLevel: '',
    interests: [] as string[],
    primaryGoal: ''
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length + 1));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  
  const toggleInterest = (interest: string) => {
      setFormData(prev => ({
          ...prev,
          interests: prev.interests.includes(interest) 
              ? prev.interests.filter(i => i !== interest)
              : [...prev.interests, interest]
      }));
  };

  const handleSubmit = () => {
      setIsFinished(true);
      setTimeout(() => {
          onComplete(formData);
      }, 2000); // Tampilkan layar sukses selama 2 detik
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-700/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {isFinished ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-96">
                    <CheckCircle size={64} className="text-green-500 mb-4"/>
                    <h2 className="text-2xl font-bold text-slate-900">Terima Kasih!</h2>
                    <p className="text-slate-600 mt-2">Asesmen Anda telah kami terima. Kami akan segera mengarahkan Anda ke halaman yang paling sesuai.</p>
                </div>
            ) : (
                <>
                    <header className="p-6 border-b flex justify-between items-center flex-shrink-0">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Asesmen Personal</h2>
                            <p className="text-sm text-slate-500">Bantu kami memahami Anda lebih baik.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-600"/></button>
                    </header>
                    
                    <div className="p-6 flex-shrink-0">
                        <div className="flex justify-between items-center -mx-4 sm:-mx-0"> {/* Adjusted margin for small screens */}
                            {steps.map((s, index) => (
                                <div key={s.id} className="flex items-center flex-1 sm:flex-none justify-center sm:justify-start px-2 sm:px-0"> {/* Added justify-center for items */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {step > s.id ? <Check size={16}/> : s.id}
                                    </div>
                                    <p className={`ml-2 text-sm hidden sm:block ${step >= s.id ? 'font-semibold text-indigo-600' : 'text-slate-500'} whitespace-nowrap`}> {/* Added whitespace-nowrap and ml-2 */}
                                        {s.name}
                                    </p>
                                    {index < steps.length - 1 && <div className={`h-1 w-4 sm:w-12 md:w-20 ml-2 sm:ml-4 transition-colors ${step > s.id ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>} {/* Adjusted ml for line */}
                                </div>
                            ))}
                        </div>
                    </div>

                    <main className="flex-grow p-6 overflow-y-auto bg-slate-50">
                        <AnimatePresence mode="wait">
                            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-xl text-slate-800">Mari kita mulai dengan perkenalan.</h3>
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Siapa nama Anda?</label>
                                            {/* PERBAIKAN: Input nama sekarang berwarna putih */}
                                            <input type="text" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contoh: Budi Santoso"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Apa level pengalaman Anda saat ini?</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Pemula', 'Menengah', 'Mahir'].map(level => (
                                                    <button key={level} onClick={() => setFormData({...formData, experienceLevel: level})} className={`p-3 text-center rounded-lg border-2 ${formData.experienceLevel === level ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white border-slate-300 hover:border-indigo-400 text-slate-800'}`}>
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {step === 2 && (
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800">Apa bidang yang paling menarik bagi Anda?</h3>
                                        <p className="text-slate-600 text-sm mb-4">Pilih satu atau lebih.</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {interestOptions.map(opt => (
                                                <button key={opt.name} onClick={() => toggleInterest(opt.name)} className={`p-4 text-center rounded-lg border-2 flex flex-col items-center justify-center gap-2 ${formData.interests.includes(opt.name) ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white border-slate-300 hover:border-indigo-400 text-slate-800'}`}>
                                                    {opt.icon}
                                                    <span className="font-semibold">{opt.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {step === 3 && (
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800">Apa tujuan utama Anda bergabung?</h3>
                                        <p className="text-slate-600 text-sm mb-4">Pilih salah satu yang paling sesuai.</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {goalOptions.map(opt => (
                                                <button key={opt.name} onClick={() => setFormData({...formData, primaryGoal: opt.name})} className={`p-4 text-center rounded-lg border-2 flex flex-col items-center justify-center gap-2 ${formData.primaryGoal === opt.name ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white border-slate-300 hover:border-indigo-400 text-slate-800'}`}>
                                                    {opt.icon}
                                                    <span className="font-semibold">{opt.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                 {step === 4 && (
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-xl text-slate-800">Ringkasan Jawaban</h3>
                                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 space-y-2 text-sm">
                                            <p><strong>Nama:</strong> {formData.name || '-'}</p>
                                            <p><strong>Level Pengalaman:</strong> {formData.experienceLevel || '-'}</p>
                                            <p><strong>Minat:</strong> {formData.interests.join(', ') || '-'}</p>
                                            <p><strong>Tujuan Utama:</strong> {formData.primaryGoal || '-'}</p>
                                        </div>
                                        <p className="text-xs text-slate-500">Pastikan semua jawaban sudah benar sebelum mengirim.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    <footer className="p-6 border-t bg-white flex justify-between items-center flex-shrink-0">
                        <button onClick={handleBack} disabled={step === 1} className="px-6 py-2 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
                            Kembali
                        </button>
                        {step < steps.length ? (
                            <button onClick={handleNext} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                                Lanjutkan
                            </button>
                        ) : (
                            <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                                Selesai & Kirim
                            </button>
                        )}
                    </footer>
                </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}