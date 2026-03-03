import { AppBar } from "@/components/AppBar";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import type { RiskLevel } from "@/context/AppContext";
import { jsPDF } from "jspdf";
import { Download, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const STUDY_TITLE =
  "A Pre-Experimental Study to Assess the Effectiveness of an AI-Based Mobile Application on Knowledge Regarding Early Detection of Tuberculosis Among Community Adults at Selected Areas, Bengaluru.";

const GUIDANCE_SUMMARY: Record<RiskLevel, string> = {
  Low: "Maintain hygiene, ensure ventilation, monitor symptoms, and eat nutritious food. Visit a health centre if symptoms develop.",
  Moderate:
    "Visit your nearest Primary Health Centre (PHC) for a sputum test. Inform your doctor about your symptoms and avoid close contact with vulnerable individuals until tested.",
  High: "Seek immediate medical attention at a government hospital or TB centre. Request sputum test and chest X-ray. Do not delay treatment.",
};

function formatDate(isoStr: string | null): string {
  if (!isoStr)
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  return new Date(isoStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ReportScreen() {
  const {
    registrationId,
    participantName,
    preTestScore,
    postTestScore,
    riskLevel,
    registrationDate,
  } = useAppContext();

  const pre = preTestScore ?? 0;
  const post = postTestScore ?? 0;
  const improvement = post - pre;
  const effectiveRisk: RiskLevel = riskLevel ?? "Low";

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentW = pageW - margin * 2;
      let y = 20;

      // ─── Header Banner ────────────────────────────────────────────────────
      doc.setFillColor(30, 80, 200);
      doc.roundedRect(margin, y, contentW, 28, 4, 4, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("TB SMART", pageW / 2, y + 10, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("AI-Based Early Detection & Awareness App", pageW / 2, y + 17, {
        align: "center",
      });

      doc.setFontSize(7);
      doc.text("Research Report", pageW / 2, y + 23, { align: "center" });

      y += 36;

      // ─── Study Title ──────────────────────────────────────────────────────
      doc.setFillColor(240, 245, 255);
      doc.roundedRect(margin, y, contentW, 22, 3, 3, "F");
      doc.setFontSize(7.5);
      doc.setTextColor(50, 80, 160);
      doc.setFont("helvetica", "italic");
      const titleLines = doc.splitTextToSize(STUDY_TITLE, contentW - 8);
      doc.text(titleLines, pageW / 2, y + 6, { align: "center" });
      y += 28;

      // ─── Participant Details ──────────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 60, 140);
      doc.text("PARTICIPANT DETAILS", margin, y);
      y += 2;
      doc.setDrawColor(30, 80, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + contentW, y);
      y += 6;

      const detailRows = [
        ["Participant Name", participantName ?? "—"],
        ["Registration ID", registrationId ?? "—"],
        ["Date of Assessment", formatDate(registrationDate)],
      ];

      doc.setFontSize(10);
      for (const [label, value] of detailRows) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text(`${label}:`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(20, 20, 20);
        doc.text(value, margin + 55, y);
        y += 7;
      }

      y += 4;

      // ─── Test Scores ──────────────────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 60, 140);
      doc.text("KNOWLEDGE ASSESSMENT SCORES", margin, y);
      y += 2;
      doc.setDrawColor(30, 80, 200);
      doc.line(margin, y, margin + contentW, y);
      y += 8;

      // Score boxes
      const boxW = (contentW - 8) / 3;
      const boxes = [
        {
          label: "Pre-Test Score",
          value: `${pre} / 20`,
          color: [220, 235, 255] as [number, number, number],
          text: [30, 60, 140] as [number, number, number],
        },
        {
          label: "Post-Test Score",
          value: `${post} / 20`,
          color: [220, 255, 235] as [number, number, number],
          text: [20, 120, 60] as [number, number, number],
        },
        {
          label: "Improvement",
          value: `${improvement >= 0 ? "+" : ""}${improvement}`,
          color:
            improvement >= 0
              ? ([220, 255, 235] as [number, number, number])
              : ([255, 225, 220] as [number, number, number]),
          text:
            improvement >= 0
              ? ([20, 120, 60] as [number, number, number])
              : ([160, 40, 20] as [number, number, number]),
        },
      ];

      for (let i = 0; i < boxes.length; i++) {
        const bx = margin + i * (boxW + 4);
        doc.setFillColor(...boxes[i].color);
        doc.roundedRect(bx, y, boxW, 22, 3, 3, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...boxes[i].text);
        doc.text(boxes[i].value, bx + boxW / 2, y + 12, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(80, 80, 80);
        doc.text(boxes[i].label, bx + boxW / 2, y + 19, { align: "center" });
      }

      y += 30;

      // ─── Risk Category ────────────────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 60, 140);
      doc.text("RISK CATEGORY & HEALTH GUIDANCE", margin, y);
      y += 2;
      doc.setDrawColor(30, 80, 200);
      doc.line(margin, y, margin + contentW, y);
      y += 8;

      const riskColors: Record<RiskLevel, [number, number, number]> = {
        Low: [34, 139, 34],
        Moderate: [200, 120, 0],
        High: [180, 40, 20],
      };
      const riskBgColors: Record<RiskLevel, [number, number, number]> = {
        Low: [230, 255, 230],
        Moderate: [255, 245, 220],
        High: [255, 235, 230],
      };

      doc.setFillColor(...riskBgColors[effectiveRisk]);
      doc.roundedRect(margin, y, contentW, 10, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...riskColors[effectiveRisk]);
      doc.text(`Risk Level: ${effectiveRisk} Risk`, pageW / 2, y + 7, {
        align: "center",
      });
      y += 16;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      const guidanceLines = doc.splitTextToSize(
        GUIDANCE_SUMMARY[effectiveRisk],
        contentW,
      );
      doc.text(guidanceLines, margin, y);
      y += guidanceLines.length * 5 + 6;

      // Helpline
      doc.setFillColor(240, 245, 255);
      doc.roundedRect(margin, y, contentW, 12, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 60, 140);
      doc.text(
        "Karnataka Health Helpline: 104 (Available 24/7 — Free of cost)",
        pageW / 2,
        y + 8,
        {
          align: "center",
        },
      );
      y += 18;

      // ─── Disclaimer ───────────────────────────────────────────────────────
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(margin, y, contentW, 20, 3, 3, "F");
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("⚠ Medical Disclaimer", margin + 4, y + 6);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      const disclaimer =
        "This report is generated for research purposes only. It does not constitute a medical diagnosis. Please consult a qualified healthcare professional for proper diagnosis and treatment.";
      const disclaimerLines = doc.splitTextToSize(disclaimer, contentW - 8);
      doc.text(disclaimerLines, margin + 4, y + 12);
      y += 26;

      // ─── Footer ───────────────────────────────────────────────────────────
      doc.setDrawColor(200, 210, 230);
      doc.setLineWidth(0.3);
      doc.line(margin, y, margin + contentW, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} | TB SMART Research Application`,
        pageW / 2,
        y,
        { align: "center" },
      );
      doc.text("Generated by TB SMART Application", pageW / 2, y + 5, {
        align: "center",
      });

      const fileName = `TBSMART_Report_${registrationId ?? "Unknown"}.pdf`;
      doc.save(fileName);
      toast.success("PDF report downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const ImprovementIcon = () => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4" />;
    if (improvement < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <div className="tb-app-shell min-h-screen">
      <AppBar
        title="TB SMART"
        subtitle="Final Report"
        showBack
        backTo="/posttest"
      />

      <div className="max-w-sm mx-auto px-4 pt-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5"
        >
          <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
            Final Report
          </h2>
          <p className="text-muted-foreground text-sm">
            Your TB SMART research study summary
          </p>
        </motion.div>

        {/* Report Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="tb-card p-5 mb-4 text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.44 0.16 255) 0%, oklch(0.38 0.14 265) 100%)",
          }}
        >
          <div className="text-4xl mb-2">🫁</div>
          <h3 className="font-heading font-bold text-2xl text-white mb-0.5">
            TB SMART
          </h3>
          <p className="text-white/80 text-xs">
            AI-Based Early Detection & Awareness App
          </p>
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-white/70 text-xs font-medium">RESEARCH REPORT</p>
          </div>
        </motion.div>

        {/* Participant Details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="tb-card p-4 mb-4"
        >
          <h3
            className="font-heading font-bold text-xs uppercase tracking-wider mb-3"
            style={{ color: "oklch(0.44 0.16 255)" }}
          >
            Participant Details
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "Name", value: participantName ?? "—" },
              {
                label: "Registration ID",
                value: registrationId ?? "—",
                mono: true,
              },
              { label: "Date", value: formatDate(registrationDate) },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span
                  className={`text-sm font-semibold text-foreground ${mono ? "font-mono text-xs" : ""}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Test Scores */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="tb-card p-4 mb-4"
        >
          <h3
            className="font-heading font-bold text-xs uppercase tracking-wider mb-3"
            style={{ color: "oklch(0.44 0.16 255)" }}
          >
            Knowledge Assessment
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-primary/10">
              <p
                className="text-2xl font-bold font-heading"
                style={{ color: "oklch(0.44 0.16 255)" }}
              >
                {pre}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Pre-Test</p>
              <p className="text-xs text-muted-foreground">out of 20</p>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{ background: "oklch(0.92 0.07 145 / 0.4)" }}
            >
              <p
                className="text-2xl font-bold font-heading"
                style={{ color: "oklch(0.52 0.16 145)" }}
              >
                {post}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Post-Test</p>
              <p className="text-xs text-muted-foreground">out of 20</p>
            </div>
            <div
              className="text-center p-3 rounded-xl"
              style={{
                background:
                  improvement >= 0
                    ? "oklch(0.92 0.07 145 / 0.4)"
                    : "oklch(0.95 0.07 28 / 0.4)",
              }}
            >
              <div className="flex items-center justify-center gap-0.5">
                <span
                  className="text-2xl font-bold font-heading"
                  style={{
                    color:
                      improvement >= 0
                        ? "oklch(0.52 0.16 145)"
                        : "oklch(0.50 0.22 28)",
                  }}
                >
                  {improvement >= 0 ? "+" : ""}
                  {improvement}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Improvement
              </p>
              <div
                className="flex items-center justify-center"
                style={{
                  color:
                    improvement >= 0
                      ? "oklch(0.52 0.16 145)"
                      : "oklch(0.50 0.22 28)",
                }}
              >
                <ImprovementIcon />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Category */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="tb-card p-4 mb-4"
        >
          <h3
            className="font-heading font-bold text-xs uppercase tracking-wider mb-3"
            style={{ color: "oklch(0.44 0.16 255)" }}
          >
            Risk Assessment & Guidance
          </h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Risk Category</span>
            <RiskBadge level={effectiveRisk} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {GUIDANCE_SUMMARY[effectiveRisk]}
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="tb-card p-3.5 mb-5"
          style={{ background: "oklch(0.97 0.005 240)" }}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            ⚠️ This report is generated for research purposes only. It does not
            constitute a medical diagnosis.
          </p>
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Button
            className="w-full h-14 text-base font-heading font-bold rounded-2xl shadow-lg"
            style={{ background: "oklch(0.44 0.16 255)" }}
            onClick={handleDownloadPDF}
            data-ocid="report.download_button"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF Report
          </Button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
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
      </div>
    </div>
  );
}
