"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  EmployeeTrainingData,
  useUpdateEmployeeTrainingMutation,
} from "@/services/apis/employeeTrainingService";

interface EditEmployeeTrainingProps {
    training: EmployeeTrainingData;
  refetch: () => void;
}

const EditEmployeeTraining: React.FC<EditEmployeeTrainingProps> = ({
    training,
  refetch,
}) => {
  const [updateTraining] = useUpdateEmployeeTrainingMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeTrainingData>({
    defaultValues: {
      trainingId: training.trainingId,
      employeeId: training.employeeId,
      trainingName: training.trainingName,
      certification: training.certification,
      trainingDate: training.trainingDate,
    },
  });

  const onSubmit: SubmitHandler<EmployeeTrainingData> = async (formData) => {
    try {
      const response = await updateTraining(formData).unwrap();
      if (response.success) {
        toast.success("Training updated successfully!");
        reset();
        refetch();
      } else {
        toast.error("Failed to update training.");
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
          <SheetTitle>Edit Training</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit, handleError)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  type="text"
                  placeholder="Training Name"
                  {...register("trainingName", {
                    required: "Training name is required",
                  })}
                />
                {errors.trainingName && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.trainingName.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Input
                  type="text"
                  placeholder="Certification"
                  {...register("certification")}
                />
              </div>

              <div className="col-span-2">
                <Label>Training Date</Label>
                <Input
                  type="date"
                  {...register("trainingDate")}
                  placeholder="Training Date"
                />
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

export default EditEmployeeTraining;
