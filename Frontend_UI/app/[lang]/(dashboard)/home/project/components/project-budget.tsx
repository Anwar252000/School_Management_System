// "use client";

// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { useThemeStore } from "@/store";
// import { useTheme } from "next-themes";
// import { themes } from "@/config/thems";
// import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import React, { useEffect, useState } from 'react';
// import { fetchSponsorship } from "@/services/sponsorshipService";
// import { PaymentData, useFetchSponsorPaymentsQuery } from "@/services/apis/sponsorPaymentService";



// interface DataItem {
//   name: string;
//   value: number;
//   color: string;
// }

// interface ProjectBudgetProps {
//   height?: number;
// }

// const data: DataItem[] = [
//   { name: 'budget', value: 40, color: '#ff0000' },
//   { name: 'cost', value: 50, color: '#00ff00' },
// ];

// const RADIAN = Math.PI / 180;
// const cx = 160;
// const cy = 200;
// const iR = 90;
// const oR = 130;
// const value = 50;

// const ProjectBudget: React.FC<ProjectBudgetProps> = ({ height = 200 }) => {

//   const { data, isLoading, error, refetch } = useFetchSponsorPaymentsQuery();
//   const payments = data?.data as PaymentData[];

//   const { theme: config } = useThemeStore();
//   const { theme: mode } = useTheme();
//   const theme = themes.find((theme) => theme.name === config);

//   const [totalSponsorship, setTotalSponsorship] = useState(0);
//   const [remainingAmount, setRemainingAmount] = useState(0);

//   useEffect(() => {
//     const calculateAmounts = async () => {
//       try {
//         const sponsorshipResponse = await fetchSponsorship();

//         const sponsorships = sponsorshipResponse.data,

//         const sponsorshipTotal = sponsorships.reduce((acc: number, item: any) => acc + item.amount, 0);
//         const paidTotal = payments.reduce((acc: number, item: any) => acc + (item.amountPaid || 0), 0);

//         setTotalSponsorship(sponsorshipTotal);
//         setRemainingAmount(sponsorshipTotal - paidTotal);
//       } catch (error) {
//         console.error("Failed to calculate sponsorship data:", error);
//       }
//     };

//     calculateAmounts();
//   }, []);

//   return (
//     <Card>
//       <CardHeader className="flex-row justify-between items-center mb-0 border-none pt-8 pl-6">
//         <CardTitle>Project Budget</CardTitle>
//       </CardHeader>
//       <CardContent className="px-0">
//         <div className="w-[300px] mx-auto">
//           <ResponsiveContainer width="100%" height={height}>
//             <PieChart height={height}>
//               <Pie
//                 dataKey="value"
//                 startAngle={180}
//                 endAngle={0}
//                 data={payment}
//                 cx={cx}
//                 cy={cy}
//                 innerRadius={iR}
//                 outerRadius={oR}
//                 fill={`hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`}
//                 stroke="none"
//               >
//                 {payment?.map((entry, index) => (
//                   <Cell key={`project-budget-key-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//       <CardFooter className="justify-center gap-12 pt-0 mt-11">
//         <div>
//           <div className="text-sm font-medium text-default-600 mb-1.5">Total Sponsorship</div>
//           <div className="text-lg font-semibold text-default-900">${totalSponsorship}</div>
//         </div>
//         <div>
//           <div className="text-sm font-medium text-default-600 mb-1.5">Remaining Unpaid Amount</div>
//           <div className="text-lg font-semibold text-default-900">${remainingAmount}</div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ProjectBudget;
