import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Loader2, Link2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const URLShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const generateShortCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleShorten = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL (including http:// or https://)");
      return;
    }

    setLoading(true);
    try {
      // Generate unique short code
      let shortCode = generateShortCode();
      let attempts = 0;
      
      while (attempts < 5) {
        const { data: existing } = await supabase
          .from("urls")
          .select("short_code")
          .eq("short_code", shortCode)
          .maybeSingle();

        if (!existing) break;
        shortCode = generateShortCode();
        attempts++;
      }

      // Insert new URL
      const { data, error } = await supabase
        .from("urls")
        .insert({
          original_url: url,
          short_code: shortCode,
        })
        .select()
        .single();

      if (error) throw error;

      const fullShortUrl = `${window.location.origin}/${data.short_code}`;
      setShortUrl(fullShortUrl);
      setClickCount(0);
      toast.success("URL shortened successfully!");
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-scale-in">
      {/* Main Input Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
        <div className="relative bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Shorten Your URL
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="url"
              placeholder="Enter your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleShorten()}
              className="flex-1 h-14 text-lg bg-background/50 border-primary/20 focus:border-primary"
              disabled={loading}
            />
            <Button
              onClick={handleShorten}
              disabled={loading}
              size="lg"
              className="h-14 px-8 bg-gradient-primary hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Shortening...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Shorten
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {shortUrl && (
        <div className="relative animate-fade-in">
          <div className="absolute inset-0 bg-gradient-secondary opacity-10 blur-2xl rounded-full" />
          <div className="relative bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-secondary/30">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Your shortened URL:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 p-4 bg-background/50 rounded-xl border border-secondary/20 break-all">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 font-mono text-lg transition-colors"
                >
                  {shortUrl}
                </a>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="lg"
                className="bg-secondary/10 border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-5 w-5 text-accent" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Clicks:</span>
              <span className="font-bold text-accent text-lg">{clickCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
