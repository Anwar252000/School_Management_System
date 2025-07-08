"use client";

import { useCreateBackupMutation } from "@/services/apis/backupService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const CreateBackup = () => {
  const [backupName, setBackupName] = useState("");
  const [createBackup, { isLoading }] = useCreateBackupMutation();

  const handleCreate = async () => {
    if (!backupName) {
      toast.error("Please enter a backup name");
      return;
    }

    try {
      await createBackup(backupName).unwrap();
      toast.success("Backup created successfully");
      setBackupName("");
    } catch (error) {
      toast.error("Failed to create backup");
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">Create Manual Backup</h3>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter backup name"
          className="border rounded px-3 py-2 text-sm flex-1"
          value={backupName}
          onChange={(e) => setBackupName(e.target.value)}
        />
        <Button disabled={isLoading} onClick={handleCreate}>
          {isLoading ? "Creating..." : "Create Backup"}
        </Button>
      </div>
    </div>
  );
};

export default CreateBackup;
