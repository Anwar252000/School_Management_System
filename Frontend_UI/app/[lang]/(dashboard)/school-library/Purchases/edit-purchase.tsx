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
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

import {
  BookPurchaseData,
  useUpdateBookPurchaseMutation,
} from "@/services/apis/bookPurchaseService";
import { BookCategoryData } from "@/services/apis/bookCategoryService";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { BookData, useFetchBooksQuery } from "@/services/apis/bookService";

// Zod schema for validation
const libraryPurchaseSchema = z.object({
  bookId: z.number().int("Book is required"),
  quantity: z.number().int("Quantity is required"),
  price: z.number().int("Unit Price is required"),
  purchasedBy: z.string().nonempty("Purchase by is required"),
  purchaseDate: z
    .string()
    .min(1, { message: "Purchase Date is required" })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
    })
    .transform((value) => format(new Date(value), "yyyy-MM-dd"))
    .optional(),
});

type LibraryPurchaseFormValues = z.infer<typeof libraryPurchaseSchema>;

interface EditBookPurchaseProps {
  purchaseData: BookPurchaseData;
}

const EditPurchase: React.FC<EditBookPurchaseProps> = ({ purchaseData }) => {
  const [open, setOpen] = useState(false);
  const [updatePurchase] = useUpdateBookPurchaseMutation();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const { data: response } = useFetchBooksQuery();
  const bookData = (response?.data as BookData[]) || [];
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const { bookPurchaseId, bookId, quantity, price, purchaseDate, purchasedBy } =
    purchaseData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LibraryPurchaseFormValues>({
    resolver: zodResolver(libraryPurchaseSchema),
    defaultValues: {
      bookId,
      quantity,
      price,
      purchasedBy,
      purchaseDate: purchaseDate
        ? format(new Date(purchaseDate), "yyyy-MM-dd")
        : "",
    },
  });

  const onSubmit: SubmitHandler<LibraryPurchaseFormValues> = async (data) => {
    try {
      const payload = {
        ...data,
        bookPurchaseId,
        updatedBy: loggedUser?.userId,
      };

      const response = await updatePurchase(payload);
      if (response.data?.success) {
        toast.success(` updated successfully!`);
        setOpen(false);
        reset();
      } else {
        toast.error("Failed to update the purchase.");
      }
    } catch (err) {
      toast.error("Request failed.");
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Edit Book Purchase</SheetTitle>
        </SheetHeader>

        <div
          className="flex flex-col justify-between"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="py-5">
            <hr />
            <form onSubmit={handleSubmit(onSubmit, handleError)}>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Book Title</Label>
                  <SearchableSelect
                    options={bookData.map((bd) => ({
                      label: bd.title || "",
                      value: String(bd.bookId),
                    }))}
                    onValueChange={(value) =>
                      setSelectedBookId(parseInt(value) || null)
                    }
                  />
                  {errors.bookId && (
                    <p className="text-destructive">{errors.bookId.message}</p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  {errors.quantity && (
                    <p className="text-destructive">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    placeholder=" Price"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-destructive">{errors.price.message}</p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label htmlFor="purchasedBy">Purchase By</Label>
                  <Input
                    id="purchasedBy"
                    type="text"
                    {...register("purchasedBy")}
                    placeholder="Enter Name"
                  />
                  {errors.purchasedBy && (
                    <p className="text-destructive">
                      {errors.purchasedBy.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Purchase Date</Label>
                  <Input type="date" {...register("purchaseDate")} />
                  {errors.purchaseDate && (
                    <p className="text-destructive">
                      {errors.purchaseDate.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <Button type="submit">Update Purchase</Button>
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

export default EditPurchase;
