import { ClassifiedFile, getCategoryByName } from "@/lib/classifier";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Tag, Brain, Clock, HardDrive } from "lucide-react";

interface Props {
  file: ClassifiedFile | null;
  onClose: () => void;
}

const FileDetailPanel = ({ file, onClose }: Props) => {
  if (!file) return null;
  const cat = getCategoryByName(file.category);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground">{file.name}</h3>
                <p className="text-sm text-muted-foreground">{file.category}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* AI Explanation */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm text-primary">AI Classification</span>
            </div>
            <p className="text-sm text-foreground">
              This file was classified as <strong>{file.category}</strong> because keywords{" "}
              <strong>{file.keywords.join(", ")}</strong> were detected with{" "}
              <strong>{Math.round(file.confidence * 100)}%</strong> confidence.
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Size:</span>
              <span className="text-foreground">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Uploaded:</span>
              <span className="text-foreground">{new Date(file.uploadedAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <span className="text-foreground">{file.type}</span>
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Detected Keywords</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {file.keywords.map((kw) => (
                <span key={kw} className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Content Preview */}
          <div>
            <span className="font-medium text-sm block mb-2">Content Preview</span>
            <div className="rounded-lg bg-secondary/50 p-4 max-h-64 overflow-y-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {file.content.slice(0, 2000) || "No text content extracted."}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FileDetailPanel;
