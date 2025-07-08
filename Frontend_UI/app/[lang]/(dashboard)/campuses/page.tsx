"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import ReportsCard from "./reports";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddDepartment from "./add-department";
import { useState } from "react";
import AddCampus from "./add-campus";
import EditCampus from "./edit-campus";
import { toast } from "sonner";
import ConfirmationDialog from "../common/confirmation-dialog";
import { CampusData, useDeleteCampusMutation, useFetchCampusesQuery } from "@/services/apis/campusService";
import { DepartmentData, useFetchDepartmentsQuery } from "@/services/apis/departmentService";

const Campus = () => {
  const {data: campus, isLoading, isError, refetch: campusRefetch} = useFetchCampusesQuery();
  const campusData = campus?.data as CampusData[];
  const {data: department, isLoading: isDepartmentLoading, isError: isDepartmentError, refetch: departmentRefetch} = useFetchDepartmentsQuery();
  const departmentData = department?.data as DepartmentData[];
  const [deleteCampus] = useDeleteCampusMutation();
  const [campusToDelete, setCampusToDelete] = useState<number | null>(null);

  const handleDeleteConfirmation = (id: number) => {
    setCampusToDelete(id);
  };

  const handleCancelDelete = () => {
    setCampusToDelete(null);
  };

  const handleRefetch = () => {
    campusRefetch();
    departmentRefetch();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCampus(id);
      toast.success("Campus deleted successfully");
      handleRefetch();
      setCampusToDelete(null); // Close dialog after successful deletion
    } catch (error) {
      console.error("Error deleting Campus:", error);
      toast.error("Failed to delete Campus");
    }
  };

  return (
    <>
    <div aria-hidden="true">
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Campus</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end space-x-4">
          <AddCampus refetch={handleRefetch}/>
          <AddDepartment campuses={campusData} refetch={handleRefetch}/>
        </div>
      </div>
  
      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-md divide-y mt-5"
        // defaultValue={`item-${campuses[0]?.campusId}`}
        defaultValue={`item-1`}
      >
        {campusData?.map((campus, index) => (
          <AccordionItem
            key={campus.campusId}
            value={`item-${campus.campusId}`} // This value should match defaultValue
            className="shadow-none rounded-none"
          >
            <AccordionTrigger>
              Campus: {index + 1} - {campus.campusName}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row-reverse">
                {campus.campusId !== undefined && (
                  <EditCampus campus={campus} refetch={handleRefetch}/>
                )}
                <Button
                    // size="icon"
                    // variant="outline"
                    className="mr-2"
                    // color="secondary"
                    onClick={() => handleDeleteConfirmation(campus.campusId!)}
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
              </div>
              <div className="col-span-12 md:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                  <ReportsCard campus={campus} refetch={handleRefetch}/>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    {campusToDelete !== null && (
      <ConfirmationDialog
        onDelete={() => handleDelete(campusToDelete)}
        onCancel={handleCancelDelete}
      />
    )}
    </>
  );
};

export default Campus;
