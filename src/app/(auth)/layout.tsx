import { ReactNode } from "react";
import { Albert_Sans } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const albertSans = Albert_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-AlberSans",
});

type AuthLayoutProps = {
  children?: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={albertSans.className}>
      <AntdRegistry>{children}</AntdRegistry>
    </div>
  );
}
