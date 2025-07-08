"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SponsorData, useFetchSponsorsQuery } from "@/services/apis/sponsorService";
import AddSponsorForm from "./add-sponsor-form";
import SponsorListTable from "./sponsor-list-table";

const Page = () => {

  const { data: sponsorData, isLoading, error, refetch } = useFetchSponsorsQuery();
  const sponsor = sponsorData?.data as SponsorData[];
  
  const handleRefetch = () => {
    refetch();
  }

  return (
    <>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Sponsor</BreadcrumbItem>
        </Breadcrumbs>
        {/* <div className="flex justify-end space-x-4 m-2"> */}
        <AddSponsorForm refetch={handleRefetch} />
        {/* </div> */}
        </div>
        <SponsorListTable sponsor={sponsor} refetch={handleRefetch} />

    </>
  );
};

export default Page;
