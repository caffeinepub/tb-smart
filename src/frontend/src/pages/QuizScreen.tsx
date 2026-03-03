import { AppBar } from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";
import { TB_QUESTIONS } from "@/data/tbQuestions";
import { useParticipantActor } from "@/hooks/useParticipantActor";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface QuizScreenProps {
  mode: "pretest" | "posttest";
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function QuizScreen({ mode }: QuizScreenProps) {
  const navigate = useNavigate();
  const { actor } = useParticipantActor();
  const { registrationId, setPreTestScore, setPostTestScore } = useAppContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(TB_QUESTIONS.length).fill(null),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);

  const question = TB_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / TB_QUESTIONS.length) * 100;
  const isLast = currentIndex === TB_QUESTIONS.length - 1;
  const currentAnswer = answers[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;

  const handleSelectOption = (idx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = idx;
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < TB_QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((p) => p - 1);
    }
  };

  const handleSubmit = async () => {
    if (answeredCount < TB_QUESTIONS.length) {
      const unanswered = TB_QUESTIONS.length - answeredCount;
      toast.error(`Please answer all questions (${unanswered} remaining)`);
      // Jump to first unanswered
      const firstUnanswered = answers.findIndex((a) => a === null);
      if (firstUnanswered >= 0) setCurrentIndex(firstUnanswered);
      return;
    }

    if (!registrationId) {
      toast.error("Session error. Please restart from the beginning.");
      navigate("/consent");
      return;
    }

    if (!actor) {
      toast.error("Connection error. Please try again.");
      return;
    }

    const score = answers.reduce<number>((acc, answer, i) => {
      return answer === TB_QUESTIONS[i].correctIndex ? acc + 1 : acc;
    }, 0);

    setIsSubmitting(true);
    try {
      if (mode === "pretest") {
        await actor.savePreTestScore(registrationId, BigInt(score));
        setPreTestScore(score);
        toast.success(`Pre-Test submitted! Score: ${score}/20`);
        navigate("/awareness");
      } else {
        await actor.savePostTestScore(registrationId, BigInt(score));
        setPostTestScore(score);
        toast.success(`Post-Test submitted! Score: ${score}/20`);
        navigate("/report");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save score. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading =
    mode === "pretest" ? "Pre-Test Assessment" : "Post-Test Assessment";
  const submitOcid =
    mode === "pretest" ? "pretest.submit_button" : "posttest.submit_button";

  return (
    <div className="tb-app-shell min-h-screen">
      <AppBar
        title="TB SMART"
        subtitle={heading}
        showBack
        backTo={mode === "pretest" ? "/register" : "/hospital-guidance"}
      />

      <div className="max-w-sm mx-auto px-4 pt-4 pb-24">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading font-bold text-xl text-foreground">
              {heading}
            </h2>
            <span className="text-sm font-semibold text-muted-foreground">
              {answeredCount}/{TB_QUESTIONS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
          <p className="text-xs text-muted-foreground mt-1.5">
            Question {currentIndex + 1} of {TB_QUESTIONS.length}
          </p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="tb-card p-4 mb-4">
              <div className="flex items-start gap-3 mb-1">
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "oklch(0.44 0.16 255)", color: "white" }}
                >
                  {currentIndex + 1}
                </span>
                <p className="text-base font-semibold text-foreground leading-snug pt-0.5">
                  {question.question}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {question.options.map((option, idx) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-start gap-3 ${
                    currentAnswer === idx
                      ? "answer-option-selected"
                      : "answer-option-unselected"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      currentAnswer === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {OPTION_LETTERS[idx]}
                  </span>
                  <span className="text-sm leading-relaxed pt-1">{option}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl font-semibold"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {isLast ? (
            <Button
              className="flex-1 h-12 rounded-xl font-heading font-bold"
              style={{ background: "oklch(0.44 0.16 255)" }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              data-ocid={submitOcid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                `Submit ${mode === "pretest" ? "Pre" : "Post"}-Test`
              )}
            </Button>
          ) : (
            <Button
              className="flex-1 h-12 rounded-xl font-heading font-bold"
              style={{ background: "oklch(0.44 0.16 255)" }}
              onClick={handleNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Answer indicators */}
        <div className="mt-5 flex flex-wrap gap-1.5 justify-center">
          {TB_QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                i === currentIndex ? "ring-2 ring-offset-1 ring-primary" : ""
              } ${
                answers[i] !== null
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
