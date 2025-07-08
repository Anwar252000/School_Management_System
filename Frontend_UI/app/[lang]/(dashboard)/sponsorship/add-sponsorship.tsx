"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
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
  SponsorshipData,
  SponsorshipDataDetails,
  useAddSponsorshipMutation,
} from "@/services/apis/sponsorshipService";
import { SponsorData } from "@/services/apis/sponsorService";
import { StudentData } from "@/services/apis/studentService";
import ClassStudentListTable from "./student-class-wise";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

const sponsorshipSchema = z.object({
  amount: z.string().min(1, "Please Enter Correct Amount").optional(),
  startDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  frequency: z.string().min(1, "Frequency is required").optional(),
  sponsorId: z.number().optional(),
  // details:z.object({
  //   classId: z.number().optional(),
  //   studentId: z.number().optional(),
  // }).array()
});

type SponsorshipFormValues = z.infer<typeof sponsorshipSchema>;

interface SponsorshipListTableProps {
  sponsorship: SponsorshipData[];
  sponsor: SponsorData[];
  sponsorshipDetail: SponsorshipDataDetails[];
  refetch: () => void;
}

const AddSponsorshipForm: React.FC<SponsorshipListTableProps> = ({
  sponsorship,
  sponsor,
  refetch,
  sponsorshipDetail,
}) => {
  const [addSponsorship] = useAddSponsorshipMutation();

  const [students, setStudents] = useState<StudentData[]>([]);
  const [sponsorId, setSponsorId] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<number>(1);
  const [selectedStudents, setSelectedStudents] = useState<
    {
      studentId: number;
      classId: number | null;
    }[]
  >([]);

  const fixedAmountPerStudent = 1500;
  const totalExpense =
    selectedStudents.length * fixedAmountPerStudent * frequency;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SponsorshipFormValues>({
    resolver: zodResolver(sponsorshipSchema),
  });
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const handleFrequencyChange = (value: string) => setFrequency(Number(value));

  const handleStudentSelectionChange = (selectedStudent: {
    studentId: number;
    classId: number;
  }) => {
    // console.log("selectedStudent", selectedStudent);

    const studentExists = selectedStudents.some(
      (s) => s.studentId === selectedStudent.studentId
    );
    
    // console.log("studentExists", studentExists);
    
    if (studentExists) {
      // Deselect the student
      setSelectedStudents(selectedStudents.filter(
        (s) => s.studentId !== selectedStudent.studentId
      ))
    } else {
      
      setSelectedStudents([...selectedStudents, selectedStudent]);
    }

    
  };

  const onSubmit: SubmitHandler<SponsorshipFormValues> = async (data) => {
    if (!sponsorId) {
      toast.error("Please select a sponsor");
      return;
    }
    // console.log("students", students)
    // console.log("selectedStudents", selectedStudents)

    let details = selectedStudents.map((selectedStudent) => {
      // Find the student object matching the selectedStudent.studentId
      const student = students.find(
        (s) => s.studentId === selectedStudent.studentId

      );

      var perStudentAmount = totalExpense/selectedStudents.length;
      // Return an object only if a match is found
      return student
        ? {
            studentId: selectedStudent.studentId,
            classId: selectedStudent.classId,
            amount: perStudentAmount, // Replace with the correct amount calculation
          }
        : null; // If no match is found, return null
    });

    // console.log("details", details)

    // Filter out null values
    details = details.filter((detail) => detail !== null);
    // console.log("filtered details", details)

    //   const perStudentAmount = fixedAmountPerStudent * frequency;
    //   if(student){
    //     return {
    //       studentId: student.studentId,
    //       classId: student.classId ?? 0,
    //       amount: perStudentAmount / selectedStudents.length,
    //     };
    //   }

    //   return null;
    // }).filter(Boolean);

    const formatDate = (isoString: string): string => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let combineData = {
      sponsorshipId: 0, // Assuming ID is auto-generated server-side
      sponsorId,
      amount: totalExpense, // Total amount for all students combined
      startDate: formatDate(
        typeof data?.startDate === "string"
          ? data.startDate
          : new Date().toISOString()
      ), // Ensuring startDate is always a string
      frequency,
      details,
      createdBy: loggedUser?.userId,
    };
    // console.log(combineData);

    try {
      const response = await addSponsorship(
        combineData as SponsorshipData
      ).unwrap();
      if (response.success) {
        toast.success(`Sponsorship  added successfully!`);
        reset();
        refetch();
      } else {
        console.error("Error:", response);
        toast.error(`Error: ${response.message || "Something went wrong"}`);
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
        <div className="flex justify-end space-x-4 m-2">
          <Button>
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2"
            />
            Add Sponsorship (1500 per-student)
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Add New Sponsorship</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Select Sponsor</Label>
              <Select onValueChange={(value) => setSponsorId(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sponsor" />
                </SelectTrigger>
                <SelectContent>
                  {sponsor &&
                    sponsor?.map((sponsor) => (
                      <SelectItem
                        key={sponsor.sponsorId}
                        value={sponsor.sponsorId?.toString() ?? ""}
                      >
                        {sponsor?.sponsorName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Total Amount</Label>
              <InputGroup merged>
                <InputGroupText>
                  <Icon icon="mdi:currency-usd" />
                </InputGroupText>
                <Input type="text" placeholder="Student Per Sponsorship 1500" value={totalExpense} readOnly />
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Frequency of Sponsorship</Label>
              <Select onValueChange={handleFrequencyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Select Start Date</Label>
              <Input type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <ClassStudentListTable
                students={students}
                setStudents={setStudents}
                selectedStudents={selectedStudents}
                sponsorship={sponsorship}
                sponsorshipDetail={sponsorshipDetail}
                handleStudentSelectionChange={handleStudentSelectionChange}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <Button type="submit">Submit Sponsorship</Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddSponsorshipForm;
