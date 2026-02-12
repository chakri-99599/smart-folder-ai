import { useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useFiles } from "@/context/FileContext";
import { CATEGORIES, getCategoryByName } from "@/lib/classifier";
import { Button } from "@/components/ui/button";
import { Download, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ReportsPage = () => {
  const { files } = useFiles();

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    for (const f of files) {
      stats[f.category] = (stats[f.category] || 0) + 1;
    }
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count, cat: getCategoryByName(name) }))
      .sort((a, b) => b.count - a.count);
  }, [files]);

  const maxCount = Math.max(...categoryStats.map((s) => s.count), 1);

  const exportCSV = () => {
    const header = "File Name,Category,Confidence,Keywords,Date,Size (KB)\n";
    const rows = files
      .map((f) =>
        `"${f.name}","${f.category}",${Math.round(f.confidence * 100)}%,"${f.keywords.join("; ")}",${new Date(f.uploadedAt).toISOString()},${(f.size / 1024).toFixed(1)}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "semantic-file-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported as CSV");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and export options</p>
        </div>
        <Button onClick={exportCSV} disabled={files.length === 0} className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Upload files to see reports</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Category Breakdown */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4">Category Distribution</h3>
            <div className="space-y-3">
              {categoryStats.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <span>{s.cat.icon}</span>
                      <span className="font-medium">{s.name}</span>
                    </span>
                    <span className="text-muted-foreground">{s.count} files</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-5">
              <span className="text-sm text-muted-foreground">Total Files</span>
              <p className="text-3xl font-bold mt-1">{files.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <span className="text-sm text-muted-foreground">Categories Used</span>
              <p className="text-3xl font-bold mt-1">{categoryStats.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <span className="text-sm text-muted-foreground">Avg Confidence</span>
              <p className="text-3xl font-bold mt-1">
                {Math.round(files.reduce((s, f) => s + f.confidence, 0) / files.length * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ReportsPage;
