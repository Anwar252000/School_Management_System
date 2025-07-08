"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BookListTable from "./book-table"; // Your book list table component
import { BookData } from "@/services/apis/bookService"; // Adjust import for your book type

interface ViewBookProps {
  selectedBooks: BookData[] | null;
}

const ViewBook: React.FC<ViewBookProps> = ({ selectedBooks }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-transparent text-xs hover:text-default-800 px-1"
        >
          View Books
        </Button>
      </SheetTrigger>

      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Library Books</SheetTitle>
        </SheetHeader>

        <div className="py-6">
          <BookListTable books={selectedBooks ?? []} />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewBook;
