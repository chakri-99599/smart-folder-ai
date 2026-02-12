import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { ClassifiedFile, classifyFile } from "@/lib/classifier";

interface FileContextType {
  files: ClassifiedFile[];
  addFiles: (newFiles: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  isProcessing: boolean;
}

const FileContext = createContext<FileContextType | null>(null);

export const useFiles = () => {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFiles must be used within FileProvider");
  return ctx;
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<ClassifiedFile[]>(() => {
    const stored = localStorage.getItem("sfo_files");
    if (stored) {
      return JSON.parse(stored).map((f: any) => ({ ...f, uploadedAt: new Date(f.uploadedAt) }));
    }
    return [];
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const persist = (newFiles: ClassifiedFile[]) => {
    localStorage.setItem("sfo_files", JSON.stringify(newFiles));
  };

  const addFiles = useCallback(async (newFiles: File[]) => {
    setIsProcessing(true);
    const results: ClassifiedFile[] = [];

    for (const file of newFiles) {
      const content = await file.text();
      const { category, keywords, confidence } = classifyFile(file.name, content);
      results.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        content: content.slice(0, 5000),
        category,
        keywords,
        confidence,
        uploadedAt: new Date(),
        type: file.type || "text/plain",
      });
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 800));

    setFiles((prev) => {
      const updated = [...prev, ...results];
      persist(updated);
      return updated;
    });
    setIsProcessing(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  return (
    <FileContext.Provider value={{ files, addFiles, removeFile, isProcessing }}>
      {children}
    </FileContext.Provider>
  );
};
