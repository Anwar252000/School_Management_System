"use client";

import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import CreateBackup from "./create-backup";
import RestoreBackup from "./restore-backup";
import BackupTable from "./backup-table";

const Page = () => {
  return (
    <>
      <div className="mb-4">
        <Breadcrumbs>
          <BreadcrumbItem>System Settings</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Backup & Restore</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <CreateBackup />
        <RestoreBackup />
      </div>

      <BackupTable />
    </>
  );
};

export default Page;
