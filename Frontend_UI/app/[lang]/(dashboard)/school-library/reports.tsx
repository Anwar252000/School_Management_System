// reports.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";

import { BookCategoryData } from "@/services/apis/bookCategoryService";
import { BookData } from "@/services/apis/bookService";
import { IssueData } from "@/services/apis/issueService";

import ViewCategories from "./categories/view-categories";
import ViewBook from "./book/view-book";
import ViewIssue from "./Issue/view-issue";
import ViewPurchase from "./Purchases/view-purchase";
import { BookPurchaseData } from "@/services/apis/bookPurchaseService";

interface ReportsCardProps {
  categories: BookCategoryData[];
  purchases: BookPurchaseData[];
  books: BookData[];
  issues: IssueData[];
}

const ReportsCard: React.FC<ReportsCardProps> = ({
  categories,
  purchases,
  books,
  issues,
}) => {
  const categoriesCount = categories?.length ?? 0;
  const purchasesCount = purchases?.length ?? 0;
  const booksCount = books?.length ?? 0;
  const issuesCount = issues?.length ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
      {/* Categories Card */}
      <Card className="rounded-lg p-6 flex flex-col items-center min-w-[250px]">
        <div>
          <span className="h-12 w-12 rounded-full flex justify-center items-center bg-destructive/10">
            <Icon
              icon="heroicons:rectangle-stack-solid"
              className="w-6 h-6 text-info"
            />
          </span>
        </div>
        <div className="mt-4 text-center">
          <div className="text-base font-medium text-default-600">
            No. of Categories
          </div>
          <div className="text-3xl font-semibold text-destructive mt-1">
            {categoriesCount}
          </div>
          <ViewCategories selectedCategory={categories} />
        </div>
      </Card>

      {/* Books Card */}
      <Card className="rounded-lg p-6 flex flex-col items-center min-w-[250px]">
        <div>
          <span className="h-12 w-12 rounded-full flex justify-center items-center bg-destructive/10">
            <Icon
              icon="mdi:book-open-page-variant"
              className="w-6 h-6 text-info"
            />
          </span>
        </div>
        <div className="mt-4 text-center">
          <div className="text-base font-medium text-default-600">
            No. of Books
          </div>
          <div className="text-3xl font-semibold text-destructive mt-1">
            {booksCount}
          </div>
          <ViewBook selectedBooks={books} />
        </div>
      </Card>

      {/* Purchases Card */}
      <Card className="rounded-lg p-6 flex flex-col items-center min-w-[250px]">
        <div>
          <span className="h-12 w-12 rounded-full flex justify-center items-center bg-destructive/10">
            <Icon icon="heroicons:shopping-bag" className="w-6 h-6 text-info" />
          </span>
        </div>
        <div className="mt-4 text-center">
          <div className="text-base font-medium text-default-600">
            No. of Purchases
          </div>
          <div className="text-3xl font-semibold text-destructive mt-1">
            {purchasesCount}
          </div>
          <ViewPurchase selectedPurchase={purchases} />
        </div>
      </Card>

      {/* Issues Card */}
      <Card className="rounded-lg p-6 flex flex-col items-center min-w-[250px]">
        <div>
          <span className="h-12 w-12 rounded-full flex justify-center items-center bg-destructive/10">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-6 h-6 text-info"
            />
          </span>
        </div>
        <div className="mt-4 text-center">
          <div className="text-base font-medium text-default-600">
            No. of Issues
          </div>
          <div className="text-3xl font-semibold text-destructive mt-1">
            {issuesCount}
          </div>
          <ViewIssue selectedIssues={issues} />
        </div>
      </Card>
    </div>
  );
};

export default ReportsCard;
