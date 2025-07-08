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
  useUpdateBookCategoryMutation,
} from "@/services/apis/bookCategoryService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

// Zod schema for school library category form validation
const categorySchema = z.object({
  categoryName: z.string().nonempty("Category Name is required"),
  description: z.string().nonempty("Description is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface EditCategoryProps {
  categoryData: BookCategoryData;
}

const EditCategory: React.FC<EditCategoryProps> = ({ categoryData }) => {
  const [updateCategory] = useUpdateBookCategoryMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const { bookCategoryId , categoryName  } = categoryData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName,
    },
  });

  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        bookCategoryId,
        updatedBy: loggedUser?.userId,
      };
      const response = await updateCategory(formData).unwrap();
      if (response?.success) {
        toast.success(`${formData.categoryName} Category updated successfully!`);
        reset();
      } else {
        toast.error("Failed to update category");
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
          <SheetTitle>Edit Category</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Category Name"
                    {...register("categoryName")}
                  />
                  {errors.categoryName && (
                    <p className="text-destructive">{errors.categoryName.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Description"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Button type="submit">Update</Button>
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

export default EditCategory;
