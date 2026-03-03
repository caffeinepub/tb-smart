import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AdminLoginScreen() {
  const navigate = useNavigate();
  const { setIsAdmin } = useAppContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Validate credentials locally — no backend call needed for admin login
      const valid = username === "researcher" && password === "tbsmart2026";
      if (valid) {
        setIsAdmin(true);
        toast.success("Access granted");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "oklch(0.18 0.06 255)",
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, oklch(0.28 0.09 255 / 0.5) 0%, transparent 70%)",
      }}
    >
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "oklch(0.44 0.16 255)" }}
            >
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white">
              Researcher Access
            </h1>
            <p className="text-white/60 text-sm mt-1">TB SMART Admin Panel</p>
          </div>

          {/* Login Card */}
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "oklch(0.24 0.06 255 / 0.8)",
              border: "1px solid oklch(0.38 0.1 255 / 0.4)",
            }}
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label
                  htmlFor="admin-username"
                  className="text-white/80 text-sm font-medium mb-1.5 block"
                >
                  Username
                </Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 rounded-xl text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary/60"
                  autoComplete="username"
                  data-ocid="admin.username_input"
                />
              </div>

              <div>
                <Label
                  htmlFor="admin-password"
                  className="text-white/80 text-sm font-medium mb-1.5 block"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl text-base bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary/60"
                  autoComplete="current-password"
                  data-ocid="admin.password_input"
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-400/30"
                  data-ocid="admin.error_state"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-heading font-bold text-base mt-2"
                style={{ background: "oklch(0.44 0.16 255)" }}
                disabled={isLoading}
                data-ocid="admin.login_button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            Authorized personnel only
          </p>
        </motion.div>
      </div>
    </div>
  );
}
