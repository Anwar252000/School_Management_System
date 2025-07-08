"use client";

import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmployeeAttendanceData, useFetchEmployeeAttendanceByDateQuery } from "@/services/apis/employeeAttendanceService";
import { EmployeesData, useFetchEmployeesQuery } from "@/services/apis/employeeService";
import AddEmployeeAttendance from "./add-employee-attendance";
import ViewEmployeeAttendance from "./employee-attendance-table";


const Page = () => {
  const [attendanceDate, setAttendanceDate] = useState<string>("");
  const {data:employeeResponse, refetch} = useFetchEmployeesQuery();
  const employees = employeeResponse?.data as EmployeesData[];
    const {
    data: employeeAttendanceResponse,
    error: employeeError,
    refetch: employeeRefetch,
  } = useFetchEmployeeAttendanceByDateQuery({
    attendanceDate: attendanceDate,});

  const employeesAttendance = employeeAttendanceResponse?.data as EmployeeAttendanceData[];



  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttendanceDate(event.target.value);
  };

  const handleRefetch = () => {
    employeeRefetch();
    refetch();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-center gap-6 mb-6 bg-white p-4 rounded-lg shadow">
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
        <AddEmployeeAttendance
          refetch={handleRefetch}
          employees={employees}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6 my-2">
        {/* View employee Attendance */}
        <ViewEmployeeAttendance
          attendanceDate={attendanceDate}
          refetch={handleRefetch}
        />
      </div>

    </div>
  );
};

export default Page;
