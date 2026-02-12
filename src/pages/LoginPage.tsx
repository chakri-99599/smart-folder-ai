import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FolderSearch, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const success = login(email, password);
    if (success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error("Invalid credentials. Try signing up first.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 glow-sm">
              <FolderSearch className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Semantic File Organizer</h1>
          <p className="text-muted-foreground mt-1">Sign in to your workspace</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50"
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
