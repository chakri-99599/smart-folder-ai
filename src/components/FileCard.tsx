import { ClassifiedFile, getCategoryByName } from "@/lib/classifier";
import { motion } from "framer-motion";
import { FileText, Trash2, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  file: ClassifiedFile;
  onRemove: (id: string) => void;
  onSelect: (file: ClassifiedFile) => void;
}

const FileCard = ({ file, onRemove, onSelect }: Props) => {
  const cat = getCategoryByName(file.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onSelect(file)}
      className="group rounded-xl border bg-card p-4 cursor-pointer hover:border-primary/30 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{cat.icon}</span>
          <span className="text-sm font-medium truncate">{file.name}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span className="font-medium text-foreground">{file.category}</span>
          <span className="ml-auto">{Math.round(file.confidence * 100)}%</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {file.keywords.map((kw) => (
            <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
              {kw}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
          <Clock className="h-3 w-3" />
          {new Date(file.uploadedAt).toLocaleDateString()}
          <span className="ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;
