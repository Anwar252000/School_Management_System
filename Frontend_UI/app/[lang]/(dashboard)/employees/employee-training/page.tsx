"use client";

import React, { useState } from "react";
import {
  EmployeesData,
  useFetchEmployeesQuery,
} from "@/services/apis/employeeService";
import {
  EmployeeTrainingData,
  useFetchEmployeeTrainingQuery,
} from "@/services/apis/employeeTrainingService";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import AddEmployeeTraining from "./add-employee-training";
import EmployeeTrainingListTable from "./employee-training-list-table";


const Page = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: employeeData, refetch: empRefetch } = useFetchEmployeesQuery();
  const employees = (employeeData?.data as EmployeesData[]) || [];

  const { data: employeeTrainingData, refetch } =
    useFetchEmployeeTrainingQuery();
  const employeeTrainings =
    (employeeTrainingData?.data as EmployeeTrainingData[]) || [];

  const handleRefetch = () => {
    empRefetch();
    refetch();
  };


  return (
    <>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Employee Training</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Add Employee Training
        </button>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
  Employee Training
</h2>



      <EmployeeTrainingListTable
  trainings={employeeTrainings}
  refetch={handleRefetch}
/>

      {isFormOpen && (
        <AddEmployeeTraining
          refetch={handleRefetch}
          employees={employees}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
};

export default Page;
