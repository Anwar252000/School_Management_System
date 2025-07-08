import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ExamResultData, useUpdateExamResultMutation } from "@/services/apis/examResultService";

const examDetailsSchema = z.object({
  examResultId: z.coerce.number().optional(),
  studentId: z.coerce.number().optional(),
  marksObtained: z.coerce.number().optional(),
  examPaperId: z.coerce.number().optional(),
});

const examResultsSchema = z.object({
  examDetails: z.array(examDetailsSchema),
  subjectName: z.string().optional(),
  className: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  totalMarks: z.number().optional(),
  isActive: z.boolean().optional().default(true),
});

type ExamsResultsFormValues = z.infer<typeof examResultsSchema>;

interface DataProps {
  examResultData: ExamResultData[];
  studentId: number;
  classId: number;
  firstName: string,
  lastName: string,
  className: string,
  onClose: () => void;
  refetch: () => void;
}

const EditResult = ({
  studentId,
  classId,
  onClose,
  refetch,
  examResultData,
  firstName,
  lastName,
  className,
}: DataProps) => {
  const [updateExamResult] = useUpdateExamResultMutation();
  const { register, handleSubmit, watch, reset } = useForm<ExamsResultsFormValues>({
    resolver: zodResolver(examResultsSchema),
    defaultValues: {
      examDetails: examResultData.map((item) => ({
        marksObtained: item.examDetails?.[0]?.marksObtained || 0,
      })),
    },
  });

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 95) return "A++";
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "B++";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    if (percentage >= 40) return "E";
    return "U";
  };

  const examDetails = watch("examDetails") || [];

  const totalMarksObtained = examDetails.reduce((sum, detail) => {
    return sum + (detail.marksObtained || 0);
  }, 0);

  const totalMarks = examResultData.reduce((sum, item) => sum + (item.totalMarks || 0), 0);
  const percentage = totalMarks > 0 ? parseFloat(((totalMarksObtained / totalMarks) * 100).toFixed(2)) : 0;
  const grade = calculateGrade(percentage);

  const filteredData = examResultData.filter(
    (item) => item.examDetails?.find((item) => item.studentId === studentId && classId === classId)
  );

  const onSubmit: SubmitHandler<ExamsResultsFormValues> = async (data) => {
    const examDetailsPayload = filteredData.map((item, index) => {
      const marksObtained = data.examDetails[index]?.marksObtained || 0;

      return {
        studentId,
        examResultId: item.examDetails?.[0]?.examResultId,
        examPaperId: item.examDetails?.[0]?.examPaperId,
        marksObtained,
      };
    });

    const finalData = {
      examDetails: examDetailsPayload,
    };

    try {
      const response = await updateExamResult(finalData);
      if (response.data?.success) {
        toast.success("Exam Results saved successfully!");
        reset();
        refetch();
        onClose();
      } else {
        toast.error(`Error: ${response.data?.message || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("Request failed");
    }
  };

  return (
    <Dialog open={!!studentId} onOpenChange={onClose}>
      <DialogContent
        style={{ width: "100%", maxWidth: "800px" }}
        className="max-w-screen-md mx-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Edit Results</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Student Name</TableHead>
                <TableHead className="text-left">Class Name</TableHead>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-left text-lg">
                  {firstName} {lastName}
                </TableCell>
                <TableCell className="font-bold float-left text-lg">{className}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-bold text-left">Subject Name</TableHead>
                <TableHead className="font-bold text-left">Total Marks</TableHead>
                <TableHead>Marks Obtained</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.examDetails?.[0].examResultId}>
                  <TableCell>{item.subjectName}</TableCell>
                  <TableCell>{item.totalMarks}</TableCell>
                  <TableCell>
                    <Input
                      className="text-center fs-md"
                      type="number"
                      value={examDetails[index]?.marksObtained || 0}
                      {...register(`examDetails.${index}.marksObtained`, {
                        valueAsNumber: true, 
                      })}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Grand Total</TableCell>
                <TableCell className="font-bold">{totalMarks}</TableCell>
                <TableCell className="font-bold pe-20">{totalMarksObtained}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Percentage</TableCell>
                <TableCell colSpan={2} className="font-bold float-left">
                  {percentage}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Grade</TableCell>
                <TableCell colSpan={2} className="font-bold float-left">
                  {grade}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditResult;
