"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteLogo } from "@/components/svg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLoginMutation } from "@/services/apis/userService";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/services/authSlice";

const userSchema = z.object({
  username: z.string({ message: "Your username is invalid." }),
  password: z.string().min(6, "Please enter your correct password."),
  roleName: z.string().optional(),
});
type UserFormValues = z.infer<typeof userSchema>;

const LogInForm = () => {
  const [isPending] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState<string>("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const [Login] = useLoginMutation();
  const dispatch = useDispatch();
  // const { login } = useAuthContext();

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      const response = await Login(data);

      if (response?.data?.success) {
        const token = response?.data?.data?.token ?? "";
        const userRoleName = response?.data?.data?.roleName;
        const userId = response?.data?.data?.userId;
        const userName = response?.data?.data?.userName;
        const permissions = response?.data?.data?.permissions;
        // const sessionTimeout = 15 * 60 * 1000; // 15 minutes

        dispatch(
          loginSuccess({
            authtoken: token,
            user: {
              userId: userId ?? 0,
              userFullName: userName ?? "",
              userRoleName: userRoleName ?? "",
            },
            permissions:
              (permissions ?? []).map((permission) => ({
                ...permission,
                entity: permission.entity ?? "", // provide a default value if entity is undefined
                isActive: permission.isActive ?? false, // provide a default value if isActive is undefined
              })) ?? [],
          })
        );
        toast.success(`${data.username} logged in successfully!`);
        if (userRoleName === "AccountsAdmin") {
          window.location.assign("/manage-accounts");
        } else {
          window.location.assign("/");
        }
        reset();
      } else {
        console.error("Error:", response);

        toast.error(
          `Error: ${response?.data?.message || "Something went wrong"}`
        );
      }
    } catch (error: any) {
      console.error("Request Failed:", error);
      toast.error(`Error: ${error.message || "Request Failed"}`);
    }
  };

  const handleError = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <div className="w-full py-5 lg:py-10">
      <Link href="/dashboard" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hello 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Enter the information you entered while login.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        className="mt-4 xl:mt-7"
      >
        <div className="relative">
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Username{" "}
          </Label>
          <Input
            disabled={isPending}
            {...register("username")}
            type="text"
            id="username"
            className={cn("peer", {
              "border-destructive": errors.username,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
            placeholder="Username"
          />
        </div>
        {errors.username && (
          <div className=" text-destructive mt-2">
            {errors.username.message}
          </div>
        )}

        <div className="mt-3.5">
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600"
          >
            {" "}
            Password{" "}
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              className="peer "
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder="Password"
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
              onClick={togglePasswordType}
            >
              {passwordType === "password" ? (
                <Icon
                  icon="heroicons:eye"
                  className="w-5 h-5 text-default-400"
                />
              ) : (
                <Icon
                  icon="heroicons:eye-slash"
                  className="w-5 h-5 text-default-400"
                />
              )}
            </div>
          </div>
        </div>
        {errors.password && (
          <div className=" text-destructive mt-2">
            {errors.password.message}
          </div>
        )}

        <div className="mt-5  mb-8 flex flex-wrap gap-2">
          <div className="flex-1 flex  items-center gap-1.5 ">
            <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="isRemebered"
            />
            <Label
              htmlFor="isRemebered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
            >
              Remember me
            </Label>
          </div>
          <Link href="/auth/forgot" className="flex-none text-sm text-primary">
            Forget Password?
          </Link>
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Loading..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default LogInForm;
