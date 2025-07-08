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
  useFetchAccountGroupsQuery,
} from "@/services/apis/accountGroupService";
import {
  ParentAccountData,
  useAddParentAccountMutation,
} from "@/services/apis/parentAccountService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define Zod schema
const parentAccountSchema = z.object({
  accountGroupId: z.coerce.number().min(1, "Account Group is required"),
  parentAccountCode: z
    .string()
    .max(3)
    .nonempty("Parent Account Code is required"),
  parentAccountName: z.string().nonempty("Parent Account Name is required"),
});

type ParentAccountFormValues = z.infer<typeof parentAccountSchema>;

interface Props {
  refetch: () => void;
}

const AddParentAccount: React.FC<Props> = ({ refetch }) => {
  const { data: accountGroupData } = useFetchAccountGroupsQuery();
  const accountGroups = accountGroupData?.data as AccountGroupData[];
  const [AddParentAccount] = useAddParentAccountMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ParentAccountFormValues>({
    resolver: zodResolver(parentAccountSchema),
  });

  const onSubmit: SubmitHandler<ParentAccountFormValues> = async (data) => {
    const formData = {
      ...data,
      CreatedBy: loggedUser?.userId,
    };
    try {
      const response = await AddParentAccount(
        formData as ParentAccountData
      ).unwrap();
      if (response.success) {
        toast.success(
          `Parent Account ${data.parentAccountName} added successfully!`
        );
        reset();
        refetch();
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
              icon="heroicons:rectangle-stack-solid"
              className="w-6 h-6 mr-2"
            />
          </span>
          Add Parent Account
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Parent Account</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Account Code"
                    {...register("parentAccountCode")}
                  />
                  {errors.parentAccountCode && (
                    <p className="text-destructive">
                      {errors.parentAccountCode.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Parent Account Name"
                    {...register("parentAccountName")}
                  />
                  {errors.parentAccountName && (
                    <p className="text-destructive">
                      {errors.parentAccountName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <Select
                    onValueChange={(value) =>
                      setValue("accountGroupId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Account Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountGroups?.map((acc) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={acc.accountGroupId}
                          value={acc.accountGroupId?.toString() ?? ""}
                        >
                          {acc.accountGroupName}
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
                  <Button type="submit">Submit Form</Button>
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
export default AddParentAccount;
