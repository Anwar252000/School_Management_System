"use client"; // Make sure this is at the very top

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  TransactionData,
  useUpdateTransactionMutation,
} from "@/services/apis/transactionService";
import {
  AccountData,
  useFetchAccountsQuery,
} from "@/services/apis/accountService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";

const transactionSchema = z.object({
  voucherTypeId: z.string(),
  entryDate: z.string(),
  voucherNo: z.string(),
  messer: z.string(),
  payee: z.string(),
  transactionDetail: z.array(
    z.object({
      accountId: z.string(),
      description: z.string(),
      debitAmount: z.number(),
      creditAmount: z.number(),
    })
  ),
});

type transactionFormValues = z.infer<typeof transactionSchema>;

interface transactionProps {
  selectedTransactionDetails: TransactionData;
}

const Edittransaction: React.FC<transactionProps> = ({
  selectedTransactionDetails,
}) => {
  const [updatetransaction] = useUpdateTransactionMutation();
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const { data: accountsData } = useFetchAccountsQuery();
  const accounts = accountsData?.data as AccountData[];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<transactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transactionDetail: [
        { accountId: "", description: "", debitAmount: 0, creditAmount: 0 },
        { accountId: "", description: "", debitAmount: 0, creditAmount: 0 },
      ],
    },
  });

  useEffect(() => {
    if (selectedTransactionDetails) {
      const {
        voucherTypeId,
        entryDate,
        voucherNo,
        messer,
        payee,
        transactionDetail,
      } = selectedTransactionDetails;

      // Set form fields
      setValue(
        "voucherTypeId",
        (selectedTransactionDetails?.voucherTypeId ?? "").toString()
      );
      setValue("entryDate", entryDate?.toString() ?? "");
      setValue("voucherNo", selectedTransactionDetails?.voucherNo ?? "");
      setValue("messer", selectedTransactionDetails?.messer ?? "");
      setValue("payee", payee);
      setValue(
        "transactionDetail",
        transactionDetail.map((detail) => ({
          accountId: detail.accountId.toString(),
          description: detail.description,
          debitAmount: detail.debitAmount,
          creditAmount: detail.creditAmount,
        }))
      );

      // Set rows for UI rendering
      setRows(
        transactionDetail.map((detail) => ({
          accountId: detail.accountId.toString(),
          description: detail.description,
          debitAmount: detail.debitAmount,
          creditAmount: detail.creditAmount,
        }))
      );
    }
  }, [selectedTransactionDetails, setValue]);

  const voucherTypes = [
    { voucherTypeId: 1, name: "Payment Voucher" },
    { voucherTypeId: 2, name: "Receipt Voucher" },
    { voucherTypeId: 3, name: "Journal Voucher" },
    { voucherTypeId: 4, name: "Contra Voucher" },
    { voucherTypeId: 5, name: "Debit Voucher" },
  ];

  const [rows, setRows] = useState([
    { accountId: "", description: "", debitAmount: 0, creditAmount: 0 },
    { accountId: "", description: "", debitAmount: 0, creditAmount: 0 },
  ]);

  const handleAddRow = () => {
    const newRow = {
      accountId: "",
      description: "",
      debitAmount: 0,
      creditAmount: 0,
    };
    setRows((prev) => [...prev, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    if (index < 2) return; // Don't allow removing first two rows
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
    setValue("transactionDetail", updatedRows);
  };

  const calculateTotal = (type: "debitAmount" | "creditAmount") => {
    return rows.reduce((sum, row) => sum + (row[type] || 0), 0);
  };

  const onSubmit = async (data: transactionFormValues) => {
    const totalDebit = calculateTotal("debitAmount");
    const totalCredit = calculateTotal("creditAmount");

    if (totalDebit !== totalCredit) {
      toast.error("Debit and Credit totals must be equal!");
      return;
    }

    try {
      const payload = {
        ...data,
        createdBy: loggedUser?.userId,
        status: "Pending",
        transactionId: selectedTransactionDetails?.transactionId,
        voucherTypeId: Number(data.voucherTypeId),
        entryDate: new Date(data.entryDate),
      };
      const response = await updatetransaction(payload).unwrap();
      if (response.success) {
        toast.success("Transaction updated successfully!");
        reset();
      } else {
        toast.error(`Error: ${response.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Request Failed");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7">
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Update Transaction</SheetTitle>
        </SheetHeader>
        <div className="p-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Top Section */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div>
                <Label>Voucher Type *</Label>
                <div className="flex gap-2">
                  <Select
                    value={watch("voucherTypeId")} // <-- watch from useForm
                    onValueChange={(value) => setValue("voucherTypeId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Voucher Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {voucherTypes?.map((voucherType) => (
                        <SelectItem
                          className="hover:bg-default-300"
                          key={voucherType.voucherTypeId}
                          value={voucherType.voucherTypeId?.toString() ?? ""}
                        >
                          {voucherType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Voucher No. *</Label>
                <Input
                  placeholder="Enter Voucher No."
                  {...register("voucherNo")}
                />
              </div>
              <div>
                <Label>Transaction Date *</Label>
                <Input type="date" {...register("entryDate")} />
              </div>
              <div>
                <Label>Messer *</Label>
                <Input placeholder="Enter Messer" {...register("messer")} />
              </div>

              <div>
                <Label>Payee *</Label>
                <Input placeholder="Enter Payee" {...register("payee")} />
              </div>
            </div>

            {/* Table Section */}
            <div className="border p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">Transaction Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  color="secondary"
                  type="button"
                  onClick={handleAddRow}
                >
                  + Add Row
                </Button>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center font-bold border-b pb-2 text-center">
                <div className="col-span-3">Account</div>
                <div className="col-span-4">Particular</div>
                <div className="col-span-2">Amount (Dr.)</div>
                <div className="col-span-2">Amount (Cr.)</div>
                <div className="col-span-1">Action</div>
              </div>

              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center mt-2"
                >
                  <div className="col-span-3">
                    <Select
                      value={row.accountId?.toString() ?? ""}
                      onValueChange={(value) => {
                        const updated = [...rows];
                        updated[index].accountId = parseInt(value).toString();
                        setRows(updated);
                        setValue("transactionDetail", updated);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts?.map((account) => (
                          <SelectItem
                            className="hover:bg-default-300"
                            key={account.accountId}
                            value={account.accountId?.toString() ?? ""}
                          >
                            {account.accountName} ({account.accountCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4">
                    <Input
                      value={row.description}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[index].description = e.target.value;
                        setRows(updated);
                        setValue("transactionDetail", updated);
                      }}
                      placeholder="Enter Particular"
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={row.debitAmount}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[index].debitAmount =
                          parseFloat(e.target.value) || 0;
                        if (updated[index].debitAmount > 0) {
                          updated[index].creditAmount = 0;
                        }
                        setRows(updated);
                        setValue("transactionDetail", updated);
                      }}
                      placeholder="Debit"
                      disabled={row.creditAmount > 0}
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={row.creditAmount}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[index].creditAmount =
                          parseFloat(e.target.value) || 0;
                        if (updated[index].creditAmount > 0) {
                          updated[index].debitAmount = 0;
                        }
                        setRows(updated);
                        setValue("transactionDetail", updated);
                      }}
                      placeholder="Credit"
                      disabled={row.debitAmount > 0}
                    />
                  </div>

                  <div className="col-span-1 text-center">
                    {index >= 2 && (
                      <Button
                        type="button"
                        size="icon"
                        className="h-7 w-7"
                        color="destructive"
                        onClick={() => handleRemoveRow(index)}
                      >
                        <Icon icon="heroicons:trash" className="h-4 w-6" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="grid grid-cols-12 gap-2 font-semibold mt-4 pt-2 border-t">
                <div className="col-span-7 text-right">Total Amount:</div>
                <div className="col-span-2">
                  {calculateTotal("debitAmount").toFixed(2)}
                </div>
                <div className="col-span-2">
                  {calculateTotal("creditAmount").toFixed(2)}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Edittransaction;
