"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CampusData, useFetchCampusesQuery } from "@/services/apis/campusService";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import React from "react";
import AddClassFee from "./add-class-fee";
import ClassFeeListTable from "./class-fee-table";
import { FeeCategoryData, useFetchFeeCategoriesQuery } from "@/services/apis/feeCategoryService";

const Page = () => {
  const { data: classData, isLoading: classLoading, refetch: classRefetch } = useFetchClassQuery();
  const classes = classData?.data as ClassData[] || [];

  const { data: campusData, isLoading: campusLoading, isError: campusError, refetch: campusRefetch } = useFetchCampusesQuery();
  const campuses = campusData?.data as CampusData[] || [];
const {data: feeCategory, refetch: feeCategoryRefetch} = useFetchFeeCategoriesQuery()
const feeCategoryData = feeCategory?.data as FeeCategoryData[] || []
  const handleRefetch = () => {

    classRefetch();
    campusRefetch();
    feeCategoryRefetch();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <BreadcrumbItem>Accounts</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Manage Class Fee</BreadcrumbItem>
      </Breadcrumbs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold text-gray-700">Class Fee Management</h2>
        <div className="flex space-x-4">
          <AddClassFee refetch={handleRefetch} classes={classes} campuses={campuses} feeCategory={feeCategoryData} />
        </div>
      </div>

      {/* Class Fee List */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4">
        <ClassFeeListTable campuses={campuses} classes={classes} feeCategory={feeCategoryData} refetch={handleRefetch} />
      </div>
    </div>
  );
};

export default Page;
