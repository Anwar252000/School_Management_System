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
  InventoryStatusData,
  useUpdateInventoryStatusMutation,
} from "@/services/apis/inventoryStatusService";

// Define Zod schema
const inventoryStatusSchema = z.object({
  statusName: z.string().nonempty("Status Name is required"),
});

type InventoryStatusFormValues = z.infer<typeof inventoryStatusSchema>;

interface StatusListTableProps {
  statusData: InventoryStatusData;
}
const EditStatus: React.FC<StatusListTableProps> = ({ statusData }) => {
  const [updateStatus] = useUpdateInventoryStatusMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const { statusId, statusName } = statusData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryStatusFormValues>({
    resolver: zodResolver(inventoryStatusSchema),
    defaultValues: {
      statusName,
    },
  });

  const onSubmit: SubmitHandler<InventoryStatusFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        statusId: statusId,
        updatedBy: loggedUser?.userId,
      };
      const response = await updateStatus(formData);
      if (response.data?.success) {
        toast.success(`${formData.statusName} Updated successfully!`);
        reset();
      } else {
        toast.error("Failed to update the status");
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
          <SheetTitle>Edit Status</SheetTitle>
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
                    placeholder="Status Name"
                    {...register("statusName")}
                  />
                  {errors.statusName && (
                    <p className="text-destructive">
                      {errors.statusName.message}
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
export default EditStatus;
