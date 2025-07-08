"use client";

import React from "react";
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
import CategoryListTable from "./category-table";
import { BookCategoryData } from "@/services/apis/bookCategoryService";

interface ViewCategoriesProps {
  selectedCategory: BookCategoryData[] | null;
}

const ViewCategories: React.FC<ViewCategoriesProps> = ({ selectedCategory }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-transparent text-xs hover:text-default-800 px-1"
        >
          View Categories
        </Button>
      </SheetTrigger>

      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>School Library Categories</SheetTitle>
        </SheetHeader>

        <div className="py-6">
          <CategoryListTable categories={selectedCategory ?? []} />
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

export default ViewCategories;
