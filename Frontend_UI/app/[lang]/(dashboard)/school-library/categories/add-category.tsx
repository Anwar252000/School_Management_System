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

import {
  BookCategoryData,
  useAddBookCategoryMutation,
} from "@/services/apis/bookCategoryService";

import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

// Zod schema for validation
const categorySchema = z.object({
  categoryName: z.string().nonempty("Category Name is required"),
  description: z.string().nonempty("Description is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddCategory = () => {
  const [addCategory] = useAddBookCategoryMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    const formData = {
      ...data,
      createdBy: loggedUser?.userId,
    };
    try {
      const response = await addCategory(formData as BookCategoryData).unwrap();
      if (response.success) {
        toast.success(`Category ${data.categoryName} added successfully!`);
        reset();
      } else {
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("Request Failed");
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
        <Button>
          <Icon icon="mdi:book-plus" className="w-6 h-6 mr-2" />
          Add Category
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Category</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form
              onSubmit={handleSubmit(onSubmit, handleError)}
              className="mt-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="categoryName"
                    className="block mb-1 font-medium"
                  >
                    Category Name
                  </label>
                  <Input
                    id="categoryName"
                    type="text"
                    placeholder="Category Name"
                    {...register("categoryName")}
                  />
                  {errors.categoryName && (
                    <p className="text-destructive mt-1">
                      {errors.categoryName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-1 font-medium"
                  >
                    Description
                  </label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Description"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-destructive mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Button type="submit" className="w-full">
                    Submit Form
                  </Button>
                </div>
              </div>
            </form>
          </div>
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

export default AddCategory;
