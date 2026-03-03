import { AppBar } from "@/components/AppBar";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import type { RiskLevel } from "@/context/AppContext";
import { useParticipantActor } from "@/hooks/useParticipantActor";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Symptom {
  id: string;
  question: string;
  icon: string;
  ocid: string;
  isCritical?: boolean;
}

const SYMPTOMS: Symptom[] = [
  {
    id: "cough",
    question: "Do you have a cough lasting more than 2 weeks?",
    icon: "😮‍💨",
    ocid: "symptom.cough_toggle",
  },
  {
    id: "fever",
    question: "Do you have fever lasting more than 2 weeks?",
    icon: "🌡️",
    ocid: "symptom.fever_toggle",
  },
  {
    id: "nightSweats",
    question: "Do you experience night sweats?",
    icon: "💧",
    ocid: "symptom.nightsweats_toggle",
  },
  {
    id: "weightLoss",
    question: "Have you experienced unexplained weight loss?",
    icon: "⚖️",
    ocid: "symptom.weightloss_toggle",
  },
  {
    id: "bloodSputum",
    question: "Have you coughed up blood?",
    icon: "🩸",
    ocid: "symptom.bloodsputum_toggle",
    isCritical: true,
  },
  {
    id: "tbContact",
    question: "Do you have a history of close contact with a TB patient?",
    icon: "👥",
    ocid: "symptom.tbcontact_toggle",
  },
];

function calculateRisk(answers: Record<string, boolean>): RiskLevel {
  if (answers.bloodSputum) return "High";
  const yesCount = Object.values(answers).filter(Boolean).length;
  if (yesCount >= 4) return "High";
  if (yesCount >= 2) return "Moderate";
  return "Low";
}

export function SymptomCheckerScreen() {
  const navigate = useNavigate();
  const { actor } = useParticipantActor();
  const { registrationId, setRiskLevel } = useAppContext();

  const [answers, setAnswers] = useState<Record<string, boolean>>(
    Object.fromEntries(SYMPTOMS.map((s) => [s.id, false])),
  );
  const [result, setResult] = useState<RiskLevel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (id: string, val: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
    if (result) setResult(null); // reset result when user changes answers
  };

  const handleCheck = async () => {
    if (!registrationId) {
      toast.error("Session error. Please restart from the beginning.");
      navigate("/consent");
      return;
    }
    if (!actor) {
      toast.error("Connection error. Please try again.");
      return;
    }

    const risk = calculateRisk(answers);

    setIsSubmitting(true);
    try {
      await actor.saveRiskLevel(registrationId, risk);
      setRiskLevel(risk);
      setResult(risk);
      // Short delay to show result, then navigate
      setTimeout(() => {
        navigate("/hospital-guidance");
      }, 1800);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save risk level. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const yesCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="tb-app-shell min-h-screen">
      <AppBar
        title="TB SMART"
        subtitle="AI Symptom Checker"
        showBack
        backTo="/awareness"
      />

      <div className="max-w-sm mx-auto px-4 pt-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
            AI Symptom Checker
          </h2>
          <p className="text-muted-foreground text-sm">
            Answer the following questions honestly
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "oklch(0.94 0.055 240)",
              color: "oklch(0.44 0.16 255)",
            }}
          >
            {yesCount} of {SYMPTOMS.length} symptoms selected
          </div>
        </motion.div>

        <div className="space-y-3 mb-5">
          {SYMPTOMS.map((symptom, i) => {
            const isYes = answers[symptom.id];
            return (
              <motion.div
                key={symptom.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                data-ocid={symptom.ocid}
              >
                <div
                  className={`tb-card p-4 transition-all duration-200 ${
                    symptom.isCritical && isYes
                      ? "border-2 border-risk-high bg-risk-high"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: "oklch(0.92 0.055 240)" }}
                    >
                      <span role="img" aria-label={symptom.id}>
                        {symptom.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {symptom.question}
                      </p>
                      {symptom.isCritical && (
                        <span className="text-xs text-risk-high font-semibold">
                          ⚠ Critical symptom
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(symptom.id, true)}
                      className={`flex-1 h-11 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        isYes
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(symptom.id, false)}
                      className={`flex-1 h-11 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        !isYes
                          ? "border-muted-foreground/40 bg-muted/60 text-muted-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Result display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="tb-card p-4 mb-4 text-center"
            >
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Your Risk Assessment
              </p>
              <RiskBadge level={result} size="lg" />
              <p className="text-xs text-muted-foreground mt-2">
                Redirecting to health guidance...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          className="w-full h-14 text-base font-heading font-bold rounded-2xl shadow-lg"
          style={{ background: "oklch(0.44 0.16 255)" }}
          onClick={handleCheck}
          disabled={isSubmitting || result !== null}
          data-ocid="symptom.submit_button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Check My Risk →"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
          ⚠️ For screening purposes only. Not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
