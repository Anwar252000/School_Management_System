// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import avatar from "@/public/images/avatar/avatar-3.jpg";
// import { Icon } from "@iconify/react";
// import Image from "next/image";
// import { User, Phone, Location, Calender, CalenderCheck, Users } from "@/components/svg";
// import { Hammer, Home, Link, Mail } from "lucide-react";
// import PersonalDetails from "./settings/edit-personal-details";
// import { SponsorData, useFetchSponsorsQuery } from "@/services/apis/sponsorService";

// interface UserInfoItem {
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   value: string;
// }
// const UserMeta = () => {

//   const { data, isLoading, error, refetch } = useFetchSponsorsQuery();
//   const sponsor = data?.data as SponsorData[];

  

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading data</div>;

//   const userInfo: UserInfoItem[] = [
//     {
//       icon: User,
//       label: "Full Name",
//       value: sponsor?.sponsorName || "N/A",
//     },
//     {
//       icon: Mail,
//       label: "Email",
//       value: sponsor?.email || "N/A",
//     },
//     {
//       icon: Users,
//       label: "Gender",
//       value: sponsor?.gender || "N/A",
//     },
//     {
//       icon: Phone,
//       label: "Mobile",
//       value: sponsor?.phoneNumber || "N/A",
//     },
//     {
//       icon: Hammer,
//       label: "Occupation",
//       value: sponsor?.occupation || "N/A",
//     },
//     {
//       icon: Home,
//       label: "Address",
//       value: sponsor?.address || "N/A",
//     },
//     {
//       icon: Location,
//       label: "City",
//       value: sponsor?.city || "N/A",
//     },
//     {
//       icon: Location,
//       label: "State",
//       value: sponsor?.state || "N/A",
//     },
//     {
//       icon: Location,
//       label: "Country",
//       value: sponsor?.country || "N/A",
//     },
//     {
//       icon: Calender,
//       label: "Postal Code",
//       value: sponsor?.postalCode?.toString() || "N/A",
//     },
//   ];

//   return (
//    <>
   
//    <Card className="my-5">
    
//       <CardContent className="py-8-3 mx-8 flex flex-col items-center">

//       <CardHeader className="border-none mb-0 px-6">
//         <CardTitle className="text-xl font-semibold text-default-800">Personal Information</CardTitle>
        
//       </CardHeader>
//         <div className="w-[124px] h-[124px] relative rounded-full">
//           <Image src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full" priority={true} />
//           <Button asChild size="icon" className="h-8 w-8 rounded-full cursor-pointer absolute bottom-0 right-0">
//             <Label htmlFor="avatar">
//               <Icon className="w-5 h-5 text-primary-foreground" icon="heroicons:pencil-square" />
//             </Label>
//           </Button>
//           <Input type="file" className="hidden" id="avatar" />
//         </div>
//         <div className="mt-4 text-xl font-semibold text-default-900">{sponsor?.sponsorName || "N/A"}</div>
//       </CardContent>


//       <CardContent className="p-10 flex flex-col items-center">
//         <ul className="mt-6 grid grid-cols-3 gap-6">
//           {userInfo.map((item, index) => (
//             <li key={`user-info-${index}`} className="flex items-center">
//               <div className="flex-none flex items-center gap-1.5 ">
//                 <span>{<item.icon className="w-5 h-5 text-primary" />}</span>
//                 <span className="text-base font-medium text-default-800">{item.label}:</span>
//               </div>
//               <div className="flex-1 text-base text-default-700">{item.value}</div>
//             </li>
//           ))}
//         </ul>
        
//      </CardContent>
//   <CardContent>
//   </CardContent>
//     </Card>
// </>  
// );
// };

// export default UserMeta;
