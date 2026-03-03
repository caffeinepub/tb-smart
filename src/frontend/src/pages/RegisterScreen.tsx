import { AppBar } from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useParticipantActor } from "@/hooks/useParticipantActor";
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function generateRegId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TBSMART-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const [previewId] = [generateRegId()];

export function RegisterScreen() {
  const navigate = useNavigate();
  const { actor, isFetching: actorLoading } = useParticipantActor();
  const { setRegistrationId, setParticipantName, setRegistrationDate } =
    useAppContext();

  const [localRegId] = useState(previewId);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actorReady, setActorReady] = useState(false);

  // Track when actor becomes ready
  useEffect(() => {
    if (actor) setActorReady(true);
  }, [actor]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    education: "",
    occupation: "",
    smokingStatus: "No",
    tbContactHistory: "No",
  });

  const now = new Date();
  const dateTimeDisplay = now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(localRegId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [localRegId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Participant name is required");
      return;
    }
    if (!form.gender) {
      toast.error("Please select gender");
      return;
    }
    if (!form.education) {
      toast.error("Please select education level");
      return;
    }

    // If actor still loading, wait a bit and retry
    if (!actor) {
      toast.error("App is still loading. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dateTimeStr = new Date().toISOString();
      const returnedId = await actor.registerParticipant(
        form.name.trim(),
        BigInt(Number(form.age) || 0),
        form.gender,
        form.education,
        form.occupation.trim() || "Not specified",
        form.smokingStatus,
        form.tbContactHistory,
        dateTimeStr,
      );

      const finalId = returnedId || localRegId;
      setRegistrationId(finalId);
      setParticipantName(form.name.trim());
      setRegistrationDate(dateTimeStr);
      toast.success("Registration successful!");
      navigate("/pretest");
    } catch (err) {
      console.error(err);
      // Provide a more helpful error message
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes("fetch") ||
        message.includes("network") ||
        message.includes("Failed to fetch")
      ) {
        toast.error("Network error. Please wait a moment and try again.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const RadioGroup = ({
    value,
    onChange,
    ocid,
  }: {
    value: string;
    onChange: (v: string) => void;
    ocid: string;
  }) => (
    <div className="flex gap-3" data-ocid={ocid}>
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 h-12 rounded-xl border-2 text-sm font-semibold transition-colors ${
            value === opt
              ? "border-primary/60 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/30"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="tb-app-shell min-h-screen">
      <AppBar title="TB SMART" subtitle="Participant Registration" />

      <div className="max-w-sm mx-auto px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
            Registration
          </h2>
          <p className="text-muted-foreground text-sm mb-5">
            Fill in your details to begin the study
          </p>
        </motion.div>

        {/* Registration ID Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="tb-card p-4 mb-5"
          style={{
            background: "oklch(0.94 0.055 240)",
            border: "1.5px solid oklch(0.44 0.16 255 / 0.3)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Your Registration ID
          </p>
          <div className="flex items-center justify-between">
            <span
              className="font-heading font-bold text-xl tracking-widest"
              style={{ color: "oklch(0.44 0.16 255)" }}
            >
              {localRegId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
              style={{ color: "oklch(0.44 0.16 255)" }}
              aria-label="Copy registration ID"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Note this ID for your records
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <Label
              htmlFor="name"
              className="text-sm font-semibold mb-1.5 block"
            >
              Participant Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="h-12 rounded-xl text-base"
              required
              data-ocid="register.name_input"
            />
          </motion.div>

          {/* Age */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            <Label htmlFor="age" className="text-sm font-semibold mb-1.5 block">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={form.age}
              onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
              className="h-12 rounded-xl text-base"
              min={1}
              max={120}
              data-ocid="register.age_input"
            />
          </motion.div>

          {/* Gender */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            <Label className="text-sm font-semibold mb-1.5 block">
              Gender <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.gender}
              onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}
            >
              <SelectTrigger
                className="h-12 rounded-xl text-base"
                data-ocid="register.gender_select"
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
          >
            <Label className="text-sm font-semibold mb-1.5 block">
              Education <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.education}
              onValueChange={(v) => setForm((p) => ({ ...p, education: v }))}
            >
              <SelectTrigger
                className="h-12 rounded-xl text-base"
                data-ocid="register.education_select"
              >
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No formal education">
                  No formal education
                </SelectItem>
                <SelectItem value="Primary">Primary</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
                <SelectItem value="Higher Secondary">
                  Higher Secondary
                </SelectItem>
                <SelectItem value="Graduate">Graduate</SelectItem>
                <SelectItem value="Post-Graduate">Post-Graduate</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Occupation */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.35 }}
          >
            <Label
              htmlFor="occupation"
              className="text-sm font-semibold mb-1.5 block"
            >
              Occupation
            </Label>
            <Input
              id="occupation"
              type="text"
              placeholder="Enter your occupation"
              value={form.occupation}
              onChange={(e) =>
                setForm((p) => ({ ...p, occupation: e.target.value }))
              }
              className="h-12 rounded-xl text-base"
              data-ocid="register.occupation_input"
            />
          </motion.div>

          {/* Smoking Status */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
          >
            <Label className="text-sm font-semibold mb-1.5 block">
              Smoking Status
            </Label>
            <RadioGroup
              value={form.smokingStatus}
              onChange={(v) => setForm((p) => ({ ...p, smokingStatus: v }))}
              ocid="register.smoking_radio"
            />
          </motion.div>

          {/* TB Contact */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
          >
            <Label className="text-sm font-semibold mb-1.5 block">
              Close contact with a TB patient?
            </Label>
            <RadioGroup
              value={form.tbContactHistory}
              onChange={(v) => setForm((p) => ({ ...p, tbContactHistory: v }))}
              ocid="register.tbcontact_radio"
            />
          </motion.div>

          {/* Date/Time */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.35 }}
          >
            <Label className="text-sm font-semibold mb-1.5 block">
              Date & Time
            </Label>
            <div className="h-12 rounded-xl border border-border bg-muted/30 flex items-center px-3 text-sm text-muted-foreground">
              {dateTimeDisplay}
            </div>
          </motion.div>

          {/* Submit */}
          {/* Actor loading notice */}
          {actorLoading && !actorReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-muted-foreground px-1"
              data-ocid="register.loading_state"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Connecting to server…
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="pt-2"
          >
            <Button
              type="submit"
              className="w-full h-14 text-base font-heading font-bold rounded-2xl shadow-lg"
              style={{ background: "oklch(0.44 0.16 255)" }}
              disabled={isSubmitting}
              data-ocid="register.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : actorLoading && !actorReady ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Register & Begin Pre-Test →"
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
