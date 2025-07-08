"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  StudentAcademicData,
  useFetchPromotedStudentByClassQuery,
} from "@/services/apis/studentAcademicService";
import { skipToken } from "@reduxjs/toolkit/query"; 

interface PromotedStudentProps {
  classId: number | null;
  date: string | null;
}

const PromotedStudent: React.FC<PromotedStudentProps> = ({ classId, date }) => {
  const { data: promoteStudent } = useFetchPromotedStudentByClassQuery(
    classId && date ? { classId, date } : skipToken
  );

  const result = promoteStudent?.data as StudentAcademicData[] || []; // Ensure it's always an array

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Student Academic Results</h2>
      
      <Table className="text-left w-full border border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-100">
            {["S.No", "Student Name", "Class", "Section", "Enrollment Date", "Academic Year", "Promotion Date", "Remarks"].map((heading, index) => (
              <TableHead key={index} className="h-10 p-2.5 border border-gray-200 text-center">
                {heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {result.length > 0 ? (
            result.map((student, index) => (
              <TableRow key={index} className="hover:bg-gray-50 border-b">
                <TableCell className="p-2.5 border border-gray-200 text-center">{index + 1}</TableCell>
                <TableCell className="p-2.5 border border-gray-200">{student.studentName}</TableCell>
                <TableCell className="p-2.5 border border-gray-200">{student.className}</TableCell>
                <TableCell className="p-2.5 border border-gray-200">{student.sectionName}</TableCell>
                <TableCell className="p-2.5 border border-gray-200 text-center whitespace-nowrap">
                  {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell className="p-2.5 border border-gray-200 text-center">{student.academicYear}</TableCell>
                <TableCell className="p-2.5 border border-gray-200 text-center whitespace-nowrap">
                  {student.promotionDate ? new Date(student.promotionDate).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell className="p-2.5 border border-gray-200">{student.remarks || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="p-4 text-center text-gray-500">
                No student data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PromotedStudent;
