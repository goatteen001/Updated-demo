import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Brain,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const perks = [
  "AI-powered personalized learning path",
  "Real-time engagement tracking",
  "Adaptive quiz gating system",
  "Progress analytics dashboard",
];

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name);

    if (error) {
      if (error.message === "REGISTRATION_SUCCESS_CONFIRM_EMAIL") {
        setError(
          `Account created! PLEASE CHECK YOUR EMAIL (${email}) to confirm before signing in.`,
        );
      } else if (error.message.includes("User already exists")) {
        setError(
          "Account already exists! Please click 'Sign in' below to continue.",
        );
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // navigate immediately - profile loads in background
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display gradient-text">
              AI Learning Guide
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-display">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Start your AI-powered learning journey today. Free forever.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="h-11 bg-secondary/50 border-border/60 focus:border-primary/60 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11 bg-secondary/50 border-border/60 focus:border-primary/60 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11 bg-secondary/50 border-border/60 focus:border-primary/60 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gradient-primary border-0 glow-sm text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                  Account…
                </>
              ) : (
                <>
                  Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero flex-col justify-between p-12">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary glow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              AI Learning Guide
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold font-display leading-tight">
              Everything included,{" "}
              <span className="gradient-text">completely free</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              No credit card required. Get full access to all features from day
              one.
            </p>
          </div>
          <div className="space-y-3">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © 2026 AI Learning Guide — Built for serious learners.
        </div>
      </div>
    </div>
  );
}