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
  useAddAccountGroupMutation,
} from "@/services/apis/accountGroupService";

// Define Zod schema
const accountGroupSchema = z.object({
  accountGroupCode: z
    .string()
    .max(2)
    .nonempty("Account Group Code is required"),
  accountGroupName: z.string().nonempty("Account Group Name is required"),
  normalBalance: z.enum(["D", "C"], {
    required_error: "Normal Balance is required",
  }),
});

interface Props {
  refetch: () => void;
}

type AccountGroupFormValues = z.infer<typeof accountGroupSchema>;

const AddAccountGroup: React.FC<Props> = ({ refetch }) => {
  const [addAccountGroup] = useAddAccountGroupMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountGroupFormValues>({
    resolver: zodResolver(accountGroupSchema),
  });

  const onSubmit: SubmitHandler<AccountGroupFormValues> = async (data) => {
    const formData = {
      ...data,
    };
    try {
      const response = await addAccountGroup(
        formData as AccountGroupData
      ).unwrap();
      if (response.success) {
        toast.success(
          `AccountGroup ${data.accountGroupName} added successfully!`
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
          Add Account Groups
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Account Group</SheetTitle>
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
                    placeholder="Code"
                    {...register("accountGroupCode")}
                  />
                  {errors.accountGroupCode && (
                    <p className="text-destructive">
                      {errors.accountGroupCode.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
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
                <div className="col-span-2 lg:col-span-1">
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
export default AddAccountGroup;
