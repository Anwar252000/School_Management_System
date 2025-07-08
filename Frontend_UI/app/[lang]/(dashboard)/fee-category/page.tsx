"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import ReportsCard from "./reports";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FeeCategoryData, useFetchFeeCategoriesQuery } from "@/services/apis/feeCategoryService";
import AddFeeCategory from "./add-fee-category";

const FeeCategory = () => {
  const { data, isLoading, refetch } = useFetchFeeCategoriesQuery();
  const feeCategoriesData = data?.data as FeeCategoryData[];

  const handleRefetch = () => {
    refetch();
  };

  return (
    <div>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Fee Categories</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end space-x-4">
          <AddFeeCategory refetch={handleRefetch} />
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5"
        defaultValue={`item-1`}
      >
        <AccordionItem
          value="item-1"
          className=" shadow-none rounded-none open"
        >
          <AccordionTrigger>Fee Categories Details</AccordionTrigger>
          <AccordionContent>
            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                <ReportsCard
                  feeCategories = {feeCategoriesData} 
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FeeCategory;
