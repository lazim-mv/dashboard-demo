import React, { FC, ReactNode } from "react";

interface WebLayoutProps {
  children?: ReactNode | null;
}

const AuthLayout: FC<WebLayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default AuthLayout;
