import type { ParticipantRecord } from "@/backend";
import { RiskBadge } from "@/components/RiskBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import type { RiskLevel } from "@/context/AppContext";
import { useActor } from "@/hooks/useActor";
import {
  AlertTriangle,
  Download,
  Eye,
  Loader2,
  LogOut,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardStats {
  total: bigint;
  avgPre: number;
  avgPost: number;
  avgImprovement: number;
  highRisk: bigint;
}

function formatDate(isoStr: string): string {
  try {
    return new Date(isoStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoStr;
  }
}

function getRiskBadgeClass(risk?: string): string {
  if (risk === "High") return "text-risk-high bg-risk-high border-risk-high";
  if (risk === "Moderate")
    return "text-risk-moderate bg-risk-moderate border-risk-moderate";
  return "text-risk-low bg-risk-low border-risk-low";
}

function downloadCSV(participants: ParticipantRecord[]) {
  const headers = [
    "registrationId",
    "name",
    "age",
    "gender",
    "education",
    "occupation",
    "smokingStatus",
    "tbContactHistory",
    "preTestScore",
    "postTestScore",
    "improvement",
    "riskLevel",
    "date",
  ];

  const rows = participants.map((p) => [
    p.registrationId,
    p.name,
    p.age.toString(),
    p.gender,
    p.education,
    p.occupation,
    p.smokingStatus,
    p.tbContactHistory,
    p.preTestScore != null ? p.preTestScore.toString() : "",
    p.postTestScore != null ? p.postTestScore.toString() : "",
    p.improvement != null ? p.improvement.toString() : "",
    p.riskLevel ?? "",
    p.dateTime,
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TBSMART_Research_Data_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminDashboardScreen() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const { isAdmin, setIsAdmin } = useAppContext();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [participants, setParticipants] = useState<ParticipantRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantRecord | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Protect route
  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (!actor) return;
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const [
          total,
          avgPre,
          avgPost,
          avgImprovement,
          highRisk,
          allParticipants,
        ] = await Promise.all([
          actor.getTotalParticipants(),
          actor.getAveragePreTestScore(),
          actor.getAveragePostTestScore(),
          actor.getAverageImprovement(),
          actor.getHighRiskCount(),
          actor.getAllParticipants(),
        ]);

        setStats({ total, avgPre, avgPost, avgImprovement, highRisk });
        setParticipants(allParticipants);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [actor],
  );

  useEffect(() => {
    if (actor && isAdmin) {
      loadData();
    }
  }, [actor, isAdmin, loadData]);

  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/admin");
    toast.success("Logged out successfully");
  };

  if (!isAdmin) return null;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.18 0.06 255)" }}
      >
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-white/60 mx-auto mb-3" />
          <p className="text-white/60 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Total Participants",
      value: stats?.total?.toString() ?? "—",
      icon: <Users className="h-5 w-5" />,
      color: "oklch(0.44 0.16 255)",
      bgColor: "oklch(0.92 0.055 240)",
      ocid: "dashboard.total_card",
    },
    {
      label: "Avg Pre-Test",
      value: stats ? `${stats.avgPre.toFixed(1)}/20` : "—",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "oklch(0.38 0.14 265)",
      bgColor: "oklch(0.94 0.04 240)",
      ocid: "dashboard.preavg_card",
    },
    {
      label: "Avg Post-Test",
      value: stats ? `${stats.avgPost.toFixed(1)}/20` : "—",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "oklch(0.52 0.16 145)",
      bgColor: "oklch(0.92 0.07 145)",
      ocid: "dashboard.postavg_card",
    },
    {
      label: "Avg Improvement",
      value: stats ? `+${stats.avgImprovement.toFixed(1)}` : "—",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "oklch(0.52 0.16 145)",
      bgColor: "oklch(0.92 0.07 145)",
      ocid: "dashboard.improvavg_card",
    },
    {
      label: "High Risk",
      value: stats?.highRisk?.toString() ?? "—",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "oklch(0.50 0.22 28)",
      bgColor: "oklch(0.95 0.07 28)",
      ocid: "dashboard.highrisk_card",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "oklch(0.96 0.012 240)",
      }}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "oklch(0.44 0.16 255)",
          boxShadow: "0 2px 12px oklch(0.44 0.16 255 / 0.3)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-white font-heading font-bold text-lg leading-tight">
              Researcher Dashboard
            </h1>
            <p className="text-white/70 text-xs">TB SMART Research Study</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadData(true)}
              className="p-2 rounded-xl text-white/80 hover:bg-white/20 transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/20 gap-1.5"
              data-ocid="dashboard.logout_button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-16">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-white rounded-2xl p-4 shadow-card"
              data-ocid={card.ocid}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                style={{ background: card.bgColor, color: card.color }}
              >
                {card.icon}
              </div>
              <p
                className="text-2xl font-heading font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {card.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            className="gap-2 rounded-xl font-semibold"
            onClick={() => {
              if (participants.length === 0) {
                toast.error("No participants to export");
                return;
              }
              downloadCSV(participants);
              toast.success("CSV exported!");
            }}
            data-ocid="dashboard.export_button"
          >
            <Download className="h-4 w-4" />
            Export CSV/Excel
          </Button>
        </div>

        {/* Participant Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border/60">
            <h3 className="font-heading font-bold text-base text-foreground">
              Participant Records
            </h3>
            <p className="text-xs text-muted-foreground">
              {participants.length} total participants
            </p>
          </div>

          {participants.length === 0 ? (
            <div className="p-8 text-center" data-ocid="dashboard.empty_state">
              <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                No participants yet
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Participant data will appear here after registration
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-center">Pre</th>
                    <th className="px-4 py-3 text-center">Post</th>
                    <th className="px-4 py-3 text-center">Δ</th>
                    <th className="px-4 py-3 text-center">Risk</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {participants.map((p, i) => {
                    const ocidIndex = i + 1;
                    return (
                      <tr
                        key={p.registrationId}
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedParticipant(p)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setSelectedParticipant(p)
                        }
                        tabIndex={0}
                        data-ocid={`dashboard.row.${ocidIndex}`}
                      >
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                          {p.registrationId}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground truncate max-w-[120px]">
                          {p.name}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-foreground">
                          {p.preTestScore != null
                            ? p.preTestScore.toString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-foreground">
                          {p.postTestScore != null
                            ? p.postTestScore.toString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-semibold">
                          {p.improvement != null ? (
                            <span
                              style={{
                                color:
                                  Number(p.improvement) >= 0
                                    ? "oklch(0.52 0.16 145)"
                                    : "oklch(0.50 0.22 28)",
                              }}
                            >
                              {Number(p.improvement) >= 0 ? "+" : ""}
                              {p.improvement.toString()}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.riskLevel ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadgeClass(p.riskLevel)}`}
                            >
                              {p.riskLevel}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatDate(p.dateTime)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedParticipant(p);
                            }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                            style={{ color: "oklch(0.44 0.16 255)" }}
                            aria-label="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
      </div>

      {/* Participant Detail Modal */}
      <Dialog
        open={selectedParticipant !== null}
        onOpenChange={(open) => !open && setSelectedParticipant(null)}
      >
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Participant Details
            </DialogTitle>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-3 mt-2">
              <div
                className="p-3 rounded-xl"
                style={{ background: "oklch(0.94 0.055 240)" }}
              >
                <p className="text-xs text-muted-foreground mb-0.5">
                  Registration ID
                </p>
                <p
                  className="font-mono font-bold text-sm"
                  style={{ color: "oklch(0.44 0.16 255)" }}
                >
                  {selectedParticipant.registrationId}
                </p>
              </div>

              {[
                { label: "Name", value: selectedParticipant.name },
                { label: "Age", value: selectedParticipant.age.toString() },
                { label: "Gender", value: selectedParticipant.gender },
                { label: "Education", value: selectedParticipant.education },
                { label: "Occupation", value: selectedParticipant.occupation },
                {
                  label: "Smoking Status",
                  value: selectedParticipant.smokingStatus,
                },
                {
                  label: "TB Contact History",
                  value: selectedParticipant.tbContactHistory,
                },
                {
                  label: "Pre-Test Score",
                  value:
                    selectedParticipant.preTestScore != null
                      ? `${selectedParticipant.preTestScore}/20`
                      : "—",
                },
                {
                  label: "Post-Test Score",
                  value:
                    selectedParticipant.postTestScore != null
                      ? `${selectedParticipant.postTestScore}/20`
                      : "—",
                },
                {
                  label: "Improvement",
                  value:
                    selectedParticipant.improvement != null
                      ? `${Number(selectedParticipant.improvement) >= 0 ? "+" : ""}${selectedParticipant.improvement}`
                      : "—",
                },
                {
                  label: "Date",
                  value: formatDate(selectedParticipant.dateTime),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {value}
                  </span>
                </div>
              ))}

              {selectedParticipant.riskLevel && (
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-muted-foreground">
                    Risk Level
                  </span>
                  <RiskBadge
                    level={selectedParticipant.riskLevel as RiskLevel}
                    size="sm"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
