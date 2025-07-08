"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
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
import EditExamPaper from "./edit-exampaper";
import { QuestionsData } from "@/services/apis/qBankService";
import { ExamPaperData, useDeleteExamPaperMutation } from "@/services/apis/examPaperService";
import { useFetchExamPaperPDFQuery } from "@/services/apis/examPaperPDFService";

interface QuestionProps{
  questionBank: QuestionsData[];
  refetch: () => void;
  examPaper: ExamPaperData[];
}

const ExamPaperTable: React.FC<QuestionProps> = ({ questionBank, refetch, examPaper }) => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const {data: examPaperPDFBlob, isLoading: isLoadingPDF, isError: isErrorPDF, error: ErrorPDF} = useFetchExamPaperPDFQuery(
    { classId: selectedClassId !== null ? selectedClassId : 0,subjectId: selectedSubjectId !== null ? selectedSubjectId : 0 }, { skip: !selectedClassId || !selectedSubjectId }
  );
  const [deleteExamPaper] = useDeleteExamPaperMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [examPaperToDelete, setExamPaperToDelete] = useState<{classId: number; subjectId: number} | null >(null);
  const itemsPerPage = 10;
  
  const filteredExamData = examPaper?.reduce((acc: ExamPaperData[], currentItem) => {
    const exists = acc.find(
      (item) => item.classId === currentItem.classId && item.subjectId === currentItem.subjectId
    );
  
    if (!exists) {
      acc.push(currentItem);
    }
  
    return acc;
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExamData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(currentItems?.length / itemsPerPage);

  useEffect(() => {
    if(examPaperPDFBlob)
    {
        const pdfUrl = URL.createObjectURL(examPaperPDFBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `Exam-Paper-${selectedClassId}.pdf`;
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link); 
    }
  }, [examPaperPDFBlob])

  useEffect(() => {
    if(isErrorPDF){
      toast.error(ErrorPDF as string);
    }
  }, [isErrorPDF])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCancelDelete = () => {
    setExamPaperToDelete(null);
  };

  const handleDeleteConfirmation = (params: { classId: number; subjectId: number }) => {
    setExamPaperToDelete(params);
  };
  
  const handleDelete = async (params: { classId: number; subjectId: number }) => {
    try {
      const itemsToDelete = examPaper.filter(
        (item) => item.classId === params.classId && item.subjectId === params.subjectId
      );
  
      if (itemsToDelete.length > 0) {
        for (const item of itemsToDelete) {
         if (item.examPaperId !== null)
          {
            await deleteExamPaper(item.examPaperId!);
          }; 
        }
        toast.success("ExamPaper deleted successfully");
        refetch();
      }
  
      setExamPaperToDelete(null);
    } catch (error) {
      console.error("Error deleting ExamPapers:", error);
      toast.error("Failed to delete ExamPapers");
    }
  };
  
  const handleViewDetails = async (params: { classId: number, subjectId: number }) => {
      setLoading(true);      
      setSelectedClassId(params.classId);
      setSelectedSubjectId(params.subjectId);
      setLoading(false);
  };
  
  return (
    <>
      <div className="mb-4 flex justify-between items-center mt-5">
        <Input
          type="text"
          placeholder="Search by Class Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <Table className="text-left condensed">
        <TableHeader>
          <TableRow>
          <TableHead className="h-10 p-2.5">S.No</TableHead>
            <TableHead className="h-10 p-2.5">Class Name</TableHead>
            <TableHead className="h-10 p-2.5">Subject</TableHead>
            <TableHead className="h-10 p-2.5">Term Name</TableHead>
            <TableHead className="h-10 p-2.5 ">Download ExamPaper</TableHead>
            <TableHead className="h-10 p-2.5">Status</TableHead>
            <TableHead className="h-10 p-2.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems?.map((item, index) => (
            <TableRow
              key={item.examPaperId}
              className="hover:bg-default-200"
              data-state={
                selectedRows.includes(item.examPaperId!) && "selected"
              }
            >
              <TableCell className="p-2.5">{index + 1}</TableCell>
              <TableCell className="p-2.5">{item.className}</TableCell>
              <TableCell className="p-2.5">{item.subjectName}</TableCell>
              <TableCell className="p-2.5">{item.termName}</TableCell>
              <TableCell className="p-2.5 ">
               <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleViewDetails({classId: item.classId, subjectId: item.subjectId})} 
                  >
                    <Icon icon="icons8:download" className=" h-4 w-8" />
                 </Button>
              </TableCell>
              <TableCell className="p-2.5">
                <Badge
                  variant="outline"
                  color={item.isActive ? "success" : "destructive"}
                  className="capitalize"
                >
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5 flex justify-end">
                <div className="flex gap-3">
                  <EditExamPaper examPaperData={examPaper} examPaperItem={[item]} questionData={questionBank} refetch={refetch}/>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation({ classId: item.classId, subjectId: item.subjectId })}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </div>
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
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
      {examPaperToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(examPaperToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default ExamPaperTable;
