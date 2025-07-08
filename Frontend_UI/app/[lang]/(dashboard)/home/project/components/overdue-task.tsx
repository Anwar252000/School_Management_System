// "use client";
// import { useEffect, useState } from "react";
// // import { fetchSponsorship, SponsorshipData } from "@/services/sponsorshipService";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import avatar2 from "@/public/images/avatar/avatar-6.jpg"; // Static avatar for now

// const columns = [
//   {
//     key: "sponsorName",
//     label: "Sponsor Name",
//   },
//   {
//     key: "studentNames",
//     label: "Student Names",
//   },
//   {
//     key: "startDate",
//     label: "Start Date",
//   },
// ];

// const OverdueTask = () => {
//   // const [sponsorships, setSponsorships] = useState<SponsorshipData[]>([]);
//   // const [groupedSponsorships, setGroupedSponsorships] = useState<Map<string, SponsorshipData[]>>(new Map());

//   // useEffect(() => {
//   //   const loadSponsorships = async () => {
//   //     try {
//   //       const response = await fetchSponsorship();
//   //       const sponsorshipData = response.data || [];
        
//   //       // Group sponsorships by sponsorName
//   //       const grouped = sponsorshipData.reduce(
//   //         (acc: Map<string, SponsorshipData[]>, item: SponsorshipData) => {
//   //           const sponsorKey = item.sponsorName || "N/A"; // Ensure key is always a string
//   //           if (!acc.has(sponsorKey)) {
//   //             acc.set(sponsorKey, []);
//   //           }
//   //           acc.get(sponsorKey)?.push(item);
//   //           return acc;
//   //         },
//   //         new Map()
//   //       );

//   //       setGroupedSponsorships(grouped);
//   //       setSponsorships(sponsorshipData);
   
//   //     } catch (error) {
//   //       console.error("Failed to load sponsorship data:", error);
//   //       // setError("Failed to load sponsorship data. Please try again later.");
//   //     }
//   //   };

//   //   loadSponsorships();
//   // }, []);

//   return (
//     <Card>
//       <CardHeader className="flex-row justify-between items-center mb-0">
//         <CardTitle> Sponsors </CardTitle>
//    </CardHeader>
//       <CardContent className="px-0 pb-0 overflow-x-auto">
//         <Table>
//           <TableHeader className="bg-default-200">
//             <TableRow>
//               {columns.map((column) => (
//                 <TableHead
//                   key={column.key}
//                   className="text-sm font-semibold text-default-800 last:text-right h-12"
//                 >
//                   {column.label}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {/* Render rows for each sponsor */}
//             {[...groupedSponsorships.entries()].map(([sponsorName, sponsorData], index) => (
//               <TableRow key={index} className="hover:bg-default-100">
//                 <TableCell className="flex items-center gap-2 py-1">
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src={avatar2.src} alt={sponsorName || "Sponsor"} />
//                     <AvatarFallback>CD</AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm font-medium text-default-600 py-1 whitespace-nowrap">
//                     {sponsorName || "N/A"}
//                   </span>
//                 </TableCell>
//                 <TableCell className="text-sm font-medium text-default-600 py-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[181px]">
//                   <div className="flex flex-wrap gap-2">
//                     {/* Show a Badge for each student's name */}
//                     {sponsorData.map((item, index) => (
//                       <Badge key={index} variant="outline" color="success">
//                         {/* {item.studentName || "N/A"} */}
//                       </Badge>
//                     ))}
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-sm font-medium text-default-600 py-1 whitespace-nowrap">
//                   {/* {sponsorData[0]?.startDate || ""} Show start date of the first student */}
//                 </TableCell>
//               </TableRow>
//             ))}

//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default OverdueTask;
