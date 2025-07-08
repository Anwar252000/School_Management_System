"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Percent } from "lucide-react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-hot-toast";
import { useApplyDiscountMutation } from "@/services/apis/feeService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

interface ApplyDiscountFormValues {
  discountType: string;
  discountValue: number;
  reason: string;
  notes?: string;
}

const AddDiscount = ({student,
  trigger,
}: {
  student: any
  trigger: React.ReactNode
}) => {
  const [fromDate, setFromDate] = useState<Date>();
  const [applyDiscount, { isLoading, isSuccess }] = useApplyDiscountMutation();
  
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<ApplyDiscountFormValues>({
      defaultValues: {
        discountType: "percentage",
        discountValue: student.discount || 0,
        reason: student.discount > 0 ? "sibling" : "merit",
        notes: "",
      },
    });

  const onSubmit = async (data: ApplyDiscountFormValues) => {
    const payload = {
      studentId: student.studentId,
      discountAmount: Number(data.discountValue),
      reason: data.reason,
       createdBy: loggedUser?.userId || 0,
      
    };

    console.log("Payload:", payload);
    
    try {
      await applyDiscount(payload).unwrap();
      toast.success("Discount applied successfully");
    } catch (err) {
      toast.error("Failed to apply discount");
      console.error(err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      setFromDate(undefined);
    }
  }, [isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Percent className="mr-2 h-4 w-4" />
          <span>Apply Discount</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply Fee Discount</DialogTitle>
          <DialogDescription>
            Apply a discount to {student.name}'s fees
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="discount-type">Discount Type</Label>
            <Select
              defaultValue={watch("discountType")}
              onValueChange={(val) => setValue("discountType", val)}
            >
              <SelectTrigger id="discount-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-value">Discount Value</Label>
            <div className="flex items-center">
              <Input
                id="discount-value"
                type="number"
                className="w-24 mr-2"
                {...register("discountValue", { required: true })}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Select
              defaultValue={watch("reason")}
              onValueChange={(val) => setValue("reason", val)}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sibling">Sibling Discount</SelectItem>
                <SelectItem value="merit">Merit Scholarship</SelectItem>
                <SelectItem value="financial">Financial Hardship</SelectItem>
                <SelectItem value="special">Special Consideration</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this discount"
              {...register("notes")}
            />
          </div>

          {/* <div className="space-y-2">
            <Label>Effective Period</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 w-auto p-0 bg-white shadow-md">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs">To</Label>
                <Select defaultValue="academic-year">
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic-year">
                      End of Academic Year
                    </SelectItem>
                    <SelectItem value="semester">End of Semester</SelectItem>
                    <SelectItem value="custom">Custom Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div> */}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Applying..." : "Apply Discount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDiscount;
