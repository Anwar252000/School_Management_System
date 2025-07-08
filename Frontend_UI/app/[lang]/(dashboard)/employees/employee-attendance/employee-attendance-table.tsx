import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import {
  EmployeeAttendanceData,
  useFetchEmployeeAttendanceByDateQuery,
} from "@/services/apis/employeeAttendanceService";

interface EmployeeAttendanceProps {
  refetch: () => void;
  attendanceDate?: Date | string;
}

const ViewEmployeeAttendance: React.FC<EmployeeAttendanceProps> = ({
  attendanceDate,
  refetch,
}) => {
  const [showAttendance, setShowAttendance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Fetch attendance data based on date
  const { data: attendanceDataByDate } = useFetchEmployeeAttendanceByDateQuery({
    attendanceDate: attendanceDate || new Date(),
  });

  const attendanceData = attendanceDataByDate?.data as EmployeeAttendanceData[];

  // Pagination logic
  const paginateData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return attendanceData?.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const totalPages = Math.ceil((attendanceData?.length || 0) / itemsPerPage);
  const currentItems = paginateData();

  return (
    <div>
      <Button onClick={() => setShowAttendance((prev) => !prev)}>
        <span className="text-xl mr-1">
          <Icon
            icon="heroicons:building-library-solid"
            className="w-6 h-6 mr-2"
          />
        </span>
        View Attendance
      </Button>

      {showAttendance && (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell>{item?.employeeName || ""}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      color={
                        item.attendanceStatus === "Present"
                          ? "success"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {item.attendanceStatus === "Present"
                        ? "Present"
                        : "Absent"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.attendanceDate
                      ? new Date(item.attendanceDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployeeAttendance;
