"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import React from "react";
import AddTransactionForm from "./add-transaction-form";
import TransactionListTable from "./transaction-list-table";
import {
  TransactionData,
  useFetchTransactionsQuery,
} from "@/services/apis/transactionService";

const page: React.FC = () => {
  const { data: transactionData } = useFetchTransactionsQuery();
  const transactions = transactionData?.data as TransactionData[];

  return (
    <>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Accounts</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Transactions</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end space-x-4">
          <AddTransactionForm />
        </div>
      </div>
      <TransactionListTable transaction={transactions} />
    </>
  );
};

export default page;
