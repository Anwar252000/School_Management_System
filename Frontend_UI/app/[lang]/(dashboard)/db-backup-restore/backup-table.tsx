"use client";

import {
  useFetchBackupsQuery,
  useDeleteBackupMutation,
  useDownloadBackupMutation,
} from "@/services/apis/backupService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BackupTable = () => {
  const { data, isLoading } = useFetchBackupsQuery();
  const [deleteBackup] = useDeleteBackupMutation();
  const [downloadBackup] = useDownloadBackupMutation();

  const handleDelete = async (id: number) => {
    if (confirm("Delete this backup?")) {
      try {
        await deleteBackup(id).unwrap();
        toast.success("Backup deleted");
      } catch {
        toast.error("Failed to delete backup");
      }
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      await downloadBackup(fileName).unwrap(); // may vary based on your blob logic
      toast.success("Download started");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Existing Backups</h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Backup Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((backup: any) => (
              <TableRow key={backup.backupId}>
                <TableCell>{backup.backupName}</TableCell>
                <TableCell>{new Date(backup.backupDate).toLocaleString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" onClick={() => handleDownload(backup.backupName)}>
                    <Download size={16} />
                  </Button>
                  <Button variant="ghost" onClick={() => toast("Use Restore section for this")}>
                    <RotateCcw size={16} />
                  </Button>
                  <Button color="destructive" onClick={() => handleDelete(backup.backupId)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BackupTable;
