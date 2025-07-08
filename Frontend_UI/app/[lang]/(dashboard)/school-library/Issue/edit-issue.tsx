"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Checkbox import removed since it's not used anymore
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  IssueData,
  useUpdateIssueMutation,
} from "@/services/apis/issueService"; // Update with correct path
import { SearchableSelect } from "@/components/ui/searchable-select";
import { BookData, useFetchBooksQuery } from "@/services/apis/bookService";

// Validation schema for Edit Issue form
const issueSchema = z.object({
  bookTitle: z.string().nonempty("Book title is required"),
  issuedTo: z.string().nonempty("Issued To is required"),
  issueDate: z.string().nonempty("Issue date is required"),
  advancePayment: z.coerce
    .number()
    .min(0, "Advance payment cannot be negative"),
  // Removed isActive and bookId
});

type IssueFormValues = z.infer<typeof issueSchema>;

interface EditIssueProps {
  issueData: IssueData;
}

const EditIssue: React.FC<EditIssueProps> = ({ issueData }) => {
  const [updateIssue] = useUpdateIssueMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const { data: bookDataResponse, isLoading: booksLoading } =
    useFetchBooksQuery();
  const books = (bookDataResponse?.data as BookData[]) || [];

  const { bookTitle, issuedTo, issueDate, advancePayment } = issueData;

  const formattedIssueDate =
    typeof issueDate === "string"
      ? issueDate.split("T")[0]
      : issueDate instanceof Date
      ? issueDate.toISOString().split("T")[0]
      : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      bookTitle,
      issuedTo,
      issueDate: formattedIssueDate,
      advancePayment,
    },
  });

  const onSubmit: SubmitHandler<IssueFormValues> = async (data) => {
    try {
      const formData: IssueData = {
        ...issueData,
        ...data,
        updatedBy: loggedUser?.userId,
        issueDate: data.issueDate,
      };

      const response = await updateIssue(formData).unwrap();

      if (response?.success) {
        toast.success(`Issue for "${data.bookTitle}" updated successfully!`);
        reset(data);
      } else {
        toast.error("Failed to update issue");
      }
    } catch (error) {
      toast.error("Request failed");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Issue</SheetTitle>
        </SheetHeader>

        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                {/* Removed Book ID input */}

                <div className="col-span-2 lg:col-span-1">
                  <label htmlFor="bookTitle" className="block mb-1 font-medium">
                    Book Title
                  </label>
                  <SearchableSelect
                    options={books.map((book) => ({
                      label: book.title || "",
                      value: String(book.bookId),
                    }))}
                    onValueChange={(val) =>
                      setSelectedBookId(parseInt(val) || null)
                    }
                    value={selectedBookId ? selectedBookId.toString() : ""}
                    disabled={booksLoading}
                  />
                  {errors.bookTitle && (
                    <p className="text-destructive">
                      {errors.bookTitle.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <label htmlFor="issuedTo" className="block mb-1 font-medium">
                    Issued To
                  </label>
                  <Input
                    id="issuedTo"
                    type="text"
                    placeholder="Issued To"
                    {...register("issuedTo")}
                  />
                  {errors.issuedTo && (
                    <p className="text-destructive">
                      {errors.issuedTo.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <label htmlFor="issueDate" className="block mb-1 font-medium">
                    Issue Date
                  </label>
                  <Input
                    id="issueDate"
                    type="date"
                    {...register("issueDate")}
                  />
                  {errors.issueDate && (
                    <p className="text-destructive">
                      {errors.issueDate.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <label
                    htmlFor="advancePayment"
                    className="block mb-1 font-medium"
                  >
                    Advance Payment
                  </label>
                  <Input
                    id="advancePayment"
                    type="number"
                    step="0.01"
                    placeholder="Advance Payment"
                    {...register("advancePayment")}
                  />
                  {errors.advancePayment && (
                    <p className="text-destructive">
                      {errors.advancePayment.message}
                    </p>
                  )}
                </div>

                {/* Removed isActive checkbox */}

                <div className="col-span-2">
                  <Button type="submit">Update Issue</Button>
                </div>
              </div>
            </form>
          </div>
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

export default EditIssue;
