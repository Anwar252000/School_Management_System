// "use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import {
  SponsorshipData,
  useFetchSponsorshipsQuery,
} from "@/services/apis/sponsorshipService";
import { useAddSponsorPaymentMutation } from "@/services/apis/sponsorPaymentService";

const paymentSchema = z.object({
  sponsorshipId: z.number().nonnegative("Sponsor is required"),
  amountPaid: z
    .number()
    .positive("Amount must be greater than zero")
    .min(1, "Minimum amount is 1"),
  paymentMethod: z.string().nonempty("Payment method is required"),
});

type SponsorPaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentProps {
  refetch: () => void;
  sponsorships: SponsorshipData[];
}

const AddPaymentForm: React.FC<PaymentProps> = ({ refetch,sponsorships }) => {
 
  const sponsorship = sponsorships?.filter(
    (value, index, self) =>
      self.findIndex((item) => item.sponsorId === value.sponsorId) === index
  );

  const [addSponsorPayment] = useAddSponsorPaymentMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SponsorPaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      sponsorshipId: 0,
      amountPaid: 0,
      paymentMethod: "",
    },
  });

  const onSubmit: SubmitHandler<SponsorPaymentFormValues> = async (data) => {
    try {
      const response = await addSponsorPayment(data).unwrap();
      if (response.success) {
        toast.success("Payment added successfully!");
        reset();
        refetch();
      } else {
        toast.error(response.message || "Failed to add payment.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the payment.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex justify-end space-x-4 m-2">
          <Button>
            <span className="text-xl mr-1">
              <Icon icon="heroicons:cash" className="w-6 h-6 mr-2" />
            </span>
            Add Payment
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add New Payment</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sponsor Selection */}
            <div className="flex flex-col gap-2 col-span-1">
              <Label>Select Sponsor</Label>
              <Select
                onValueChange={(value) =>
                  setValue("sponsorshipId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sponsor" />
                </SelectTrigger>
                <SelectContent>
                  {sponsorship?.map((item) => (
                    <SelectItem
                      key={item.sponsorshipId}
                      value={item?.sponsorshipId?.toString() || ''}
                    >
                      {item.sponsorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sponsorshipId && (
                <p className="text-destructive">{errors.sponsorshipId.message}</p>
              )}
            </div>

            {/* Amount Paid */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="amountPaid">Enter Amount Paid</Label>
              <InputGroup merged>
                <InputGroupText>
                  <Icon icon="mdi:money" />
                </InputGroupText>
                <Input
                  type="number"
                  placeholder="Enter Amount Paid"
                  id="amountPaid"
                  {...register("amountPaid", { valueAsNumber: true })}
                />
              </InputGroup>
              {errors.amountPaid && (
                <p className="text-destructive">{errors.amountPaid.message}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                onValueChange={(value) => setValue("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-destructive">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 my-3">
            <Button type="submit">Submit Form</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddPaymentForm;
