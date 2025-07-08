"use client";
import React from 'react'
import AddFeedback from './add-feedback'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumbs'
import { FeedbackData, useFetchParentFeedbacksQuery } from '@/services/apis/parentFeedbackService'
import FeedbackListTable from './veiw-parent-feedback'

const page = () => {

  const {data, refetch}= useFetchParentFeedbacksQuery()
  const feedbacks = data?.data as FeedbackData[];

  const handleRefetch = () => {
    refetch()
  }
  return (
    <>
     <Breadcrumbs>
            <BreadcrumbItem>Administration</BreadcrumbItem>
            <BreadcrumbItem className="text-primary">Parent FeedBack</BreadcrumbItem>
          </Breadcrumbs>
    <div>
      <AddFeedback/>
      <FeedbackListTable feedbacks={feedbacks} refetch={handleRefetch}/>

    </div>
    </>
  )
}

export default page
