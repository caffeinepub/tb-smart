import { AppBar } from "@/components/AppBar";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import type { RiskLevel } from "@/context/AppContext";
import { AlertTriangle, ChevronRight, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface GuidanceContent {
  title: string;
  steps: string[];
  urgency: string;
  urgencyColor: string;
}

const GUIDANCE: Record<RiskLevel, GuidanceContent> = {
  Low: {
    title: "You're at Low Risk",
    urgency: "Monitor & Maintain",
    urgencyColor: "oklch(0.52 0.16 145)",
    steps: [
      "Maintain personal hygiene",
      "Ensure good ventilation at home",
      "Monitor your symptoms regularly",
      "Eat nutritious food to boost immunity",
      "If symptoms develop, visit your nearest health centre",
    ],
  },
  Moderate: {
    title: "You're at Moderate Risk",
    urgency: "Visit PHC Soon",
    urgencyColor: "oklch(0.55 0.19 60)",
    steps: [
      "Visit your nearest Primary Health Centre (PHC)",
      "Request a sputum test for TB",
      "Inform your doctor about your symptoms",
      "Avoid close contact with vulnerable individuals until tested",
    ],
  },
  High: {
    title: "You're at High Risk",
    urgency: "Seek Immediate Care",
    urgencyColor: "oklch(0.50 0.22 28)",
    steps: [
      "Seek immediate medical attention TODAY",
      "Visit your nearest government hospital or TB centre",
      "Request sputum test and chest X-ray",
      "Do NOT delay — early treatment prevents complications",
    ],
  },
};

export function HospitalGuidanceScreen() {
  const navigate = useNavigate();
  const { riskLevel } = useAppContext();

  const effectiveRisk: RiskLevel = riskLevel ?? "Low";
  const guidance = GUIDANCE[effectiveRisk];

  return (
    <div className="tb-app-shell min-h-screen">
      <AppBar
        title="TB SMART"
        subtitle="Health Guidance"
        showBack
        backTo="/symptom-checker"
      />

      <div className="max-w-sm mx-auto px-4 pt-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
            Health Guidance
          </h2>
          <p className="text-muted-foreground text-sm">
            Based on your symptom checker results
          </p>
        </motion.div>

        {/* Risk Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 280,
            damping: 24,
          }}
          className="tb-card p-5 mb-4 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Your Risk Category
          </p>
          <RiskBadge level={effectiveRisk} size="lg" />
          <p
            className="mt-3 text-base font-bold font-heading"
            style={{ color: guidance.urgencyColor }}
          >
            {guidance.title}
          </p>
          <div
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${guidance.urgencyColor}22`,
              color: guidance.urgencyColor,
            }}
          >
            {effectiveRisk === "High" && <AlertTriangle className="h-3 w-3" />}
            {guidance.urgency}
          </div>
        </motion.div>

        {/* Guidance Steps */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="tb-card p-4 mb-4"
        >
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Recommended Actions
          </h3>
          <ul className="space-y-3">
            {guidance.steps.map((step, i) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: guidance.urgencyColor }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/80 leading-relaxed">
                  {step}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Helpline Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="tb-card p-4 mb-4"
          style={{
            background: "oklch(0.94 0.055 240)",
            border: "1.5px solid oklch(0.44 0.16 255 / 0.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.44 0.16 255)" }}
            >
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-foreground">
                Karnataka Health Helpline
              </p>
              <p
                className="text-2xl font-bold font-heading"
                style={{ color: "oklch(0.44 0.16 255)" }}
              >
                104
              </p>
              <p className="text-xs text-muted-foreground">
                Available 24/7 — Free of cost
              </p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="tb-card p-4 mb-6"
          style={{
            background: "oklch(0.97 0.005 240)",
            border: "1px solid oklch(0.88 0.025 240)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Medical Disclaimer:</strong>{" "}
              This app is for awareness and screening purposes only. It does not
              replace professional medical diagnosis. Please consult a qualified
              healthcare professional for proper diagnosis and treatment.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button
            className="w-full h-14 text-base font-heading font-bold rounded-2xl shadow-lg"
            style={{ background: "oklch(0.44 0.16 255)" }}
            onClick={() => navigate("/posttest")}
            data-ocid="guidance.primary_button"
          >
            Proceed to Post-Test
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
