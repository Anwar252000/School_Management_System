"use client"; // Make sure this is at the very top

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ClassroomData,
  useUpdateClassroomMutation,
} from "@/services/apis/classroomService";

// Define Zod schema for class form validation
const classroomSchema = z.object({
  roomNumber: z.string().min(1, "Room Number is required"),
  capacity: z.number().min(1, "Capacity is required").max(999),
  building: z.string().min(1, "Building is required"),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;

export default function EditClassroom({
  classroomData,
  refetch,
}: {
  classroomData: ClassroomData;
  refetch: () => void;
}) {
  const { classroomId, campusId, roomNumber, building, capacity } =
    classroomData;
  const [updateClassroom] = useUpdateClassroomMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      roomNumber,
      capacity,
      building,
    },
  });

  const onSubmit: SubmitHandler<ClassroomFormValues> = async (data) => {
    try {
      const updatedClassroom = { ...data, classroomId, campusId };
      const response = await updateClassroom(updatedClassroom);

      if (response.data?.success) {
        toast.success(
          `${updatedClassroom.roomNumber} Classroom Updated successfully!`
        );
        reset();
        refetch();
      } else {
        toast.error("Failed to update the classroom");
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Request failed");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors in the form.");
    }
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
          <SheetTitle>Edit Classroom</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Room Number"
                    {...register("roomNumber")}
                  />
                  {errors.roomNumber && (
                    <p className="text-destructive">
                      {errors.roomNumber.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="number"
                    placeholder="Capacity"
                    {...register("capacity", { valueAsNumber: true })}
                  />
                  {errors.capacity && (
                    <p className="text-destructive">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Building"
                    {...register("building")}
                  />
                  {errors.building && (
                    <p className="text-destructive">
                      {errors.building.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Update</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
