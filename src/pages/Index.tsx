import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFiles } from "@/context/FileContext";
import { CATEGORIES, getCategoryByName, ClassifiedFile } from "@/lib/classifier";
import AppLayout from "@/components/AppLayout";
import FileUploadZone from "@/components/FileUploadZone";
import FileCard from "@/components/FileCard";
import FileDetailPanel from "@/components/FileDetailPanel";
import { motion } from "framer-motion";
import { FolderOpen, FileText, BarChart3, Zap } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const { files, removeFile } = useFiles();
  const [selectedFile, setSelectedFile] = useState<ClassifiedFile | null>(null);

  const stats = useMemo(() => {
    const categories = new Set(files.map((f) => f.category));
    const avgConf = files.length ? files.reduce((s, f) => s + f.confidence, 0) / files.length : 0;
    return {
      totalFiles: files.length,
      totalCategories: categories.size,
      avgConfidence: Math.round(avgConf * 100),
      totalSize: files.reduce((s, f) => s + f.size, 0),
    };
  }, [files]);

  const groupedFiles = useMemo(() => {
    const groups: Record<string, ClassifiedFile[]> = {};
    for (const f of files) {
      (groups[f.category] ??= []).push(f);
    }
    return groups;
  }, [files]);

  const statCards = [
    { label: "Total Files", value: stats.totalFiles, icon: FileText, suffix: "" },
    { label: "Categories", value: stats.totalCategories, icon: FolderOpen, suffix: "" },
    { label: "Avg Confidence", value: stats.avgConfidence, icon: Zap, suffix: "%" },
    { label: "Total Size", value: (stats.totalSize / 1024).toFixed(1), icon: BarChart3, suffix: " KB" },
  ];

  return (
    <AppLayout>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your file organization overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-2xl font-bold">{s.value}{s.suffix}</span>
          </motion.div>
        ))}
      </div>

      {/* Upload */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
        <FileUploadZone />
      </div>

      {/* Organized Folders */}
      {Object.keys(groupedFiles).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Organized Folders</h2>
          <div className="space-y-6">
            {Object.entries(groupedFiles).map(([category, catFiles]) => {
              const cat = getCategoryByName(category);
              return (
                <motion.div key={category} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{cat.icon}</span>
                    <h3 className="font-medium">{category}</h3>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {catFiles.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catFiles.map((f) => (
                      <FileCard key={f.id} file={f} onRemove={removeFile} onSelect={setSelectedFile} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Panel */}
      <FileDetailPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
    </AppLayout>
  );
};

export default DashboardPage;
