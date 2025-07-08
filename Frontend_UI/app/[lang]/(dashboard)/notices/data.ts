import { Notice } from "./types";

export const notices: Notice[] = [
    {
      id: 1,
      title: "Notice Title 1",
      description: "Notice Description 1",
      deliveryMethod: "Email",
      deliveryStatus: "Sent",
      postedBy: "Admin",
      postedDate: "2021-10-05",
    },
    {
      id: 2,
      title: "Notice Title 2",
      description: "Notice Description 2",
        deliveryMethod: "SMS",
        deliveryStatus: "Failed",
      postedBy: "Admin",
      postedDate: "2021-10-05",
    },
    {
      id: 3,
      title: "Notice Title 3",
      description: "Notice Description 3",
        deliveryMethod: "WhatsApp",
        deliveryStatus: "Pending",
      postedBy: "Admin",
      postedDate: "2021-10-05",
    },
    {
      id: 4,
      title: "Notice Title 4",
      description: "Notice Description 4",
        deliveryMethod: "Email",
        deliveryStatus: "Sent",
      postedBy: "Admin",
      postedDate: "2021-10-05",
    },
  ]