"use client";
import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ClassData, useFetchClassQuery } from "@/services/apis/classService";
import {
  CampusData,
  useFetchCampusesQuery,
} from "@/services/apis/campusService";
import FeeGrid from "./fee-grid";
import FeeSummary from "./fee-summary";

function Page() {
  const {
    data,
    isLoading: classLoading,
    refetch: classRefetch,
  } = useFetchClassQuery();
  const classes = data?.data as ClassData[];
  const {
    data: campusData,
    isLoading: campusLoading,
    refetch: campusRefetch,
  } = useFetchCampusesQuery();
  const campuses = campusData?.data as CampusData[];

  const handleRefetch = () => {
    classRefetch();
  };

  return (
    <>
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>Fee Management</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">List</BreadcrumbItem>
      </Breadcrumbs>
<div className="space-y-4">
      <FeeGrid classes={classes} campuses={campuses} refetch={handleRefetch} />
</div>
      <FeeSummary />
    </>
  );
}

export default Page;
