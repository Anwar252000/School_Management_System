"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import IssueTable from "./issue-table"; // Your issue list table component
import { IssueData } from "@/services/apis/issueService"; // Adjust import for your issue type

interface ViewIssueProps {
  selectedIssues: IssueData[] | null;
}

const ViewIssue: React.FC<ViewIssueProps> = ({ selectedIssues }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-transparent text-xs hover:text-default-800 px-1"
        >
          View Issues
        </Button>
      </SheetTrigger>

      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Reported Issues</SheetTitle>
        </SheetHeader>

        <div className="py-6">
          <IssueTable issues={selectedIssues ?? []} />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewIssue;
