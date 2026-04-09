import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/src/services/gemini";
import { ScamMeter } from "./ScamMeter";
import { motion } from "motion/react";

interface AnalysisResultViewProps {
  result: AnalysisResult;
}

export function AnalysisResultView({ result }: AnalysisResultViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Analysis Report</span>
          </div>
          <ScamMeter score={result.riskScore} level={result.riskLevel} />
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              What's happening here?
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.explanation}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              Red Flags Detected
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
              Recommended Action
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
