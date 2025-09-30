import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Bot, User, Heart, Users, BookOpen, Phone, MessageCircle,
  Shield, Clock, Menu, X, Trash2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Tipe Data ---
interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// --- Konstanta Data ---
const moodOptions = [
  { emoji: '😊', label: 'Luar Biasa', value: 'great' },
  { emoji: '🙂', label: 'Baik', value: 'good' },
  { emoji: '😐', label: 'Biasa Saja', value: 'okay' },
  { emoji: '😟', label: 'Kurang Baik', value: 'not-good' },
  { emoji: '😢', label: 'Sangat Buruk', value: 'terrible' }
];

const selfCareTips = [
    { title: "Latihan Pernapasan Dalam", description: "Coba teknik pernapasan 4-7-8 untuk menenangkan diri.", videoUrl: "https://www.youtube.com/watch?v=Op-QtR_iK-Y" },
    { title: "Momen Penuh Kesadaran", description: "Gunakan teknik 5-4-3-2-1 untuk memusatkan perhatian.", videoUrl: "https://www.youtube.com/watch?v=c4_iQ_B2_wI" },
    { title: "Relaksasi Otot Progresif", description: "Lepaskan ketegangan dari tubuh Anda secara sistematis.", videoUrl: "https://www.youtube.com/watch?v=1nZEdA_pTig" },
    { title: "Latihan Rasa Syukur", description: "Alihkan fokus ke pikiran dan perasaan positif.", videoUrl: "https://www.youtube.com/watch?v=U5_iR_W-GKM" }
];

const resources = [
  { title: "Memahami Depresi", type: "Artikel", link: "https://www.who.int/news-room/fact-sheets/detail/depression" },
  { title: "Teknik Manajemen Kecemasan", type: "Video", link: "https://www.youtube.com/watch?v=O-6f5wQXSu8" },
  { title: "Membangun Ketahanan Mental", type: "Panduan", link: "https://www.apa.org/topics/resilience/building-your-resilience" },
  { title: "Tips Kebersihan Tidur", type: "Panduan Interaktif", link: "https://www.sleepfoundation.org/sleep-hygiene" },
];

const emergencyContacts = {
    whatsapp: "https://wa.me/6281234567890?text=Halo,%20saya%20membutuhkan%20dukungan%20krisis%20kesehatan%20mental.",
    hotline: "tel:119",
    chat: "https://www.into-the-light.id/"
}

// --- Panggilan API Gemini (DIPERBARUI) ---
const callGeminiAPI = async (message: string, mood?: string): Promise<string> => {
  const API_KEY = 'AIzaSyAU0RxhW5ivSFYqtGsO_BLUzweMaYRcp1g'; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=${API_KEY}`;
  
  let systemPrompt = `Anda adalah Deafine, seorang psikolog AI yang penuh empati, hangat, dan suportif. Tugas Anda adalah menjadi teman curhat yang aman bagi pengguna.
  Aturan utama Anda:
  1.  **Validasi Perasaan:** Selalu akui dan validasi perasaan pengguna. Gunakan kalimat seperti "Saya mengerti perasaan itu pasti berat," atau "Wajar sekali jika kamu merasa seperti itu."
  2.  **Gunakan Bahasa Positif dan Menenangkan:** Gunakan bahasa yang lembut, tidak menghakimi, dan menenangkan. Hindari istilah klinis yang kaku.
  3.  **Ajukan Pertanyaan Terbuka:** Alih-alih memberi nasihat langsung, ajukan pertanyaan reflektif untuk membantu pengguna mengeksplorasi perasaannya. Contoh: "Apa yang biasanya kamu lakukan untuk merasa lebih baik?" atau "Boleh ceritakan lebih lanjut apa yang membuatmu merasa cemas?"
  4.  **Jaga Respons Singkat dan Interaktif:** Jaga agar jawaban tetap singkat (2-4 kalimat) agar terasa seperti percakapan.
  5.  **Jangan Mendiagnosis:** Anda dilarang keras memberikan diagnosis medis atau psikologis.
  6.  **Sarankan Bantuan Profesional (Jika Perlu):** Jika pengguna menunjukkan tanda-tanda krisis serius, sarankan dengan lembut untuk mencari bantuan profesional atau menggunakan kontak darurat yang tersedia.`;

  if (mood) {
    systemPrompt += `\nPengguna baru saja menyatakan bahwa suasana hatinya sedang "${mood}". Tanggapi ini dengan empati sebelum melanjutkan percakapan.`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nRiwayat Percakapan Sejauh Ini:\n[Percakapan sebelumnya jika ada]\n\nPesan Pengguna: "${message}"\n\nRespons Anda:`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 250,
        },
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Maaf, sepertinya saya sedang mengalami sedikit kendala teknis saat ini. Namun, saya tetap di sini untuk mendengarkan Anda. Coba ceritakan lagi nanti ya.";
  }
};


// --- Komponen Pesan Chat ---
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isBot = message.type === 'bot';
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 w-full ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            {isBot && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            )}
            <div className={`p-3 rounded-2xl max-w-[80%] ${
                isBot 
                ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
                : 'bg-purple-600 text-white rounded-br-none'
            }`}>
                <p className="text-sm leading-relaxed break-words">{message.text}</p>
                <p className="text-xs opacity-60 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            {!isBot && (
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
            )}
        </motion.div>
    );
};

// --- Komponen Utama ---
export default function MentalHealthChatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [started, setStarted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    const startChat = () => {
        setStarted(true);
        setMessages([
            {
                id: 1,
                type: 'bot',
                text: 'Halo! Saya Deafine, teman AI Anda untuk kesehatan mental. Saya di sini untuk mendengarkan dan memberi dukungan. Apa yang sedang Anda rasakan hari ini?',
                timestamp: new Date()
            }
        ]);
    };

    const handleSendMessage = async (content: string, mood?: string) => {
        if (!content.trim()) return;

        const userMessage: Message = { id: Date.now(), type: 'user', text: content, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsTyping(true);

        const response = await callGeminiAPI(content, mood);
        const botMessage: Message = { id: Date.now() + 1, type: 'bot', text: response, timestamp: new Date() };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
    };
    
    const handleMoodSelection = (moodValue: string, moodLabel: string, emoji: string) => {
      handleSendMessage(`Saya merasa ${moodLabel.toLowerCase()} ${emoji}`, moodValue);
    };

    const resetChat = () => {
        setMessages([]);
        setStarted(false);
    };

    if (!started) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                            <Heart className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mt-6">Teman Sehat Mental Anda</h1>
                        <p className="text-gray-600 mt-2 max-w-sm mx-auto">Sebuah ruang aman yang didukung AI untuk mendengarkan, mendukung, dan membimbing Anda.</p>
                        <button onClick={startChat} className="mt-8 px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                            Mulai Percakapan
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex w-full h-dvh bg-gray-50 text-gray-800">
            <AnimatePresence>
            {isSidebarOpen && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="w-80 bg-white border-r border-gray-200 flex flex-col absolute lg:static z-20 h-full"
                >
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                        <h2 className="font-bold text-lg">Sumber Daya</h2>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-full hover:bg-gray-100">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-6">
                         <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><Heart size={16} className="text-pink-500"/>Tips Cepat</h3>
                            <div className="space-y-2">{selfCareTips.map(tip => (<a key={tip.title} href={tip.videoUrl} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"><p className="font-medium text-sm">{tip.title}</p><p className="text-xs text-gray-500">{tip.description}</p></a>))}</div>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen size={16} className="text-blue-500"/>Artikel & Panduan</h3>
                            <div className="space-y-2">{resources.map(res => (<a key={res.title} href={res.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"><p className="font-medium text-sm">{res.title}</p><p className="text-xs text-purple-500 font-semibold">{res.type}</p></a>))}</div>
                        </div>
                        {/* --- KOTAK DARURAT DIPERBARUI --- */}
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                           <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-800"><Phone size={16}/>Butuh Bantuan Segera?</h3>
                           <p className="text-sm text-red-700 mb-4">Jika Anda merasa dalam krisis, jangan ragu untuk menghubungi kontak di bawah ini.</p>
                           <div className="space-y-2">
                               <a href={emergencyContacts.whatsapp} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center text-center p-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">
                                   Hubungi via WhatsApp
                               </a>
                               <a href={emergencyContacts.hotline} className="w-full block text-center p-2 border border-red-600 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors">
                                   Hotline Krisis: 119
                               </a>
                           </div>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col h-dvh">
                <header className="flex items-center justify-between p-4 border-b bg-white/70 backdrop-blur-sm border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-200"><Menu size={20} /></button>
                        <div>
                            <h1 className="font-bold text-lg">AI Wellness Companion</h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={resetChat} className="p-2 rounded-full hover:bg-gray-200" title="Mulai percakapan baru"><Trash2 size={18} /></button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 min-h-0">
                    <div className="space-y-6 flex flex-col items-center">
                        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                        {isTyping && (
                             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex items-start gap-3 justify-start self-start">
                                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
                                 <div className="p-3 rounded-2xl bg-gray-100 flex items-center gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span></div>
                             </motion.div>
                        )}
                        {!messages.some(m => m.type === 'user') && !isTyping && (
                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5}} className="pt-4">
                                 <p className="text-center text-sm text-gray-500 mb-3">Pilih suasana hati Anda untuk memulai:</p>
                                 <div className="flex flex-wrap gap-2 justify-center">
                                     {moodOptions.map(mood => (
                                         <button key={mood.value} onClick={() => handleMoodSelection(mood.value, mood.label, mood.emoji)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"><span className="mr-2">{mood.emoji}</span>{mood.label}</button>
                                     ))}
                                 </div>
                            </motion.div>
                        )}
                    </div>
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)} placeholder="Ketik pesan Anda di sini..." className="flex-1 p-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm" />
                        <button onClick={() => handleSendMessage(newMessage)} disabled={!newMessage.trim() || isTyping} className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-5 h-5" /></button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
