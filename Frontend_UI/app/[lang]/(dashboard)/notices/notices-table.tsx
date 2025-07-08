import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { useState } from "react";
// import EditNotice from "./edit-notice";
import { notices } from "./data";

const NoticesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const itemsPerPage = 10;

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = filteredNotices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex justify-items-center">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>

      {/* Table */}
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5">Notice Title</TableHead>
            <TableHead className="h-10 p-2.5">Notice Description</TableHead>
            <TableHead className="h-10 p-2.5">Delivery Method</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5">Posted By</TableHead>
            <TableHead className="h-10 p-2.5">Posted Date</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentNotices.map((notice) => (
            <TableRow
              key={notice.id}
              className="hover:bg-default-200"
              data-state={selectedRows.includes(notice.id!) && "selected"}
            >
              <TableCell className="p-2.5">{notice.title}</TableCell>
              <TableCell className="p-2.5">{notice.description}</TableCell>
              <TableCell className="p-2.5">{notice.deliveryMethod}</TableCell>
              <TableCell className="p-2.5">
                <Badge
                  variant="outline"
                  color={
                    notice.deliveryStatus === "Sent"
                      ? "success"
                      : notice.deliveryStatus === "Pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {notice.deliveryStatus}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5">{notice.postedBy}</TableCell>
              <TableCell className="p-2.5">{notice.postedDate}</TableCell>
              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3">
                  {/* <EditNotice noticeData={notice} refetch={() => {}} /> */}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="destructive"
                    // onClick={() => handleDeleteConfirmation(item.userId!)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </>
  );
};

export default NoticesTable;
