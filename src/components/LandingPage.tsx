import { motion } from "motion/react";
import { Scale, ShieldCheck, HeartHandshake, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { TRANSLATIONS, Language } from "../types.js";

interface LandingPageProps {
  language: Language;
  onStartChat: () => void;
  isDarkMode: boolean;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
}

export default function LandingPage({
  language,
  onStartChat,
  isDarkMode,
  setLanguage,
  toggleTheme
}: LandingPageProps) {
  const t = TRANSLATIONS[language];

  // Smooth scroll helper
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-legal-dark text-[#F3F4F6]" : "bg-legal-bg text-legal-dark animate-fade-in"}`}>
      
      {/* 1. Navbar */}
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isDarkMode 
          ? "bg-legal-dark/85 backdrop-blur-md border-gray-800" 
          : "bg-white/85 backdrop-blur-md border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Left */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToId("hero")}>
              <div className="p-2 bg-legal-navy text-legal-gold rounded-lg shadow-sm border border-legal-gold/25">
                <Scale className="h-6 w-6" id="logo-scale" />
              </div>
              <span className={`font-serif text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-legal-navy"}`}>
                Law<span className="text-legal-gold">Bot</span>
              </span>
            </div>

            {/* Links Center */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToId("features")} className={`text-sm font-medium hover:text-legal-gold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t.navFeatures}
              </button>
              <button onClick={() => scrollToId("how-it-works")} className={`text-sm font-medium hover:text-legal-gold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t.navHow}
              </button>
              <button onClick={() => scrollToId("statutory-scope")} className={`text-sm font-medium hover:text-legal-gold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t.navTrust}
              </button>
              <button onClick={() => scrollToId("disclaimer")} className={`text-sm font-medium hover:text-legal-gold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t.navDisclaimer}
              </button>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center space-x-4">
              
              {/* Language Picker */}
              <div className="flex items-center space-x-1 border rounded-lg p-1 bg-transparent border-legal-gold/20">
                {(["en", "hi", "ta"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${
                      language === lang 
                        ? "bg-legal-gold text-legal-navy shadow-xs" 
                        : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? "border-gray-800 text-yellow-400 hover:bg-gray-850" 
                    : "border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
                title="Toggle Theme"
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>

              {/* CTA Start Button */}
              <button
                onClick={onStartChat}
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-legal-gold text-legal-navy hover:bg-legal-gold-hover border border-legal-gold shadow-sm transition-all cursor-pointer"
                id="start-chat-nav"
              >
                {t.startChat.split(" ")[0]} ⚖️
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="hero" className={`relative overflow-hidden py-20 lg:py-32 border-b ${isDarkMode ? "border-gray-900 bg-gradient-to-b from-legal-dark to-slate-950" : "border-gray-100 bg-gradient-to-b from-blue-50/50 to-white"}`}>
        {/* Soft background glow circles */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-legal-gold/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-legal-blue/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-legal-gold/10 text-legal-gold border border-legal-gold/20">
                <ShieldCheck className="h-4 w-4" />
                <span>AI-Powered Legal Grounding Model</span>
              </div>
              
              <h1 className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none ${isDarkMode ? "text-white" : "text-legal-navy"}`}>
                {t.subtitle}
              </h1>
              
              <p className={`text-base sm:text-lg max-w-xl leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {t.tagline} Powered by verified retrieval technology that matches queries directly into BNS/IPC codes, traffic statutes, and cyber safety laws to prevent AI hallucinations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={onStartChat}
                  className="flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-base font-bold bg-legal-gold text-legal-navy hover:bg-legal-gold-hover border border-legal-gold shadow-md hover:shadow-lg hover:scale-102 transition-all cursor-pointer"
                  id="start-chat-hero"
                >
                  <span>{t.startChat}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollToId("features")}
                  className={`flex items-center justify-center px-6 py-4 rounded-xl text-base font-semibold border transition-all ${
                    isDarkMode 
                      ? "border-gray-800 bg-gray-900/50 hover:bg-gray-800 text-white" 
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {t.learnMore}
                </button>
              </div>

              {/* Short stats strip */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800/10">
                <div>
                  <div className="font-serif text-2xl font-bold text-legal-gold">0%</div>
                  <div className="text-xs text-gray-400">Section Hallucination Goal</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-legal-gold">23+</div>
                  <div className="text-xs text-gray-400">Core Codified Acts</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-legal-gold">100%</div>
                  <div className="text-xs text-gray-400">Secure Server Grounding</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column Illustration */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-8 rounded-3xl border border-legal-gold/15 bg-legal-navy/10 backdrop-blur-sm">
                
                {/* Visual grid backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-3xl" />
                
                {/* Floating CSS Scales of justice illustration */}
                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="relative z-10 p-12 bg-gradient-to-br from-legal-navy to-slate-900 rounded-2xl shadow-2xl border border-legal-gold/30 text-center flex flex-col items-center justify-center w-80 h-80"
                >
                  <div className="p-4 bg-legal-gold/10 rounded-full border border-legal-gold/20 mb-4 animate-pulse">
                    <Scale className="h-16 w-16 text-legal-gold" />
                  </div>
                  <span className="font-serif text-lg font-bold text-white tracking-widest uppercase">
                    Satyameva Jayate
                  </span>
                  <p className="text-xs text-gray-400 mt-2 italic px-4">
                    "Truth alone triumphs. Grounded statutory analysis engine."
                  </p>
                  
                  {/* Digital pulse nodes */}
                  <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-emerald-400" />
                </motion.div>

                {/* Floating structural chips */}
                <div className={`absolute top-10 right-4 px-3 py-1.5 rounded-lg shadow-md border text-xs font-mono font-bold flex items-center space-x-2 ${isDarkMode ? "bg-gray-900/90 border-gray-800 text-legal-gold" : "bg-white/90 border-gray-200 text-legal-navy"}`}>
                  <span>BNS 318 - OK</span>
                </div>
                <div className={`absolute bottom-10 left-4 px-3 py-1.5 rounded-lg shadow-md border text-xs font-mono font-bold flex items-center space-x-2 ${isDarkMode ? "bg-gray-900/90 border-gray-800 text-legal-gold" : "bg-white/90 border-gray-200 text-legal-navy"}`}>
                  <span>IPC 420 - OK</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            {t.featuresTitle}
          </h2>
          <p className={`text-base max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t.featuresSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Legal Knowledge */}
          <motion.div 
            whileHover={{ y: -8 }}
            className={`p-8 rounded-2xl border transition-all relative overflow-hidden group ${
              isDarkMode 
                ? "border-gray-800 bg-gray-900/40 hover:border-legal-gold/40" 
                : "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-legal-gold/60"
            }`}
          >
            <div className="p-3 bg-legal-gold/10 text-legal-gold rounded-xl w-fit mb-6">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Legal Knowledge Grounding</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Direct database lookups cross-reference your question against common theft, bodily harm, cyber, consumer, or traffic rules before AI processing begins.
            </p>
            <div className="absolute top-0 right-0 h-16 w-16 bg-legal-gold/5 blur-xl group-hover:bg-legal-gold/10 transition-colors" />
          </motion.div>

          {/* Card 2: Instant Answers */}
          <motion.div 
            whileHover={{ y: -8 }}
            className={`p-8 rounded-2xl border transition-all relative overflow-hidden group ${
              isDarkMode 
                ? "border-gray-800 bg-gray-900/40 hover:border-legal-gold/40" 
                : "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-legal-gold/60"
            }`}
          >
            <div className="p-3 bg-legal-gold/10 text-legal-gold rounded-xl w-fit mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Bilingual Confidence Indicators</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Instantly toggle UI layout text and active advice between English, Hindi, and Tamil, complete with clear confidence badges.
            </p>
            <div className="absolute top-0 right-0 h-16 w-16 bg-legal-gold/5 blur-xl group-hover:bg-legal-gold/10 transition-colors" />
          </motion.div>

          {/* Card 3: Indian Law Focus */}
          <motion.div 
            whileHover={{ y: -8 }}
            className={`p-8 rounded-2xl border transition-all relative overflow-hidden group ${
              isDarkMode 
                ? "border-gray-800 bg-gray-900/40 hover:border-legal-gold/40" 
                : "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-legal-gold/60"
            }`}
          >
            <div className="p-3 bg-legal-gold/10 text-legal-gold rounded-xl w-fit mb-6">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Clean Statutory Breakdown</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Every output provides a structured response format: official section reference numbers, plain language translations, and customized realistic examples.
            </p>
            <div className="absolute top-0 right-0 h-16 w-16 bg-legal-gold/5 blur-xl group-hover:bg-legal-gold/10 transition-colors" />
          </motion.div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className={`py-20 border-y ${isDarkMode ? "border-gray-900 bg-slate-950/40" : "border-gray-100 bg-gray-50/50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              {t.howItWorksTitle}
            </h2>
            <p className={`text-base max-w-xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Our system guarantees authentic references using a unique verified search methodology pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="h-12 w-12 rounded-full bg-legal-navy text-legal-gold border border-legal-gold/40 flex items-center justify-center font-bold font-serif text-lg z-10 shadow-md">
                1
              </div>
              <h3 className="font-serif text-lg font-bold">1. Ask a Legal Question</h3>
              <p className={`text-sm max-w-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Submit a query detailing your scenario. The input is sanitized and checked against our safety filters.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="h-12 w-12 rounded-full bg-legal-navy text-legal-gold border border-legal-gold/40 flex items-center justify-center font-bold font-serif text-lg z-10 shadow-md">
                2
              </div>
              <h3 className="font-serif text-lg font-bold">2. Local Retrieval Search</h3>
              <p className={`text-sm max-w-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                The database performs a high-speed weighted search across IPC, BNS, IT Act, and MV acts to pull exact matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="h-12 w-12 rounded-full bg-legal-navy text-legal-gold border border-legal-gold/40 flex items-center justify-center font-bold font-serif text-lg z-10 shadow-md">
                3
              </div>
              <h3 className="font-serif text-lg font-bold">3. Grounded Synthesis</h3>
              <p className={`text-sm max-w-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                The Gemini model synthesizes a structured output backed strictly by lookups, marking confidence level flag transparently.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Trust / Authority Section */}
      <section id="statutory-scope" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            {t.statutoryScopeTitle}
          </h2>
          <p className={`text-base max-w-xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t.statutoryScopeSub}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { tag: "IPC / BNS", name: "Indian Penal Code", details: "Codified transition laws including Theft, Assault, Murder, Forgery, Dowry Harassment." },
            { tag: "CrPC / BNSS", name: "Procedural Rules", details: "Rules overseeing Anticipatory Bail petitions (438), crime reports (FIR 154), lockup arrests without warrants." },
            { tag: "Constitution", name: "Fundamental Justice", details: "Supreme legal remedies. Articles 14 (Equality), 19 (Speech), 21 (Liberties), and 32 Writs." },
            { tag: "IT Act", name: "Cyber Law Rules", details: "Safeguards focusing on Digital Crimes. Sections 66C Password Spying, and 66D Online OTP Phishing Scams." },
            { tag: "Consumer Rights", name: "Consumer Protection", details: "Statutory guarantees on Refund policies, Unfair trade tricks (2(47)), E-Daakhil dispute commissions." },
            { tag: "MV Act", name: "Motor Vehicles Code", details: "Road and safety guidelines including Section 185 Drunken Driving detection, overspeed, and license fine systems." }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border flex flex-col justify-between ${
                isDarkMode ? "bg-gray-950/60 border-gray-800" : "bg-white border-gray-200"
              }`}
            >
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-legal-gold/10 text-legal-gold border border-legal-gold/25 w-fit block">
                  {item.tag}
                </span>
                <h4 className="font-serif text-lg font-bold">{item.name}</h4>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {item.details}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-500 mt-4">
                <CheckCircle2 className="h-4 w-4" />
                <span>Configured</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Testimonial Section */}
      <section className={`py-20 border-t ${isDarkMode ? "border-gray-900 bg-slate-950/20" : "border-gray-100 bg-gray-50/20"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Aesthetic Trust Reviews</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200 shadow-xs"}`}>
              <div className="flex space-x-1 text-legal-gold mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-legal-gold text-legal-gold" />)}
              </div>
              <p className={`text-sm italic ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                "LawBot has significantly reduced legal research overhead. The grounded BNS/IPC section cross-linking gives absolute precision without having to dig through massive acts. It's a gold standard SaaS tool."
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <div className="h-8 w-8 rounded-full bg-legal-navy text-legal-gold font-bold flex items-center justify-center text-xs">
                  A
                </div>
                <div>
                  <h5 className="font-bold text-xs">Aditya Sharma</h5>
                  <span className="text-gray-400 text-[10px]">District Court Advocate, Pune</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200 shadow-xs"}`}>
              <div className="flex space-x-1 text-legal-gold mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-legal-gold text-legal-gold" />)}
              </div>
              <p className={`text-sm italic ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                "For law students trying to make sense of cyber violations or consumer protection clauses, this chatbot is an unbelievable visual helper. Grounded checks mean no imaginary sections!"
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <div className="h-8 w-8 rounded-full bg-legal-navy text-legal-gold font-bold flex items-center justify-center text-xs">
                  P
                </div>
                <div>
                  <h5 className="font-bold text-xs">Priya Raman</h5>
                  <span className="text-gray-400 text-[10px]">LL.B Candidate, Chennai Law College</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Disclaimer Section */}
      <section id="disclaimer" className="py-12 max-w-4xl mx-auto px-4 sm:px-6 underline-offset-4">
        <div className={`p-6 sm:p-8 rounded-2xl border ${
          isDarkMode 
            ? "bg-amber-950/10 border-amber-900/30 text-amber-200" 
            : "bg-amber-50/50 border-amber-200/50 text-amber-900"
        }`}>
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-legal-gold/20 rounded-full text-legal-gold flex-shrink-0">
              <Scale className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-bold">Important Notice & Public Disclaimer</h4>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                {t.disclaimerBar}
              </p>
              <p className="text-[11px] opacity-75 leading-relaxed">
                LawBot does not possess active attorney authorization. It is an AI-powered lookup database designed exclusively to clarify legal concepts and direct users to relevant sections under BNS/IPC, Traffic rules, or cyber laws.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className={`py-12 border-t ${isDarkMode ? "bg-slate-950 border-gray-900" : "bg-legal-navy text-gray-300 border-gray-800"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo element */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-legal-gold/10 text-legal-gold rounded-md border border-legal-gold/20">
                <Scale className="h-5 w-5" />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                Law<span className="text-legal-gold">Bot</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              AI-Powered Indian Law and Order consultation framework grounded in validated statuary corpus entries.
            </p>
          </div>

          {/* Links column */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-white">Framework Lookups</h5>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <span className="hover:text-legal-gold transition-colors cursor-pointer">BNS / IPC</span>
              <span className="hover:text-legal-gold transition-colors cursor-pointer">IT ACT 2000</span>
              <span className="hover:text-legal-gold transition-colors cursor-pointer text-gray-500">CrPC (BNSS)</span>
              <span className="hover:text-legal-gold transition-colors cursor-pointer text-gray-500">MV Act 1988</span>
            </div>
          </div>

          {/* Technical scope */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-white">Platform Safeguards</h5>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Secure Server AI Sandbox</div>
              <div>SQLite Persistent Scopes</div>
              <div>Rate Limiter Active: Max 10/min</div>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-gray-800/10 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} LawBot. Built for Indian Legal Grounding & Information Redressal.
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-legal-gold cursor-pointer transition-colors">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-legal-gold cursor-pointer transition-colors">Terms of Use</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
