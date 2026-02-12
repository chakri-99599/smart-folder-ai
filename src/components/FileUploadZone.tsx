import { useCallback, useState } from "react";
import { useFiles } from "@/context/FileContext";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FileUploadZone = () => {
  const { addFiles, isProcessing } = useFiles();
  const [dragOver, setDragOver] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleFiles = useCallback((fileList: FileList) => {
    const valid = Array.from(fileList).filter(
      (f) => f.type === "text/plain" || f.type === "application/pdf" || f.name.endsWith(".txt") || f.name.endsWith(".md")
    );
    if (valid.length === 0) {
      toast.error("Please upload text or PDF files");
      return;
    }
    setPendingFiles((prev) => [...prev, ...valid]);
  }, []);

  const processFiles = async () => {
    if (pendingFiles.length === 0) return;
    await addFiles(pendingFiles);
    toast.success(`${pendingFiles.length} file(s) classified successfully`);
    setPendingFiles([]);
  };

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => { const input = document.createElement("input"); input.type = "file"; input.multiple = true; input.accept = ".txt,.pdf,.md"; input.onchange = (e) => handleFiles((e.target as HTMLInputElement).files!); input.click(); }}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
          dragOver
            ? "border-primary bg-primary/5 glow-sm"
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <Upload className={cn("h-10 w-10 mx-auto mb-3 transition-colors", dragOver ? "text-primary" : "text-muted-foreground")} />
        <p className="font-medium text-foreground">Drop files here or click to browse</p>
        <p className="text-sm text-muted-foreground mt-1">Supports .txt, .md, .pdf files</p>
      </div>

      {/* Pending Files */}
      <AnimatePresence>
        {pendingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {pendingFiles.map((file, i) => (
              <motion.div
                key={file.name + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removePending(i); }} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
            <Button onClick={processFiles} disabled={isProcessing} className="w-full gap-2">
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Classify {pendingFiles.length} file(s)</>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
