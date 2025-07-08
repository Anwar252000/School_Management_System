"use client"; // Make sure this is at the very top

import React, { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  StudentData,
  useUpdateStudentMutation,
} from "@/services/apis/studentService";
import { ClassData } from "@/services/apis/classService";

const studentSchema = z.object({
  campusId: z.coerce.number().optional(),
  studentId: z.coerce.number().optional(),
  grNo: z.number().min(1, "gr no is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  gender: z.string().min(1, "Gender is required"),
  profileImage: z.string().nullable().optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .max(15, "Phone number must be at most 15 characters long"),
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of Birth is required" })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
    })
    .transform((value) => format(new Date(value), "yyyy-MM-dd")),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  classId: z.number().int().positive("Class is required").nullable(),
  isActive: z.boolean(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentProps {
  studentData: StudentData;
  classes: ClassData[];
  refetch: () => void;
}

const EditStudent: React.FC<StudentProps> = ({
  studentData,
  refetch,
  classes,
}) => {
  const [selectclassId, setClassId] = useState<number | null>(null);
  const [updateStudent] = useUpdateStudentMutation();

  const {
    campusId,
    studentId,
    grNo,
    firstName,
    lastName,
    email,
    gender,
    phoneNumber,
    dateOfBirth,
    enrollmentDate,
    classId,
    isActive,
    profileImage,
  } = studentData;

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      campusId,
      grNo,
      firstName,
      lastName,
      email,
      gender,
      phoneNumber,
      dateOfBirth: studentData.dateOfBirth?.toString() as string | undefined,
      enrollmentDate: new Date(studentData.dateOfBirth ?? "")
        .toISOString()
        .slice(0, 10),
      classId,
      isActive,
    },
  });
  // console.log("default values", studentData);

  const onSubmit: SubmitHandler<StudentFormValues> = async (data) => {
    try {
      const updatedStudent = {
        ...data,
        studentId,
        enrollmentDate: new Date(data.enrollmentDate),
        profileImage: data.profileImage || null,
      };
      const response = await updateStudent(updatedStudent);

      if (response?.data?.success) {
        toast.success(
          `${updatedStudent.firstName} Student Updated successfully!`
        );
        reset();
        refetch();
      } else {
        toast.error("Failed to update the Student");
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
          <SheetTitle>Edit Student Details</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Label>Gr_No</Label>
                  <Input
                    type="number"
                    placeholder="Gr No"
                    {...register("grNo", { valueAsNumber: true })}
                  />
                  {errors.grNo && (
                    <p className="text-destructive">{errors.grNo.message}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    defaultValue={gender}
                    onValueChange={(value) => setValue("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-destructive">{errors.gender.message}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <Label>Phone Number</Label>
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-destructive">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <Label>Date Of Birth</Label>
                  <Input
                    type="text"
                    placeholder="Date of Birth"
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-destructive">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <Label>Date Of Enrollment</Label>
                  <Input
                    type="text"
                    placeholder="Date of Enrollment"
                    {...register("enrollmentDate")}
                  />
                  {errors.enrollmentDate && (
                    <p className="text-destructive">
                      {errors.enrollmentDate.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <Label>Select Class</Label>
                  <Select
                    defaultValue={classId ? classId.toString() : ""} // Default value based on studentData
                    onValueChange={(value) => setClassId(parseInt(value))} // Set selected class ID
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((cd) => (
                        <SelectItem
                          key={cd.classId}
                          value={cd.classId?.toString() || ""}
                        >
                          {cd.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
};

export default EditStudent;
