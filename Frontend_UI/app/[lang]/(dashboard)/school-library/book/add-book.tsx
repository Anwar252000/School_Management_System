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

import { BookPurchaseData } from "@/services/apis/bookPurchaseService";
import { RootState } from "@/services/reduxStore";
import { BookCategoryData } from "@/services/apis/bookCategoryService";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { BookData, useAddBookMutation } from "@/services/apis/bookService";

// Validation Schema
const bookSchema = z.object({
  title: z.string().nonempty("Book title is required"),
  author: z.string().nonempty("Author name is required"),
  bookCategoryId: z.number().min(1, "Category is required"),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface AddBookCategoryProps {
  categories: BookCategoryData[];
}

const AddBook: React.FC<AddBookCategoryProps> = ({ categories }) => {
  const [addBook] = useAddBookMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  });

  const onSubmit: SubmitHandler<BookFormValues> = async (data) => {
    if (!selectedCategoryId) {
      toast.error("Please select a book category.");
      return;
    }

    const formData: BookData = {
      ...data,
      bookCategoryId: selectedCategoryId,
      createdBy: loggedUser?.userId,
      purchaseDate: new Date().toISOString(),
      isActive: true,
    };

    try {
      const response = await addBook(formData).unwrap();
      if (response.success) {
        toast.success(`Book "${data.title}" added successfully!`);
        reset();
        setSelectedCategoryId(null);
      } else {
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch {
      toast.error("Failed to add book.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Icon icon="mdi:book-open-page-variant" className="w-6 h-6 mr-2" />
          Add Book
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Book</SheetTitle>
        </SheetHeader>

        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Book Title */}
              <div className="col-span-2 lg:col-span-1">
                <label htmlFor="bookTitle" className="block mb-1 font-medium">
                  Book Title
                </label>
                <Input
                  id="bookTitle"
                  placeholder="Book Title"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Author Name */}
              <div className="col-span-2 lg:col-span-1">
                <label htmlFor="author" className="block mb-1 font-medium">
                  Author Name
                </label>
                <Input
                  id="author"
                  placeholder="Author Name"
                  {...register("author")}
                />
                {errors.author && (
                  <p className="text-destructive">{errors.author.message}</p>
                )}
              </div>

              {/* Category Dropdown using SearchableSelect */}
              <div className="col-span-2">
                <label
                  htmlFor="bookCategoryId"
                  className="block mb-1 font-medium"
                >
                  Category
                </label>
                <SearchableSelect
                  options={categories?.map((cat) => ({
                    label: cat.categoryName ?? "", // provide a default value if categoryName is undefined
                    value: cat.bookCategoryId?.toString() ?? "",
                  }))}
                  onValueChange={(value) => {
                    const parsed = parseInt(value);
                    setSelectedCategoryId(!isNaN(parsed) ? parsed : null);
                    setValue("bookCategoryId", parsed); // For validation
                  }}
                />
                {!selectedCategoryId && (
                  <p className="text-destructive">Category is required</p>
                )}
              </div>

              <div className="col-span-2">
                <Button type="submit" className="w-full">
                  Submit Form
                </Button>
              </div>
            </div>
          </form>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddBook;
