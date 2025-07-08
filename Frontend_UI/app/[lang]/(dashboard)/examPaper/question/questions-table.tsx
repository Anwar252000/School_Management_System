import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ConfirmationDialog from "../../common/confirmation-dialog";
import EditQuestions from "./edit-question";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import {
  QuestionsData,
  useDeleteQuestionMutation,
} from "@/services/apis/qBankService";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const QuestionsTable = ({
  Questions,
  refetch,
}: {
  Questions: QuestionsData[];
  refetch: () => void;
}) => {
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [detailQuestion, setDetailQuestion] = useState<QuestionsData | null>(
    null
  );
  const itemsPerPage = 7;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredQuestions = Questions?.filter((q) =>
    q.subjectName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredQuestions?.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDeleteConfirmation = (id: number) => {
    setQuestionToDelete(id);
  };

  const handleCancelDelete = () => {
    setQuestionToDelete(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion(id);
      toast.success("Question deleted successfully");
      refetch();
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Error deleting Question:", error);
      toast.error("Failed to delete Question");
    }
  };

  const handleViewDetails = (questions: QuestionsData) => {
    setDetailQuestion(questions);
  };

  const handleCloseDetails = () => {
    setDetailQuestion(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Subject Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="h-10 p-2.5 ">Class Name</TableHead>
            <TableHead className="h-10 p-2.5 ">Subject Name</TableHead>
            <TableHead className="h-10 p-2.5 ">Question Type</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Question</TableHead>
            <TableHead className="h-10 p-2.5 text-center">T. Marks</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Status</TableHead>
            <TableHead className="h-10 p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item) => {
            return (
              <TableRow
                key={item.questionBankId}
                className="hover:bg-default-200"
                data-state={
                  selectedRows.includes(item.questionBankId!) && "selected"
                }
              >
                <TableCell className="p-2.5 ">{item.className}</TableCell>
                <TableCell className="p-2.5 ">{item.subjectName}</TableCell>
                <TableCell className="p-2.5 ">{item.questionType}</TableCell>
                <TableCell className="p-2.5 w-[20rem] text-center">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleViewDetails(item)} // Show detailed view
                  >
                    <Icon icon="heroicons:eye" className=" h-4 w-4" />
                  </Button>
                  <p style={{ fontSize: "10px" }}>View Question</p>
                </TableCell>
                <TableCell className="p-2.5 text-center">
                  {item.marks}
                </TableCell>
                <TableCell className="p-2.5 text-center">
                  <Badge
                    variant="outline"
                    color={item.isActive ? "success" : "destructive"}
                    className="capitalize "
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className=" flex justify-center">
                  <div className="flex gap-3">
                    <EditQuestions question={[item]} refetch={refetch} />

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      color="secondary"
                      onClick={() =>
                        handleDeleteConfirmation(item.questionBankId!)
                      }
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {/* )} */}
        </TableBody>
      </Table>
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

      <Dialog open={!!detailQuestion} onOpenChange={handleCloseDetails}>
        <DialogContent className="max-w-screen-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              Question Details
            </DialogTitle>
            <DialogClose onClick={handleCloseDetails} />
          </DialogHeader>

          {detailQuestion && (
            <ReactQuill
              value={detailQuestion.questions}
              readOnly={true}
              modules={{
                toolbar: false,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {questionToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(questionToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default QuestionsTable;
