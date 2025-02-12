import React from "react";
import Onboarding from "./clientcomponents/Onboarding";
import CustomHeader from "@/app/Components/Header/Header";
import "../../../app/globals.css";

const page = () => {
  return (
    <>
      <CustomHeader logout={false} />
      <Onboarding />
    </>
  );
};

export default page;
