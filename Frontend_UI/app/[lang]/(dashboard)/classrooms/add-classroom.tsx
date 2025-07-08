"use client";
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
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddClassroomMutation } from "@/services/apis/classroomService";
import { CampusData } from "@/services/apis/campusService";

const classroomSchema = z.object({
  classroomId: z.coerce.number().optional(),
  campusId: z.coerce.number().optional(),
  roomNumber: z.string().min(1, "Room Number is required"),
  capacity: z.coerce.number().max(999),
  building: z.string().min(1, "Building is required"),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;
interface ClassroomSheetProps {
  campuses: CampusData[];
  refetch: () => void;
}

export default function AddClassroom({
  campuses,
  refetch,
}: ClassroomSheetProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
  });

  const [addClassroom] = useAddClassroomMutation();
  const onSubmit: SubmitHandler<ClassroomFormValues> = async (data) => {
    try {
      const response = await addClassroom(data);

      if (response.data?.success) {
        const roomNumber = Array.isArray(response.data?.data)
          ? response.data?.data[0].roomNumber
          : response.data?.data.roomNumber;
        toast.success(`${roomNumber} Classroom Added successfully!`);
        reset();
        refetch();
      } else {
        console.error("Error:", response);
        toast.error(
          `Error: ${response.data?.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      console.error("Request Failed:", error);
      toast.error("Request Failed");
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
        <Button>
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2  "
            />
          </span>
          Add Classroom
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Classroom</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            {/* form */}
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Select
                    onValueChange={(value) =>
                      setValue("campusId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses?.map((campus) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={campus.campusId}
                          value={campus.campusId?.toString() ?? ""}
                        >
                          {campus.campusName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.campusId && (
                    <p className="text-destructive">
                      {errors.campusId.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 ">
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
                <div className="col-span-3 lg:col-span-1">
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
                <div className="col-span-3 lg:col-span-1">
                  <Input
                    type="number"
                    placeholder="capacity"
                    {...register("capacity")}
                  />
                  {errors.capacity && (
                    <p className="text-destructive">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Submit Form</Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
