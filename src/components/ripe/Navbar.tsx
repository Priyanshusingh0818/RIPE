import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Scenarios", to: "/scenarios" },
  { label: "Architecture", to: "/architecture" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center glow-primary transition-shadow duration-300 group-hover:bg-primary/25">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">RIPE</span>
        </Link>

        {/* Desktop nav links + badge */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-[11px] font-medium text-accent tracking-wide animate-glow-pulse shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Phase 1 Prototype
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/onboarding" className="hidden md:block">
            <Button variant="hero" size="sm">
              Get Protected
            </Button>
          </Link>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border/30 px-6 py-4 space-y-2">
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-[11px] font-medium text-accent tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Phase 1 Prototype • Demo
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/onboarding" onClick={() => setMobileOpen(false)}>
            <Button variant="hero" size="sm" className="w-full mt-2">
              Get Protected
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
