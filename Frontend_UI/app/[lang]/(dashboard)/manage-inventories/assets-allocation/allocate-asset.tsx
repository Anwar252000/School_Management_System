"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
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
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";
import { useAllocateAssetMutation } from "@/services/apis/assetsAllocationService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define Zod schema
const assetAllocationSchema = z.object({
  itemId: z.number().int("Item ID is required"),
  allocatedTo: z.string().nonempty("Allocated To is required"),
  allocatedLocation: z.string().nonempty("Allocated Location is required"),
  quantity: z.number().int("Quantity is required"),
  allocationDate: z
    .string()
    .min(1, { message: "Date of Birth is required" })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
    })
    .transform((value) => format(new Date(value), "yyyy-MM-dd")),
  statusId: z.number().int("Status is required"),
});

type AssetAllocationFormValues = z.infer<typeof assetAllocationSchema>;

interface AssetAllocationProps {
  items: InventoryItemData[];
  status: InventoryStatusData[];
  refetchStocks: () => void;
}
const AllocateAsset: React.FC<AssetAllocationProps> = ({
  items,
  status,
  refetchStocks,
}) => {
  const [allocateAsset] = useAllocateAssetMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssetAllocationFormValues>({
    resolver: zodResolver(assetAllocationSchema),
  });

  const onSubmit: SubmitHandler<AssetAllocationFormValues> = async (data) => {
    const formData = {
      ...data,
      createdBy: loggedUser?.userId,
      allocatedBy: loggedUser?.userId,
    };
    try {
      const response = await allocateAsset(formData);
      if (response?.data?.success) {
        toast.success(`Asset Allocated successfully!`);
        reset();
        refetchStocks();
      } else {
        console.error("Error:", response);
        toast.error(
          `Error: ${response?.data?.message || "Something went wrong"}`
        );
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
              icon="heroicons:clipboard-document-check-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Allocate Asset
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
                  <Input
                    type="text"
                    placeholder="Allocated To"
                    {...register("allocatedTo")}
                  />
                  {errors.allocatedTo && (
                    <p className="text-destructive">
                      {errors.allocatedTo.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
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
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Allocated Location"
                    {...register("allocatedLocation")}
                  />
                  {errors.allocatedLocation && (
                    <p className="text-destructive">
                      {errors.allocatedLocation.message}
                    </p>
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
                      {status?.map((s) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={s.statusId}
                          value={s.statusId?.toString() ?? ""}
                        >
                          {s.statusName}
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
                  <Input type="date" {...register("allocationDate")} />
                  {errors.allocationDate && (
                    <p className="text-destructive">
                      {errors.allocationDate.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Button type="submit">Allocate</Button>
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
export default AllocateAsset;
