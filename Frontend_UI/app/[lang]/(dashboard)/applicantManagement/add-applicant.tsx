"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ApplicantStepForm from "./applicant-step-form";

interface ApplicantProp {
  refetch: () => void;
}
const AddApplicant: React.FC<ApplicantProp> = ({ refetch }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <span className="text-xl mr-1">
            <Icon
              icon="heroicons:building-library-solid"
              className="w-6 h-6 mr-2  "
            />
          </span>
          Add Applicant
        </Button>
      </SheetTrigger>
      <SheetContent
        // className="max-w-[736px]"
        side="top"
        className="p-0  overflow-y-auto"
      >
        <SheetHeader className="p-3 border-b border-default-200">
          <SheetTitle>Applicant Registration Form</SheetTitle>
        </SheetHeader>
        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <ApplicantStepForm refetch={refetch} />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddApplicant;
