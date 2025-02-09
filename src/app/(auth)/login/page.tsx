import React from "react";
import LoginUI from "./clientcomponents/LoginUI";
import CustomHeader from "@/app/Components/Header/Header";
// import { cookies } from "next/headers";

const Page: React.FC = () => {
  // cookies().delete("access_token_level_up");
  // cookies().delete("refresh_token_level_up");
  return (
    <>
      <CustomHeader logout={false} />
      <LoginUI />
    </>
  );
};

export default Page;
