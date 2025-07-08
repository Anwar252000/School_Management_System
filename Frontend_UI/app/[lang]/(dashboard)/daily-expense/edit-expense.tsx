"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DailyExpenseData,
  useUpdateDailyExpenseMutation,
} from "@/services/apis/dailyExpenseService";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import { ExpenseCategoryData } from "@/services/apis/expenseCategoryService";

interface EditDailyExpenseProps {
  expenseData: DailyExpenseData;
  refetch: () => void;
  categories: ExpenseCategoryData[];
}

const EditDailyExpense: React.FC<EditDailyExpenseProps> = ({
  expenseData,
  refetch,
  categories,
}) => {
  const [updateExpense] = useUpdateDailyExpenseMutation();
  const [categoryId, setCategoryId] = useState<number | null>(
    expenseData.expenseCategoryId ?? null
  );
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [amountType, setAmountType] = useState<string>(
    expenseData.amountType ?? ""
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DailyExpenseData>({
    defaultValues: {
      dailyExpenseId: expenseData.dailyExpenseId,
      item: expenseData.item,
      description: expenseData.description,
      quantity: expenseData.quantity,
      amount: expenseData.amount,
      amountDate: expenseData.amountDate,
    },
  });

  useEffect(() => {
    setValue("expenseCategoryId", expenseData.expenseCategoryId);
  }, [expenseData.expenseCategoryId, setValue]);

  const onSubmit: SubmitHandler<DailyExpenseData> = async (formData) => {
    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (!amountType) {
      toast.error("Please select an amount type.");
      return;
    }

    const totalAmount = Number(formData.amount) * Number(formData.quantity);

    try {
      const payload = {
        ...formData,
        createdBy: loggedUser?.userId ?? 0,
        expenseCategoryId: categoryId,
        amountType,
        totalAmount,
        dailyExpenseId: expenseData.dailyExpenseId,
        isActive: true,
        updatedAt: new Date().toISOString(),
        updatedBy: loggedUser?.userId ?? 0,
      };

      const response = await updateExpense(payload).unwrap();

      if (response.success) {
        toast.success("Expense updated successfully!");
        reset();
        refetch();
      } else {
        toast.error("Failed to update expense.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Something went wrong!");
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
          <SheetTitle>Edit Expense</SheetTitle>
        </SheetHeader>

        <div className="py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Item */}
              <div className="col-span-2">
                <Label>Item</Label>
                <Input
                  type="text"
                  placeholder="Item name"
                  {...register("item", { required: "Item is required" })}
                />
                {errors.item && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.item.message}
                  </p>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="col-span-2">
                <Label>Category</Label>
                <SearchableSelect
                  options={categories.map((cat) => ({
                    label: cat.categoryName,
                    value: cat.expenseCategoryId?.toString() ?? "",
                  }))}
                  value={categoryId?.toString() ?? ""}
                  onValueChange={(value) => {
                    const parsed = parseInt(value);
                    setCategoryId(!isNaN(parsed) ? parsed : null);
                    setValue("expenseCategoryId", parsed);
                  }}
                />
              </div>

              {/* Quantity */}
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  {...register("quantity", {
                    required: "Quantity is required",
                  })}
                />
                {errors.quantity && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("amount", { required: "Amount is required" })}
                />
                {errors.amount && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Amount Type */}
              <div>
                <Label>Amount Type</Label>
                <SearchableSelect
                  options={[
                    { label: "Paid", value: "Paid" },
                    { label: "Received", value: "Received" },
                  ]}
                  value={amountType}
                  onValueChange={(val) => setAmountType(val)}
                />
                {!amountType && (
                  <p className="text-destructive text-sm mt-1">
                    Amount type is required
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <Label>Amount Date</Label>
                <Input
                  type="date"
                  {...register("amountDate", {
                    required: "Date is required",
                  })}
                />
                {errors.amountDate && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.amountDate.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Write a description"
                  {...register("description")}
                />
              </div>

              {/* Submit + Close in one row */}
              <div className="col-span-2 flex justify-between items-center mt-4">
                <Button type="submit">Update Expense</Button>
                <SheetClose asChild>
                  <Button variant="ghost">Close</Button>
                </SheetClose>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditDailyExpense;
