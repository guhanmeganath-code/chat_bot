import React, { useState, useEffect, useRef } from "react";
import { 
  Scale, 
  Send, 
  MessageSquare, 
  Plus, 
  Languages, 
  AlertTriangle, 
  Cpu, 
  BookOpen, 
  Briefcase, 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Moon, 
  Sun,
  Loader2,
  Paperclip,
  X,
  FileText
} from "lucide-react";
import { TRANSLATIONS, Language, Message, ChatSession, BotResponse, FileAttachment } from "../types.js";

interface ChatInterfaceProps {
  language: Language;
  sessionId: string | null;
  history: Message[];
  sessionsList: ChatSession[];
  isDarkMode: boolean;
  onSetLanguage: (lang: Language) => void;
  onToggleTheme: () => void;
  onSubmitMessage: (text: string, file?: FileAttachment) => Promise<void>;
  onNewChat: () => Promise<void>;
  onSelectSession: (id: string) => Promise<void>;
  onBackToHome: () => void;
  isGenerating: boolean;
  clearAllHistoryLocal: () => void; // helper
}

export default function ChatInterface({
  language,
  sessionId,
  history,
  sessionsList,
  isDarkMode,
  onSetLanguage,
  onToggleTheme,
  onSubmitMessage,
  onNewChat,
  onSelectSession,
  onBackToHome,
  isGenerating,
  clearAllHistoryLocal
}: ChatInterfaceProps) {
  const t = TRANSLATIONS[language];
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<FileAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web Speech API reference
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isGenerating]);

  // Clean error messages after 10 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Setup client Speech Recognition based on browser availability
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone access denied. Please allow microphone permissions.");
        } else {
          setErrorMessage("Failed to capture audio clearly. Please try again or type instead.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  // Trigger microphone dictation
  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      setErrorMessage("Voice speech dictation is not fully supported by your browser or inside this frame.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start voice engine:", err);
        recognitionRef.current.abort();
      }
    }
  };

  // File upload handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File too large. Maximum size is 5MB.");
      return;
    }

    // Validate type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg", "image/png", "image/webp",
      "text/plain", "text/csv",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Unsupported file type. Allowed: PDF, images (JPG/PNG/WebP), text files, Word docs.");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1]; // strip data:... prefix
      setAttachedFile({ name: file.name, mimeType: file.type, base64 });
    };
    reader.onerror = () => setErrorMessage("Failed to read file.");
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    if (inputValue.length > 1000) {
      setErrorMessage("Legal inquiries are strictly capped at 1000 characters to prevent server abuse.");
      return;
    }

    const textToSend = inputValue;
    const fileToSend = attachedFile;
    setInputValue("");
    setAttachedFile(null);
    setErrorMessage(null);

    try {
      await onSubmitMessage(textToSend, fileToSend || undefined);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit legal consultation inquiry.");
    }
  };

  // Keyboard shortcut handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${
      isDarkMode ? "bg-[#0B1F3A] text-[#F9FAFB]" : "bg-legal-bg text-legal-dark animate-fade-in"
    }`}>
      
      {/* 1. SIDEBAR PANEL */}
      <aside className={`hidden md:flex flex-col w-72 border-r flex-shrink-0 transition-all ${
        isDarkMode 
          ? "bg-[#0B1F3A] border-white/5 text-gray-350" 
          : "bg-white border-gray-200 text-legal-dark"
      }`}>
        
        {/* Sidebar Logo */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? "border-white/5" : "border-gray-200"}`}>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg border border-[#D4AF37]/20 flex-shrink-0">
              <Scale className="h-5 w-5 animate-pulse" />
            </div>
            <span className={`font-serif text-base font-bold tracking-wide ${isDarkMode ? "text-white" : "text-[#0B1F3A]"}`}>
              Law<span className="text-[#D4AF37]">Bot</span>
            </span>
          </div>
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="System Live" />
        </div>

        {/* Action Button: Start New Chat */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            disabled={isGenerating}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm ${
              isDarkMode
                ? "border border-dashed border-white/20 text-[#F9FAFB] hover:bg-white/5 bg-transparent"
                : "bg-legal-gold text-legal-navy hover:bg-legal-gold-hover border border-legal-gold"
            }`}
          >
            <Plus className="h-4 w-4 text-[#D4AF37]" />
            <span>{t.newChat}</span>
          </button>
        </div>

        {/* Chat History List Scoped per Session */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] block font-mono">
            CONSULTATION LOGS
          </span>

          {sessionsList.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-gray-500">
              No prior sessions found.
            </div>
          ) : (
            sessionsList.map((sess) => {
              const isActive = sessionId === sess.id;
              return (
                <button
                  key={sess.id}
                  onClick={() => !isGenerating && onSelectSession(sess.id)}
                  disabled={isGenerating}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-3 transition-colors ${
                    isActive 
                      ? isDarkMode
                        ? "bg-white/5 text-[#D4AF37] border-l-2 border-[#D4AF37] rounded-l-none"
                        : "bg-legal-gold/15 text-legal-navy border-l-2 border-legal-gold rounded-l-none"
                      : isDarkMode
                        ? "text-gray-400 hover:bg-white/5 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-black"
                  }`}
                >
                  <MessageSquare className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-[#D4AF37]" : "text-gray-500"}`} />
                  <span className="truncate flex-1">{sess.title}</span>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />}
                </button>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className={`p-4 border-t space-y-3 text-xs ${isDarkMode ? "border-white/5 bg-black/20" : "border-gray-200 bg-gray-50"}`}>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span>Server Limit Check:</span>
            <span className="text-[#D4AF37] font-bold">10 Message/min</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Theme Trigger */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center justify-center space-x-1.5 py-2 px-1 rounded-lg border text-xs font-semibold transition-colors ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10" 
                  : "border-gray-200 bg-white text-gray-600 hover:text-black hover:bg-gray-50"
              }`}
              title="Change Theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
              <span className="text-[10px] font-bold">Theme</span>
            </button>

            {/* Back Home */}
            <button
              onClick={onBackToHome}
              className={`flex items-center justify-center space-x-1 py-1.5 px-0.5 rounded-lg border text-xs font-semibold transition-colors ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10" 
                  : "border-gray-200 bg-white text-gray-600 hover:text-black hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="text-[10px] font-bold">Close Chat</span>
            </button>
          </div>

        </div>
      </aside>

      {/* 2. MAIN ACTIVE CONVERSATION WORKBENCH */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Main Header */}
        <header className={`px-6 h-16 border-b flex items-center justify-between flex-shrink-0 z-10 transition-all ${
          isDarkMode 
            ? "bg-[#111827]/85 backdrop-blur-xl border-white/10" 
            : "bg-white border-gray-200"
        }`}>
          
          {/* Back Trigger on Mobile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToHome}
              className="md:hidden p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
              title="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="md:hidden p-1.5 bg-legal-navy text-[#D4AF37] rounded-md border border-[#D4AF37]/20">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h2 className={`text-sm font-bold font-serif ${isDarkMode ? "text-white" : "text-[#0B1F3A]"}`}>
                  Statutory Consultation Console
                </h2>
                <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                  <span className="font-mono text-emerald-500 font-bold flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                    BNS ACTIVE LOOKUP
                  </span>
                  <span>&bull;</span>
                  <span className="font-mono">ID: {sessionId?.substring(5, 12)}...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Selection Selector Bar */}
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-gray-400 hidden sm:block" />
            <div className="flex border rounded-lg p-0.5 bg-gray-100/50 dark:bg-gray-900 border-gray-300 dark:border-gray-800">
              {(["en", "hi", "ta"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSetLanguage(lang)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                    language === lang 
                      ? "bg-[#D4AF37] text-[#0B1F3A] shadow-xs font-bold" 
                      : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Sticky Disclaimer Warning Ribbon under header */}
        <div className={`p-2 px-6 text-[10px] font-medium leading-relaxed border-b text-center flex-shrink-0 transition-colors ${
          isDarkMode 
            ? "bg-amber-950/10 border-white/5 text-amber-300/85" 
            : "bg-amber-50 border-amber-100 text-amber-900"
        }`}>
          <span>⚠️ <strong>Aesthetic Guideline Notice:</strong> Every answer is grounded in statutory Indian Penal/Cyber corpus lookups. Double-check citations for vital cases.</span>
        </div>

        {/* Chat Bubbles Scroll Area */}
        <div className={`flex-1 overflow-y-auto px-4 py-8 space-y-6 transition-all ${
          isDarkMode 
            ? "bg-gradient-to-br from-[#0B1F3A] via-[#111827] to-[#0B1F3A]" 
            : "bg-gradient-to-b from-white to-blue-50/10"
        }`}>
          
          {history.length === 0 ? (
            /* Blank state help window */
            <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
              
              <div className="mx-auto p-4 bg-[#0B1F3A] text-[#D4AF37] rounded-full w-fit border border-[#D4AF37]/25 animate-bounce">
                <Scale className="h-10 w-10 text-[#D4AF37]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold">Welcome to LawBot Legal consultation</h3>
                <p className={`text-xs max-w-md mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-650"}`}>
                  Ask legal scenario questions in plain language. We'll search the statutory IPC, BNS, IT Act, and Traffic regulations references first, then compile matched legal solutions.
                </p>
              </div>

              {/* Sample queries recommendation bento card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
                {[
                  { q: "What is the fine for driving without a license or drunken driving in India?", label: "Traffic MV Act query" },
                  { q: "Someone hacked my laptop and is demanding an online cryptocurrency payload.", label: "Cyber scam IT Act query" },
                  { q: "Penalty for theft under Indian Penal Code and the new BNS rules?", label: "Theft IPC / BNS query" },
                  { q: "What is Article 21 and the scope of individual freedom?", label: "Constitution fundamental query" }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(sample.q)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-101 ${
                      isDarkMode 
                        ? "bg-white/5 border-white/10 hover:border-[#D4AF37]/30 hover:bg-white/10" 
                        : "bg-white border-gray-200 hover:border-legal-gold/40 hover:bg-gray-50/40"
                    }`}
                  >
                    <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
                      {sample.label}
                    </div>
                    <div className="text-xs truncate text-gray-300 dark:text-gray-300">{sample.q}</div>
                  </button>
                ))}
              </div>

            </div>
          ) : (
            history.map((msg) => {
              const isUser = msg.role === "user";

              if (isUser) {
                return (
                  /* User Message align RIGHT */
                  <div key={msg.id} className="flex justify-end max-w-4xl mx-auto">
                    <div className={`max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-2xl rounded-tr-none shadow-xl border ${
                      isDarkMode 
                        ? "bg-[#1E3A8A] border-white/10 text-[#F9FAFB]" 
                        : "bg-[#1E3A8A] text-white border-blue-800"
                    }`}>
                      <span className="text-xs leading-relaxed whitespace-pre-wrap">{msg.raw_text}</span>
                      {msg.file && (
                        <div className="mt-2 flex items-center space-x-1.5 bg-white/10 rounded-lg px-2 py-1">
                          <FileText className="h-3 w-3 flex-shrink-0" />
                          <span className="text-[10px] truncate">{msg.file.name}</span>
                        </div>
                      )}
                      <div className="text-[8px] opacity-70 text-right mt-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              }

              /* Bot Response aligns LEFT - Premium card format matching JSON */
              const bots: BotResponse = msg.bot_response || {
                section_reference: "General References",
                explanation: msg.raw_text || "No explanation provided.",
                example: "None",
                disclaimer: t.disclaimerBar,
                confidence: "general"
              };

              const isGrounded = bots.confidence === "grounded";

              return (
                <div key={msg.id} className="flex items-start space-x-3 max-w-4xl mx-auto">
                  
                  {/* Bot vector scale avatar matching LexGuard layout */}
                  <div className="w-9 h-9 rounded bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center shrink-0 shadow-lg hidden sm:flex">
                    <span className="text-sm font-bold">⚖️</span>
                  </div>

                  {/* Complete response render block */}
                  <div className={`flex-1 rounded-2xl p-5 sm:p-6 transition-all ${
                    isDarkMode 
                      ? "bg-white/5 backdrop-blur-md border border-white/10 rounded-tl-none shadow-2xl animate-fade-in" 
                      : "bg-white border border-gray-200 rounded-tl-none shadow-sm"
                  } space-y-4`}>
                    
                    {/* Header: Grounded confidence flags + citation */}
                    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-2 ${isDarkMode ? "border-white/5" : "border-gray-100"}`}>
                      <div className="space-y-1">
                        <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase block">STATUTORY BADGE REFERENCE</span>
                        <h4 className="font-serif text-base font-bold text-[#D4AF37]">
                          {bots.section_reference}
                        </h4>
                      </div>

                      {/* Confidence badge tags */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {isGrounded ? (
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{t.confidenceGrounded.toUpperCase()}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-550 border border-amber-500/25">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span>{t.confidenceGeneral.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 1: Detailed plain text explanation */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block flex items-center space-x-1">
                        <BookOpen className="h-3 w-3 text-[#D4AF37] mr-1" />
                        <span>Translation & Explanation</span>
                      </span>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-750"}`}>
                        {bots.explanation}
                      </p>
                    </div>

                    {/* Section 2: Case example scenario */}
                    {bots.example && bots.example !== "N/A" && bots.example !== "Not applicable." && (
                      <div className={`p-4 rounded-lg border-l-2 border-[#D4AF37] text-xs space-y-1 ${
                        isDarkMode ? "bg-black/30 border-y-0 border-r-0" : "bg-gray-50 border-gray-200"
                      }`}>
                        <span className="font-bold text-[10px] text-[#D4AF37] tracking-widest uppercase flex items-center space-x-1">
                          <Briefcase className="h-3.5 w-3.5 mr-1" />
                          <span>Illustrative Scenario Example</span>
                        </span>
                        <p className={`italic ${isDarkMode ? "text-gray-300" : "text-gray-650"}`}>
                          "{bots.example}"
                        </p>
                      </div>
                    )}

                    {/* Section 3: Caveat confidence footnote helper */}
                    <div className="flex items-start text-[10px] leading-relaxed text-gray-400 bg-gray-500/5 p-2 rounded">
                      <Cpu className="h-4 w-4 mr-1.5 text-gray-450 flex-shrink-0 mt-0.5" />
                      <span>
                        {isGrounded ? t.confidenceInfo : t.generalInfo} For deeper analyses, download full acts via government portals.
                      </span>
                    </div>

                    {/* Section 4: Individual statutory disclaimer row */}
                    {bots.disclaimer && (
                      <div className={`text-[10px] italic pt-4 border-t leading-normal uppercase tracking-wide ${
                        isDarkMode ? "border-white/5 text-white/30" : "border-gray-100 text-gray-400"
                      }`}>
                        {bots.disclaimer}
                      </div>
                    )}

                    {/* Row footer with timestamp */}
                    <div className="text-[8px] text-gray-450 font-mono text-right">
                      Source verified &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                  </div>
                </div>
              );
            })
          )}

          {/* Floating Typing Indicator while server processes query */}
          {isGenerating && (
            <div className="flex items-start space-x-3 max-w-4xl mx-auto animate-fade-in">
              <div className="w-9 h-9 rounded bg-[#D4AF37] text-[#0B1F3A] flex items-center justify-center shrink-0 shadow-lg hidden sm:flex">
                <span className="text-sm font-bold">⚖️</span>
              </div>
              <div className={`rounded-xl border p-4 px-5 flex items-center space-x-2 ${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"
              }`}>
                <Loader2 className="h-4 w-4 text-[#D4AF37] animate-spin" />
                <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">
                  Searching statutory sources database...
                </span>
                
                {/* Visual loading bounce nodes */}
                <div className="flex space-x-1 ml-2">
                  <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full typing-dot" />
                  <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full typing-dot" />
                  <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Auto scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Error Bar indicator */}
        {errorMessage && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-lg">
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/90 backdrop-blur-md text-red-200 shadow-lg text-xs flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="flex-1 leading-snug">{errorMessage}</p>
              <button 
                onClick={() => setErrorMessage(null)}
                className="hover:text-white font-bold p-1 px-1.5 bg-red-950/60 rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Floating audio recording helper */}
        {isListening && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-xs">
            <div className="p-3 rounded-full bg-emerald-950/90 text-emerald-100 border border-emerald-500/30 text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-lg animate-pulse">
              <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span>🎙️ Speech recognition active. Speak now...</span>
            </div>
          </div>
        )}

        {/* Chat input form container with gradient background matched to Immersive UI */}
        <div className={`p-6 border-t flex-shrink-0 ${
          isDarkMode 
            ? "bg-gradient-to-t from-[#111827] to-transparent border-white/5" 
            : "bg-white border-gray-200"
        }`}>
          <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-2">
            
            {/* Attached file preview bar */}
            {attachedFile && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
              }`}>
                <FileText className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                <span className="text-xs flex-1 truncate">{attachedFile.name}</span>
                <span className="text-[9px] text-gray-400 font-mono">{attachedFile.mimeType.split("/")[1]?.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                  title="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-3">
            
            {/* Input wrap pill */}
            <div className={`flex-1 flex items-center border rounded-2xl px-5 py-2.5 transition-all shadow-xl ${
              inputValue.length > 900 ? "border-red-500" : isDarkMode ? "bg-[#1A1F2C] border-white/10 text-white focus-within:border-[#D4AF37]" : "bg-gray-50 border-gray-200 text-black focus-within:border-legal-gold"
            }`}>
              
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isGenerating}
                  placeholder={t.askPlaceholder}
                  className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none min-w-0 pr-2 placeholder-gray-400 py-1"
                />

                {/* Character count label */}
                {inputValue.length > 500 && (
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded mr-2 ${
                    inputValue.length > 900 ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {inputValue.length}/1000
                  </span>
                )}

                {/* File attachment button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                  className={`p-2 rounded-full cursor-pointer transition-colors ${
                    attachedFile
                      ? "bg-[#D4AF37] text-[#0B1F3A]"
                      : isDarkMode ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-black hover:bg-gray-200"
                  }`}
                  title="Attach case file (PDF, image, text)"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.csv,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Web Speech Dictation Mic Trigger toggle */}
                <button
                  type="button"
                  onClick={handleMicToggle}
                  disabled={isGenerating}
                  className={`p-2 rounded-full cursor-pointer transition-colors ${
                    isListening 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                      : isDarkMode ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-black hover:bg-gray-200"
                  }`}
                  title={t.micTooltip}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 animate-pulse" />}
                </button>
            </div>

            {/* SEND button */}
            <button
              type="submit"
              disabled={isGenerating || !inputValue.trim()}
              className="p-3 bg-[#D4AF37] text-[#0B1F3A] hover:bg-[#D4AF37]/90 disabled:opacity-40 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer border border-[#D4AF37]"
            >
              <Send className="h-4 w-4 font-bold" />
            </button>
            </div>
          </form>

          {/* Under-input disclaimer footer */}
          <div className="max-w-4xl mx-auto text-center mt-3">
            <span className="text-[10px] text-gray-500 leading-none">
              LawBot answers from public statutes & BNS reference systems.
            </span>
          </div>
        </div>

      </main>

      {/* 3. RIGHT PANEL: LEGAL CITATIONS */}
      <aside className={`hidden lg:flex flex-col w-64 border-l flex-shrink-0 transition-all p-4 space-y-6 shrink-0 ${
        isDarkMode 
          ? "bg-[#111827] border-white/5 text-[#F9FAFB]" 
          : "bg-white border-gray-200 text-legal-dark"
      }`}>
        
        {/* Dynamic or fallback active act reference */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-mono">
            Active Statutory Focus
          </h4>
          
          {(() => {
            // Find the last bot response in history to dynamically show its reference
            const botMsgs = history.filter(m => m.role === "bot" && m.bot_response);
            const activeBotResponse = botMsgs.length > 0 ? botMsgs[botMsgs.length - 1].bot_response : null;

            if (activeBotResponse) {
              return (
                <div className={`rounded-xl p-4 border transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200 shadow-xs"
                }`}>
                  <div className="text-[10px] text-[#D4AF37] mb-1 font-mono tracking-tighter uppercase font-bold">
                    {activeBotResponse.section_reference}
                  </div>
                  <div className="text-xs leading-normal font-sans line-clamp-6 text-gray-300 dark:text-gray-300">
                    {activeBotResponse.explanation}
                  </div>
                  <div className="mt-3 h-1 w-full bg-gray-700/30 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-[#D4AF37] rounded-full animate-pulse" />
                  </div>
                </div>
              );
            } else {
              return (
                <div className={`rounded-xl p-4 border transition-all ${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200 shadow-sm"
                }`}>
                  <div className="text-[10px] text-[#D4AF37] mb-1 font-mono tracking-tighter uppercase font-bold">
                    BNS 2023 - SEC 79
                  </div>
                  <div className="text-xs leading-normal font-sans italic text-gray-400 dark:text-gray-400">
                    Select or ask a query to inspect live statutory lookup records here.
                  </div>
                  <div className="mt-3 h-1 w-full bg-gray-700/30 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-[#D4AF37] rounded-full" />
                  </div>
                </div>
              );
            }
          })()}
        </div>

        {/* Static relevant legal cards */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] font-mono">
            Related Digital Statutes
          </h4>
          
          <div className={`p-3 border rounded-lg transition-all text-xs ${
            isDarkMode ? "border-white/5 bg-white/2 hover:bg-white/5" : "border-gray-200 bg-white hover:bg-gray-100/50"
          }`}>
            <div className="font-bold text-[10px] text-[#D4AF37] font-mono">IT Act Sec 66E</div>
            <p className="text-[10px] text-gray-400 mt-1">Punishment for violation of digital privacy and unauthorized image capture.</p>
          </div>

          <div className={`p-3 border rounded-lg transition-all text-xs ${
            isDarkMode ? "border-white/5 bg-white/2 hover:bg-white/5" : "border-gray-200 bg-white hover:bg-gray-100/50"
          }`}>
            <div className="font-bold text-[10px] text-[#D4AF37] font-mono">BNS Sec 318</div>
            <p className="text-[10px] text-gray-400 mt-1">Formerly IPC 420. Covers punishment for cheating, online deception, and financial fraud.</p>
          </div>
        </div>

        {/* Advise Upgrade Panel */}
        <div className="mt-auto">
          <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
            <div className="text-[10px] font-bold text-[#D4AF37] uppercase mb-1">Need an Advocate?</div>
            <p className="text-[10px] leading-tight text-gray-300">
              LawBot connects you with licensed criminal & civil council in Indian jurisdictions.
            </p>
          </div>
        </div>
      </aside>

    </div>
  );
}
