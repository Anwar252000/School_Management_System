"use client";
import React, { useState, useEffect } from "react";
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

import EditSponsor from "./edit-sponsor";
import { SponsorData, useDeleteSponsorMutation } from "@/services/apis/sponsorService";

interface SponsorListTableProps {
  sponsor: SponsorData[];
  refetch: () => void;

}

const SponsorListTable: React.FC<SponsorListTableProps> = ({sponsor, refetch}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sponsorToDelete, setSponsorToDelete] = useState<number | null>(null);
  const itemsPerPage = 50;
  // const [detailedSponsor, setDetailedSponsor] = useState<SponsorData | null>(null); 
  const [deleteSponsor] = useDeleteSponsorMutation();
  
  const filteredSponsors = (sponsor as SponsorData[])?.filter((sponsor) =>
    sponsor?.sponsorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSponsors?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredSponsors?.length / itemsPerPage);


  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setSponsorToDelete(id);
  };

  const handleCancelDelete = () => {
    setSponsorToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSponsor(id);
      toast.success("Sponsor deleted successfully");
      setSponsorToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting Sponsor:", error);
      toast.error("Failed to delete Sponsor");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Sponsor Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
          <TableHead className="h-10 p-2.5">S.No:</TableHead>
            <TableHead className="h-10 p-2.5">Full Name</TableHead>
            <TableHead className="h-10 p-2.5">Gender</TableHead>
            <TableHead className="h-10 p-2.5">Occupation</TableHead>
            <TableHead className="h-10 p-2.5">Country</TableHead>
            <TableHead className="h-10 p-2.5">State</TableHead>
            <TableHead className="h-10 p-2.5">City</TableHead>
            <TableHead className="h-10 p-2.5">Email</TableHead>            
            <TableHead className="h-10 p-2.5">Phone Number</TableHead>
            <TableHead className="h-10 p-2.5">Postal Code</TableHead>
            <TableHead className="h-10 p-2.5">Address</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item, index) => (
            <TableRow
              key={item.sponsorId}
              className="hover:bg-default-200"
            >
              <TableCell className="p-2.5">{index + 1}</TableCell>
              <TableCell className="p-2.5">
               {item?.sponsorName}
              </TableCell>
              <TableCell className="p-2.5"> {item?.gender}</TableCell>
              <TableCell className="p-2.5"> {item?.occupation}</TableCell>
              <TableCell className="p-2.5"> {item?.country}</TableCell>
              <TableCell className="p-2.5"> {item?.state}</TableCell>
              <TableCell className="p-2.5"> {item?.city}</TableCell>
              <TableCell className="p-2.5">{item?.email}</TableCell>
              <TableCell className="p-2.5"> {item?.phoneNumber}</TableCell>
              <TableCell className="p-2.5"> {item?.postalCode}</TableCell>
              <TableCell className="p-2.5"> {item?.address}</TableCell>
              <TableCell className="p-2.5">
                <Badge
                  variant="outline"
                  color={item.isActive ? "success" : "destructive"}
                  className="capitalize"
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3">
                  <EditSponsor sponsorData={item} refetch={refetch}/>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.sponsorId!)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {sponsorToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(sponsorToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>

  )}


export default SponsorListTable;
