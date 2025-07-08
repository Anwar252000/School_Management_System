"use client";
import React, { useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { format } from "date-fns";
import { InventoryPurchaseData, useUpdateInventoryPurchaseMutation } from "@/services/apis/inventoryPurchaseService";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define Zod schema
const inventoryPurchaseSchema = z.object({
  purchaseId: z.number().int().optional(),
  itemId: z.number().int("Item is Required"),
  supplierName: z.string().nonempty("Supplier Name is required"),
  quantity: z.number().int("Quantity is required"),
  unitPrice: z.number().int("Unit Price is required"),
  purchaseDate: z
      .string()
      .min(1, { message: "Purchase Date is required" })
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Invalid date format",
      })
      .transform((value) => format(new Date(value), "yyyy-MM-dd"))
      .optional(),
  invoiceNumber: z.string().nonempty().optional(),
  remarks: z.string().nonempty().optional(),
});

type InventoryPurchaseFormValues = z.infer<typeof inventoryPurchaseSchema>;

interface PurchaseProps {
  items: InventoryItemData[];
  purchaseData: InventoryPurchaseData;
}
const EditPurchase: React.FC<PurchaseProps> = ({ items, purchaseData }) => {
  const [updatePurchase] = useUpdateInventoryPurchaseMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [open, setOpen] = useState(false);

  const { itemId, purchaseId, supplierName, quantity, unitPrice, purchaseDate, invoiceNumber, remarks } = purchaseData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InventoryPurchaseFormValues>({
    resolver: zodResolver(inventoryPurchaseSchema),
    defaultValues: {
      purchaseId: purchaseId ?? undefined,  
      itemId,
      supplierName,
      quantity,
      unitPrice,
      purchaseDate: purchaseDate ? format(new Date(purchaseDate), "yyyy-MM-dd") : "",
      invoiceNumber,
      remarks
    },
  });

  const onSubmit: SubmitHandler<InventoryPurchaseFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        purchaseId: purchaseId,
        updatedBy: loggedUser?.userId,
      };
      const response = await updatePurchase(formData);
      if (response.data?.success) {
        toast.success(
          `${formData.supplierName} updated successfully!`
        );
        setOpen(false);
        reset();
      } else {
        toast.error("Failed to update the purchase.");
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setOpen(true)}>
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Purchase</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
            <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="col-span-2 lg:col-span-1">
                <Label>Supplier Name</Label>
                  <Input
                    type="text"
                    placeholder="Supplier Name"
                    {...register("supplierName")}
                  />
                  {errors.supplierName && (
                    <p className="text-destructive">
                      {errors.supplierName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                <Label>Item Name</Label>
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
                <div className="col-span-2 lg:col-span-1">
                <Label>Quantity</Label>
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
                <div className="col-span-2 lg:col-span-1">
                <Label>Unit Price</Label>
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    {...register("unitPrice", { valueAsNumber: true })}
                  />
                  {errors.unitPrice && (
                    <p className="text-destructive">
                      {errors.unitPrice.message}
                    </p>
                  )}
                </div>
                <div>
                <Label>Date of Purchase</Label>
                  <Input 
                  type="date" 
                  defaultValue={purchaseDate?.toString() ?? ""}
                  {...register("purchaseDate")} />
                  {errors.purchaseDate && (
                    <p className="text-destructive">
                      {errors.purchaseDate.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                <Label>Invoice Number</Label>
                  <Input
                    type="text"
                    placeholder="Invoice Number"
                    {...register("invoiceNumber")}
                  />
                  {errors.invoiceNumber && (
                    <p className="text-destructive">
                      {errors.invoiceNumber.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                <Label>Remarks</Label>
                  <Input
                    type="text"
                    placeholder="Remarks"
                    {...register("remarks")}
                  />
                  {errors.remarks && (
                    <p className="text-destructive">
                      {errors.remarks.message}
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
          <SheetClose asChild>
            <Button variant="ghost">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default EditPurchase;
