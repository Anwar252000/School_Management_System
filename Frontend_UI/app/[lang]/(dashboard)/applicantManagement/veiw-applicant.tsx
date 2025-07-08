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
import EditApplicant from "./edit-applicant";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApplicationDropdown from "./application-dropdown";
import {
  ApplicantApplicationDetail,
  useDeleteApplicantMutation,
} from "@/services/apis/applicantService";
import { SectionData } from "@/services/apis/sectionService";
import { ParentData } from "@/services/apis/parentService";

interface ApplicantListTableProps {
  applicants: ApplicantApplicationDetail[];
  refetch: () => void;
  sectionData: SectionData[];
  // parents: ParentData[];
}

const ApplicantListTable: React.FC<ApplicantListTableProps> = ({
  applicants,
  refetch,
  sectionData,
  // parents,
}) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteApplicant] = useDeleteApplicantMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [applicantToDelete, setApplicantToDelete] = useState<number | null>(
    null
  );
  const [detailedApplicant, setDetailedApplicant] =
    useState<ApplicantApplicationDetail | null>(null); // State for detailed view
  const itemsPerPage = 7;

  // Apply search filter and pagination
  const filteredApplicants = applicants?.filter(
    (applicant) =>
      applicant?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplicants?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredApplicants?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setApplicantToDelete(id);
  };

  const handleCancelDelete = () => {
    setApplicantToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteApplicant(id);
      toast.success("Applicant deleted successfully");
      setApplicantToDelete(null); // Close dialog after successful deletion
      refetch();
    } catch (error) {
      console.error("Error deleting Applicant:", error);
      toast.error("Failed to delete Applicant");
    }
  };
  const handleViewDetails = (applicant: ApplicantApplicationDetail) => {
    setDetailedApplicant(applicant); // Set detailed view state
  };

  const handleCloseDetails = () => {
    setDetailedApplicant(null); // Close detailed view
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by applicant name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Application No.</TableHead>
            <TableHead className="h-10 p-2.5">Applicant</TableHead>
            <TableHead className="h-10 p-2.5">Gender</TableHead>
            <TableHead className="h-10 p-2.5">Campus</TableHead>
            <TableHead className="h-10 p-2.5">Application Status</TableHead>
            <TableHead className="h-10 p-2.5">Last Attended Class</TableHead>
            <TableHead className="h-10 p-2.5">Class Applied For</TableHead>
            <TableHead className="h-10 p-2.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow
              key={item.applicationId}
              className="hover:bg-default-200"
              data-state={
                selectedRows.includes(item.applicationId!) && "selected"
              }
            >
              <TableCell className="p-2.5">{item.applicationId}</TableCell>
              <TableCell className="p-2.5">
                {item.firstName} {item.lastName}
              </TableCell>
              <TableCell className="p-2.5">{item.gender}</TableCell>
              <TableCell className="p-2.5">{item.campusName}</TableCell>
              <TableCell className="p-2.5">
                <Badge
                  variant="outline"
                  color={
                    item.applicationStatus == "Pending"
                      ? "warning"
                      : item.applicationStatus == "Approved"
                      ? "success"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {item.applicationStatus}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5">
                {item.lastAttendedClassName}
              </TableCell>
              <TableCell className="p-2.5">{item.appliedClassName}</TableCell>
              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3 justify-center">
                  <ApplicationDropdown
                    applicationId={item.applicationId}
                    refetch={refetch}
                    sectionData={sectionData}
                    classId={item.appliedClassId}
                    applicantId={item.applicantId}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleViewDetails(item)} // Show detailed view
                  >
                    <Icon icon="heroicons:eye" className=" h-4 w-4" />
                  </Button>
                  <EditApplicant applicantData={item} refetch={refetch} />
                  {/* <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(item.applicantId!)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button> */}
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

      {/* Detailed Applicant View in Dialog */}
      <Dialog open={!!detailedApplicant} onOpenChange={handleCloseDetails}>
        <DialogContent className="max-w-screen-sm mx-auto" size="lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-large">
              Applicant Details
            </DialogTitle>
            <DialogClose onClick={handleCloseDetails} />
          </DialogHeader>

          {detailedApplicant && (
            <div className="text-sm text-default-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="font-bold">Application No: </span>
                  {detailedApplicant.applicationId}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Application Status: </span>
                  <Badge
                    variant="outline"
                    color={
                      detailedApplicant.applicationStatus == "Pending"
                        ? "warning"
                        : detailedApplicant.applicationStatus == "Approved"
                        ? "success"
                        : "destructive"
                    }
                    className="capitalize"
                  >
                    {detailedApplicant.applicationStatus}
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Admission Date </span>
                  {detailedApplicant.admissionDecisionDate}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Campus </span>
                  {detailedApplicant.campusName}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Class Applied For</span>
                  {detailedApplicant.appliedClassName}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Last Class Attended </span>
                  {detailedApplicant.lastAttendedClassName}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Full Name: </span>
                  {detailedApplicant.firstName} {detailedApplicant.lastName}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Parent Name: </span>
                  {detailedApplicant.parentFirstName}{" "}
                  {detailedApplicant.parentMiddleName}{" "}
                  {detailedApplicant.parentLastName}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Form B Number: </span>
                  {detailedApplicant.formBNumber}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Date of Birth: </span>
                  {detailedApplicant.dateOfBirth.toString()}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Gender: </span>
                  {detailedApplicant.gender}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Email: </span>
                  {detailedApplicant.email}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Phone Number: </span>
                  {detailedApplicant.phoneNumber}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Nationality: </span>
                  {detailedApplicant.nationality}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Address: </span>
                  {detailedApplicant.parentAddress}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Occupation: </span>
                  {detailedApplicant.occupation}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Income: </span>
                  {detailedApplicant.sourceOfIncome}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Dependent: </span>
                  {detailedApplicant.dependent}
                </div>
                {/* <div className="flex flex-col">
                  <span className="font-bold">City: </span>
                  {detailedApplicant.city}
                </div>

                <div className="flex flex-col">
                  <span className="font-bold">States: </span>
                  {detailedApplicant.states}
                </div> */}
                <div className="flex flex-col">
                  <span className="font-bold">Residence Status: </span>
                  {detailedApplicant.residenceStatus}
                </div>

                <div className="flex flex-col">
                  <span className="font-bold">Mother Tongue </span>
                  {detailedApplicant.motherTongue}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {applicantToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(applicantToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ApplicantListTable;
