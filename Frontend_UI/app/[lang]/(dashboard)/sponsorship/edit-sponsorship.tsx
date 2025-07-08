// // "use client";

// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { InputGroup, InputGroupText } from "@/components/ui/input-group";
// import { Icon } from "@iconify/react";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { z } from "zod";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { useEffect, useState } from "react";
// import {
//   updateSponsorship,
//   SponsorshipData,
// } from "@/services/sponsorshipService";
// import { fetchSponsor, SponsorData } from "@/services/sponsorService";
// import { ClassData, useFetchClassQuery } from "@/services/apis/classService";

// // const sponsorshipSchema = z.object({
// //   amount: z.number().optional(),
// //   startDate: z.union([z.string(), z.date()]).optional(),
// //   frequency: z.number().optional(),
// //   classId: z.number().optional(),
// //   studentId: z.number().optional(),
// //   sponsorId: z.number().optional(),
// // });

// // type SponsorshipFormValues = z.infer<typeof sponsorshipSchema>;

// // interface EditSponsorshipFormProps {
// //   existingSponsorship: SponsorshipData;
// //   sponsor: SponsorData;
// //   studentName: string;
// //   reftech: () => void;
// // }

// const EditSponsorshipForm: React.FC<EditSponsorshipFormProps> = ({
//   existingSponsorship,
//   studentName,
// }) => {
//   const [sponsors, setSponsors] = useState<SponsorData[]>([]);
//   const [classId, setClassId] = useState<number | null>(
//     existingSponsorship.classId || null
//   );
//   const [sponsorId, setSponsorId] = useState<number | null>(
//     existingSponsorship.sponsorId || null
//   );
//   const [studentId] = useState<number | null>(
//     existingSponsorship.studentId || null
//   );
//   const [frequency, setFrequency] = useState<number | undefined>(
//     existingSponsorship.frequency || undefined
//   );

//   const {data: classData, isLoading: classLoading, refetch: classRefetch} = useFetchClassQuery();
//   const classes = classData?.data as ClassData[];

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<SponsorshipFormValues>({
//     resolver: zodResolver(sponsorshipSchema),
//     defaultValues: {
//       amount: existingSponsorship.amount,
//       startDate: existingSponsorship.startDate || "",
//       frequency: existingSponsorship.frequency || undefined,
//       classId: existingSponsorship.classId || undefined,
//       studentId: existingSponsorship.studentId || undefined,
//       sponsorId: existingSponsorship.sponsorId || undefined,
//     },
//   });

//   useEffect(() => {
//     const fetchClassSponsorData = async () => {
//       try {
//         const sponsorResponse = await fetchSponsor();
//         setSponsors(sponsorResponse.data as SponsorData[]);
//       } catch (err) {
//         toast.error("Error loading class and sponsor data.");
//       }
//     };

// //     fetchClassSponsorData();
// //   }, []);

// //   useEffect(() => {
// //     setValue("amount", existingSponsorship.amount);
// //     setValue("startDate", existingSponsorship.startDate || "");
// //     setFrequency(existingSponsorship.frequency);
// //   }, [existingSponsorship, setValue]);

// //   const handleFrequencyChange = (value: number) => setFrequency(value);

// //   const onSubmit: SubmitHandler<SponsorshipFormValues> = async (data) => {
// //     const updatedData: SponsorshipData = {
// //       ...data,
// //       sponsorshipId: existingSponsorship.sponsorshipId,
// //       sponsorId: sponsorId ?? 0,
// //       frequency: frequency,
// //     };

// //     const response = await updateSponsorship(updatedData);
// //     console.log("Form data:", updatedData);
// //     if (response.success) {
// //       toast.success("Sponsorship updated successfully!");
// //     } else {
// //       toast.error(`Error: ${response.message || "Something went wrong"}`);
// //     }
// //   };

// //   return (
// //     <Sheet>
// //       <SheetTrigger asChild>
// //         <Button size="icon" variant="outline" className="h-7 w-7">
// //           <Icon icon="heroicons:pencil" className="h-4 w-4" />
// //         </Button>
// //       </SheetTrigger>
// //       <SheetContent side="top">
// //         <SheetHeader>
// //           <SheetTitle>Edit Sponsorship</SheetTitle>
// //         </SheetHeader>
// //         <form onSubmit={handleSubmit(onSubmit)}>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div className="flex flex-col gap-2 col-span-1">
// //               <Label>Select Class</Label>
// //               <Select
// //                 onValueChange={(value) => setClassId(parseInt(value))}
// //                 defaultValue={classId?.toString()}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder="Select Class" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {classes.map((cd) => (
// //                   <SelectItem key={cd.classId} value={cd.classId?.toString() || ""}>
// //                   {cd.className}
// //                   </SelectItem>
// //                   ))}
// //                   </SelectContent>
// //                 </Select>
// //             </div>

// //             <div className="flex flex-col gap-2 col-span-1">
// //               <Label>Select Sponsor</Label>
// //               <Select
// //                 onValueChange={(value) => setSponsorId(parseInt(value))}
// //                 defaultValue={sponsorId?.toString()}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder="Select Sponsor" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {sponsor && sponsor?.map((sponsor as SponsorData) => (
// //                     <SelectItem
// //                       key={s.sponsorId}
// //                       value={s.sponsorId?.toString() || ''}
// //                     >
// //                       {s?.sponsorName}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             <div className="flex flex-col gap-2">
// //               <Label htmlFor="amount">Enter Amount</Label>
// //               <InputGroup merged>
// //                 <InputGroupText>
// //                   <Icon icon="mdi:money" />
// //                 </InputGroupText>
// //                 <Input
// //                   type="number"
// //                   placeholder="Enter Your Amount"
// //                   id="amount"
// //                   {...register("amount", { valueAsNumber: true })}
// //                 />
// //               </InputGroup>
// //               {errors.amount && (
// //                 <p className="text-destructive">{errors.amount.message}</p>
// //               )}
// //             </div>

// //             <Select
// //               onValueChange={(value) => setFrequency(parseInt(value))} // parse the value as an integer
// //               defaultValue={existingSponsorship.frequency?.toString() || "1"} // ensure defaultValue is a string
// //             >
// //               <SelectTrigger>
// //                 <SelectValue placeholder="Select frequency" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="1">1 Month</SelectItem>
// //                 <SelectItem value="3">3 Months</SelectItem>
// //                 <SelectItem value="6">6 Months</SelectItem>
// //                 <SelectItem value="12">12 Months</SelectItem>
// //               </SelectContent>
// //             </Select>

// //             <div className="flex flex-col gap-2">
// //               <Label>Sponsored Student</Label>
// //               <InputGroup>
// //                 <InputGroupText>
// //                   <Icon icon="mdi:account" />
// //                 </InputGroupText>
// //                 <Input
// //                   value={studentName}
// //                   disabled
// //                   className="text-dark text-base"
// //                 />
// //               </InputGroup>
// //             </div>

// //             <div className="col-span-2 flex justify-end">
// //               <Button type="submit">Submit Sponsorship</Button>
// //             </div>
// //           </div>
// //         </form>
// //         <SheetFooter>
// //           <SheetClose asChild>Close</SheetClose>
// //         </SheetFooter>
// //       </SheetContent>
// //     </Sheet>
// //   );
// // };

// // export default EditSponsorshipForm;
