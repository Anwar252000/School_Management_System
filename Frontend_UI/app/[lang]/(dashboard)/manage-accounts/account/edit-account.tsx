"use client";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
import { ParentAccountData, useFetchParentAccountsQuery, useUpdateParentAccountMutation } from "@/services/apis/parentAccountService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountGroupData, useFetchAccountGroupsQuery } from "@/services/apis/accountGroupService";
import { AccountData, useUpdateAccountMutation } from "@/services/apis/accountService";

// Define Zod schema
const accountSchema = z.object({
  accountId: z.coerce.number().min(1, "Account Id is required"),
  parentAccountId: z.coerce.number().min(1, ("Parent Account is required")),
  accountCode: z.string().max(5).nonempty("Account Code is required"),
  accountName: z.string().nonempty("Account Name is required"),
  // isSubAccount: z.boolean().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountListTableProps {
  accountData: AccountData[];
}
const EditAccount: React.FC<AccountListTableProps> = ({
  accountData,
}) => {
  const [updateAccount] = useUpdateAccountMutation();
  const { data: parentAccountData } = useFetchParentAccountsQuery();
  const parentAccounts = parentAccountData?.data as ParentAccountData[];
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const { accountId, parentAccountId, accountCode, accountName } = accountData[0];

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      accountId,
      parentAccountId,
      accountCode,
      accountName,
      // isSubAccount,
    },
  });

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        parentAccountId: parentAccountId,
        createdBy: loggedUser?.userId
      };
      const response = await updateAccount(formData);
      if (response.data?.success) {
        toast.success(`Account ${formData.accountName} Updated successfully!`);
        reset();
      } else {
        toast.error("Failed to update the Controlling Account");
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
          <SheetTitle>Edit Controlling Account</SheetTitle>
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
                    placeholder="Account Code"
                    {...register("accountCode")}
                  />
                  {errors.accountCode && (
                    <p className="text-destructive">{errors.accountCode.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Account Name"
                    {...register("accountName")}
                  />
                  {errors.accountName && (
                    <p className="text-destructive">{errors.accountName.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <Select
                    defaultValue={parentAccountId ? parentAccountId.toString() : ""}
                    onValueChange={(value) =>
                      setValue("parentAccountId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentAccounts?.map((cd) => (
                        <SelectItem
                          key={cd.parentAccountId}
                          value={cd.parentAccountId?.toString() || ""}
                        >
                          {cd.parentAccountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.parentAccountId && (<p className="text-destructive">{errors.parentAccountId.message}
                    </p>
                  )}
                </div>

                {/* <Controller
                  control={control}
                  name="isSubAccount"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value || isSubAccount}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-5 h-5 ms-3 mb-2 border border-gray-500"
                    />
                  )}
                /> */}
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
export default EditAccount;
