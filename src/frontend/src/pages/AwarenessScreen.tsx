import { AppBar } from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface AwarenessSection {
  icon: string;
  iconLabel: string;
  title: string;
  content: React.ReactNode;
  colorClass: string;
}

const sections: AwarenessSection[] = [
  {
    icon: "🫁",
    iconLabel: "lungs",
    title: "What is Tuberculosis?",
    colorClass: "bg-sky-50 border-sky-200",
    content: (
      <p className="text-sm text-foreground/80 leading-relaxed">
        Tuberculosis (TB) is an infectious disease caused by the bacterium{" "}
        <em className="font-semibold text-foreground">
          Mycobacterium tuberculosis
        </em>
        . It primarily affects the lungs but can affect other organs. TB is one
        of the leading infectious disease killers worldwide, but it is{" "}
        <strong>preventable and curable</strong>.
      </p>
    ),
  },
  {
    icon: "🦠",
    iconLabel: "bacteria",
    title: "What Causes TB?",
    colorClass: "bg-violet-50 border-violet-200",
    content: (
      <p className="text-sm text-foreground/80 leading-relaxed">
        TB is caused by{" "}
        <em className="font-semibold text-foreground">
          Mycobacterium tuberculosis
        </em>
        , a slow-growing bacterium. When a person with active TB coughs,
        sneezes, speaks, or sings, they release tiny droplets containing the
        bacteria into the air.
      </p>
    ),
  },
  {
    icon: "💨",
    iconLabel: "airborne spread",
    title: "How Does TB Spread?",
    colorClass: "bg-cyan-50 border-cyan-200",
    content: (
      <div className="space-y-2">
        <p className="text-sm text-foreground/80 leading-relaxed">
          TB spreads through the air from person to person. Breathing in air
          containing TB bacteria can cause infection.
        </p>
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
          <strong>Note:</strong> TB does NOT spread through touching, sharing
          food, or mosquito bites.
        </div>
      </div>
    ),
  },
  {
    icon: "🌡️",
    iconLabel: "symptoms",
    title: "Early Symptoms",
    colorClass: "bg-rose-50 border-rose-200",
    content: (
      <ul className="space-y-1.5">
        {[
          "Persistent cough lasting more than 2 weeks",
          "Coughing up blood or blood-stained sputum",
          "Chest pain",
          "Weakness or fatigue",
          "Weight loss",
          "Fever (especially low-grade, evening fever)",
          "Night sweats",
          "Loss of appetite",
        ].map((s) => (
          <li
            key={s}
            className="flex items-start gap-2 text-sm text-foreground/80"
          >
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: "oklch(0.59 0.22 28)" }}
            />
            {s}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: "🔍",
    iconLabel: "early detection",
    title: "Importance of Early Detection",
    colorClass: "bg-emerald-50 border-emerald-200",
    content: (
      <div className="space-y-2">
        <p className="text-sm text-foreground/80 leading-relaxed">
          Early detection of TB is critical. When TB is found early:
        </p>
        <ul className="space-y-1.5">
          {[
            "Treatment is more effective",
            "Recovery is faster",
            "Spread to family and community is prevented",
            "Risk of drug-resistant TB is reduced",
          ].map((s) => (
            <li
              key={s}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: "oklch(0.52 0.16 145)" }}
              />
              {s}
            </li>
          ))}
        </ul>
        <div
          className="p-2.5 rounded-xl text-xs font-semibold"
          style={{
            background: "oklch(0.94 0.055 240)",
            color: "oklch(0.44 0.16 255)",
          }}
        >
          ⚡ If you have any TB symptoms, do not delay — get tested immediately.
        </div>
      </div>
    ),
  },
  {
    icon: "🛡️",
    iconLabel: "prevention",
    title: "Prevention",
    colorClass: "bg-indigo-50 border-indigo-200",
    content: (
      <ul className="space-y-1.5">
        {[
          "Get BCG vaccination (especially for children)",
          "Ensure good ventilation in living spaces",
          "Cover your mouth when coughing or sneezing",
          "Maintain good nutrition and healthy immunity",
          "Avoid prolonged close contact with TB patients",
          "Complete the full course of TB treatment if diagnosed",
        ].map((s) => (
          <li
            key={s}
            className="flex items-start gap-2 text-sm text-foreground/80"
          >
            <span
              className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: "oklch(0.44 0.16 255)" }}
            />
            {s}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: "💊",
    iconLabel: "treatment",
    title: "Treatment",
    colorClass: "bg-teal-50 border-teal-200",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-foreground/80 leading-relaxed">
          TB is <strong>completely curable</strong> with proper treatment.
        </p>
        <div
          className="p-3 rounded-xl"
          style={{
            background: "oklch(0.94 0.055 240)",
            border: "1.5px solid oklch(0.44 0.16 255 / 0.25)",
          }}
        >
          <p
            className="text-sm font-bold mb-2"
            style={{ color: "oklch(0.44 0.16 255)" }}
          >
            🇮🇳 National Tuberculosis Elimination Programme (NTEP)
          </p>
          <ul className="space-y-1">
            {[
              "FREE treatment at all government health centres",
              "Treatment duration: 6 months (standard first-line)",
              "Regular sputum tests to monitor progress",
              "DOTS (Directly Observed Treatment, Short-course) strategy",
            ].map((s) => (
              <li
                key={s}
                className="flex items-start gap-2 text-xs text-foreground/80"
              >
                <span
                  className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                  style={{ background: "oklch(0.44 0.16 255)" }}
                />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
          ⚠️ Do not stop treatment midway — incomplete treatment leads to
          drug-resistant TB.
        </div>
      </div>
    ),
  },
];

export function AwarenessScreen() {
  const navigate = useNavigate();

  return (
    <div className="tb-app-shell min-h-screen">
      <AppBar
        title="TB SMART"
        subtitle="TB Awareness"
        showBack
        backTo="/pretest"
      />

      <div className="max-w-sm mx-auto px-4 pt-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
            TB Awareness
          </h2>
          <p className="text-muted-foreground text-sm">
            Learn important facts about tuberculosis before proceeding to the
            symptom checker.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={`tb-card p-4 border ${section.colorClass}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "oklch(0.44 0.16 255 / 0.1)" }}
                >
                  <span role="img" aria-label={section.iconLabel}>
                    {section.icon}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-foreground pt-1.5">
                  {section.title}
                </h3>
              </div>
              {section.content}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-6"
        >
          <Button
            className="w-full h-14 text-base font-heading font-bold rounded-2xl shadow-lg"
            style={{ background: "oklch(0.44 0.16 255)" }}
            onClick={() => navigate("/symptom-checker")}
            data-ocid="awareness.primary_button"
          >
            Proceed to Symptom Checker
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
