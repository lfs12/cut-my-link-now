import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Redirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirectToUrl = async () => {
      if (!code) {
        setError(true);
        return;
      }

      try {
        // Fetch the URL
        const { data, error: fetchError } = await supabase
          .from("urls")
          .select("*")
          .eq("short_code", code)
          .maybeSingle();

        if (fetchError || !data) {
          setError(true);
          return;
        }

        // Check if expired
        if (new Date(data.expires_at) < new Date()) {
          setError(true);
          return;
        }

        // Increment click count
        await supabase
          .from("urls")
          .update({ click_count: data.click_count + 1 })
          .eq("id", data.id);

        // Redirect to original URL
        window.location.href = data.original_url;
      } catch (error) {
        console.error("Error redirecting:", error);
        setError(true);
      }
    };

    redirectToUrl();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destructive mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            This link doesn't exist or has expired
          </p>
          <a
            href="/"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-xl text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Redirect;
