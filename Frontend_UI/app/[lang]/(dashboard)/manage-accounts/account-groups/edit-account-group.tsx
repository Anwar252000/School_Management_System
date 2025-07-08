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
  AccountGroupData,
  useUpdateAccountGroupMutation,
} from "@/services/apis/accountGroupService";

// Define Zod schema
const accountGroupSchema = z.object({
  accountGroupCode: z.string().nonempty("Code is required"),
  accountGroupName: z.string().nonempty("Account Group Name is required"),
  normalBalance: z.string().nonempty("Account Group Name is required"),
});

type AccountGroupFormValues = z.infer<typeof accountGroupSchema>;

interface AccountGroupListTableProps {
  accountGroupData: AccountGroupData;
}
const EditAccountGroup: React.FC<AccountGroupListTableProps> = ({
  accountGroupData,
}) => {
  const [updateAccountGroup] = useUpdateAccountGroupMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const { accountGroupId, accountGroupCode, accountGroupName, normalBalance } =
    accountGroupData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountGroupFormValues>({
    resolver: zodResolver(accountGroupSchema),
    defaultValues: {
      accountGroupCode,
      accountGroupName,
      normalBalance,
    },
  });

  const onSubmit: SubmitHandler<AccountGroupFormValues> = async (data) => {
    try {
      const formData = {
        ...data,
        accountGroupId: accountGroupId,
      };
      const response = await updateAccountGroup(formData);
      if (response.data?.success) {
        toast.success(
          `${formData.accountGroupName} Account Group Updated successfully!`
        );
        reset();
      } else {
        toast.error("Failed to update the Account Group");
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
          <SheetTitle>Edit Account Group</SheetTitle>
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
                    placeholder="Account Group Code"
                    {...register("accountGroupCode")}
                  />
                  {errors.accountGroupCode && (
                    <p className="text-destructive">
                      {errors.accountGroupCode.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Account Group Name"
                    {...register("accountGroupName")}
                  />
                  {errors.accountGroupName && (
                    <p className="text-destructive">
                      {errors.accountGroupName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Normal Balance"
                    {...register("normalBalance")}
                  />
                  {errors.normalBalance && (
                    <p className="text-destructive">
                      {errors.normalBalance.message}
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
export default EditAccountGroup;
