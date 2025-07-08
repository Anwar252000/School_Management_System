"use client";

import React, { useEffect, useState } from "react";
import AddStudentAttendance from "./add-student-attendance";
import ViewStudentAttendance from "./student-attendance-table";
import {
  SectionData,
  useFetchSectionQuery,
} from "@/services/apis/sectionService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import { StudentData, useFetchStudentByClassSectionQuery } from "@/services/apis/studentService";

const Page = () => {
  const [classId, setClassId] = useState<number | null>(null);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [attendanceDate, setAttendanceDate] = useState<string>("");

  const {
    data: classResponse,
    error: classError,
  } = useFetchClassQuery();

  const classes = classResponse?.data as ClassData[];

  const {
    data: sectionResponse,
    error: sectionError,
  } = useFetchSectionQuery();

  useEffect(() => {
    if (classId) {
      const filteredSections = (sectionResponse?.data as SectionData[])?.filter(
        (section) => section.classId === classId
      );
      setSections(filteredSections || []);
    } else {
      setSections([]);
    }
  }, [classId, sectionResponse]);

  const {
    data: studentsResponse,
    error: studentError,
    refetch: studentRefetch,
  } = useFetchStudentByClassSectionQuery({
    classId: classId || 0,
    sectionId: sectionId || 0,
  });

  const students = studentsResponse?.data as StudentData[];

  const handleClassChange = (value: string) => {
    setClassId(parseInt(value));
    setSectionId(null);
  };

  const handleSectionChange = (value: string) => {
    setSectionId(parseInt(value));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttendanceDate(event.target.value);
  };

  const handleRefetch = () => {
    studentRefetch();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-center gap-6 mb-6 bg-white p-4 rounded-lg shadow">
        {/* Select Class */}
        <div className="flex flex-col w-full sm:w-auto">
          <Label className="mb-1 text-gray-700">Select Class</Label>
          <Select onValueChange={handleClassChange}>
            <SelectTrigger className="w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((cd) => (
                <SelectItem
                  key={cd?.classId}
                  value={cd?.classId?.toString() || ""}
                >
                  {cd?.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <Label className="mb-1 text-gray-700">Select Section</Label>
          <Select onValueChange={handleSectionChange}>
            <SelectTrigger className="w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select a Section" />
            </SelectTrigger>
            <SelectContent>
              {sections?.map((section) => (
                <SelectItem
                  key={section?.sectionId}
                  value={section?.sectionId?.toString() || ""}
                >
                  {section?.sectionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Date */}
        <div className="flex flex-col w-full sm:w-auto">
          <Label className="mb-1 text-gray-700">Select Date</Label>
          <input
            type="date"
            className="w-64 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={attendanceDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Add Student Attendance */}
        <AddStudentAttendance
          classId={classId}
          sectionId={sectionId}
          refetch={handleRefetch}
          students={students}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        {/* View Student Attendance */}
        <ViewStudentAttendance
          classId={classId}
          sectionId={sectionId}
          attendanceDate={attendanceDate}
          refetch={handleRefetch}
        />
      </div>

    </div>
  );
};

export default Page;
