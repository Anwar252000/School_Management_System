"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Check, UserPlus, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import NoticeAlert from "./notice-alert";
import DeliveryMethodCard from "./delivery-method-card";
import PreviewCard from "./preview-card";
import {
  Contact,
  DeliveryType,
  NoticeFormFieldTypes,
  RecipientType,
  StudentNoticeType,
} from "./types";
import { useSendNoticeMutation } from "@/services/apis/noticeService";
import useAuth from "@/hooks/use-auth";

export default function NoticeForm() {
  const { userId } = useAuth();

  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
  } = useForm<NoticeFormFieldTypes>({
    defaultValues: {
      title: "",
      content: "",
      noticeType: "general",
      recipientType: "general",
      studentNoticeType: "all",
      deliveryType: "email",
      selectedClasses: [],
      selectedContacts: [],
    },
  });

  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sendNotice, { isError, isLoading }] = useSendNoticeMutation();

  const selectedContacts = watch("selectedContacts");
  const selectedClasses = watch("selectedClasses");
  const recipientType = watch("recipientType") as RecipientType;
  const studentNoticeType = watch("studentNoticeType") as StudentNoticeType;

  // Sample classes data
  const classes = [
    "Grade 1-A",
    "Grade 1-B",
    "Grade 2-A",
    "Grade 2-B",
    "Grade 3-A",
    "Grade 3-B",
    "Grade 4-A",
    "Grade 4-B",
    "Grade 5-A",
    "Grade 5-B",
    "Grade 6-A",
    "Grade 6-B",
    "Grade 7-A",
    "Grade 7-B",
    "Grade 8-A",
    "Grade 8-B",
    "Grade 9-A",
    "Grade 9-B",
    "Grade 10-A",
    "Grade 10-B",
    "Grade 11-A",
    "Grade 11-B",
    "Grade 12-A",
    "Grade 12-B",
  ];

  // Sample contacts data
  const contacts: Contact[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      type: "student",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      type: "teacher",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1234567892",
      type: "parent",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice@example.com",
      phone: "+1234567893",
      type: "student",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "+1234567894",
      type: "teacher",
    },
    {
      id: "6",
      name: "Diana Prince",
      email: "diana@example.com",
      phone: "+1234567895",
      type: "parent",
    },
    {
      id: "7",
      name: "Edward Norton",
      email: "edward@example.com",
      phone: "+1234567896",
      type: "student",
    },
    {
      id: "8",
      name: "Fiona Apple",
      email: "fiona@example.com",
      phone: "+1234567897",
      type: "teacher",
    },
    {
      id: "9",
      name: "George Lucas",
      email: "george@example.com",
      phone: "+1234567898",
      type: "parent",
    },
    {
      id: "10",
      name: "Helen Mirren",
      email: "helen@example.com",
      phone: "+1234567899",
      type: "student",
    },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = async (data: any) => {
    setIsSending(true);

    try {
      // Send notice
      const response = await sendNotice({
        ...data,
        createdBy: userId,
      }).unwrap();

      if (response.success) {
        setIsSending(false);
        toast({
          title: "Notice sent successfully",
          description: `Notice has been sent to ${data.recipientType} via ${data.deliveryType}`,
          color: "success",
        });

        // Reset form
        reset();
      } else {
        setIsSending(false);
        toast({
          title: "Notice sending failed",
          description: `Notice could not be sent to ${data.recipientType} via ${data.deliveryType}`,
          color: "destructive",
        });
      }
    } catch (error) {
      setIsSending(false);
      toast({
        title: "Notice sending failed",
        description: `Notice could not be sent to ${data.recipientType} via ${data.deliveryType}`,
        color: "destructive",
      });
    }
  };

  const addContact = (contact: Contact) => {
    if (!selectedContacts.some((c: Contact) => c.id === contact.id)) {
      setValue("selectedContacts", [...selectedContacts, contact]);
    }
  };

  const removeContact = (contactId: string) => {
    setValue(
      "selectedContacts",
      selectedContacts.filter((contact: Contact) => contact.id !== contactId)
    );
  };

  const toggleClass = (className: string) => {
    setValue(
      "selectedClasses",
      selectedClasses.includes(className)
        ? selectedClasses.filter((c: string) => c !== className)
        : [...selectedClasses, className]
    );
  };

  const isFormValid = () => {
    const {
      title,
      content,
      noticeType,
      recipientType,
      studentNoticeType,
      selectedContacts,
      selectedClasses,
    } = watch();
    if (!title || !content || isSending) return false;
    if (recipientType === "custom" && selectedContacts.length === 0)
      return false;
    if (
      recipientType === "student" &&
      studentNoticeType === "byClass" &&
      selectedClasses.length === 0
    )
      return false;
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Notice</CardTitle>
              <CardDescription>
                Compose a notice to send to school members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notice Title</Label>
                <Input
                  id="title"
                  placeholder="Enter notice title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Notice Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter notice content"
                  className="min-h-[200px]"
                  {...register("content", { required: "Content is required" })}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Notice Type</Label>
                <Controller
                  name="noticeType"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      defaultValue={value}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="general" id="general" />
                        <Label htmlFor="general">General</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student">Event</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher">Reminder</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Recipient Type</Label>
                <Controller
                  name="recipientType"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      onValueChange={onChange}
                      defaultValue={value}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="general" id="general" />
                        <Label htmlFor="general">General</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher">Teacher</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parents" id="parents" />
                        <Label htmlFor="parents">Parents</Label>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {recipientType === "student" && (
                <div className="space-y-3 mt-4 border rounded-md p-4">
                  <Label className="font-medium">Student Notice Options</Label>
                  <Controller
                    name="studentNoticeType"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        onValueChange={onChange}
                        defaultValue={value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all-students" />
                          <Label htmlFor="all-students">All Students</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="byClass" id="by-class" />
                          <Label htmlFor="by-class">By Class</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {studentNoticeType === "byClass" && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>
                          Selected Classes ({selectedClasses.length})
                        </Label>
                        {selectedClasses.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("selectedClasses", [])}
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {classes.map((className) => (
                          <div
                            key={className}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={className}
                              checked={selectedClasses.includes(className)}
                              onCheckedChange={() => toggleClass(className)}
                            />
                            <Label
                              htmlFor={className}
                              className="text-sm cursor-pointer"
                            >
                              {className}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {recipientType === "custom" && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <Label>Selected Contacts ({selectedContacts.length})</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <UserPlus className="h-4 w-4" />
                          Add Contact
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0"
                        align="end"
                        side="right"
                        sideOffset={10}
                        alignOffset={0}
                        style={{ width: 320 }}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No contacts found.</CommandEmpty>
                            <ScrollArea className="h-[200px]">
                              <CommandGroup>
                                {filteredContacts.map((contact) => (
                                  <CommandItem
                                    key={contact.id}
                                    value={contact.id}
                                    onSelect={() => {
                                      addContact(contact);
                                      // Keep focus within the command input for better UX
                                      const input = document.querySelector(
                                        "[cmdk-input]"
                                      ) as HTMLInputElement;
                                      if (input) input.focus();
                                    }}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div>
                                        <div>{contact.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {contact.email}
                                        </div>
                                      </div>
                                      <div className="flex h-6 items-center">
                                        {selectedContacts.some(
                                          (c: Contact) => c.id === contact.id
                                        ) && <Check className="h-4 w-4" />}
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </ScrollArea>
                            <div className="border-t p-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => setOpen(false)}
                              >
                                Done
                              </Button>
                            </div>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="border rounded-md p-2 min-h-[100px]">
                    {selectedContacts.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                        No contacts selected. Click "Add Contact" to select
                        recipients.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedContacts.map((contact: Contact) => (
                          <Badge
                            key={contact.id}
                            // variant="secondary"
                            color="secondary"
                            className="flex items-center gap-1 py-1 px-2"
                          >
                            <span>{contact.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeContact(contact.id);
                              }}
                              className="h-4 w-4 rounded-full hover:bg-muted-foreground/20 inline-flex items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">
                                Remove {contact.name}
                              </span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <NoticeAlert />
        </div>

        <div className="space-y-6">
          <DeliveryMethodCard
            deliveryType={watch("deliveryType") as DeliveryType}
            setDeliveryType={(value: DeliveryType) =>
              setValue("deliveryType", value)
            }
          />

          <PreviewCard
            title={watch("title")}
            content={watch("content")}
            recipientType={watch("recipientType")}
            studentNoticeType={watch("studentNoticeType")}
            deliveryType={watch("deliveryType")}
            selectedClasses={watch("selectedClasses")}
            selectedContacts={watch("selectedContacts")}
            isPreviewOpen={isPreviewOpen}
            setIsPreviewOpen={setIsPreviewOpen}
            isSending={isSending}
            isFormValid={isFormValid}
          />
        </div>
      </div>
    </form>
  );
}
