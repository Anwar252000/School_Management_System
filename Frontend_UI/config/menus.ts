import IncomeStatementPage from "@/app/[lang]/(dashboard)/manage-accounts/income-statement/page";
import { DashBoard, Users, Campus, ClipBoard2, Book, CalenderCheck, User, Donation, List, ListFill, ClipBoard, ChartBar, ChartArea } from "@/components/svg";
import { Award, Bell, Boxes, CalendarCheck2Icon, CheckCircle, CheckSquare, Coins, FileBarChart, HeartHandshake, Receipt, School, ThumbsUp, UserCheck, Wallet, KeyRound, BookOpenCheck, BarChart, PieChart,CircleDollarSign, UserCog, LibraryIcon} from "lucide-react";

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  isHeader?: boolean;
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
}

// Centralized menu configuration
export const menuItems: MenuItemProps[] = [
  {
    title: "Administration",
    icon: DashBoard,
    child: [
      {
        title: "DashBoard",
        href: "/",
        icon: DashBoard,
      },
      {
        title: "Manage Users",
        href: "/userManagement",
        icon: User,
      },
      {
        title: "Manage Campuses",
        href: "/campuses",
        icon: Campus,
      },
      {
        title: "Manage Classes",
        href: "/classrooms",
        icon: School,
      },
      {
        title: "Tasks",
        href: "/task",
        icon: ClipBoard2,
      },
      {
        title: "daily expense",
        href: "/daily-expense",
        icon: ChartBar,
      },
      
      

      {
        title: "Manage Sponsors",
        href: "/sponsors",
        icon: HeartHandshake,
      },
      {
        title: "Manage Sponsorships",
        href: "/sponsorship",
        icon: Donation,
      },
      {
        title: "Manage Inventories",
        href: "/manage-inventories",
        icon: Boxes,
      },
      {
        title: "Manage Documents",
        href: "/document-management",
        icon: FileBarChart,
      },
      {
        title: "Backup&Restore",
        href: "/db-backup-restore",
        icon: FileBarChart,
      },
    ],
  },
  {
    title: "Academic",
    icon: Book,
    child: [
      {
        title: "Applicants",
        href: "/applicantManagement",
        icon: UserCheck,
      },
      {
        title: "Students",
        href: "/students",
        icon: Users,
      },
      {
        title: "Attendance",
        href: "/student-attendance",
        icon: CheckSquare,
      },
      {
        title: "Time Tables",
        href: "/timetables",
        icon: CalenderCheck,
      },
      {
        title: "Manage Subjects",
        href: "/subjects",
        icon: Book,
      },
      {
        title: "Manage Exams",
        href: "/examPaper",
        icon: CheckCircle,
      },
      {
        title: "Manage Results",
        href: "/examResults",
        icon: Award,
      },
      {
        title: "Grades",
        href: "/manage-grades",
        icon: Book,
      },
      {
        title: "Promoted Student",
        href: "/student-academic",
        icon: ClipBoard2,
      },
      {
        title: "Parents Feedback",
        href: "/parent-feedback",
        icon: ThumbsUp,
      },
      {
        title: "School Library",
        href: "/school-library",
        icon: LibraryIcon,
      },
      

      
    ],
  },
  {
    title: "Manage Employees",
    icon: UserCog,
    child: [
      {
        title: "Manage Employees",
        href: "/employees",
        icon: Users,
      },
      {
        title: "Employees Attendance",
        href: "/employees/employee-attendance",
        icon: CalendarCheck2Icon,
      },
      {
        title: "Employees Leave",
        href: "/employees/employee-leave",
        icon: ListFill,
      },
      {
        title: "Employee Training",
        href: "/employees/employee-training",
        icon: CalendarCheck2Icon,
      },
      {
        title: "Employee Benefits",
        href: "/employees/employee-benefits",
        icon: UserCheck,
},
       {
        title: "Employees Performance Appraisal",
        href: "/employees/performance-appraisal",
        icon: CalendarCheck2Icon,
      },
      
    ]
  },
  {
    title: "Account",
    icon: Wallet,
    child: [
      // {
      //   title: "Manage Payments",
      //   href: "/payments",
      //   icon: Coins,
      // },
      {
        title: "Manage Accounts",
        href: "/manage-accounts",
        icon: ChartBar,
      },
      {
        title: "Transactions",
        href: "/transactions",
        icon: Coins,
      },
      // {
      //   title: "Journal Report",
      //   href: "/manage-accounts/journal-report",
      //   icon: Chart
      // },
      {
        title: "General Ledger",
        href: "/manage-accounts/general-ledger",
        icon: FileBarChart,
      },
      {
        title: "Trial Balance",
        href: "/manage-accounts/trail-balance",
        icon: BarChart
      },
      {
        title: "Income Statement",
        href: "/manage-accounts/income-statement",
        icon: ChartArea
      },
      {
        title: "Balance Sheet",
        href: "/manage-accounts/balance-sheet",
        icon: PieChart
      },

    ]
  },
  {
    title: "Fee Management",
    icon: Receipt,
    child: [
      {
        title: "Fee List",
        href: "/fee-management",
        icon: List,
      },
      {
        title: "Fee Category",
        href: "/fee-category",
        icon: Coins,
      },
      {
        title: "Manage Class Fees",
        href: "/manage-class-fee",
        icon: Coins,
      },
    ],
  },
  {
    title: "Notices",
    icon: Bell,
    child: [
      {
        title: "Notices",
        href: "/notices",
        icon: Bell,
      },
    ],
  },
];

// Utility function to generate specific menu styles
const generateMenus = (menuItems: MenuItemProps[]) => {
  return {
    mainNav: menuItems.map(item => ({
      ...item,
    })),
    
    sidebarNav: {
      modern: menuItems.map(item => ({
        ...item,
      })),
      classic: menuItems.map(item => ({
        ...item,
      })),
    },
    mobileMenu: menuItems.map(item => ({
      ...item,
    })),
  };
};

// Generate menus from the centralized configuration
export const menusConfig = generateMenus(menuItems);

// Type definitions
export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
