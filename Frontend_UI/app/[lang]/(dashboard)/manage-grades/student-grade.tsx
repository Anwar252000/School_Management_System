import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchExamResultsByClassQuery } from "@/services/apis/examResultService";
import { useFetchStudentAcademicQuery } from "@/services/apis/studentAcademicService";
import { Button } from "@/components/ui/button";
import StudentDialog from "./student-dialog";

interface ExamResultData {
  grNo: number;
  firstName: string;
  lastName: string;
  totalMarks: number;
  marksObtained: number;
  examDetails: {
    studentId: number;
    marksObtained: number;
  }[];
}

interface StudentAcademicRecord {
  studentAcademicId: number;
  studentId: number;
  classId: number;
  campusId: number;
  sectionId: number;
  academicYear: string;
}

interface GradesProps {
  refetch: () => void;
  classId: number;
  studentClassName?: string | null;
}

const StudentGrade: React.FC<GradesProps> = ({
  classId,
  refetch,
  studentClassName,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    studentName: string;
    grade: string;
    studentId: number;
    campusId: number;
    studentAcademicId: number | null;
  } | null>(null);

  const { data } = useFetchExamResultsByClassQuery(classId);
  const { data: studentAcademicData } = useFetchStudentAcademicQuery();

  const examResultData = data?.data as ExamResultData[];
  const studentAcademicRecords =
    studentAcademicData?.data as StudentAcademicRecord[];

  const uniqueStudents =
    examResultData?.reduce((acc, result) => {
      if (!acc[result.grNo]) {
        acc[result.grNo] = {
          grNo: result.grNo,
          firstName: result.firstName,
          lastName: result.lastName,
          examDetails: [],
          totalMarks: 0,
          marksObtained: 0,
        };
      }
      acc[result.grNo].totalMarks += result.totalMarks || 0;
      acc[result.grNo].marksObtained +=
        result.examDetails?.[0]?.marksObtained || 0;
      acc[result.grNo].examDetails.push(...(result.examDetails || []));
      return acc;
    }, {} as Record<string, any>) || {};

  const uniqueExamResults = Object.values(uniqueStudents);

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
    return "F";
  };

  const handlePromoteClick = (result: any) => {
    const studentId = result.examDetails[0]?.studentId;
    if (!studentId) {
      console.warn("No studentId found in exam details");
      return;
    }

    const studentAcademic = studentAcademicRecords?.find(
      (record) => record.studentId === studentId
    );

    setSelectedStudent({
      studentName: `${result.firstName} ${result.lastName}`,
      grade: calculateGrade((result.marksObtained / result.totalMarks) * 100),
      campusId: studentAcademic?.campusId ?? 0,
      studentId,
      studentAcademicId: studentAcademic
        ? studentAcademic.studentAcademicId
        : null,
    });

    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GR No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Obtained Marks</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueExamResults.map((result) => {
                const percentage = result.totalMarks
                  ? ((result.marksObtained / result.totalMarks) * 100).toFixed(
                      2
                    )
                  : "0.00";

                const overallPercentage = parseFloat(percentage);
                const grade = calculateGrade(overallPercentage);
                const status = overallPercentage >= 40 ? "Pass" : "Fail";

                return (
                  <TableRow key={result.grNo}>
                    <TableCell>{result.grNo}</TableCell>
                    <TableCell>
                      {result.firstName} {result.lastName}
                    </TableCell>
                    <TableCell>{result.totalMarks}</TableCell>
                    <TableCell>{result.marksObtained}</TableCell>
                    <TableCell>{percentage}%</TableCell>
                    <TableCell>{grade}</TableCell>
                    <TableCell
                      className={`font-medium ${
                        status === "Pass" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {status}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handlePromoteClick(result)}>
                        Promote
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedStudent && (
        <StudentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          studentName={selectedStudent.studentName}
          grade={selectedStudent.grade}
          studentClassName={studentClassName}
          studentId={selectedStudent.studentId}
          studentAcademicId={selectedStudent.studentAcademicId ?? 0}
          campusId={selectedStudent.campusId ?? 0}
        />
      )}
    </>
  );
};

export default StudentGrade;
