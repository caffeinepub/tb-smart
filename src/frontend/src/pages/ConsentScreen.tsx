import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen, Heart, Lock, ShieldCheck, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ConsentScreen() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="tb-app-shell min-h-screen">
      <div className="max-w-sm mx-auto px-4 py-6 pb-24">
        {/* Logo header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ background: "oklch(0.44 0.16 255)" }}
          >
            <span className="text-4xl" role="img" aria-label="lungs">
              🫁
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground tracking-tight">
            TB SMART
          </h1>
          <p className="text-muted-foreground text-sm mt-1 leading-snug px-4">
            AI-Based Early Detection & Awareness App
          </p>
        </motion.div>

        {/* Study Title Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="tb-card p-4 mb-4"
          style={{ borderLeft: "4px solid oklch(0.44 0.16 255)" }}
        >
          <div className="flex items-start gap-3">
            <BookOpen
              className="h-5 w-5 mt-0.5 shrink-0"
              style={{ color: "oklch(0.44 0.16 255)" }}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Research Study
              </p>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                "A Pre-Experimental Study to Assess the Effectiveness of an
                AI-Based Mobile Application on Knowledge Regarding Early
                Detection of Tuberculosis Among Community Adults at Selected
                Areas, Bengaluru."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Consent Sections */}
        {[
          {
            icon: <BookOpen className="h-5 w-5" />,
            title: "Study Purpose",
            content:
              "This study aims to assess the effectiveness of TB SMART app in improving knowledge about early detection of tuberculosis among community adults in Bengaluru.",
            delay: 0.25,
          },
          {
            icon: <Heart className="h-5 w-5" />,
            title: "Voluntary Participation",
            content:
              "Your participation in this study is completely voluntary. You may withdraw at any time without any penalty or loss of benefits.",
            delay: 0.35,
          },
          {
            icon: <Lock className="h-5 w-5" />,
            title: "Confidentiality",
            content:
              "All information collected will be kept strictly confidential. Your data will be identified only by a registration ID and used solely for research purposes.",
            delay: 0.45,
          },
        ].map(({ icon, title, content, delay }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="tb-card p-4 mb-3"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(0.92 0.055 240)",
                  color: "oklch(0.44 0.16 255)",
                }}
              >
                {icon}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-foreground mb-1">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Consent Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="tb-card p-4 mb-4"
          style={{ background: agreed ? "oklch(0.94 0.04 240)" : undefined }}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent-check"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              className="mt-0.5 h-5 w-5"
              data-ocid="consent.checkbox"
            />
            <Label
              htmlFor="consent-check"
              className="text-sm text-foreground font-medium leading-relaxed cursor-pointer"
            >
              I agree to participate in this study and understand my rights as a
              participant
            </Label>
          </div>
        </motion.div>

        {/* Consent Icon */}
        {agreed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-4"
          >
            <div
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "oklch(0.52 0.16 145)" }}
            >
              <ShieldCheck className="h-5 w-5" />
              <span>Thank you for your consent</span>
            </div>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <Button
            className="w-full h-14 text-base font-heading font-bold rounded-2xl shadow-lg"
            style={{
              background: agreed ? "oklch(0.44 0.16 255)" : undefined,
              opacity: agreed ? 1 : 0.5,
            }}
            disabled={!agreed}
            onClick={() => navigate("/register")}
            data-ocid="consent.primary_button"
          >
            Continue to Registration →
          </Button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>

        {/* Hidden Admin Access */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            data-ocid="consent.admin_button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-muted/40"
            title="Researcher / Admin Login"
          >
            <UserCog className="h-3.5 w-3.5" />
            <span>Researcher Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
