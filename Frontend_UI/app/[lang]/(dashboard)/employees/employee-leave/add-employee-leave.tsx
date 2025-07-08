"use client";

import React, { useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  EmployeeLeaveData,
  useAddEmployeeLeaveMutation,
} from "@/services/apis/employeeLeaveService";
import { EmployeesData } from "@/services/apis/employeeService";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface EmployeeLeaveProps {
  employees: EmployeesData[];
  refetch: () => void;
}

const AddEmployeeLeave: React.FC<EmployeeLeaveProps> = ({
  employees,
  refetch,
}) => {
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeLeaveData>();

  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [addLeave] = useAddEmployeeLeaveMutation();

  const onSubmit: SubmitHandler<EmployeeLeaveData> = async (data) => {
    try {
      const payload: EmployeeLeaveData = {
        ...data,
        employeeId: Number(employeeId),
        createdBy: loggedUser?.userId,
      };
      console.log("Leave submission response:", payload);

      const response = await addLeave(payload);
      
      if (response.data?.success) {
        toast.success("Leave added successfully!");
        reset();
        refetch();
      } else {
        toast.error(response.data?.message || "Error while adding leave");
      }
    } catch (error) {
      console.error("Leave submission error:", error);
      toast.error("Failed to submit leave");
    }
  };

  const handleError = () => {
    toast.error("Please correct the errors in the form.");
  };

  return (
    <Sheet>
      <div className="flex justify-end mb-4">
        <SheetTrigger asChild>
          <Button>
            <Icon icon="mdi:calendar-plus" className="w-6 h-6 mr-2" />
            Add Leave
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Employee Leave</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5 overflow-y-auto pr-2">
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                {/* Employee Dropdown */}
                <div>
                  <Label>Select Employee</Label>
                  <SearchableSelect
                    options={employees?.map((e) => ({
                      label: `${e?.firstName} ${e?.lastName}`,
                      value: e?.employeeId?.toString() || "",
                    }))}
                    onValueChange={(value) =>
                      setEmployeeId(parseInt(value) || null)
                    }
                  />
                </div>

                {/* Leave Type */}
                <div>
                  <Label>Leave Type</Label>
                  <Input
                    type="text"
                    placeholder="Leave Type"
                    {...register("leaveType", {
                      required: "Leave type is required",
                    })}
                  />
                  {errors.leaveType && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.leaveType.message}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    {...register("startDate", {
                      required: "Start date is required",
                    })}
                  />
                  {errors.startDate && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    {...register("endDate", {
                      required: "End date is required",
                    })}
                  />
                  {errors.endDate && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>

                {/* Approval Status */}
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

                {/* Reason */}
                <div className="col-span-2">
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Reason for Leave"
                    {...register("reason", { required: "Reason is required" })}
                  />
                  {errors.reason && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.reason.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-span-2">
                  <Button type="submit">Submit Leave</Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <div className="text-sm text-muted-foreground">You can close this panel from here.</div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddEmployeeLeave;
