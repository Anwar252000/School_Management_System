"use client";

import React, { useState } from "react";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  DailyExpenseData,
  useAddDailyExpenseMutation,
} from "@/services/apis/dailyExpenseService";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ExpenseCategoryData } from "@/services/apis/expenseCategoryService";

interface AddDailyExpenseProps {
  refetch: () => void;
  categories: ExpenseCategoryData[];
  items?: string[];
}

const AddDailyExpense: React.FC<AddDailyExpenseProps> = ({
  refetch,
  categories,
  items = [],
}) => {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amountType, setAmountType] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DailyExpenseData>();

  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [addExpense] = useAddDailyExpenseMutation();

  const onSubmit: SubmitHandler<DailyExpenseData> = async (data) => {
    if (!amountType) {
      toast.error("Please select an amount type.");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    const totalAmount = Number(data.amount) * Number(data.quantity);

    try {
      const payload: DailyExpenseData = {
        ...data,
        amountType,
        totalAmount,
        expenseCategoryId: categoryId,
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: loggedUser?.userId ?? 0,
      };

      const response = await addExpense(payload);

      if (response.data?.success) {
        toast.success("Expense added successfully!");
        reset();
        setAmountType("");
        setCategoryId(null);
        refetch();
      } else {
        toast.error(response.data?.message || "Error while adding expense");
      }
    } catch (error) {
      console.error("Expense submission error:", error);
      toast.error("Failed to submit expense");
    }
  };

  return (
    <Sheet>
      <div className="flex justify-end mb-4">
        <SheetTrigger asChild>
          <Button>
            <Icon icon="mdi:plus-circle" className="w-6 h-6 mr-2" />
            Add Expense
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Daily Expense</SheetTitle>
        </SheetHeader>

        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5 overflow-y-auto pr-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                {/* Item Dropdown or Input */}
                <div>
                  <Label>Item</Label>
                  {items.length > 0 ? (
                    <select
                      {...register("item", { required: "Item is required" })}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select Item</option>
                      {items.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      placeholder="Item name"
                      {...register("item", { required: "Item is required" })}
                    />
                  )}
                  {errors.item && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.item.message}
                    </p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div>
                  <Label>Category</Label>
                  <SearchableSelect
                    options={categories?.map((cat) => ({
                      label: cat.categoryName,
                      value: cat.expenseCategoryId?.toString() ?? "",
                    }))}
                    onValueChange={(value) => {
                      const parsed = parseInt(value);
                      setCategoryId(!isNaN(parsed) ? parsed : null);
                      setValue("expenseCategoryId", parsed); // For validation
                    }}
                  />

                  {!categoryId && <p className="text-sm mt-2"></p>}
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

                {/* Amount Type Dropdown */}
                <div>
                  <Label htmlFor="amountType">Amount Type</Label>
                  <SearchableSelect
                    value={amountType}
                    onValueChange={setAmountType}
                    options={[
                      { label: "Paid", value: "Paid" },
                      { label: "Received", value: "Received" },
                    ]}
                    // placeholder="Select amount type"
                  />
                  {!amountType && (
                    <p className="text-destructive text-sm mt-1">
                      Amount type is required
                    </p>
                  )}
                </div>

                {/* Amount Date */}
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

                {/* Submit Button */}
                <div className="col-span-2">
                  <Button type="submit">Submit Expense</Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <div className="text-sm text-muted-foreground">
              You can close this panel from here.
            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddDailyExpense;
