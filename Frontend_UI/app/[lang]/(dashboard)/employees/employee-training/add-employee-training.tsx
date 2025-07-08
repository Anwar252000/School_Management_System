"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { EmployeesData } from "@/services/apis/employeeService";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { EmployeeTrainingData, useAddEmployeeTrainingMutation } from "@/services/apis/employeeTrainingService";
import { Input } from "@/components/ui/input";


type AddEmployeeTrainingProps = {
  refetch: () => void;
  employees: EmployeesData[];
  onClose: () => void;
};

const AddEmployeeTraining: React.FC<AddEmployeeTrainingProps> = ({
  refetch,
  employees,
  onClose,
}) => {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const [addTraining] = useAddEmployeeTrainingMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeTrainingData>();

  const onSubmit: SubmitHandler<EmployeeTrainingData> = async (data) => {
    if (!employeeId) {
      toast.error("Please select an employee.");
      return;
    }

    try {
      const payload = {
        ...data,
        employeeId,
        createdBy: loggedUser?.userId,
      };

      const response = await addTraining(payload);

      if (response.data?.success) {
        toast.success("Training added successfully!");
        reset();
        setEmployeeId(null);
        refetch();
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to add training.");
      }
    } catch (error) {
      console.error("Training submission error:", error);
      toast.error("An error occurred while adding training.");
    }
  };

  const handleError = () => {
    toast.error("Please fill all required fields.");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
      <div className="w-full sm:max-w-md bg-white h-full p-6 shadow-lg transform transition-transform duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Employee Training</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, handleError)}>
          {/* Employee Dropdown */}
          <div className="mb-4">
            <Label>Select Employee</Label>
            <SearchableSelect
              options={employees.map((e) => ({
                label: `${e.firstName} ${e.lastName}`,
                value: e.employeeId?.toString() || "",
              }))}
              onValueChange={(value) => setEmployeeId(parseInt(value) || null)}
            />
          </div>

          {/* Training Name */}
          <div className="mb-4">
            <Label>Training Name</Label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              {...register("trainingName", { required: "Training name is required" })}
            />
            {errors.trainingName && (
              <p className="text-red-500 text-sm">{errors.trainingName.message}</p>
            )}
          </div>

          {/* Training Date */}
          <div className="mb-4">
            <Label>Date</Label>
            <input
              type="date"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              {...register("trainingDate", { required: "Training date is required" })}
            />
            {errors.trainingDate && (
              <p className="text-red-500 text-sm">{errors.trainingDate.message}</p>
            )}
          </div>

          <div className="mb-4">
            <Label>Certificate</Label>
            <Input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              {...register("certification")}
            />
          </div>

          

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeTraining;
