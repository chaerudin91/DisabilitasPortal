import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, StopCircle, Copy, Download, Trash2, Settings, Users, Plus, Edit2, Bot,
  Play, Pause, RotateCcw, FileText, Languages, Zap, Clock, AlertCircle, FileSignature
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- INTERFACES & DATA ---

interface TranscriptChunk {
  speakerId: number;
  text: string;
  timestamp: Date;
}

interface Speaker {
  id: number;
  name: string;
}

interface TranscriptionSession {
  id: string;
  chunks: TranscriptChunk[];
  speakers: Speaker[];
  timestamp: Date;
  duration: number;
  language: string;
  summary?: string;
}

const languages = [
  { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
];

// --- SIMULASI PANGGILAN API GEMINI UNTUK RINGKASAN ---
const callGeminiForSummary = async (transcript: string): Promise<string> => {
  console.log("Meminta ringkasan untuk transkrip:", transcript);
  await new Promise(resolve => setTimeout(resolve, 2500)); 
  
  return `**Ringkasan Diskusi Utama:**\nPara peserta mendiskusikan pentingnya desain antarmuka yang intuitif. Pembicara 1 menekankan pada kesederhanaan, sementara Pembicara 2 menyoroti kebutuhan akan fitur kustomisasi.\n\n**Butir Tindakan (Action Items):**\n- Tim desain akan membuat prototipe A/B testing berdasarkan masukan.\n- Jadwalkan sesi lanjutan untuk meninjau prototipe minggu depan.\n\n**Sentimen Umum:**\nSecara keseluruhan, diskusi berjalan positif dan konstruktif, dengan beberapa perbedaan pendapat yang sehat mengenai prioritas fitur.`;
};


// --- UTAMA ---
export default function SpeechToTextPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [transcriptChunks, setTranscriptChunks] = useState<TranscriptChunk[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([{ id: 1, name: 'Speaker 1' }]);
  const [activeSpeakerId, setActiveSpeakerId] = useState(1);
  
  const activeSpeakerIdRef = useRef(activeSpeakerId);

  const [sessions, setSessions] = useState<TranscriptionSession[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('id-ID');
  const [recordingTime, setRecordingTime] = useState(0);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState('');

  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- EFEK & PENGATURAN ---

  useEffect(() => {
    activeSpeakerIdRef.current = activeSpeakerId;
  }, [activeSpeakerId]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition tidak didukung di browser ini. Gunakan Chrome atau Edge.');
    }
    try {
        const savedSessions = JSON.parse(localStorage.getItem('speechSessions-fgd') || '[]');
        setSessions(savedSessions);
    } catch (e) {
        console.error("Failed to parse sessions from localStorage", e);
        setSessions([]);
    }
  }, []);
  
  const drawWaveform = useCallback(() => {
    if (!isRecording || isPaused || !analyserRef.current || !canvasRef.current || !audioContextRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = '#f3f4f6'; // bg-gray-100
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#6366f1'; // text-indigo-500

    canvasCtx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * canvas.height / 2;
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    requestAnimationFrame(drawWaveform);
  }, [isRecording, isPaused]);

  const setupAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      drawWaveform();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Izin mikrofon ditolak. Mohon izinkan akses untuk memulai.');
      throw err; 
    }
  };

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) };
  }, [isRecording, isPaused]);
  
  // --- FUNGSI UTAMA ---

  const startRecording = async () => {
    if (!isSupported) return;
    setError('');
    setTranscriptChunks([]);
    setInterimText('');
    setSummary('');
    setRecordingTime(0);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = selectedLanguage;

    try {
      await setupAudioVisualization();
      
      recognitionRef.current.onresult = (event: any) => {
        let finalChunk = '';
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript.trim() + '. ';
          } else {
            currentInterim += transcript;
          }
        }

        if (finalChunk) {
            setTranscriptChunks(prev => [...prev, {
                speakerId: activeSpeakerIdRef.current,
                text: finalChunk,
                timestamp: new Date()
            }]);
        }
        setInterimText(currentInterim);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
      };

      recognitionRef.current.onend = () => {
        if (isRecording && !isPaused) {
          recognitionRef.current.start();
        }
      };
      
      recognitionRef.current.start();
      setIsRecording(true);
      setIsPaused(false);

    } catch(err) {
      // Error sudah ditangani di setupAudioVisualization
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    setIsPaused(false);

    if (transcriptChunks.length > 0 || speakers.length > 1) {
      const newSession: TranscriptionSession = {
        id: Date.now().toString(),
        chunks: transcriptChunks,
        speakers: speakers,
        timestamp: new Date(),
        duration: recordingTime,
        language: selectedLanguage,
        summary: summary,
      };
      const updatedSessions = [newSession, ...sessions].slice(0, 10);
      setSessions(updatedSessions);
      localStorage.setItem('speechSessions-fgd', JSON.stringify(updatedSessions));
    }
  };

  const pauseRecording = () => {
    if (isPaused) {
      recognitionRef.current?.start();
      drawWaveform();
    } else {
      recognitionRef.current?.stop();
    }
    setIsPaused(!isPaused);
  };

  const generateSummary = async () => {
    const fullTranscript = formatTranscript(transcriptChunks, speakers);
    if (!fullTranscript) return;
    
    setIsSummarizing(true);
    setSummary('');
    try {
      const result = await callGeminiForSummary(fullTranscript);
      setSummary(result);
    } catch (e) {
      setError("Gagal membuat ringkasan. Coba lagi nanti.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // --- FUNGSI PEMBANTU (HELPERS) ---

  const addSpeaker = () => {
    const newId = speakers.length > 0 ? Math.max(...speakers.map(s => s.id)) + 1 : 1;
    const newSpeaker = { id: newId, name: `Speaker ${newId}` };
    setSpeakers([...speakers, newSpeaker]);
    setActiveSpeakerId(newId);
  };
  
  const renameSpeaker = (id: number) => {
    const currentName = speakers.find(s => s.id === id)?.name || '';
    const newName = prompt("Masukkan nama baru:", currentName);
    if (newName && newName.trim() !== '') {
      setSpeakers(speakers.map(s => s.id === id ? { ...s, name: newName } : s));
    }
  };
  
  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const formatTranscript = (chunks: TranscriptChunk[], speakerList: Speaker[]) => {
    return chunks.map(chunk => {
        const speakerName = speakerList.find(s => s.id === chunk.speakerId)?.name || `Unknown`;
        return `**${speakerName}:** ${chunk.text.trim()}`;
    }).join('\n\n');
  };

  const loadSession = (session: TranscriptionSession) => {
      stopRecording();
      setTranscriptChunks(session.chunks);
      setSpeakers(session.speakers);
      setRecordingTime(session.duration);
      setSummary(session.summary || '');
      if (session.speakers.length > 0) {
        setActiveSpeakerId(session.speakers[0].id);
      }
  };
  
  const clearAllSessions = () => {
      if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat sesi? Tindakan ini tidak dapat diurungkan.")) {
          setSessions([]);
          localStorage.removeItem('speechSessions-fgd');
      }
  };

  // --- RENDER ---
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* KOLOM KIRI: KONTROL & LIVE TRANSCRIPT */}
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-3xl font-bold text-gray-900">Transkrip Diskusi</h1>
            <p className="text-gray-500">Rekam, transkrip, dan rangkum FGD atau rapat Anda secara real-time.</p>
          </header>

          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md ${
                  isRecording ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'
                }`}
              >
                {isRecording ? <StopCircle size={32} /> : <Mic size={32} />}
              </button>
              {isRecording && (
                <button onClick={pauseRecording} className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-400 text-white shadow-md">
                    {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>
              )}
            </div>
            <div className="text-center font-mono text-xl">{formatTime(recordingTime)}</div>

            <canvas ref={canvasRef} width="600" height="80" className="w-full h-20 bg-gray-100 rounded-lg"></canvas>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm flex gap-2 items-center"><AlertCircle size={18}/>{error}</div>}

            <div>
              <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">Bahasa</label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isRecording}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
              >
                {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pembicara Aktif</label>
              <div className="flex flex-wrap gap-2 items-center">
                {speakers.map(speaker => (
                  <div key={speaker.id} className="group relative">
                    <button
                      onClick={() => setActiveSpeakerId(speaker.id)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeSpeakerId === speaker.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {speaker.name}
                    </button>
                    <button onClick={() => renameSpeaker(speaker.id)} className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={12} className="text-gray-600"/>
                    </button>
                  </div>
                ))}
                <button onClick={addSpeaker} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300"><Plus size={16}/></button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex-grow">
            <h3 className="font-bold text-lg mb-2">Teks Real-time</h3>
            <div className="bg-gray-100 p-4 rounded-lg min-h-[100px] text-gray-600 italic">
                {interimText || "..."}
                {isRecording && !isPaused && <span className="inline-block w-0.5 h-5 bg-indigo-500 animate-pulse ml-1"></span>}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: HASIL & RINGKASAN */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
              <h3 className="font-bold text-lg mb-2">Transkrip Final</h3>
              <div className="flex-grow bg-gray-100 p-4 rounded-lg overflow-y-auto whitespace-pre-wrap text-sm">
                  {transcriptChunks.length > 0 ? formatTranscript(transcriptChunks, speakers) : <p className="text-gray-400">Hasil transkrip akan muncul di sini.</p>}
              </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg flex items-center gap-2"><Bot size={20} className="text-indigo-600"/>Ringkasan AI</h3>
                <button onClick={generateSummary} disabled={transcriptChunks.length === 0 || isSummarizing} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors">
                    {isSummarizing ? "Menganalisis..." : "Buat Ringkasan"}
                </button>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg min-h-[150px] whitespace-pre-wrap text-sm">
                  {isSummarizing ? <p className="text-gray-500 animate-pulse">Sedang membuat ringkasan...</p> : (summary || <p className="text-gray-400">Ringkasan akan muncul di sini.</p>)}
              </div>
          </div>
          
           {sessions.length > 0 && (
             <div className="bg-white rounded-2xl shadow-lg p-6">
               <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">Sesi Terakhir</h3>
                <button onClick={clearAllSessions} className="p-2 rounded-lg hover:bg-red-100 text-red-600" title="Hapus semua riwayat">
                    <Trash2 size={16}/>
                </button>
               </div>
                <div className="space-y-2">
                    {sessions.slice(0, 3).map(session => (
                        <div key={session.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                               <p className="font-medium text-sm">{new Date(session.timestamp).toLocaleString()}</p>
                               <p className="text-xs text-gray-500">{formatTime(session.duration)} - {session.speakers.length} Pembicara</p>
                            </div>
                            <button onClick={() => loadSession(session)} className="p-2 rounded-lg hover:bg-gray-200" title="Muat sesi ini">
                                <RotateCcw size={16}/>
                            </button>
                        </div>
                    ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}