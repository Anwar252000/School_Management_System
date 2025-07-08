import React from "react";
import UserInfo from "./sponsor-profile";
import Header from "./components/header";
import UserMeta from "@/components/user-profile/settings/user-meta";
// import UserMeta from '@/components/user-profile/settings/user-meta'

const UserProfile = () => {
  return (
    <>
      <Header />
      <UserMeta />
    </>
  );
};

export default UserProfile;
