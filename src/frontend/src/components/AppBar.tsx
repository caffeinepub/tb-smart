import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppBarProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function AppBar({
  title = "TB SMART",
  showBack = false,
  backTo,
  subtitle,
  rightElement,
}: AppBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "oklch(0.44 0.16 255)",
        boxShadow: "0 2px 12px oklch(0.44 0.16 255 / 0.3)",
      }}
    >
      <div className="max-w-sm mx-auto px-4 py-3 flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0 text-white hover:bg-white/20 -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-heading font-bold text-lg leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/80 text-xs leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
    </header>
  );
}
