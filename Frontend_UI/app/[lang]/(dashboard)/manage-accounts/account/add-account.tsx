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
import {
  ParentAccountData,
  useFetchParentAccountsQuery,
} from "@/services/apis/parentAccountService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccountData,
  useAddAccountMutation,
} from "@/services/apis/accountService";
import { Label } from "@/components/ui/label";

// Define Zod schema
const accountSchema = z.object({
  parentAccountId: z.coerce.number().min(1, "Parent Account is required"),
  accountCode: z.string().max(5).nonempty("Account Code is required"),
  accountName: z.string().nonempty("Account Name is required"),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface Props {
  refetch: () => void;
}

const AddAccount: React.FC<Props> = ({ refetch }) => {
  const { data: parentAccountData } = useFetchParentAccountsQuery();
  const parentAccounts = parentAccountData?.data as ParentAccountData[];
  const [AddAccount] = useAddAccountMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    // defaultValues: {
    //   isSubAccount: false, // Ensure it's a boolean by default
    // },
  });

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    const formData = {
      ...data,
      CreatedBy: loggedUser?.userId,
    };
    try {
      const response = await AddAccount(formData as AccountData).unwrap();
      if (response.success) {
        toast.success(`Account ${data.accountName} added successfully!`);
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
          Add Controlling Account
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Account</SheetTitle>
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
                    {...register("accountCode")}
                  />
                  {errors.accountCode && (
                    <p className="text-destructive">
                      {errors.accountCode.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    type="text"
                    placeholder="Account Name"
                    {...register("accountName")}
                  />
                  {errors.accountName && (
                    <p className="text-destructive">
                      {errors.accountName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1">
                  <Select
                    onValueChange={(value) =>
                      setValue("parentAccountId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Parent Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentAccounts?.map((acc) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={acc.parentAccountId}
                          value={acc.parentAccountId?.toString() ?? ""}
                        >
                          {acc.parentAccountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.parentAccountId && (
                    <p className="text-destructive">
                      {errors.parentAccountId.message}
                    </p>
                  )}
                </div>

                {/* <Controller
                  control={control}
                  name="isSubAccount"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-5 h-5 ms-3 mb-2 border border-gray-500"
                    />
                  )}
                /> */}

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
export default AddAccount;
