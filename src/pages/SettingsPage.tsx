import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoClassify, setAutoClassify] = useState(true);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated (mock)");
  };

  const clearData = () => {
    localStorage.removeItem("sfo_files");
    toast.success("All file data cleared. Refresh to see changes.");
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Upload Notifications</span>
                <p className="text-xs text-muted-foreground">Show alerts on file classification</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Auto-Classify</span>
                <p className="text-xs text-muted-foreground">Automatically classify on upload</p>
              </div>
              <Switch checked={autoClassify} onCheckedChange={setAutoClassify} />
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <Input type="password" placeholder="Current password" className="bg-secondary/50" />
            <Input type="password" placeholder="New password" className="bg-secondary/50" />
            <Button type="submit" size="sm">Update Password</Button>
          </form>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-destructive/20 bg-card p-6">
          <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-3">Clear all uploaded file data from browser storage.</p>
          <Button variant="destructive" size="sm" onClick={clearData}>Clear All Data</Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
