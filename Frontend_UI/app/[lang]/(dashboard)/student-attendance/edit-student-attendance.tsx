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

const EditStudentAttendance = () => {
  const [classId, setClassId] = useState<string | undefined>();
  const [sectionId, setSectionId] = useState<string | undefined>();
  const [attendanceData, setAttendanceData] = useState<any[]>([]); // Holds fetched or updated data

  // Mock data for classes and sections
  const classes = [
    { id: "1", name: "Class 1" },
    { id: "2", name: "Class 2" },
  ];

  const sections: { [key: string]: { id: string; name: string }[] } = {
    "1": [
      { id: "A", name: "Section A" },
      { id: "B", name: "Section B" },
    ],
    "2": [
      { id: "C", name: "Section C" },
      { id: "D", name: "Section D" },
    ],
  };

  // Mock API call to fetch attendance data
  useEffect(() => {
    if (classId && sectionId) {
      // Simulate API call with mock data
      const mockData = [
        {
          id: 1,
          gRNO: 101,
          studentName: "John Doe",
          status: "Present",
          classId: "1",
          sectionId: "A",
        },
        {
          id: 2,
          gRNO: 102,
          studentName: "Jane Smith",
          status: "Absent",
          classId: "1",
          sectionId: "A",
        },
        {
          id: 3,
          gRNO: 103,
          studentName: "Alice Johnson",
          status: "Present",
          classId: "1",
          sectionId: "A",
        },
      ];
      setAttendanceData(
        mockData.filter(
          (item) => item.classId === classId && item.sectionId === sectionId
        )
      );
    }
  }, [classId, sectionId]);

  const handleClassChange = (value: string) => {
    setClassId(value);
    setSectionId(undefined); // Reset section when class changes
    setAttendanceData([]); // Reset attendance data
  };

  const handleSectionChange = (value: string) => {
    setSectionId(value);
  };

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

      <div className="col-span-1 mb-4">
        <Label>Select Class</Label>
        <Select onValueChange={handleClassChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cd) => (
              <SelectItem key={cd.id} value={cd.id}>
                {cd.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1 mb-4">
        <Label>Select Section</Label>
        <Select onValueChange={handleSectionChange} disabled={!classId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Section" />
          </SelectTrigger>
          <SelectContent>
            {classId &&
              sections[classId]?.map((section: any) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Editable Attendance Data */}
      {classId && sectionId && attendanceData.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Edit Attendance Data</h2>
          <Table className="table-auto w-full border border-gray-300">
            <TableHeader>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">GR.No</th>
                <th className="px-4 py-2 border">Student Name</th>
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
                    {item.gRNO}
                  </TableCell>
                  <TableCell className="px-4 py-2 border">
                    {item.studentName}
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

      {(!classId || !sectionId) && (
        <p className="text-gray-500 mt-4">
          Please select a class and section to edit attendance data.
        </p>
      )}
    </div>
  );
};

export default EditStudentAttendance;
