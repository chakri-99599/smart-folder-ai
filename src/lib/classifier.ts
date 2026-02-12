// Mock semantic file classifier using keyword detection

export interface FileCategory {
  name: string;
  icon: string;
  color: string;
  keywords: string[];
}

export const CATEGORIES: FileCategory[] = [
  {
    name: "Technology",
    icon: "💻",
    color: "174 72% 46%",
    keywords: ["software", "code", "programming", "api", "database", "algorithm", "computer", "tech", "javascript", "python", "react", "server", "cloud", "docker", "machine learning", "artificial intelligence", "ai", "ml", "data", "network", "html", "css", "deploy", "github", "app", "web"],
  },
  {
    name: "Finance",
    icon: "💰",
    color: "45 93% 47%",
    keywords: ["money", "bank", "invest", "stock", "budget", "tax", "revenue", "profit", "loss", "expense", "income", "financial", "payment", "credit", "debit", "loan", "interest", "portfolio", "market", "trading", "crypto", "bitcoin", "salary", "accounting"],
  },
  {
    name: "Education",
    icon: "📚",
    color: "262 83% 58%",
    keywords: ["school", "university", "student", "teacher", "course", "exam", "study", "learn", "education", "degree", "lecture", "homework", "grade", "curriculum", "research", "thesis", "dissertation", "academic", "class", "training", "certificate"],
  },
  {
    name: "Health",
    icon: "🏥",
    color: "142 71% 45%",
    keywords: ["health", "medical", "doctor", "patient", "hospital", "disease", "treatment", "medicine", "symptom", "diagnosis", "therapy", "wellness", "fitness", "nutrition", "diet", "exercise", "mental", "clinical", "pharmacy", "vaccine"],
  },
  {
    name: "Legal",
    icon: "⚖️",
    color: "220 70% 50%",
    keywords: ["law", "legal", "court", "judge", "attorney", "contract", "agreement", "regulation", "compliance", "patent", "trademark", "copyright", "lawsuit", "liability", "jurisdiction", "statute", "policy", "rights"],
  },
  {
    name: "Others",
    icon: "📁",
    color: "220 10% 50%",
    keywords: [],
  },
];

export interface ClassifiedFile {
  id: string;
  name: string;
  size: number;
  content: string;
  category: string;
  keywords: string[];
  confidence: number;
  uploadedAt: Date;
  type: string;
}

export function classifyFile(name: string, content: string): { category: string; keywords: string[]; confidence: number } {
  const text = (name + " " + content).toLowerCase();
  let bestCategory = "Others";
  let bestScore = 0;
  let matchedKeywords: string[] = [];

  for (const cat of CATEGORIES) {
    if (cat.name === "Others") continue;
    const found = cat.keywords.filter((kw) => text.includes(kw));
    const score = found.length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat.name;
      matchedKeywords = found;
    }
  }

  const confidence = bestScore === 0 ? 0.3 : Math.min(0.95, 0.5 + bestScore * 0.08);
  if (bestScore === 0) matchedKeywords = ["general"];

  return { category: bestCategory, keywords: matchedKeywords.slice(0, 5), confidence };
}

export function getCategoryByName(name: string): FileCategory {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];
}
