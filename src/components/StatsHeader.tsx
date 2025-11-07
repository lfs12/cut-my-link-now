import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Link2 } from "lucide-react";

export function StatsHeader() {
  const [totalLinks, setTotalLinks] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);

  // Fetch total links and visits
  useEffect(() => {
    let isMounted = true;
    
    // Get total links count
    supabase
      .from("urls")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => {
        if (isMounted) setTotalLinks(count ?? 0);
      });

    // Get total visits (sum of all click_count)
    supabase
      .from("urls")
      .select("click_count")
      .then(({ data }) => {
        if (isMounted && data) {
          const total = data.reduce((sum, url) => sum + (url.click_count || 0), 0);
          setTotalVisits(total);
        }
      });

    // Subscribe to realtime updates for clicks
    const channel = supabase
      .channel('stats-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'urls'
        },
        () => {
          // Refetch total visits when any URL is updated
          supabase
            .from("urls")
            .select("click_count")
            .then(({ data }) => {
              if (isMounted && data) {
                const total = data.reduce((sum, url) => sum + (url.click_count || 0), 0);
                setTotalVisits(total);
              }
            });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'urls'
        },
        () => {
          // Refetch counts when new URL is created
          supabase
            .from("urls")
            .select("id", { count: "exact", head: true })
            .then(({ count }) => {
              if (isMounted) setTotalLinks(count ?? 0);
            });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex justify-center gap-8 mb-10">
      <div className="flex items-center gap-2 text-lg font-medium bg-card/60 px-4 py-2 rounded-xl shadow">
        <Eye className="h-5 w-5 text-primary" />
        <span>{totalVisits !== null ? totalVisits : "..."}</span>
        <span className="text-muted-foreground text-sm">visitas</span>
      </div>
      <div className="flex items-center gap-2 text-lg font-medium bg-card/60 px-4 py-2 rounded-xl shadow">
        <Link2 className="h-5 w-5 text-secondary" />
        <span>{totalLinks !== null ? totalLinks : "..."}</span>
        <span className="text-muted-foreground text-sm">links</span>
      </div>
    </div>
  );
}
