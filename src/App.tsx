import { useState } from "react";
import { Shield, MessageSquare, AlertCircle, Info, ShieldCheck, ShieldAlert, Loader2, History, Languages, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";
import { analyzeText, analyzeImage, analyzeAudio, AnalysisResult } from "./services/gemini";
import { AnalysisResultView } from "./components/AnalysisResult";
import { MediaUpload } from "./components/MediaUpload";
import { ScamSchool } from "./components/ScamSchool";
import { cn } from "@/lib/utils";
import { Language, translations } from "./constants/translations";

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const t = translations[lang];

  const handleTextAnalysis = async () => {
    if (!text.trim()) {
      toast.error(lang === "pidgin" ? "Abeg enter text first." : "Please enter some text to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeText(text);
      setResult(res);
      setHistory(prev => [res, ...prev].slice(0, 5));
      if (res.riskLevel === "High") {
        toast.error(lang === "pidgin" ? "High Risk! No let dem run you!" : "High Risk Detected!", {
          description: res.explanation,
          duration: 5000,
        });
      } else {
        toast.success(lang === "pidgin" ? "We don check am finish" : "Analysis Complete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (file: File, type: "image" | "audio") => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];
        let res: AnalysisResult;
        try {
          if (type === "image") {
            res = await analyzeImage(base64, file.type);
          } else {
            res = await analyzeAudio(base64, file.type);
          }
          setResult(res);
          setHistory(prev => [res, ...prev].slice(0, 5));
          if (res.riskLevel === "High") {
            toast.error("High Risk Detected!", {
              description: res.explanation,
              duration: 5000,
            });
          }
        } catch (err) {
          console.error(err);
          toast.error(`Failed to analyze ${type}. Please try again.`);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to read ${type} file.`);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-slate-50 transition-colors duration-500 selection:bg-blue-100",
      result?.riskLevel === "High" ? "bg-red-50/50" : "bg-gradient-to-b from-blue-50/50 to-white"
    )}>
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">{t.title}</h1>
              <p className="text-[10px] text-blue-600 uppercase font-bold tracking-widest">{t.tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-full border">
              {(["en", "fr", "pidgin"] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all",
                    lang === l ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-12">
        {/* Intro */}
        <section className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-2"
          >
            {lang === "pidgin" ? "AI de your back" : "AI-Powered Security"}
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{t.introTitle}</h2>
          <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
            {t.introDesc}
          </p>
        </section>

        {/* Main Input Area */}
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-slate-100 rounded-2xl border">
            <TabsTrigger value="text" className="rounded-xl flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4" /> {t.textTab}
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-xl flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
              <ShieldCheck className="w-4 h-4" /> {t.mediaTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder={t.placeholder}
                className="min-h-[180px] rounded-3xl p-6 text-lg resize-none border-2 border-slate-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 bg-white shadow-sm transition-all"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isAnalyzing}
              />
              <div className="absolute bottom-4 right-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {text.length} chars
              </div>
            </div>
            <Button 
              className="w-full h-16 text-xl font-black rounded-3xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
              onClick={handleTextAnalysis}
              disabled={isAnalyzing || !text.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                t.checkBtn
              )}
            </Button>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <MediaUpload onUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
          </TabsContent>
        </Tabs>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {result ? (
            <AnalysisResultView result={result} lang={lang} />
          ) : isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center space-y-6 bg-white rounded-3xl border shadow-sm"
            >
              <div className="relative inline-block">
                <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="font-black text-2xl text-slate-900">{t.analyzing}</p>
                <p className="text-slate-500">Checking urgency, payment requests, and linguistic markers.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-16 border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center text-center gap-6 bg-white/50 border-slate-200"
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
                <ShieldAlert className="w-10 h-10 text-slate-300" />
              </div>
              <div className="max-w-[300px] space-y-2">
                <p className="font-black text-xl text-slate-400">{t.noAnalysis}</p>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{t.noAnalysisDesc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scam School Section */}
        <ScamSchool lang={lang} />

        {/* Educational Section */}
        <section className="pt-8 border-t space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">{t.recentScans}</h3>
          </div>
          {history.length > 0 ? (
            <div className="grid gap-3">
              {history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border text-sm shadow-sm hover:border-blue-200 transition-colors">
                  <span className="font-bold text-slate-700 truncate max-w-[200px]">{item.explanation.split('.')[0]}</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    item.riskLevel === "High" ? "bg-red-100 text-red-700" : 
                    item.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                  )}>
                    {item.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">{t.emptyHistory}</p>
          )}
        </section>

        {/* Call for Advice Section */}
        <section className="p-8 rounded-[40px] bg-blue-600 text-white space-y-6 shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-2xl">{t.needAdvice}</h3>
              <p className="text-blue-100 font-medium">{t.speakHuman}</p>
            </div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="tel:+234800CONFIRM"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-2xl h-14 flex items-center gap-2 bg-white text-blue-600 border-none hover:bg-blue-50 text-lg font-bold"
              )}
            >
              <Shield className="w-5 h-5" /> {t.callHelpline}
            </a>
            <a 
              href="https://wa.me/234800CONFIRM" 
              target="_blank" 
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-2xl h-14 flex items-center gap-2 bg-blue-700 text-white border-none hover:bg-blue-800 text-lg font-bold"
              )}
            >
              <MessageSquare className="w-5 h-5" /> {t.whatsappUs}
            </a>
          </div>
          <p className="relative z-10 text-[10px] text-center text-blue-200 uppercase font-black tracking-[0.2em] pt-2">
            {t.emergencySupport}
          </p>
        </section>

        {/* Disclaimer */}
        <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-[32px] p-6">
          <AlertCircle className="h-5 w-5" />
          <div className="ml-2">
            <AlertTitle className="font-black text-lg mb-1">{t.disclaimerTitle}</AlertTitle>
            <AlertDescription className="text-sm font-medium opacity-80 leading-relaxed">
              {t.disclaimerDesc}
            </AlertDescription>
          </div>
        </Alert>
      </main>

      {/* Footer */}
      <footer className="py-16 text-center space-y-4">
        <div className="flex justify-center gap-4 opacity-30">
          <Shield className="w-4 h-4" />
          <Globe className="w-4 h-4" />
          <Languages className="w-4 h-4" />
        </div>
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">Built for Social Good • Prompt for Good</p>
      </footer>
    </div>
  );
}

