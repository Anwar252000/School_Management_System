
"use client";
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddPeriodMutation } from '@/services/apis/periodService';

const addPeriodSchema = z.object({
  periodId: z.coerce.number().optional(),
  startTime: z.string().min(1,"Invalid start time format"),
  endTime: z.string().min(1,"Invalid start time format"),
  periodName: z.string(),
  isActive: z.boolean().optional()
});

type AddPeriodFormValues = z.infer<typeof addPeriodSchema>;

export default function AddPeriods({refetch}: {refetch: () => void}) {
  const [addPeriod] = useAddPeriodMutation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddPeriodFormValues>({
    resolver: zodResolver(addPeriodSchema),
  });

  const onSubmit: SubmitHandler<AddPeriodFormValues> = async (data) => {
    const formattedStartTime = data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime;
    const formattedEndTime = data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime;
  
    const formData = {
      ...data,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
    
    try {
      const response = await addPeriod(formData);

      if (response.data?.success) {
        toast.success('Period added successfully!');
        refetch();
        reset();
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Request Failed");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Icon icon="heroicons:building-library-solid" className="w-6 h-6 mr-2" />
          Add Period
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="max-w-[736px]">
        <SheetHeader>
          <SheetTitle>Add Period</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col py-5">
          <form onSubmit={handleSubmit(onSubmit)}>             

            <div className="grid grid-cols-6 gap-4 mt-5">
              <div className="col-span-2">
                <Label>Class Periods</Label>
                <Select onValueChange={(value) => setValue("periodName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Period">1st Period</SelectItem>
                    <SelectItem value="2nd Period">2nd Period</SelectItem>
                    <SelectItem value="3rd Period">3rd Period</SelectItem>
                    <SelectItem value="4th Period">4th Period</SelectItem>
                    <SelectItem value="5th Period">5th Period</SelectItem>
                    <SelectItem value="6th Period">6th Period</SelectItem>
                    <SelectItem value="7th Period">7th Period</SelectItem>
                    <SelectItem value="8th Period">8th Period</SelectItem>
                    <SelectItem value="9th Period">9th Period</SelectItem>
                    <SelectItem value="10th Period">10th Period</SelectItem>
                    <SelectItem value="Break-Time">Break-Time</SelectItem>
                    <SelectItem value="Fixture">Fixture</SelectItem>
                  </SelectContent>
                </Select>
                {errors.periodName && <p className="text-destructive">{errors.periodName.message}</p>}
              </div>

              <div className="col-span-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  {...register('startTime')}
                  className="input input-bordered w-full"
                />
                {errors.startTime && <p className="text-destructive">{errors.startTime.message}</p>}
              </div>

              <div className="col-span-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  {...register('endTime')}
                  className="input input-bordered w-full"
                />
                {errors.endTime && <p className="text-destructive">{errors.endTime.message}</p>}
              </div>
            </div>

            
            <div className="mt-6">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
        <SheetFooter>
          <SheetClose asChild>Footer Content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
