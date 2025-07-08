"use client";
import React, { useState } from "react";
import PromotedStudent from "./student-academic-view";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import { useFetchStudentAcademicQuery } from "@/services/apis/studentAcademicService";

const Page = () => {
  const [classId, setClassId] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);

  // Fetch class data
  const { data: classData } = useFetchClassQuery();
  const classes = classData?.data as ClassData[] || [];

  // Fetch student academic data
  const { data: studentData } = useFetchStudentAcademicQuery();
  const studentAcademic = studentData?.data as { academicYear: string }[] || [];

  // Get unique academic years
  const academicYears = [...new Set(studentAcademic.map((student) => student.academicYear))];

  return (
    <>
      {/* Class Selection */}
      <div className="col-span-1 mb-4">
        <Label>Select Class</Label>
        <Select onValueChange={(value) => setClassId(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cd) => (
              <SelectItem key={cd.classId} value={cd.classId?.toString() || ""}>
                {cd.className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Academic Year Selection */}
      <div className="col-span-1 mb-4">
        <Label>Select Academic Year</Label>
        <Select onValueChange={(value) => setDate(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Academic Year" />
          </SelectTrigger>
          <SelectContent>
            {academicYears.map((year, index) => (
              <SelectItem key={index} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Promoted Students with selected filters */}
      <div>
        <PromotedStudent classId={classId} date={date} />
      </div>
    </>
  );
};

export default Page;
