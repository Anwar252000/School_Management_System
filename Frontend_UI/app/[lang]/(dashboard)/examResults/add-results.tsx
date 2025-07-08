"use client";

import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  StudentData,
} from "@/services/apis/studentService";
import { useFetchExamResultPDFQuery } from "@/services/apis/examResultPDFService";
import { toast } from "sonner";
import { ExamPaperData } from "@/services/apis/examPaperService";
import { z } from "zod";
import { useAddExamResultMutation } from "@/services/apis/examResultService";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import ViewResult from "./view-result";

const examDetailsSchema = z.object({
  studentId: z.coerce.number().optional(),
  examPaperId: z.coerce.number().optional(),
  marksObtained: z.coerce.number().optional(),
});

const examResultsSchema = z.object({
  examResultId: z.coerce.number().optional(),
  examDetails: z.array(examDetailsSchema),
  isActive: z.boolean().optional().default(true),
});

interface StudentListTableProps {
  students: StudentData[];
  examPaperId: number | null;
  refetch: () => void;
}

type ExamsResultsFormValues = z.infer<typeof examResultsSchema>;
const AddResults: React.FC<StudentListTableProps> = ({
  students,
  examPaperId,
  refetch,
  
}) => {

  const [addExamResults] = useAddExamResultMutation();
  const { register, handleSubmit, reset } = useForm<ExamsResultsFormValues>({
    resolver: zodResolver(examResultsSchema),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{ studentId: number; classId: number} | null>(null);
  const [viewDialog, setViewDialog] = useState<{studentId: number; classId: number} | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<{studentId: number} | null>(null);
  const [dialogType, setDialogType] = useState<"add" | "view" | null>(null);
  const {data: examResultPDFBlob, isError: isErrorPDF, error: ErrorPDF,} = useFetchExamResultPDFQuery(
    selectedStudentId !== null
        ? { studentId: selectedStudentId.studentId }
        : { studentId: 0 }, { skip: !selectedStudentId });  

  const itemsPerPage = 5;
  const filteredStudents = (students as StudentData[])?.filter(
    (students) =>
      students.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      students.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents?.slice(indexOfFirstItem, indexOfLastItem );
  const totalPages = Math.ceil(filteredStudents?.length / itemsPerPage);

  useEffect(() => {
    if(examResultPDFBlob)
    {
        const pdfUrl = URL.createObjectURL(examResultPDFBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `Exam-Result-${selectedStudentId?.studentId}.pdf`;
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link); 
        URL.revokeObjectURL(pdfUrl);
    }
  }, [examResultPDFBlob, selectedStudentId]);

  useEffect(() => {
    if(isErrorPDF){
      toast.error(ErrorPDF as string);
    }
  }, [isErrorPDF])

  useEffect(() => {
  }, [selectedStudent]);

  const handleViewDetails = (params: { studentId: number }) => {
    event?.preventDefault();
    setSelectedStudentId({studentId: params.studentId});
};

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleViewResult = (studentId: number, classId: number) => {
    event?.preventDefault();
    setViewDialog({ studentId, classId});
    setDialogType("view");
  };

  const handleCloseViewDialog = () => {
    setViewDialog(null);
    setDialogType(null);
  };
  
  const onSubmit: SubmitHandler<ExamsResultsFormValues> = async (data) => {
    const examDetailsPayload = currentItems.map((item, index) => {
      const marksObtained = data.examDetails[index]?.marksObtained || 0;
      return {
        studentId: students[index]?.studentId || 0,
        examPaperId: examPaperId || 0,
        marksObtained: marksObtained,
      };
    });
    const finalData = {
      ...data,
      examDetails: examDetailsPayload,
    };

    try {
      const response = await addExamResults(finalData);
      if (response.data?.success) {
        toast.success("Exam Results saved successfully!");
        reset();
        refetch();
      } else {
        toast.error(`Error: ${response.data?.message || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("Request failed");
    }
  };
  
  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Student Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>
      <Card className="overflow-x-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">GrNo</TableHead>
              <TableHead className="font-semibold">Full Name</TableHead>
              <TableHead className="font-semibold">Gender</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Marks Obtained</TableHead>
              <TableHead className="text-center sticky right-0 bg-background drop-shadow-md">
              View Results
              </TableHead>
              <TableHead className="text-center sticky right-0 bg-background drop-shadow-md">
              Download Transcript
              </TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems?.map((item, index) => (
              <TableRow key={item.email} className="hover:bg-muted">
                <TableCell>{item.grNo}</TableCell>
                <TableCell>
                  {item.firstName} {item.lastName}
                </TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    color={item.isActive ? "success" : "destructive"}
                    className="capitalize"
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`examDetails.${index}.marksObtained`)}
                    />
                  </TableCell>

                <TableCell className="gap-3 text-center bg-background drop-shadow-md">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className=" h-7 w-7"
                    color="secondary"
                    onClick={() => handleViewResult(item.studentId, item.classId ?? 0)}
                  >
                    <Icon icon="heroicons:academic-cap" className=" h-4 w-4  " />
                  </Button>
                </TableCell>

                <TableCell className="gap-3 text-center bg-background drop-shadow-md">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className=" h-7 w-7"
                    color="secondary"
                    onClick={() => handleViewDetails({studentId: item.studentId})}
                  >
                    <Icon icon="heroicons:arrow-long-down" className=" h-4 w-4 " /> 
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4 mb-2">

        <Button type="submit" className="ml-auto mt-4">
            Submit
          </Button>
        </div>
        </form>
      </Card>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="ml-auto">
          Page {currentPage} of {totalPages}
        </span>
        <Button className="ml-auto" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
        <div>
        </div>
      </div>
      {dialogType === "view" && viewDialog && (
        <ViewResult
          className={currentItems.find((item) => item.studentId === viewDialog.studentId)?.className ?? ""}
          firstName={currentItems.find((item) => item.studentId === viewDialog.studentId)?.firstName ?? ""}
          lastName={currentItems.find((item) => item.studentId === viewDialog.studentId)?.lastName ?? ""}
          studentId={viewDialog.studentId}
          classId={viewDialog.classId}
          refetch={refetch}
          onClose={handleCloseViewDialog}
          dialogType={dialogType}
        />
      )}
    </>
  );
};

export default AddResults;
