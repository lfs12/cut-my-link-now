import { Users, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const StatsHeader = () => {
  const [totalUrls, setTotalUrls] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // Fetch initial stats
    const fetchStats = async () => {
      const { data: urlsData } = await supabase
        .from("urls")
        .select("id", { count: "exact", head: true });
      
      if (urlsData !== null) {
        setTotalUrls(urlsData as any);
      }

      // Simulate online users (in production, implement with presence tracking)
      setOnlineUsers(Math.floor(Math.random() * 50) + 10);
    };

    fetchStats();

    // Subscribe to realtime updates for URLs
    const channel = supabase
      .channel("urls-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "urls",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    // Update online users periodically
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, prev + change);
      });
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-primary/20">
        <Users className="h-4 w-4 text-accent" />
        <span className="text-muted-foreground">Online:</span>
        <span className="font-bold text-accent">{onlineUsers}</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full border border-secondary/20">
        <LinkIcon className="h-4 w-4 text-secondary" />
        <span className="text-muted-foreground">URLs Created:</span>
        <span className="font-bold text-secondary">{totalUrls}</span>
      </div>
    </div>
  );
};
