"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  FileDown,
  Printer,
  Percent,
  UserPlus,
  Eye,
  MoreHorizontal,
  Download,
  Mail,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  FeeViewData,
  useFetchAllStudentFeeDetailQuery,
} from "@/services/apis/feeService";
import { CampusData } from "@/services/apis/campusService";
import { ClassData } from "@/services/apis/classService";
import AddDiscount from "./add-discount";

interface FeeTableProps {
  refetch: () => void;
  campuses: CampusData[];
  classes?: ClassData[];
}
const FeeGrid: React.FC<FeeTableProps> = ({ refetch, classes, campuses }) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [classId, setClassId] = useState<number | null>(0);
  const [campusId, setCampusId] = useState<number | null>(0);

  // Mock data for student fee details
  const { data, isLoading } = useFetchAllStudentFeeDetailQuery();
  const studentFees = data?.data as FeeViewData[];

  const toggleSelectAll = () => {
    if (selectedStudents.length === studentFees?.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(
        studentFees.map((student) => student?.studentId?.toString() || "")
      );
    }
  };

  const toggleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(
        selectedStudents.filter((studentId) => studentId !== id)
      );
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "Partial":
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case "Unpaid":
        return <Badge color="destructive">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Student Fee Details</CardTitle>
            <CardDescription>
              Comprehensive view of all student fees and payment status
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or GR number..."
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setCampusId(parseInt(value))}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Campus" />
                </SelectTrigger>
                <SelectContent>
                  {campuses?.map((campus) => (
                    <SelectItem
                      key={campus.campusId}
                      value={campus.campusId?.toString() ?? ""}
                    >
                      {campus.campusName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <Select onValueChange={(value) => setClassId(parseInt(value))}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder=" Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map((cd) => (
                      <SelectItem
                        key={cd.classId}
                        value={cd.classId?.toString() || ""}
                      >
                        {cd.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedStudents?.length === studentFees?.length &&
                        studentFees?.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class/Campus</TableHead>
                  <TableHead>Total Fees</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentFees?.map((student) => (
                  <TableRow key={student.voucherId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(
                          student?.voucherId?.toString() || ""
                        )}
                        onCheckedChange={() =>
                          toggleSelectStudent(
                            student?.voucherId?.toString() || ""
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder.svg?height=32&width=32"
                            alt={student.fullName}
                          />
                          <AvatarFallback>
                            {student?.fullName &&
                              student?.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student?.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {student?.studentId} | GR: {student?.grNo}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {student?.campusName}
                      </div>
                    </TableCell>
                    <TableCell>${student?.totalFees?.toFixed(2)}</TableCell>
                    <TableCell className="text-green-600">
                      ${student?.paidAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={
                        student?.pendingAmount && student?.pendingAmount > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      ${student?.pendingAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(student?.dueDate || "").toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(student?.paymentStatus || "")}
                    </TableCell>
                    <TableCell>
                      {student?.discountAmount &&
                      student?.discountAmount > 0 ? (
                        <Badge variant="outline" className="bg-purple-100">
                          {student.discountAmount}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student?.sponsorName ? (
                        <span className="text-sm">{student?.sponsorName}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Printer className="mr-2 h-4 w-4" />
                                <span>Print Voucher</span>
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Print Fee Voucher</DialogTitle>
                                <DialogDescription>
                                  Select voucher options for {student.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Voucher Month</Label>
                                  <Select defaultValue="5">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5">
                                        May 2024
                                      </SelectItem>
                                      <SelectItem value="6">
                                        June 2024
                                      </SelectItem>
                                      <SelectItem value="7">
                                        July 2024
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Include Details</Label>
                                  <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="breakdown" defaultChecked />
                                      <Label htmlFor="breakdown">
                                        Fee Breakdown
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="payment-history" />
                                      <Label htmlFor="payment-history">
                                        Payment History
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="adjustments"
                                        defaultChecked
                                      />
                                      <Label htmlFor="adjustments">
                                        Adjustments & Discounts
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print Voucher
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <AddDiscount
                            student={student}
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Percent className="mr-2 h-4 w-4" />
                                <span>Apply Discount</span>
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing 5 of 125 students
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {selectedStudents.length > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-background">
                {selectedStudents.length} students selected
              </Badge>
              <span className="text-sm text-muted-foreground">
                Bulk actions:
              </span>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Vouchers
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Print Multiple Vouchers</DialogTitle>
                    <DialogDescription>
                      Print fee vouchers for {selectedStudents.length} selected
                      students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Voucher Month</Label>
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">May 2024</SelectItem>
                          <SelectItem value="6">June 2024</SelectItem>
                          <SelectItem value="7">July 2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Print Format</Label>
                      <Select defaultValue="individual">
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">
                            Individual Vouchers
                          </SelectItem>
                          <SelectItem value="consolidated">
                            Consolidated Report
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-details" defaultChecked />
                      <Label htmlFor="include-details">
                        Include Fee Breakdown
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Vouchers
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Percent className="mr-2 h-4 w-4" />
                    Apply Discount
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply Bulk Discount</DialogTitle>
                    <DialogDescription>
                      Apply discount to {selectedStudents.length} selected
                      students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bulk-discount-type">Discount Type</Label>
                      <Select defaultValue="percentage">
                        <SelectTrigger id="bulk-discount-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-discount-value">
                        Discount Value
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="bulk-discount-value"
                          type="number"
                          defaultValue="10"
                          className="w-20 mr-2"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-discount-reason">Reason</Label>
                      <Select defaultValue="group">
                        <SelectTrigger id="bulk-discount-reason">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group">Group Discount</SelectItem>
                          <SelectItem value="special">
                            Special Promotion
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-discount-notes">Notes</Label>
                      <Textarea
                        id="bulk-discount-notes"
                        placeholder="Additional notes about this discount"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Apply to Selected</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Sponsor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Bulk Sponsorship</DialogTitle>
                    <DialogDescription>
                      Assign a sponsor to {selectedStudents.length} selected
                      students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bulk-sponsor-type">Sponsor Type</Label>
                      <Select defaultValue="organization">
                        <SelectTrigger id="bulk-sponsor-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="organization">
                            Organization
                          </SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-sponsor-name">Sponsor Name</Label>
                      <Input
                        id="bulk-sponsor-name"
                        placeholder="Name of sponsor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-coverage-percentage">
                        Coverage Percentage
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="bulk-coverage-percentage"
                          type="number"
                          defaultValue="100"
                          className="w-20 mr-2"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-sponsor-notes">Notes</Label>
                      <Textarea
                        id="bulk-sponsor-notes"
                        placeholder="Additional notes about this sponsorship"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Assign to Selected</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Send Reminders
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeGrid;
