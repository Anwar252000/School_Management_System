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
  InventoryItemData,
  useUpdateInventoryItemMutation,
} from "@/services/apis/inventoryItemService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryCategoryData } from "@/services/apis/inventoryCategoryService";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";

const inventoryItemSchema = z.object({
  itemName: z.string().nonempty("Item Name is required"),
  categoryId: z.number().int("Category is required"),
  description: z.string().nonempty("Description is required"),
  unitPrice: z.number().int("Unit Price is required"),
  totalQuantity: z.number().int("Quantity is required"),
  reorderLevel: z.number().optional(),
});

type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

interface ItemListTableProps {
  itemData: InventoryItemData;
  categories: InventoryCategoryData[];
}
const EditItem: React.FC<ItemListTableProps> = ({ itemData, categories }) => {
  const [updateItem] = useUpdateInventoryItemMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    itemId,
    itemName,
    categoryId,
    description,
    unitPrice,
    totalQuantity,
    reorderLevel,
  } = itemData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      itemName,
      categoryId,
      description,
      unitPrice,
      totalQuantity,
      reorderLevel,
    },
  });

  const onSubmit: SubmitHandler<InventoryItemFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        itemId: itemId,
        updatedBy: loggedUser?.userId,
      };
      const response = await updateItem(formData);
      if (response.data?.success) {
        toast.success(`${formData.itemName} Item Updated successfully!`);
        reset();
      } else {
        toast.error("Failed to update the item");
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
                  <Input
                    type="text"
                    placeholder="Item Name"
                    {...register("itemName")}
                  />
                  {errors.itemName && (
                    <p className="text-destructive">
                      {errors.itemName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
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
                <div>
                  <Select
                    defaultValue={categoryId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("categoryId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={category.categoryId}
                          value={category.categoryId?.toString() ?? ""}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-destructive">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>
                <div>
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
                  <Input
                    type="number"
                    placeholder="Total Quantity"
                    {...register("totalQuantity", { valueAsNumber: true })}
                  />
                  {errors.totalQuantity && (
                    <p className="text-destructive">
                      {errors.totalQuantity.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Reorder Level"
                    {...register("reorderLevel", { valueAsNumber: true })}
                  />
                  {errors.reorderLevel && (
                    <p className="text-destructive">
                      {errors.reorderLevel.message}
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
