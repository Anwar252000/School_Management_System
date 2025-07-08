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
import EditPaymentForm from "./edit-sponsor-payment";
import {
  PaymentData,
  useDeleteSponsorPaymentMutation,
} from "@/services/apis/sponsorPaymentService";
import {
  SponsorshipData,
  SponsorshipDataDetails,
} from "@/services/apis/sponsorshipService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";

interface PaymentListTableProps {
  payment: PaymentData[];
  sponsorships: SponsorshipData[];
  refetch: () => void;
}

const PaymentListTable: React.FC<PaymentListTableProps> = ({
  payment,
  refetch,
  sponsorships,
}) => {
  const [deleteSponsorPayment] = useDeleteSponsorPaymentMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
  const [detailedSponsorship, setDetailedSponsorship] = useState<{
    sponsorName?: string;
    totalSponsorshipAmount?: number;
    totalPaidAmount?: number;
    remainingAmount?: number;
    payments?: PaymentData[];
  } | null>(null);
  const itemsPerPage = 20;

  const filteredPayments = payment?.filter((payment) =>
    payment?.sponsorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPayments?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setPaymentToDelete(id);
  };

  const handleCancelDelete = () => {
    setPaymentToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSponsorPayment(id);
      toast.success("Sponsor Payment deleted successfully");
      setPaymentToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting Sponsor Payment:", error);
      toast.error("Failed to delete Sponsor Payment");
    }
  };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleViewDetails = (paymentItem: PaymentData) => {
    const sponsorship = sponsorships.find(
      (s) => s.sponsorshipId === paymentItem.sponsorshipId
    );

    if (sponsorship) {
      const sponsorPayments = payment.filter(
        (p) => p.sponsorshipId === sponsorship.sponsorshipId
      );

      const totalPaidAmount = sponsorPayments.reduce(
        (sum, p) => sum + (p.amountPaid ?? 0),
        0
      );

      const remainingAmount = (sponsorship?.amount ?? 0) - totalPaidAmount; // Allow negative values for overpayment

      setDetailedSponsorship({
        sponsorName: sponsorship.sponsorName,
        totalSponsorshipAmount: sponsorship.amount,
        totalPaidAmount,
        remainingAmount,
        payments: sponsorPayments,
      });
    }
  };

  const handleCloseDetails = () => {
    setDetailedSponsorship(null);
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
            <TableHead className="h-10 p-2.5">Sponsor Name</TableHead>
            <TableHead className="h-10 p-2.5">View Detail</TableHead>
            <TableHead className="h-10 p-2.5">Payment Date</TableHead>
            <TableHead className="h-10 p-2.5">Amount Paid</TableHead>
            <TableHead className="h-10 p-2.5">Payment Method</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => (
            <TableRow key={item.paymentId} className="hover:bg-default-200">
              <TableCell className="p-2.5">{item.sponsorName}</TableCell>
              <TableCell className="p-2.5">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  color="secondary"
                  onClick={() => handleViewDetails(item as any)} // Show detailed view
                >
                  <Icon icon="heroicons:eye" className=" h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell className="p-2.5">
                {formatDate(item.paymentDate || "")}
              </TableCell>
              <TableCell className="p-2.5">{item.amountPaid}</TableCell>
              <TableCell className="p-2.5">{item.paymentMethod}</TableCell>
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
                  <EditPaymentForm payment={item} refetch={refetch} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.paymentId!)}
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
      {paymentToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(paymentToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
      {/* Sponsorship Details Dialog */}
      <Dialog open={!!detailedSponsorship} onOpenChange={handleCloseDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sponsorship Details</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {detailedSponsorship && (
            <div>
              <h3>Sponsor: {detailedSponsorship.sponsorName}</h3>
              <p>
                <strong>Total Sponsorship Amount:</strong> $
                {detailedSponsorship.totalSponsorshipAmount}
              </p>
              <p>
                <strong>Total Paid Amount:</strong> $
                {detailedSponsorship.totalPaidAmount}
              </p>
              <p>
                <strong>Remaining Amount:</strong>{" "}
                {detailedSponsorship?.remainingAmount != null && detailedSponsorship.remainingAmount < 0 ? (
                  <span style={{ color: "red" }}>
                    -${Math.abs(detailedSponsorship?.remainingAmount || 0)}
                  </span>
                ) : (
                  `$${detailedSponsorship?.remainingAmount ?? 0} `
                )}
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedSponsorship?.payments?.map((payment) => (
                    <TableRow key={payment.paymentId}>
                      <TableCell>
                        {formatDate(payment?.paymentDate || "")}
                      </TableCell>
                      <TableCell>${payment.amountPaid}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentListTable;
