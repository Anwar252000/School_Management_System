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
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import { useAddInventoryStockMutation } from "@/services/apis/inventoryStockService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

// Define Zod schema
const inventoryStockSchema = z.object({
  itemId: z.number().int("Item is required"),
  quantity: z.number().int("Quantity is required"),
  statusId: z.number().int("Status is required"),
  transactionType: z.string().nonempty("Transaction type is required"),
  transactionDate: z
    .string()
    .min(1, { message: "Date of Birth is required" })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
    })
    .transform((value) => format(new Date(value), "yyyy-MM-dd")),
  remarks: z.string().nonempty("Remarks is required"),
});

type InventoryStockFormValues = z.infer<typeof inventoryStockSchema>;

interface StockProps {
  items: InventoryItemData[];
  status: InventoryStatusData[];
}
const AddStock: React.FC<StockProps> = ({ items, status }) => {
  const [addStock] = useAddInventoryStockMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InventoryStockFormValues>({
    resolver: zodResolver(inventoryStockSchema),
  });

  const onSubmit: SubmitHandler<InventoryStockFormValues> = async (data) => {
    const formData = {
      ...data,
      createdBy: loggedUser?.userId,
    };
    try {
      const response = await addStock(formData).unwrap();
      if (response.success) {
        toast.success(`Stock added successfully!`);
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
              icon="heroicons-outline:archive-box"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add Stock
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Stock</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Select
                    onValueChange={(value) =>
                      setValue("itemId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items?.map((item) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={item.itemId}
                          value={item.itemId?.toString() ?? ""}
                        >
                          {item.itemName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.itemId && (
                    <p className="text-destructive">{errors.itemId.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Select
                    onValueChange={(value) =>
                      setValue("statusId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {status?.map((status) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={status.statusId}
                          value={status.statusId?.toString() ?? ""}
                        >
                          {status.statusName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.statusId && (
                    <p className="text-destructive">
                      {errors.statusId.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Remarks"
                    {...register("remarks")}
                  />
                  {errors.remarks && (
                    <p className="text-destructive">{errors.remarks.message}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  {errors.quantity && (
                    <p className="text-destructive">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <Select
                    onValueChange={(value) =>
                      setValue("transactionType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="hover:bg-default-300" value={"IN"}>
                        IN
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-default-300"
                        value={"OUT"}
                      >
                        OUT
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.transactionType && (
                    <p className="text-destructive">
                      {errors.transactionType.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input type="date" {...register("transactionDate")} />
                  {errors.transactionDate && (
                    <p className="text-destructive">
                      {errors.transactionDate.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Add</Button>
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
export default AddStock;
