"use client"; // Make sure this is at the very top

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SponsorData, useUpdateSponsorMutation } from "@/services/apis/sponsorService";




const sponsorSchema = z.object({
    sponsorId: z.coerce.number().optional(),
    sponsorName: z.string().min(1, "Full Name is required"),
    email: z.string().email({ message: "Invalid email address" }),
    gender: z.string().min(1, "Gender is required"),
    occupation: z.string().min(1, "Occupation is required"),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters long")
        .max(15, "Phone number must be at most 15 characters long"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.number().min(3, "Postal Code is required"),
    address: z.string().min(1, "Address is required"),
    isActive: z.boolean().optional()
});

type SponsorFormValues = z.infer<typeof sponsorSchema>;

interface SponsorProps {
    sponsorData: SponsorData;
    refetch: () => void;
}

const EditSponsor: React.FC<SponsorProps> = ({ sponsorData, refetch }) => {
 
    const { sponsorId, sponsorName, email, gender, occupation, phoneNumber, country, state, city, postalCode, address, isActive } = sponsorData;

  const [updateSponsor] = useUpdateSponsorMutation();


    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm<SponsorFormValues>({
        resolver: zodResolver(sponsorSchema),
        defaultValues: {
            sponsorId,
            sponsorName,
            email,
            gender,
            occupation,
            phoneNumber,
            country,
            state,
            city,
            postalCode,
            address,
            isActive
        },
    });

    const onSubmit: SubmitHandler<SponsorFormValues> = async (data) => {

      
        try {
            const updatedSponsor = { ...data, sponsorId };
            const response = await updateSponsor(updatedSponsor).unwrap();
        
            if (response.success) {
              toast.success(
                `${updatedSponsor.sponsorName} was updated successfully!`
              );
              reset();
              refetch();
            } else {
              toast.error("Failed to update the Sponsor");
            }
          } catch (error) {
            console.error("Request failed:", error);
            toast.error("Request failed");
          }
        };
        
  

    const handleError = () => {
        if (Object.keys(errors).length > 0) {
            toast.error("Please correct the errors in the form.");
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                >
                    <Icon icon="heroicons:pencil" className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="max-w-[736px]">
                <SheetHeader>
                    <SheetTitle>Edit Sponsor Details</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col justify-between" style={{ height: "calc(100vh - 80px)" }}>
                    <div className="py-5">
                        <hr />
                        <form onSubmit={handleSubmit(onSubmit, handleError)}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-3">
                                    <Label>Sponsor Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Sponsor Name"
                                        {...register("sponsorName")}
                                    />
                                    {errors.sponsorName && (
                                        <p className="text-destructive">
                                            {errors.sponsorName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select 
                                        defaultValue={gender}
                                        onValueChange={(value) => setValue("gender", value)}>
                                        <SelectTrigger>
                                            {/* <Icon icon="fa:user-md" /> */}
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && (
                                        <p className="text-destructive">{errors.gender.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="occupation">Occupation</Label>
                                    <Select 
                                        defaultValue={occupation}
                                        onValueChange={(value) => setValue("occupation", value)}>
                                        <SelectTrigger>
                                            {/* <Icon icon="fa:user-md" /> */}
                                            <SelectValue placeholder="Select Occupation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Own-Business">Own Business</SelectItem>
                                            <SelectItem value="Govt-Job">Government Job</SelectItem>
                                            <SelectItem value="Pvt-Job">Private Job</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.occupation && (
                                        <p className="text-destructive">{errors.occupation.message}</p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                <Label>Phone Number</Label>
                                    <Input
                                        type="text"
                                        placeholder="Phone Number"
                                        {...register("phoneNumber")}
                                    />
                                    {errors.phoneNumber && (
                                        <p className="text-destructive">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <Label>Postal Code</Label>
                                    <Input
                                        type="number"
                                        placeholder="Postal Code"
                                        {...register("postalCode" , {
                                            setValueAs: (value) => parseInt(value) || "",})}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-destructive">
                                            {errors.postalCode.message}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-1 lg:col-span-1 flex flex-col gap-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select 
                                        defaultValue={country}
                                        onValueChange={(value) => setValue("country", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pakistan">Pakistan</SelectItem>
                                            <SelectItem value="India">India</SelectItem>
                                            <SelectItem value="USA">USA</SelectItem>
                                            <SelectItem value="UK">UK</SelectItem>
                                            <SelectItem value="UAE">UAE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.country && (
                                        <p className="text-destructive">{errors.country.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2 lg:col-span-1 flex flex-col gap-2">
                                    <Label htmlFor="state">State</Label>
                                    <Select 
                                        defaultValue={state}
                                        onValueChange={(value) => setValue("state", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sindh">Sindh</SelectItem>
                                            <SelectItem value="Punjab">Punjab</SelectItem>
                                            <SelectItem value="Balochistan">Balochistan</SelectItem>
                                            <SelectItem value="KPK">Khyber Pakhtunkhua</SelectItem>
                                            <SelectItem value="GB">Gilgit Baltistan</SelectItem>
                                            <SelectItem value="UP">Uttar Pardesh</SelectItem>
                                            <SelectItem value="MP">Maharashtra</SelectItem>
                                            <SelectItem value="Bihar">Bihar</SelectItem>
                                            <SelectItem value="Dubai">Dubai</SelectItem>
                                            <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                                            <SelectItem value="Sharjah">Sharjah</SelectItem>
                                            <SelectItem value="England">England</SelectItem>
                                            <SelectItem value="Scotland">Scotland</SelectItem>
                                            <SelectItem value="Irelands">Northern Irelands</SelectItem>
                                            <SelectItem value="Chicago">Chicago</SelectItem>
                                            <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                                            <SelectItem value="Miami">Miami</SelectItem>
                                            <SelectItem value="Texas">Texas</SelectItem>
                                            <SelectItem value="Virginia">Virginia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.state && (
                                        <p className="text-destructive">{errors.state.message}</p>
                                    )}
                                </div>

                                <div className="col-span-2 lg:col-span-1 flex flex-col gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Select 
                                        defaultValue={city}
                                        onValueChange={(value) => setValue("city", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Karachi">Karachi</SelectItem>
                                            <SelectItem value="Lahore">Lahore</SelectItem>
                                            <SelectItem value="Islamabad">Islamabad</SelectItem>
                                            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                                            <SelectItem value="Delhi">Delhi</SelectItem>
                                            <SelectItem value="Goa">Goa</SelectItem>
                                            <SelectItem value="London">London</SelectItem>
                                            <SelectItem value="Manchester">Manchester</SelectItem>
                                            <SelectItem value="New York">New York</SelectItem>
                                            <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                                            <SelectItem value="Miami">Miami</SelectItem>
                                            <SelectItem value="Texas">Texas</SelectItem>
                                            <SelectItem value="Virginia">Virginia</SelectItem>                                            
                                        </SelectContent>
                                    </Select>
                                    {errors.city && (
                                        <p className="text-destructive">{errors.city.message}</p>
                                    )}
                                </div>

                                <div className="col-span-3">
                                    <Label>Address</Label>
                                    <Input
                                        type="text"
                                        placeholder="Address"
                                        {...register("address")}
                                    />
                                    {errors.address && (
                                        <p className="text-destructive">
                                            {errors.address.message}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <Button type="submit">Update</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="ghost">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default EditSponsor