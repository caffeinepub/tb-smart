import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";
import { AdminDashboardScreen } from "@/pages/AdminDashboardScreen";
import { AdminLoginScreen } from "@/pages/AdminLoginScreen";
import { AwarenessScreen } from "@/pages/AwarenessScreen";
import { ConsentScreen } from "@/pages/ConsentScreen";
import { HospitalGuidanceScreen } from "@/pages/HospitalGuidanceScreen";
import { QuizScreen } from "@/pages/QuizScreen";
import { RegisterScreen } from "@/pages/RegisterScreen";
import { ReportScreen } from "@/pages/ReportScreen";
import { SymptomCheckerScreen } from "@/pages/SymptomCheckerScreen";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Participant Flow */}
          <Route path="/" element={<Navigate to="/consent" replace />} />
          <Route path="/consent" element={<ConsentScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/pretest" element={<QuizScreen mode="pretest" />} />
          <Route path="/awareness" element={<AwarenessScreen />} />
          <Route path="/symptom-checker" element={<SymptomCheckerScreen />} />
          <Route
            path="/hospital-guidance"
            element={<HospitalGuidanceScreen />}
          />
          <Route path="/posttest" element={<QuizScreen mode="posttest" />} />
          <Route path="/report" element={<ReportScreen />} />

          {/* Admin (hidden from participant flow) */}
          <Route path="/admin" element={<AdminLoginScreen />} />
          <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/consent" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AppProvider>
  );
}
