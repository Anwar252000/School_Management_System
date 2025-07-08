"use client";
import React, { useState } from "react";
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
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { RootState } from "@/services/reduxStore";
import { useSelector } from "react-redux";
import { useAddBookPurchaseMutation } from "@/services/apis/bookPurchaseService";
import { BookData, useFetchBooksQuery } from "@/services/apis/bookService";
import { SearchableSelect } from "@/components/ui/searchable-select";

// Schema with price and quantity validation
const libraryPurchaseSchema = z.object({
  purchasedBy: z.string().nonempty("Purchase by is required"),
  purchaseDate: z
    .string()
    .min(1, { message: "Purchase date is required" })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
    })
    .transform((value) => format(new Date(value), "yyyy-MM-dd")),
  quantity: z.number().int("Quantity is required"),
  price: z.number().int("Unit Price is required"),
});

type LibraryPurchaseFormValues = z.infer<typeof libraryPurchaseSchema>;

const AddPurchase: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [addPurchase] = useAddBookPurchaseMutation();

  const { data: response } = useFetchBooksQuery();
  const bookData = (response?.data as BookData[]) || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LibraryPurchaseFormValues>({
    resolver: zodResolver(libraryPurchaseSchema),
  });

  const onSubmit: SubmitHandler<LibraryPurchaseFormValues> = async (data) => {
    if (!selectedBookId) {
      toast.error("Please select a book.");
      return;
    }

    const formData = {
      ...data,
      bookId: selectedBookId,
      createdBy: loggedUser?.userId,
    };

    try {
      const response = await addPurchase(formData).unwrap();
      if (response.success) {
        toast.success(`Purchase for book added successfully!`);
        reset();
        setSelectedBookId(null);
        setOpen(false);
      } else {
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch {
      toast.error("Request failed");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Icon icon="mdi:book-plus" className="w-5 h-5 mr-2" />
          Add Library Purchase
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-[700px]">
        <SheetHeader>
          <SheetTitle>Add New Library Purchase</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit, handleError)}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Book Select */}
            <div className="col-span-2">
              <Label>Select Book</Label>
              <SearchableSelect
                options={bookData.map((bd) => ({
                  label: bd.title || "",
                  value: String(bd.bookId),
                }))}
                onValueChange={(value) =>
                  setSelectedBookId(parseInt(value) || null)
                }
              />
              {!selectedBookId && (
                <p className="text-destructive">Book selection is required</p>
              )}
            </div>

            {/* Purchase By */}
            <div className="col-span-2 lg:col-span-1">
              <Label htmlFor="purchasedBy">Purchase By</Label>
              <Input
                id="purchasedBy"
                type="text"
                {...register("purchasedBy")}
                placeholder="Enter Name"
              />
              {errors.purchasedBy && (
                <p className="text-destructive">{errors.purchasedBy.message}</p>
              )}
            </div>

            {/* Purchase Date */}
            <div className="col-span-2 lg:col-span-1">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register("purchaseDate")}
              />
              {errors.purchaseDate && (
                <p className="text-destructive">
                  {errors.purchaseDate.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="col-span-2 lg:col-span-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="Enter Price"
              />
              {errors.price && (
                <p className="text-destructive">{errors.price.message}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="col-span-2 lg:col-span-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="Enter Quantity"
              />
              {errors.quantity && (
                <p className="text-destructive">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="ghost">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddPurchase;
