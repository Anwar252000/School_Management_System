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
} from "@/components/ui/sheet"; // Adjusted service import
import {
  InventoryCategoryData,
  useAddInventoryCategoryMutation,
} from "@/services/apis/inventoryCategoryService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

// Define Zod schema
const inventoryCategorySchema = z.object({
  categoryName: z.string().nonempty("Category Name is required"),
  description: z.string().nonempty("Description is required"),
});

type InventoryCategoryFormValues = z.infer<typeof inventoryCategorySchema>;

const AddCategory = () => {
  const [addCategory] = useAddInventoryCategoryMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryCategoryFormValues>({
    resolver: zodResolver(inventoryCategorySchema),
  });

  const onSubmit: SubmitHandler<InventoryCategoryFormValues> = async (data) => {
    const formData = {
      ...data,
      createdBy: loggedUser?.userId,
    };
    try {
      const response = await addCategory(
        formData as InventoryCategoryData
      ).unwrap();
      if (response.success) {
        toast.success(`Category ${data.categoryName} added successfully!`);
        reset();
      } else {
        console.error("Error:", response);
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Request Failed:", error);
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
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:rectangle-stack-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
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
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Category Name"
                    {...register("categoryName")}
                  />
                  {errors.categoryName && (
                    <p className="text-destructive">
                      {errors.categoryName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Description"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Submit Form</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default AddCategory;
