
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ListItem from "./list-item";
import DetailsCard from "./details-card";
import { PaymentData } from "@/services/apis/sponsorPaymentService";


interface AggregatedSponsorData {
  sponsorId: number;
  sponsorName: string;
  totalAmountPaid: number;
  amountPaid: number; 
  firstName?: string;
  lastName?: string;
}

const TopContributer = () => {
  const [topSponsors, setTopSponsors] = useState<AggregatedSponsorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // // useEffect(() => {
  //   const getTopSponsors = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null); // Reset error state

  //       // const response = await fetchSponsorPayment();
  //       if (response.success) {
  //         // Filter payments made in the last three months
  //         const recentPayments = response.data.filter((payment: PaymentData) => {
  //           const paymentDate = new Date(payment.paymentDate || "");
  //           const threeMonthsAgo = new Date();
  //           threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  //           return paymentDate >= threeMonthsAgo;
  //         });

  //         // Group by sponsorId and calculate total payment using a Map
  //         const groupedSponsors = new Map<number, AggregatedSponsorData>();
  //         recentPayments.forEach((payment: PaymentData) => {
  //           const sponsor = groupedSponsors.get(payment.sponsorId) || {
  //             sponsorId: payment.sponsorId,
  //             sponsorName: payment.sponsorName || "",
  //             totalAmountPaid: 0,
  //             amountPaid: payment.amountPaid || 0,
  //             firstName: payment.firstName,
  //             lastName: payment.lastName,
  //           };
  //           sponsor.totalAmountPaid += payment.amountPaid || 0;
  //           groupedSponsors.set(payment.sponsorId, sponsor);
  //         });

  //         // Sort by totalAmountPaid in descending order and slice the top 10
  //         const sortedSponsors = Array.from(groupedSponsors.values())
  //           .sort((a, b) => b.totalAmountPaid - a.totalAmountPaid)
  //           .slice(0, 10);

  //         setTopSponsors(sortedSponsors);
  //       } else {
  //         setError("Failed to fetch sponsor payments. Please try again later.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching top sponsors:", error);
  //       setError("An error occurred while fetching data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getTopSponsors();
  // }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (topSponsors.length === 0) {
    return <div>No recent contributions found.</div>;
  }

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center gap-4 mb-0 border-none p-6">
        <CardTitle>Top Contributors</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6">
            {/* {topSponsors.slice(0, 3).map((item, index) => ( */}
              {/* // <DetailsCard key={item.sponsorId} item={mapToDetails(item)} index={index + 1} /> */}
            {/* ))} */}
          </div>
          <div className="mt-8">
            {/* {topSponsors.slice(3).map((item, index) => ( */}
              {/* <ListItem key={item.sponsorId} item={mapToDetails(item)} index={index + 4} /> */}
            {/* )
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const mapToDetails = (item: AggregatedSponsorData) => {
  const getInitial = (name: string | undefined) => name?.charAt(0).toUpperCase() || "?";

  return {
    name: item.sponsorName || `${item.firstName || "Unknown"} ${item.lastName || ""}`.trim(),
    score: Math.min(100, Math.round(item.totalAmountPaid / 1000)), // Example scoring logic
    image: {
      text: getInitial(item.sponsorName),
    },
    color: "primary", // Replace with logic to determine color, if needed
    amount: `$${item.totalAmountPaid.toLocaleString()}`,
  };
};

export default TopContributer;
