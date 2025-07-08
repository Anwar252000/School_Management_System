"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  SponsorshipData,
  SponsorshipDataDetails,
} from "@/services/apis/sponsorshipService";
import {
  StudentData,
  useFetchStudentQuery,
} from "@/services/apis/studentService";

// In the child component (ClassStudentListTable)
interface StudentListTableProps {
  // onStudentSelectionChange: (selectedStudents: number[]) => void;
  sponsorship: SponsorshipData[];
  sponsorshipDetail: SponsorshipDataDetails[];
  students: StudentData[];
  setStudents: Dispatch<SetStateAction<StudentData[]>>;
  selectedStudents: { studentId: number; classId: number | null }[];
  handleStudentSelectionChange: (selectedStudent: {
    studentId: number;
    classId: number;
  }) => void; // Adjust type to not allow null
}

const ClassStudentListTable: React.FC<StudentListTableProps> = ({
  sponsorship,
  students,
  setStudents,
  sponsorshipDetail,
  selectedStudents,
  handleStudentSelectionChange,
}) => {
  const { data: studentsData, isSuccess } = useFetchStudentQuery();
  // const students = (studentsData?.data as StudentData[]) || [];
  // const [selectedStudents, setSelectedStudents] = useState<
  //   { studentId: number | null; classId: number | null }[]
  // >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (isSuccess) {
      setStudents(studentsData?.data);
    }
  }, [isSuccess]);

  // Filter students by search query and exclude those with existing sponsorship
  const filteredStudents = students.filter(
    (student) =>
      // Matches search query
      (student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      // Excludes students already sponsored
      !sponsorshipDetail?.some((s) => s?.studentId === student?.studentId)
  );

  // Handle checkbox change
  const handleCheckboxChange = (student: StudentData) => {
    // const isAlreadySelected = selectedStudents.some(
    //   (s) => s.studentId === student?.studentId
    // );

    // const updatedSelection = isAlreadySelected
    //   ? selectedStudents.filter((s) => s.studentId !== student?.studentId)
    //   : [
    //       ...selectedStudents,
    //       { studentId: student.studentId ?? null, classId: student.classId ?? null },
    //     ];

    // setSelectedStudents(updatedSelection);

    handleStudentSelectionChange({
      studentId: student.studentId ?? 0,
      classId: student.classId ?? 0,
    });
  };

  // Paginate students
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div>
      <Input
        placeholder="Search by Student Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded mb-4"
      />
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Gr No</TableHead>
              <TableHead>Full Name</TableHead>
              {/* <TableHead>Email</TableHead> */}
              {/* <TableHead>Phone</TableHead> */}
              <TableHead>Gender</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Enrollment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Select</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>
                  <Avatar>
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{student.grNo}</TableCell>
                <TableCell>
                  {student.firstName} {student.lastName}
                </TableCell>
                {/* <TableCell>{student.email}</TableCell> */}
                {/* <TableCell>{student.phoneNumber}</TableCell> */}
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>
                  {student.dateOfBirth
                    ? new Date(student.dateOfBirth).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>
                  {student.enrollmentDate
                    ? new Date(student.enrollmentDate).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    color={student.isActive ? "success" : "destructive"}
                  >
                    {student.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.some(
                      (s) => s.studentId === student.studentId
                    )}
                    onChange={() =>
                      handleStudentSelectionChange({
                        studentId: student.studentId ?? 0,
                        classId: student.classId ?? 0,
                      })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClassStudentListTable;
