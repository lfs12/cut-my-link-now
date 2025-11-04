import { StatsHeader } from "@/components/StatsHeader";
import { URLShortener } from "@/components/URLShortener";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link2, Shield, Zap, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
      
      <div className="relative">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl">
                <Link2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                CutmeLink
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/admin"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Admin
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
              Shorten URLs.<br />Share Faster.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform long, complex URLs into short, memorable links in seconds.
              Track clicks and manage your links with ease.
            </p>
          </div>

          <StatsHeader />
          <URLShortener />

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors">
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Create short links instantly without any registration required
              </p>
            </div>
            
            <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-secondary/10 hover:border-secondary/30 transition-colors">
              <div className="inline-flex p-4 bg-secondary/10 rounded-xl mb-4">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Analytics</h3>
              <p className="text-muted-foreground">
                Monitor click counts and see how your links perform in real-time
              </p>
            </div>
            
            <div className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-accent/10 hover:border-accent/30 transition-colors">
              <div className="inline-flex p-4 bg-accent/10 rounded-xl mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your links are stored securely with 30-day automatic expiration
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 mt-20 border-t border-border/50">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 CutmeLink. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
