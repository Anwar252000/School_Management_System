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
import { ParentAccountData, useUpdateParentAccountMutation } from "@/services/apis/parentAccountService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountGroupData, useFetchAccountGroupsQuery } from "@/services/apis/accountGroupService";

// Define Zod schema
const parentAccountSchema = z.object({
  parentAccountId: z.coerce.number().min(1, "Parent Account Id is required"),
  accountGroupId: z.coerce.number().min(1, ("Account Group is required")),
  parentAccountCode: z.string().max(3).nonempty("Parent Account Code is required"),
  parentAccountName: z.string().nonempty("Parent Account Name is required"),
});

type ParentAccountFormValues = z.infer<typeof parentAccountSchema>;

interface ParentAccountListTableProps {
  parentAccountData: ParentAccountData;
}
const EditParentAccount: React.FC<ParentAccountListTableProps> = ({
  parentAccountData,
}) => {
  const [updateParentAccount] = useUpdateParentAccountMutation();
  const { data: accountGroupData } = useFetchAccountGroupsQuery();
  const accountGroups = accountGroupData?.data as AccountGroupData[];
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const { accountGroupId, parentAccountId, parentAccountCode, parentAccountName } = parentAccountData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ParentAccountFormValues>({
    resolver: zodResolver(parentAccountSchema),
    defaultValues: {
      parentAccountCode,
      parentAccountName,
      accountGroupId,
      parentAccountId,
    },
  });

  const onSubmit: SubmitHandler<ParentAccountFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        parentAccountId: parentAccountId,
      };
      const response = await updateParentAccount(formData);
      if (response.data?.success) {
        toast.success(`${formData.parentAccountName} Parent Account Updated successfully!`);
        reset();
      } else {
        toast.error("Failed to update the Parent Account");
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
          <SheetTitle>Edit Parent Account</SheetTitle>
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
                    placeholder="Parent Account Code"
                    {...register("parentAccountCode")}
                  />
                  {errors.parentAccountCode && (
                    <p className="text-destructive">{errors.parentAccountCode.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Parent Account Name"
                    {...register("parentAccountName")}
                  />
                  {errors.parentAccountName && (
                    <p className="text-destructive">{errors.parentAccountName.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Select
                    defaultValue={accountGroupId ? accountGroupId.toString() : ""} // Default value based on studentData
                    onValueChange={(value) =>
                      setValue("accountGroupId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountGroups?.map((cd) => (
                        <SelectItem
                          key={cd.accountGroupId}
                          value={cd.accountGroupId?.toString() || ""}
                        >
                          {cd.accountGroupName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.accountGroupId && (
                    <p className="text-destructive">
                      {errors.accountGroupId.message}
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
export default EditParentAccount;
