"use client"

import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumbs'
import React, { useEffect, useState } from 'react'
import SponsorshipListTable from './sponsorship-list-table'
import { SponsorData, useFetchSponsorsQuery } from '@/services/apis/sponsorService'
import { SponsorshipData, SponsorshipDataDetails, useFetchSponsorshipDetailQuery, useFetchSponsorshipsQuery } from '@/services/apis/sponsorshipService'
import AddSponsorshipForm from './add-sponsorship'

const Page = () => {

  const { data: sponsorData, isLoading:sponsorLoading, error:sponsorError, refetch } = useFetchSponsorsQuery();
  const {data: sponsershipData, isLoading, refetch:sponsorshipRefetch} = useFetchSponsorshipsQuery();
  const {data: sponsorshipDetailData, isLoading:sponsorshipLoading,error:sponsorshipError } = useFetchSponsorshipDetailQuery();
  const sponsor = sponsorData?.data as SponsorData[];
  const sponsorship = sponsershipData?.data as SponsorshipData[];
  const sponsorshipDetail = sponsorshipDetailData?.data as SponsorshipDataDetails[];
  
  const handleRefetch = () => {
    refetch();
    sponsorshipRefetch();
  }


  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Administration</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Sponsorship</BreadcrumbItem>
      </Breadcrumbs>
      <AddSponsorshipForm sponsorship={sponsorship} refetch={handleRefetch} sponsor={sponsor}  sponsorshipDetail={sponsorshipDetail}/>
        <SponsorshipListTable sponsorship={sponsorship} refetch={handleRefetch} sponsor={sponsor} sponsorshipDetail={sponsorshipDetail}/>
        
        </div>
    

  )
}

export default Page
