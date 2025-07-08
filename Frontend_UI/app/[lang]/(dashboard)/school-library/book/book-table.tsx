"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import EditBook from "./edit-book";
import ConfirmationDialog from "../../common/confirmation-dialog";

import { BookData, useDeleteBookMutation } from "@/services/apis/bookService";

interface BookTableProps {
  books: BookData[];
}

const BookTable: React.FC<BookTableProps> = ({ books }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const itemsPerPage = 8;

  const [deleteBook] = useDeleteBookMutation();

  const filteredBooks = (books ?? []).filter((book) => {
    const nameMatch = book.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const authorMatch = book.author
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return nameMatch || authorMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteConfirmation = (id: number) => setBookToDelete(id);
  const handleCancelDelete = () => setBookToDelete(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id).unwrap();
      toast.success("Book deleted successfully");
      setBookToDelete(null);
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by Book Name or Author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded m-2"
        />
      </div>

      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="p-2.5">Book Name</TableHead>
            <TableHead className="p-2.5">Author</TableHead>
            <TableHead className="p-2.5">Category</TableHead>
            <TableHead className="p-2.5">Status</TableHead>
            <TableHead className="p-2.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((book) => (
            <TableRow key={book.bookId} className="hover:bg-default-200">
              <TableCell className="p-2.5">{book.title}</TableCell>
              <TableCell className="p-2.5">{book.author}</TableCell>
              <TableCell className="p-2.5">{book.categoryName}</TableCell>
              <TableCell className="p-2.5">
                <Badge variant="outline" className="capitalize">
                  {book.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="p-2.5">
                <div className="flex justify-center gap-3">
                  <EditBook bookData={book} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                    onClick={() => handleDeleteConfirmation(book.bookId ?? 0)}
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

      {bookToDelete !== null && (
        <ConfirmationDialog
          onDelete={() => handleDelete(bookToDelete)}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default BookTable;
