"use client"

import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumbs';
import React, { useEffect, useState } from 'react'
// import AddPaymentForm from './add-sponsor-payments';
import PaymentListTable from './sponsor-payments-table';
import { PaymentData, useFetchSponsorPaymentsQuery } from '@/services/apis/sponsorPaymentService';
import AddPaymentForm from './add-sponsor-payments';
import {  SponsorshipData, SponsorshipDataDetails, useFetchSponsorshipDetailQuery, useFetchSponsorshipsQuery } from '@/services/apis/sponsorshipService';


const page = () => {

  const { data, isLoading, error, refetch } = useFetchSponsorPaymentsQuery();
  const payment = data?.data as PaymentData[];

  const { data: sponsorships } = useFetchSponsorshipsQuery();
  const sponsorship = sponsorships?.data as SponsorshipData[];


  const {data:sponsoeshipDetail, isLoading:sponsoeshipDetailLoading, error:sponsoeshipDetailError, 
    refetch:sponsorshipDetailRefetch} = useFetchSponsorshipDetailQuery()
const sponsorshipDetailData = sponsoeshipDetail?.data as SponsorshipDataDetails[]


  
  const handleRefetch = () => {
    refetch();
    sponsorshipDetailRefetch();

  }

  return (
    <>
    <Breadcrumbs>
        <BreadcrumbItem>Administration</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Sponsors Payments</BreadcrumbItem>
      </Breadcrumbs>
      <AddPaymentForm refetch={handleRefetch} sponsorships={sponsorship} />
        <PaymentListTable payment={payment} refetch={handleRefetch} sponsorships={sponsorship}  />
    </>


  )
}

export default page
