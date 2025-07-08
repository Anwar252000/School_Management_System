"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApplicationStatusMutation } from "@/services/apis/applicantService";
import { SectionData } from "@/services/apis/sectionService";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

interface ApplicantProps {
  applicationId: number;
  applicantId: number;
  refetch: () => void;
  sectionData: SectionData[];
  classId: number;
}

const ApplicationDropdown: React.FC<ApplicantProps> = ({
  applicationId,
  applicantId,
  refetch,
  sectionData,
  classId,
}) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicationStatus] = useApplicationStatusMutation();

  const filteredSectionData = sectionData.filter(
    (section) => section.classId === classId
  );

  const handleStatusUpdate = async (
    id: number,
    status: string,
    sectionId?: number,
    applicantId?: number
  ) => {
    try {
      setLoading(true);
      const response = await applicationStatus({
        id: applicationId,
        status,
        sectionId: sectionId ?? 0,
        applicantId: applicantId ?? 0,
      });
      toast.success(response?.data?.message);
      refetch();
    } catch (err: any) {
      toast.error("Failed to Update Status");
      console.error("Error updating application status:", err);
    } finally {
      setLoading(false);
      setIsDialogOpen(false); // Close the dialog after updating
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            color="secondary"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[196px]"
          align="end"
          side="bottom"
          avoidCollisions
        >
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Icon
              icon="heroicons:hand-thumb-up-16-solid"
              className="h-4 w-4 mr-2 text-green-500"
            />
            Admission Approved
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusUpdate(applicationId, "Rejected")}
          >
            <Icon
              icon="heroicons:hand-thumb-down-16-solid"
              className="h-4 w-4 mr-2 text-red-500"
            />
            Admission Rejected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Section</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="p-4">
            {filteredSectionData.length ? (
              <div className="flex flex-col space-y-4">
                <label
                  htmlFor="section-dropdown"
                  className="block font-medium text-sm"
                >
                  Select Section
                </label>
                <select
                  id="section-dropdown"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => {
                    const selectedSectionId = e.target.value;
                    if (selectedSectionId) {
                      handleStatusUpdate(
                        applicationId,
                        "Approved",
                        parseInt(selectedSectionId),
                        applicantId
                      );
                    }
                  }}
                  defaultValue="" // Default option value
                >
                  <option value="" disabled>
                    -- Select a Section --
                  </option>
                  {filteredSectionData.map((section) => (
                    <option key={section.sectionId} value={section.sectionId}>
                      {section.sectionName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p>No sections available for the selected class.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {loading && <p>Loading...</p>}
    </>
  );
};

export default ApplicationDropdown;
