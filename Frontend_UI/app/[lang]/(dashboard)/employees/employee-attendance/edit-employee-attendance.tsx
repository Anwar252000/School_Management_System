import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState, useEffect } from "react";

const EditEmployeeAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]); // Holds fetched or updated data

  const handleStatusChange = (id: number, newStatus: string) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleSave = () => {
    // Simulate saving the data to the backend
    console.log("Updated Attendance Data:", attendanceData);
    alert("Attendance updated successfully!");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Attendance</h1>

      {attendanceData.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Edit Attendance Data</h2>
          <Table className="table-auto w-full border border-gray-300">
            <TableHeader>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">S.No</th>

                <th className="px-4 py-2 border">Employee Name</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </TableHeader>
            <TableBody>
              {attendanceData.map((item, index) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="px-4 py-2 border">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-2 border">
                    {item.employeeName}
                  </TableCell>
                  <TableCell className="px-4 py-2 border">
                    <Select
                      onValueChange={(value) =>
                        handleStatusChange(item.id, value)
                      }
                      defaultValue={item.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={item.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <button
            onClick={handleSave}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default EditEmployeeAttendance;
