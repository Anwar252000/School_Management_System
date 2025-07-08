import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Location, Calender, CalenderCheck } from "@/components/svg";
import FigmaImage from "@/public/images/all-img/figma.png"
import ReactImage from "@/public/images/all-img/react.png"
import Image from "next/image";
import { Button } from "@/components/ui/button";
interface UserInfoItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const UserInfo = () => {
  const userInfo: UserInfoItem[] = [
    {
      icon: User,
      label: "Full Name",
      value: "Jennyfer Frankin"
    },
    {
      icon: Phone,
      label: "Mobile",
      value: "+(1) 987 6543"
    },
    {
      icon: Location,
      label: "Location",
      value: "101, California"
    },
    {
      icon: CalenderCheck,
      label: "Joining Date",
      value: "24 Nov 2021"
    },
    {
      icon: Calender,
      label: "Last Task Complete ",
      value: "09 Mar 2024"
    },
  ]
  return (
    <Card>
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-medium text-default-800">Information</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="text-sm text-default-600">
          Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..
        </p>
        <ul className="mt-6 space-y-4">
          {
            userInfo.map((item, index) => (
              <li
                key={`user-info-${index}`}
                className="flex items-center"
              >
                <div className="flex-none  2xl:w-56 flex items-center gap-1.5">
                  <span>{<item.icon className="w-4 h-4 text-primary" />}</span>
                  <span className="text-sm font-medium text-default-800">{item.label}:</span>
                </div>
                <div className="flex-1 text-sm text-default-700">{item.value}</div>
              </li>
            ))
          }
        </ul>
       <Button >
        Edit Profile
       </Button>
      </CardContent>
    </Card>
  );
};

export default UserInfo;