"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  BookData,
  UpdateBookData,
  useUpdateBookMutation,
} from "@/services/apis/bookService"; // Updated import

const bookSchema = z.object({
  title: z.string().nonempty("Title is required"),
  author: z.string().nonempty("Author is required"),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface EditBookProps {
  bookData: BookData;
}

const EditBook: React.FC<EditBookProps> = ({ bookData }) => {
  const [updateBook] = useUpdateBookMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const { bookId, title, author, bookCategoryId, isActive } = bookData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title,
      author,
    },
  });

  const onSubmit: SubmitHandler<BookFormValues> = async (data) => {
    try {
      if (!bookId) {
        toast.error("Book ID is missing.");
        return;
      }
      if (!loggedUser?.userId) {
        toast.error("User not logged in.");
        return;
      }
      if (bookCategoryId === undefined) {
        toast.error("Book category ID is missing.");
        return;
      }
      if (isActive === undefined) {
        toast.error("Book active status is missing.");
        return;
      }

      const formData: UpdateBookData = {
        bookId,
        updatedBy: loggedUser.userId,
        title: data.title,
        author: data.author,
        bookCategoryId,
        isActive,
      };

      const response = await updateBook(formData).unwrap();

      if (response?.success) {
        toast.success(`"${formData.title}" updated successfully!`);
        reset();
      } else {
        toast.error("Failed to update book");
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
          <SheetTitle>Edit Book</SheetTitle>
        </SheetHeader>

        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 lg:col-span-1">
                  <label htmlFor="title" className="block mb-1 font-medium">
                    Book Title
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Book Title"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <label htmlFor="author" className="block mb-1 font-medium">
                    Author
                  </label>
                  <Input
                    id="author"
                    type="text"
                    placeholder="Author"
                    {...register("author")}
                  />
                  {errors.author && (
                    <p className="text-destructive">{errors.author.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Button type="submit">Update Book</Button>
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

export default EditBook;
