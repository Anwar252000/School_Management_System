"use client";

import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import AddApplicant from "./add-applicant";
import ApplicantListTable from "./veiw-applicant";
import {
  ApplicantApplicationDetail,
  useGetApplicantsQuery,
} from "@/services/apis/applicantService";
import {
  SectionData,
  useFetchSectionQuery,
} from "@/services/apis/sectionService";
import {
  ParentData,
  useFetchParentsQuery,
} from "@/services/apis/parentService";
import { useEffect } from "react";

const Applicants = () => {
  const { data: sections } = useFetchSectionQuery();
  const sectionData = (sections?.data as SectionData[]) || [];
  const {
    data: applicantsData,
    isLoading,
    isError,
    refetch,
  } = useGetApplicantsQuery();
  const applicants =
    (applicantsData?.data as ApplicantApplicationDetail[]) || [];
  // const {data: parentData } = useFetchParentsQuery();
  // const parents = (parentData?.data as ParentData[]) || [];

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (isError) {
    return <div>Error</div>; // Show error message if any
  }

  const handleRefetch = () => {
    refetch();
  };

  return (
    <div>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Academic</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Applicants</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-end space-x-4 m-2">
          <AddApplicant refetch={handleRefetch} />
        </div>
      </div>

      {/* Render ApplicantListTable directly */}
      <ApplicantListTable
        applicants={applicants}
        refetch={handleRefetch}
        sectionData={sectionData}
        // parents={parents}
      />
    </div>
  );
};

export default Applicants;
