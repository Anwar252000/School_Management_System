"use client";

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
import { format } from "date-fns";
import {
  ApplicantApplicationDetail,
  useUpdateApplicantMutation,
} from "@/services/apis/applicantService";
import {
  CampusData,
  useFetchCampusesQuery,
} from "@/services/apis/campusService";

const applicantSchema = z.object({
  applicantId: z.number().optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  formBNumber: z.string().min(1, "Form B is required"),
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of Birth is required" })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
    })
    .transform((value) => format(new Date(value), "yyyy-MM-dd")),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address").optional().default(""),
  applicantAddress: z.string().min(5, "Address is required"),
  residenceStatus: z.string().min(1, "Residence Status is required"),
  city: z.string().min(1, "City is required"),
  motherTounge: z.string().min(1, "Language is required"),
  states: z.string().min(1, "State is required"),
  lastClassId: z.number().min(1, "Last Class Attended is required"),
  appliedClassId: z.number().min(1, "Admission Required In Class is required"),
  campusId: z.number().min(1, "Campus is required").optional(),
  applicationId: z.number().optional(),
  applicationStatus: z.string().optional().default("Pending"),
  admissionDecisionDate: z.string().optional(),
  remarks: z.string().optional(),
  // createdAt: z.string().optional(),
  // createdBy: z.number().optional(),
  // updatedAt: z.string().optional(),
  // updatedBy: z.number().optional(),
  // isActive: z.boolean().optional().default(true),
  phoneNumber: z.string().max(15, "Phone number must be 15 characters long"),
});

type ApplicantFormValues = z.infer<typeof applicantSchema>;

interface ApplicantProps {
  applicantData: ApplicantApplicationDetail;
  refetch: () => void;
}

const EditApplicant: React.FC<ApplicantProps> = ({
  applicantData,
  refetch,
}) => {
  const {
    applicationId,
    applicantId,
    formBNumber,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    email,
    phoneNumber,
    // applicantAddress,
    // city,
    applicationStatus,
    // states,
    // motherTounge,
    residenceStatus,
    lastClassId,
    appliedClassId,
    campusId,
  } = applicantData;
  const [classes, setClasses] = useState<
    { classId: number; className: string }[]
  >([]);
  const [updateApplicant] = useUpdateApplicantMutation();
  const { data: campusData } = useFetchCampusesQuery();
  const campuses = (campusData?.data as CampusData[]) || [];
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      applicantId,
      applicationId,
      lastClassId,
      appliedClassId,
      formBNumber,
      firstName,
      lastName,
      dateOfBirth: applicantData.dateOfBirth?.toString() as string | undefined,
      gender,
      email,
      phoneNumber,
      // applicantAddress,
      // city,
      applicationStatus,
      // states,
      // motherTounge,
      residenceStatus,
      campusId,
    },
  });

  const onSubmit: SubmitHandler<ApplicantFormValues> = async (data) => {
    try {
      const updatedApplicant = {
        ...data,
        applicationId: applicationId,
      };
      const response = await updateApplicant(updatedApplicant);

      if (response?.data?.success) {
        toast.success(
          `${updatedApplicant.firstName} Applicant Updated successfully!`
        );
        reset();
      } else {
        toast.error("Failed to update the Applicant");
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Request failed");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      console.error(errors);
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          color="secondary"
        >
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button> */}
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Applicant</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Form B Number"
                    {...register("formBNumber")}
                  />
                  {errors.formBNumber && (
                    <p className="text-destructive">
                      {errors.formBNumber.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
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
                <div className="col-span-2 lg:col-span-1">
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
                <div className="col-span-2 lg:col-span-1">
                  <Select
                    defaultValue={campusId?.toString()}
                    onValueChange={(value) =>
                      setValue("campusId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {campuses.map((c) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={c?.campusId}
                          value={c.campusId ? c.campusId.toString() : ""}
                        >
                          {c?.campusName}
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
                <div className="col-span-2 lg:col-span-1">
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
                <div className="col-span-2 lg:col-span-1">
                  <Select
                    defaultValue={gender ?? ""}
                    onValueChange={(value) => setValue("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-destructive">{errors.gender.message}</p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
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
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Address"
                    {...register("applicantAddress")}
                  />
                  {errors.applicantAddress && (
                    <p className="text-destructive">
                      {errors.applicantAddress.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input type="text" placeholder="City" {...register("city")} />
                  {errors.city && (
                    <p className="text-destructive">{errors.city.message}</p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Select
                    defaultValue={applicationStatus ?? ""}
                    onValueChange={(value) =>
                      setValue("applicationStatus", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.applicationStatus && (
                    <p className="text-destructive">
                      {errors.applicationStatus.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Select
                    defaultValue={lastClassId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("lastClassId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Last Class Attended" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={c.classId}
                          value={c.classId.toString()}
                        >
                          {c.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.lastClassId && (
                    <p className="text-destructive">
                      {errors.lastClassId.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Select
                    defaultValue={appliedClassId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("appliedClassId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Admission Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={c.classId}
                          value={c.classId.toString()}
                        >
                          {c.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.appliedClassId && (
                    <p className="text-destructive">
                      {errors.appliedClassId.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="States"
                    {...register("states")}
                  />
                  {errors.states && (
                    <p className="text-destructive">{errors.states.message}</p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Mother Tounge"
                    {...register("motherTounge")}
                  />
                  {errors.motherTounge && (
                    <p className="text-destructive">
                      {errors.motherTounge.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Residence Status"
                    {...register("residenceStatus")}
                  />
                  {errors.residenceStatus && (
                    <p className="text-destructive">
                      {errors.residenceStatus.message}
                    </p>
                  )}
                </div>
              </div>
              <SheetFooter className="mt-6">
                {/* <SheetClose asChild> */}
                <Button type="submit">Update</Button>
                {/* </SheetClose> */}
              </SheetFooter>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditApplicant;
