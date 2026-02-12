import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useFiles } from "@/context/FileContext";
import { ClassifiedFile } from "@/lib/classifier";
import FileDetailPanel from "@/components/FileDetailPanel";
import { Input } from "@/components/ui/input";
import { Search, FileText, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const HistoryPage = () => {
  const { files } = useFiles();
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<ClassifiedFile | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name" | "confidence">("date");

  const filtered = useMemo(() => {
    let result = files.filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase()) ||
        f.keywords.some((k) => k.includes(search.toLowerCase()))
    );
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "confidence") return b.confidence - a.confidence;
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
    return result;
  }, [files, search, sortBy]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">File History</h1>
        <p className="text-muted-foreground mt-1">Browse all uploaded and classified files</p>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files, categories, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50"
          />
        </div>
        <div className="flex gap-2">
          {(["date", "name", "confidence"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                sortBy === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No files found</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">File Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <motion.tr
                  key={f.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedFile(f)}
                  className="border-b last:border-0 hover:bg-secondary/20 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium truncate max-w-[200px]">{f.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{f.category}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {new Date(f.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${f.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{Math.round(f.confidence * 100)}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FileDetailPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
    </AppLayout>
  );
};

export default HistoryPage;
