"use client";

import { useRestoreBackupMutation } from "@/services/apis/backupService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";




const RestoreBackup = () => {  // State to hold the backup file name
  const [fileName, setFileName] = useState("");
  const [restoreBackup, { isLoading }] = useRestoreBackupMutation();

  const handleRestore = async () => {
    if (!fileName) return toast.error("Enter backup filename to restore");
    try {
      await restoreBackup(fileName).unwrap();
      toast.success("Database restored successfully");
      setFileName("");
    } catch {
      toast.error("Failed to restore backup");
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Restore Backup</h3>
      <Label>Backup File Name</Label>
      <Input
        className="mb-3"
        placeholder="e.g., Backup_20250620.bak"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <Button disabled={isLoading} onClick={handleRestore}>
        {isLoading ? "Restoring..." : "Restore"}
      </Button>
    </div>
  );
};

export default RestoreBackup;
