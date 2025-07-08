// page.tsx
"use client";

import React, { Fragment } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";

import AddCategory from "./categories/add-category";
import AddPurchase from "./Purchases/add-purchase";
import AddBook from "./book/add-book";
import AddIssue from "./Issue/add-issue";

import {
  BookCategoryData,
  useFetchBookCategoriesQuery,
} from "@/services/apis/bookCategoryService";

import { BookData, useFetchBooksQuery } from "@/services/apis/bookService";

import { IssueData, useFetchIssuesQuery } from "@/services/apis/issueService";

import LibraryReportsCard from "./reports";
import {
  BookPurchaseData,
  useFetchBookPurchasesQuery,
} from "@/services/apis/bookPurchaseService";

const Page = () => {
  const { data: categoriesData } = useFetchBookCategoriesQuery();
  const categories = (categoriesData?.data as BookCategoryData[]) || [];

  const { data: purchasesData } = useFetchBookPurchasesQuery();
  const purchases = (purchasesData?.data as BookPurchaseData[]) || [];

  const { data: booksData } = useFetchBooksQuery();
  const books = (booksData?.data as BookData[]) || [];

  const { data: issuesData } = useFetchIssuesQuery();
  const issues = (issuesData?.data as IssueData[]) || [];

  return (
    <Fragment>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>{" Academic "}</BreadcrumbItem>
          <BreadcrumbItem>School Library</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex justify-end space-x-4 m-2">
          <AddCategory />
          <AddBook categories={categories} />
          <AddPurchase />
          <AddIssue />
        </div>
      </div>

      <div className="p-4">
        <LibraryReportsCard
          categories={categories}
          purchases={purchases}
          books={books}
          issues={issues}
        />
      </div>
    </Fragment>
  );
};

export default Page;
