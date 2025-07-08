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
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  InventoryStockData,
  useUpdateInventoryStockMutation,
} from "@/services/apis/inventoryStockService";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

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

interface StockListTableProps {
  stockData: InventoryStockData;
  items: InventoryItemData[];
  status: InventoryStatusData[];
}
const EditItem: React.FC<StockListTableProps> = ({
  stockData,
  items,
  status,
}) => {
  const [updateItem] = useUpdateInventoryStockMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    itemId,
    quantity,
    statusId,
    transactionType,
    transactionDate,
    remarks,
  } = stockData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InventoryStockFormValues>({
    resolver: zodResolver(inventoryStockSchema),
    defaultValues: {
      itemId,
      quantity,
      statusId,
      transactionType,
      transactionDate,
      remarks,
    },
  });

  const onSubmit: SubmitHandler<InventoryStockFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        updatedBy: loggedUser?.userId,
      };
      const response = await updateItem(formData);
      if (response.data?.success) {
        toast.success("Stock Updated successfully!");
        reset();
      } else {
        toast.error("Failed to update the Stock");
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
          <SheetTitle>Edit Item</SheetTitle>
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
                    defaultValue={itemId?.toString() ?? ""}
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
                    defaultValue={statusId?.toString() ?? ""}
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
                <div>
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
                <div>
                  <Select
                    defaultValue={transactionType?.toString() ?? ""}
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
export default EditItem;
