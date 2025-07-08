"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "../common/confirmation-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SponsorData } from "@/services/apis/sponsorService";
import {
  SponsorshipData,
  SponsorshipDataDetails,
  useDeleteSponsorshipMutation,
} from "@/services/apis/sponsorshipService";

interface SponsorshipListTableProps {
  sponsorship: SponsorshipData[];
  sponsor: SponsorData[];
  sponsorshipDetail: SponsorshipDataDetails[];
  refetch: () => void;
}

const SponsorshipListTable: React.FC<SponsorshipListTableProps> = ({
  sponsorship,
  refetch,
  sponsor,
  sponsorshipDetail,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sponsorshipToDelete, setSponsorshipToDelete] = useState<number | null>(
    null
  );
  const [detailedSponsorship, setDetailedSponsorship] =
    useState<SponsorshipDataDetails | null>(null);

  const [deleteSponsorship] = useDeleteSponsorshipMutation();
  const itemsPerPage = 20;

  const filteredSponsorship = sponsorship?.filter(
    (item) =>
      item?.sponsorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.amount?.toString().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredSponsorship?.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSponsorship?.length / itemsPerPage);

  const groupedData = currentItems?.reduce(
    (acc: Record<number, SponsorshipData>, item) => {
      if (item.sponsorId !== null && item.sponsorId !== undefined) {
        acc[item.sponsorId] = acc[item.sponsorId]
          ? {
              ...acc[item.sponsorId],
              amount: (acc[item.sponsorId]?.amount || 0) + (item.amount ?? 0),
            }
          : { ...item };
      }
      return acc;
    },
    {}
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteSponsorship(id);
      toast.success("Sponsorship deleted successfully");
      setSponsorshipToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting sponsorship:", error);
      toast.error("Failed to delete sponsorship");
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Sponsor Name or Amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Sponsor Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Sponsor Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(groupedData || {}).map((item) => (
            <TableRow key={item.sponsorId} className="hover:bg-default-200">
              <TableCell>{item.startDate?.toString()}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{item.sponsorName}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  color={item.isActive ? "success" : "destructive"}
                  className="capitalize"
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setDetailedSponsorship(item)}
                >
                  <Icon icon="heroicons:eye" className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() =>
                    setSponsorshipToDelete(item.sponsorshipId ?? null)
                  }
                >
                  <Icon icon="heroicons:trash" className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <Dialog
        open={!!detailedSponsorship}
        onOpenChange={() => setDetailedSponsorship(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sponsorship Details</DialogTitle>
            <DialogClose onClick={() => setDetailedSponsorship(null)} />
          </DialogHeader>
          {detailedSponsorship && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsorshipDetail?.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
      {sponsorshipToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(sponsorshipToDelete)}
          onCancel={() => setSponsorshipToDelete(null)}
        />
      )}
    </div>
  );
};

export default SponsorshipListTable;
