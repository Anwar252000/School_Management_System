"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import { IssueData, useAddIssueMutation } from "@/services/apis/issueService";
import { RootState } from "@/services/reduxStore";
import { BookData, useFetchBooksQuery } from "@/services/apis/bookService";
import { SearchableSelect } from "@/components/ui/searchable-select";

// Validation schema
const issueSchema = z.object({
  issuedTo: z.string().nonempty("Issued To is required"),
  issueDate: z
    .string()
    .nonempty("Issue date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  advancePayment: z.coerce
    .number()
    .min(0, "Advance payment cannot be negative"),
});

type IssueFormValues = z.infer<typeof issueSchema>;

const AddIssue = () => {
  const [open, setOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const [addIssue] = useAddIssueMutation();
  const { data: bookDataResponse, isLoading: booksLoading } =
    useFetchBooksQuery();
  const books = (bookDataResponse?.data as BookData[]) || [];
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
  });

  const selectedBook = books.find((b) => b.bookId === selectedBookId);

  const onSubmit: SubmitHandler<IssueFormValues> = async (data) => {
    if (!selectedBookId) {
      toast.error("Please select a book.");
      return;
    }

    const formData: IssueData = {
      bookId: selectedBookId,
      bookTitle: selectedBook?.title || "",
      issuedTo: data.issuedTo,
      issueDate: data.issueDate,
      advancePayment: data.advancePayment,
      createdAt: new Date(),
      createdBy: loggedUser?.userId,
      isActive: true,
      issuedDate: new Date().toLocaleString(), // Add this line
    };

    try {
      const response = await addIssue(formData).unwrap();
      if (response.success) {
        toast.success(`Issue for "${formData.bookTitle}" added successfully!`);
        reset();
        setSelectedBookId(null);
        setOpen(false);
      } else {
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch {
      toast.error("Failed to add issue.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Icon icon="mdi:book-plus" className="w-6 h-6 mr-2" />
          Add Issue
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Add New Issue</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-5 space-y-6">
          {/* Book Select using SearchableSelect */}
          <div>
            <label className="block mb-1 font-medium">Select Book</label>
            <SearchableSelect
              options={books.map((book) => ({
                label: book.title || "",
                value: String(book.bookId),
              }))}
              onValueChange={(val) => setSelectedBookId(parseInt(val) || null)}
              value={selectedBookId ? selectedBookId.toString() : ""}
              disabled={booksLoading}
            />
            {!selectedBookId && (
              <p className="text-destructive mt-1 text-sm">
                Book selection is required
              </p>
            )}
          </div>

          {/* Issued To */}
          <div>
            <label htmlFor="issuedTo" className="block mb-1 font-medium">
              Issued To
            </label>
            <Input
              id="issuedTo"
              placeholder="Issued To"
              {...register("issuedTo")}
            />
            {errors.issuedTo && (
              <p className="text-destructive mt-1 text-sm">
                {errors.issuedTo.message}
              </p>
            )}
          </div>

          {/* Issue Date */}
          <div>
            <label htmlFor="issueDate" className="block mb-1 font-medium">
              Issue Date
            </label>
            <Input id="issueDate" type="date" {...register("issueDate")} />
            {errors.issueDate && (
              <p className="text-destructive mt-1 text-sm">
                {errors.issueDate.message}
              </p>
            )}
          </div>

          {/* Advance Payment */}
          <div>
            <label htmlFor="advancePayment" className="block mb-1 font-medium">
              Advance Payment
            </label>
            <Input
              id="advancePayment"
              type="number"
              step="0.01"
              placeholder="Advance Payment"
              {...register("advancePayment", { valueAsNumber: true })}
            />
            {errors.advancePayment && (
              <p className="text-destructive mt-1 text-sm">
                {errors.advancePayment.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" className="w-full">
              Submit Issue
            </Button>
          </div>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddIssue;
