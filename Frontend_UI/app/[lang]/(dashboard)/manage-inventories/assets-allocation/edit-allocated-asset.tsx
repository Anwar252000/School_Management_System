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

import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryItemData } from "@/services/apis/inventoryItemService";
import { InventoryStatusData } from "@/services/apis/inventoryStatusService";
import { format } from "date-fns";
import {
  AssetAllocationData,
  useUpdateAllocatedAssetMutation,
} from "@/services/apis/assetsAllocationService";

// Define Zod schema
const assetAllocationSchema = z.object({
  allocatedTo: z.string().nonempty("Allocated To is required"),
  allocatedLocation: z.string().nonempty("Allocated Location is required"),
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
  allocatedAsset: AssetAllocationData;
  items: InventoryItemData[];
  status: InventoryStatusData[];
}
const EditAllocatedAsset: React.FC<AssetAllocationProps> = ({
  allocatedAsset,
  items,
  status,
}) => {
  const [updateAllocatedAsset] = useUpdateAllocatedAssetMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    allocatedTo,
    allocatedLocation,
    allocationDate,
    allocationId,
    itemId,
    quantity,
    statusId,
  } = allocatedAsset;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssetAllocationFormValues>({
    resolver: zodResolver(assetAllocationSchema),
    defaultValues: {
      allocatedTo,
      allocatedLocation,
      allocationDate,
      statusId,
    },
  });

  const onSubmit: SubmitHandler<AssetAllocationFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        itemId: itemId,
        quantity: quantity,
        allocationId: allocationId,
        allocatedBy: loggedUser?.userId,
        updatedBy: loggedUser?.userId,
      };
      const response = await updateAllocatedAsset(formData);
      if (response.data?.success) {
        toast.success("Allocated Asset Updated successfully!");
        reset();
      } else {
        toast.error("Failed to update the Allocated Asset");
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
                    defaultValue={statusId?.toString() ?? ""}
                    onValueChange={(value) =>
                      setValue("statusId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
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
export default EditAllocatedAsset;
