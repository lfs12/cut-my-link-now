import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Link2 } from "lucide-react";

export function StatsHeader() {
  const [totalLinks, setTotalLinks] = useState<number | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const bcRef = useRef<BroadcastChannel | null>(null);

  // Fetch total links from Supabase
  useEffect(() => {
    let isMounted = true;
    supabase
      .from("urls")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => {
        if (isMounted) setTotalLinks(count ?? 0);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Estimate online users using BroadcastChannel
  useEffect(() => {
    let userId = Math.random().toString(36).slice(2);
    let users = new Set<string>([userId]);
    const bc = new BroadcastChannel("cutmelink-online-users");
    bcRef.current = bc;

    const sendPing = () => bc.postMessage({ type: "ping", userId });
    const sendHello = () => bc.postMessage({ type: "hello", userId });

    let pingInterval = setInterval(sendPing, 4000);
    sendHello();

    bc.onmessage = (ev) => {
      const { type, userId: otherId } = ev.data || {};
      if (!otherId) return;
      if (type === "hello" || type === "ping") {
        users.add(otherId);
        setOnlineUsers(users.size);
        if (type === "ping" && otherId !== userId) sendHello();
      }
    };

    // Remove self on unload
    const handleUnload = () => {
      bc.postMessage({ type: "bye", userId });
    };
    window.addEventListener("beforeunload", handleUnload);

    bc.onmessage = (ev) => {
      const { type, userId: otherId } = ev.data || {};
      if (!otherId) return;
      if (type === "hello" || type === "ping") {
        users.add(otherId);
        setOnlineUsers(users.size);
        if (type === "ping" && otherId !== userId) sendHello();
      }
      if (type === "bye") {
        users.delete(otherId);
        setOnlineUsers(users.size);
      }
    };

    return () => {
      clearInterval(pingInterval);
      window.removeEventListener("beforeunload", handleUnload);
      bc.close();
    };
  }, []);

  return (
    <div className="flex justify-center gap-8 mb-10">
      <div className="flex items-center gap-2 text-lg font-medium bg-card/60 px-4 py-2 rounded-xl shadow">
        <Users className="h-5 w-5 text-primary" />
        <span>{onlineUsers}</span>
        <span className="text-muted-foreground text-sm">online</span>
      </div>
      <div className="flex items-center gap-2 text-lg font-medium bg-card/60 px-4 py-2 rounded-xl shadow">
        <Link2 className="h-5 w-5 text-secondary" />
        <span>{totalLinks !== null ? totalLinks : "..."}</span>
        <span className="text-muted-foreground text-sm">links</span>
      </div>
    </div>
  );
}
