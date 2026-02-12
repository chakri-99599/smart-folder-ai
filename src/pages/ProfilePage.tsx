import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useFiles } from "@/context/FileContext";
import { User, Mail, HardDrive, FileText } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user } = useAuth();
  const { files } = useFiles();
  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Your account details</p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Name:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </motion.div>

        {/* Storage Usage */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-6"
        >
          <h3 className="font-semibold mb-4">Storage Usage</h3>
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{(totalSize / 1024).toFixed(1)} KB</span>
            <span className="text-muted-foreground text-sm">used</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{files.length} files uploaded</span>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
