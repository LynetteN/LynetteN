import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Share2, Brain, Fingerprint, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisResult } from "@/src/services/gemini";
import { ScamMeter } from "./ScamMeter";
import { motion } from "motion/react";
import { Language, translations } from "@/src/constants/translations";
import { toast } from "sonner";
import { useState } from "react";

interface AnalysisResultViewProps {
  result: AnalysisResult;
  lang: Language;
}

export function AnalysisResultView({ result, lang }: AnalysisResultViewProps) {
  const t = translations[lang];
  const [chatInput, setChatInput] = useState("");

  const handleShare = () => {
    const shareText = `🚨 *SCAM ALERT VERIFIED BY CONFIRM-AM* 🚨\n\n` +
      `*Risk Level:* ${result.riskLevel} (${result.riskScore}/100)\n` +
      `*Analysis:* ${result.explanation}\n\n` +
      `*Red Flags:* ${result.redFlags.join(", ")}\n\n` +
      `*Recommendation:* ${result.recommendation}\n\n` +
      `Don't get scammed! Check suspicious messages at: ${window.location.href}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp to share...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-none shadow-2xl shadow-blue-100 rounded-[40px] overflow-hidden relative bg-white">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-500 to-red-500" />
        
        <CardHeader className="bg-slate-50/50 pb-6 pt-8 px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block mb-0.5">{t.analysisReport}</span>
                <CardTitle className="text-xl font-black text-slate-900">{t.analysisReport}</CardTitle>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 gap-2 rounded-2xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-bold"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" /> {t.shareAlert}
            </Button>
          </div>
          <ScamMeter score={result.riskScore} level={result.riskLevel} />
        </CardHeader>

        <CardContent className="pt-8 px-8 pb-8 space-y-8">
          {/* Explanation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-400">
              <Info className="w-4 h-4 text-blue-500" />
              {t.explanation}
            </h4>
            <p className="text-lg font-medium leading-relaxed text-slate-700">
              {result.explanation}
            </p>
          </div>

          {/* Linguistic Breakdown - SMART FEATURE */}
          {result.linguisticBreakdown && (
            <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-blue-600">
                <Brain className="w-4 h-4" />
                {t.linguisticBreakdown}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">{t.tactic}</p>
                  <p className="text-sm font-bold text-slate-900">{result.linguisticBreakdown.tactic}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">{t.trigger}</p>
                  <p className="text-sm font-bold text-slate-900">{result.linguisticBreakdown.psychologicalTrigger}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400">{t.markers}</p>
                <div className="flex flex-wrap gap-2">
                  {result.linguisticBreakdown.markers.map((marker, i) => (
                    <Badge key={i} variant="secondary" className="bg-white text-blue-700 border-blue-100 font-bold px-3 py-1 rounded-lg">
                      <Fingerprint className="w-3 h-3 mr-1.5 opacity-50" />
                      {marker}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Red Flags */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-4 h-4" />
              {t.redFlags}
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.redFlags.map((flag, i) => (
                <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-100 py-2 px-4 rounded-xl font-bold">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-6 bg-green-600 rounded-[32px] text-white shadow-xl shadow-green-100 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-80">
              <CheckCircle2 className="w-4 h-4" />
              {t.recommendation}
            </h4>
            <p className="text-xl font-black leading-tight">
              {result.recommendation}
            </p>
          </div>

          {/* Smart AI Chat - LOVELY FEATURE */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-400">
                <Sparkles className="w-4 h-4 text-purple-500" />
                {t.smartChat}
              </h4>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-purple-200 text-purple-600 bg-purple-50">Experimental</Badge>
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder={t.chatPlaceholder}
                className="rounded-2xl border-slate-200 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 h-12 bg-slate-50/50"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <Button 
                className="rounded-2xl w-12 h-12 p-0 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100 shrink-0"
                onClick={() => {
                  toast.info("AI Guardian is thinking...", { description: "This feature is coming in the next update!" });
                  setChatInput("");
                }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
