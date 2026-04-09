import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/src/services/gemini";
import { ScamMeter } from "./ScamMeter";
import { motion } from "motion/react";
import { Language, translations } from "@/src/constants/translations";
import { toast } from "sonner";

interface AnalysisResultViewProps {
  result: AnalysisResult;
  lang: Language;
}

export function AnalysisResultView({ result, lang }: AnalysisResultViewProps) {
  const t = translations[lang];

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
      <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden relative">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.title} Report</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-2 rounded-full border-primary/20 hover:bg-primary/10"
              onClick={handleShare}
            >
              <Share2 className="w-3.5 h-3.5" /> {t.shareAlert}
            </Button>
          </div>
          <ScamMeter score={result.riskScore} level={result.riskLevel} />
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              {t.explanation}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.explanation}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              {t.redFlags}
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.redFlags.map((flag, i) => (
                <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200 py-1 px-3">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-100 rounded-xl space-y-2">
            <h4 className="text-sm font-bold flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-4 h-4" />
              {t.recommendation}
            </h4>
            <p className="text-sm text-green-800 font-medium">
              {result.recommendation}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
