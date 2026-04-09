import { BookOpen, AlertCircle, ShieldAlert, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Language, translations } from "@/src/constants/translations";

interface ScamSchoolProps {
  lang: Language;
}

const lessons = [
  {
    id: "nnpc",
    title: {
      en: "NNPC Recruitment Scam",
      fr: "Arnaque au recrutement de la NNPC",
      pidgin: "NNPC Job Format"
    },
    desc: {
      en: "Fake job offers claiming to be from NNPC or Shell. They ask for a 'processing fee' or 'medical fee' before the interview.",
      fr: "Fausses offres d'emploi prétendant provenir de la NNPC ou de Shell. Ils demandent des 'frais de dossier' ou des 'frais médicaux' avant l'entretien.",
      pidgin: "Fake job from NNPC or Shell. Dem go ask you for 'processing fee' or 'medical money' before interview happen."
    },
    tag: "Job Scam"
  },
  {
    id: "bvn",
    title: {
      en: "Bank BVN Phishing",
      fr: "Hameçonnage BVN bancaire",
      pidgin: "Bank BVN Phishing"
    },
    desc: {
      en: "SMS saying your account is blocked. They ask for your BVN or PIN to 'unblock' it. Real banks will NEVER ask for your PIN.",
      fr: "SMS disant que votre compte est bloqué. Ils demandent votre BVN ou code PIN pour le 'débloquer'. Les vraies banques ne demanderont JAMAIS votre code PIN.",
      pidgin: "SMS wey say your account don block. Dem go ask for your BVN or PIN to 'unblock' am. Real bank NO DEY ask for PIN."
    },
    tag: "Phishing"
  },
  {
    id: "emergency",
    title: {
      en: "Emergency Family Trap",
      fr: "Piège de l'urgence familiale",
      pidgin: "Emergency Family Format"
    },
    desc: {
      en: "A voice note or text from a 'relative' in an accident or police station. They demand immediate money. Always call the relative back on their known number.",
      fr: "Une note vocale ou un texte d'un 'parent' dans un accident ou un poste de police. Ils exigent de l'argent immédiatement. Rappelez toujours le parent sur son numéro connu.",
      pidgin: "Voice note or text from 'relative' wey say accident happen or police carry am. Dem go want money sharp-sharp. Always call dat person back for their real number."
    },
    tag: "Social Engineering"
  }
];

export function ScamSchool({ lang }: ScamSchoolProps) {
  const t = translations[lang];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">{t.scamSchool}</h3>
      </div>

      <div className="grid gap-4">
        {lessons.map((lesson, i) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-bold">{lesson.title[lang]}</CardTitle>
                  <Badge variant="secondary" className="text-[10px] uppercase">{lesson.tag}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lesson.desc[lang]}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start">
        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Scam of the Week</p>
          <p className="text-sm text-blue-800">
            {lang === "pidgin" 
              ? "Watch out for people wey de call say dem be 'Customer Care' from OPay or Moniepoint. Dem want your OTP!"
              : "Beware of callers claiming to be 'Customer Care' from OPay or Moniepoint asking for your OTP to verify your account."}
          </p>
        </div>
      </div>
    </section>
  );
}
