"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  EmployeeLeaveData,
  useUpdateEmployeeLeaveMutation,
} from "@/services/apis/employeeLeaveService";
import { Label } from "@/components/ui/label";

interface EditEmployeeLeaveProps {
  leaveData: EmployeeLeaveData;
  refetch: () => void;
}

const EditEmployeeLeave: React.FC<EditEmployeeLeaveProps> = ({
  leaveData,
  refetch,
}) => {
  const [updateLeave] = useUpdateEmployeeLeaveMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeLeaveData>({
    defaultValues: {
      employeeLeaveId: leaveData?.employeeLeaveId ?? 0,
      employeeId: leaveData?.employeeId ?? 0,
      leaveType: leaveData?.leaveType,
      startDate: leaveData?.startDate,
      endDate: leaveData?.endDate,
      reason: leaveData?.reason,
      approvalStatus: leaveData?.approvalStatus,
      isActive: leaveData?.isActive,
    },
  });

  const onSubmit: SubmitHandler<EmployeeLeaveData> = async (formData) => {
    try {
      const payload = {
        ...formData,
        leaveId: leaveData?.employeeLeaveId ?? 0,
      };

      const response = await updateLeave(payload).unwrap();

      if (response.success) {
        toast.success("Leave updated successfully!");
        reset();
        refetch();
      } else {
        toast.error("Failed to update leave.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleError = () => {
    toast.error("Please fix the form errors.");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Leave</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit, handleError)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  type="text"
                  placeholder="Leave Type"
                  {...register("leaveType")}
                />
              </div>
              <div className="col-span-2">
              <Label>start Date</Label>

                <Input
                  type="date"
                  {...register("startDate")}
                  placeholder="Start Date"
                />
              </div>
              <div className="col-span-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register("endDate")}
                  placeholder="End Date"
                />
              </div>
              <div className="col-span-2">
                <Textarea placeholder="Reason" {...register("reason")} />
              </div>
              <div className="col-span-2">
                <Label>Approval Status</Label>
                <select
                  {...register("approvalStatus", {
                    required: "Approval status is required",
                  })}
                  className="w-full border rounded px-3 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select approval status
                  </option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {errors.approvalStatus && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.approvalStatus.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Button type="submit">Update</Button>
              </div>
            </div>
          </form>
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

export default EditEmployeeLeave;
