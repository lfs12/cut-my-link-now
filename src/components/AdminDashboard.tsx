import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Trash2, Search, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface URL {
  id: string;
  original_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
  expires_at: string;
}

export const AdminDashboard = () => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const { data, error } = await supabase
        .from("urls")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUrls(data || []);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      toast.error("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    try {
      const { error } = await supabase.from("urls").delete().eq("id", id);
      if (error) throw error;

      setUrls(urls.filter((url) => url.id !== id));
      toast.success("URL deleted successfully");
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.reload();
  };

  const filteredUrls = urls.filter(
    (url) =>
      url.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.original_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your shortened URLs</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Total URLs</p>
            <p className="text-4xl font-bold text-primary">{urls.length}</p>
          </div>
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-secondary/20">
            <p className="text-sm text-muted-foreground mb-2">Total Clicks</p>
            <p className="text-4xl font-bold text-secondary">
              {urls.reduce((sum, url) => sum + url.click_count, 0)}
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">Avg Clicks/URL</p>
            <p className="text-4xl font-bold text-accent">
              {urls.length > 0
                ? Math.round(urls.reduce((sum, url) => sum + url.click_count, 0) / urls.length)
                : 0}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by short code or original URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-card/50 border-primary/20"
            />
          </div>
        </div>

        {/* URLs Table */}
        <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Short Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Original URL</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Clicks</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Expires</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUrls.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No URLs found
                    </td>
                  </tr>
                ) : (
                  filteredUrls.map((url) => (
                    <tr key={url.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <code className="text-primary font-mono">{url.short_code}</code>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <div className="flex items-center gap-2">
                          <a
                            href={url.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:text-primary transition-colors truncate"
                          >
                            {url.original_url}
                          </a>
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold">{url.click_count}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {format(new Date(url.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {format(new Date(url.expires_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          onClick={() => handleDelete(url.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
