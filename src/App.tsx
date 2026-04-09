import { useState } from "react";
import { Shield, MessageSquare, AlertCircle, Info, ShieldCheck, ShieldAlert, Loader2, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";
import { analyzeText, analyzeImage, analyzeAudio, AnalysisResult } from "./services/gemini";
import { AnalysisResultView } from "./components/AnalysisResult";
import { MediaUpload } from "./components/MediaUpload";
import { cn } from "@/lib/utils";

export default function App() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const handleTextAnalysis = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeText(text);
      setResult(res);
      setHistory(prev => [res, ...prev].slice(0, 5));
      if (res.riskLevel === "High") {
        toast.error("High Risk Detected!", {
          description: "This message shows strong signs of digital fraud.",
          duration: 5000,
        });
      } else {
        toast.success("Analysis Complete");
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
              description: "Evidence shows strong signs of digital fraud.",
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
      "min-h-screen bg-background transition-colors duration-500",
      result?.riskLevel === "High" ? "bg-red-50/30" : ""
    )}>
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Confirm-Am</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Digital Fraud Guardian</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        {/* Intro */}
        <section className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Don't Get Scammed.</h2>
          <p className="text-muted-foreground">
            Paste a suspicious message or upload a screenshot/voice note. 
            Our AI analyzes social engineering patterns in seconds.
          </p>
        </section>

        {/* Main Input Area */}
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="text" className="rounded-lg flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Text
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-lg flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Paste the suspicious message here... (e.g. 'Bro, I'm at the police station...')"
                className="min-h-[150px] rounded-2xl p-4 text-base resize-none border-2 focus-visible:ring-primary/20"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isAnalyzing}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
                {text.length} chars
              </div>
            </div>
            <Button 
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              onClick={handleTextAnalysis}
              disabled={isAnalyzing || !text.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Patterns...
                </>
              ) : (
                "Check for Scams"
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
            <AnalysisResultView result={result} />
          ) : isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center space-y-4"
            >
              <div className="relative inline-block">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">Scanning for Fraud...</p>
                <p className="text-sm text-muted-foreground">Checking urgency, payment requests, and linguistic markers.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center gap-4 bg-muted/20"
            >
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="max-w-[280px]">
                <p className="font-semibold text-muted-foreground">No analysis yet</p>
                <p className="text-sm text-muted-foreground/60">Your results will appear here after analysis.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational Section */}
        <section className="pt-8 border-t space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Recent Scans</h3>
          </div>
          {history.length > 0 ? (
            <div className="grid gap-3">
              {history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border text-sm">
                  <span className="font-medium truncate max-w-[200px]">{item.explanation.split('.')[0]}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    item.riskLevel === "High" ? "bg-red-100 text-red-700" : 
                    item.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                  )}>
                    {item.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">Your analysis history is empty.</p>
          )}
        </section>

        {/* Disclaimer */}
        <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Important Disclaimer</AlertTitle>
          <AlertDescription className="text-xs opacity-80">
            Confirm-Am is an experimental tool. While highly accurate, it may not detect all scams. 
            Always verify with trusted sources before sending money. Never share your PIN or OTP.
          </AlertDescription>
        </Alert>

        {/* Call for Advice Section */}
        <section className="p-6 rounded-3xl bg-primary/5 border-2 border-primary/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Need Expert Advice?</h3>
              <p className="text-sm text-muted-foreground">Speak to a human fraud specialist.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-xl h-12 flex items-center gap-2 border-primary/20 hover:bg-primary/10" asChild>
              <a href="tel:+234800CONFIRM">
                <Shield className="w-4 h-4" /> Call Helpline
              </a>
            </Button>
            <Button variant="outline" className="rounded-xl h-12 flex items-center gap-2 border-primary/20 hover:bg-primary/10" asChild>
              <a href="https://wa.me/234800CONFIRM" target="_blank" rel="noreferrer">
                <MessageSquare className="w-4 h-4" /> WhatsApp Us
              </a>
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest pt-2">
            Available 24/7 for Emergency Fraud Support
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground">
        <p className="text-xs uppercase font-bold tracking-widest opacity-50">Built for Social Good • Prompt for Good</p>
      </footer>
    </div>
  );
}

