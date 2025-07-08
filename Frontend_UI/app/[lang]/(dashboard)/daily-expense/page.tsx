"use client";

import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DailyExpenseData, useFetchDailyExpensesQuery } from "@/services/apis/dailyExpenseService";
import AddDailyExpense from "./add-expense";
import DailyExpenseListTable from "./expense-table";
import { useFetchExpenseCategoriesQuery } from "@/services/apis/expenseCategoryService";

const Page = () => {
  // Fetch all daily expenses
  const { data: dailyExpenseData, refetch } = useFetchDailyExpensesQuery();
  const dailyExpenses = (dailyExpenseData?.data as DailyExpenseData[]) || [];

  // Fetch all categories from the same service
  const { data: categoryData, refetch: categoryRefetch } = useFetchExpenseCategoriesQuery();
  const categories = categoryData?.data || [];

  // Combined refetch handler
  const handleRefetch = () => {
    refetch();
    categoryRefetch();
  };

  return (
    <React.Fragment>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Daily Expenses</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div>
        <AddDailyExpense refetch={handleRefetch} categories={categories} />
        <DailyExpenseListTable refetch={handleRefetch} expenses={dailyExpenses} categories={categories} />
      </div>
    </React.Fragment>
  );
};

export default Page;
