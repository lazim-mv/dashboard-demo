// "use client";
// import React, { FC, ReactNode } from "react";
// import type { MenuProps } from "antd";
// import { Divider, Layout, Menu } from "antd";
// import CustomHeader from "../Components/Header/Header";
// import Link from "next/link";
// import "../globals.css";
// import { IoMdHome } from "react-icons/io";
// import { IoPersonSharp } from "react-icons/io5";
// import { LuBookMarked } from "react-icons/lu";
// import { FaUniversity, FaHandshake } from "react-icons/fa";
// import { FaBell } from "react-icons/fa6";
// import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
// import { MdAdminPanelSettings } from "react-icons/md";
// import { usePathname } from "next/navigation";

// interface WebLayoutProps {
//   children?: ReactNode;
// }

// const { Content, Sider } = Layout;

// type MenuItem = Required<MenuProps>["items"][number];

// function getItem(
//   label: React.ReactNode,
//   key: string,
//   icon?: React.ReactNode,
//   path: string | null = null,
//   children?: MenuItem[]
// ): MenuItem {
//   return {
//     key: path || key,
//     icon,
//     label: path ? (
//       <Link href={path} passHref>
//         <span style={{ marginLeft: "0px", fontWeight: "500" }}>{label}</span>
//       </Link>
//     ) : (
//       label
//     ),
//     children,
//   } as MenuItem;
// }

// // const items: MenuItem[] = [
// //   getItem("Dashboard", "1", <IoMdHome size={20} />, "/dashboard"),
// //   getItem("Students", "2", <IoPersonSharp size={20} />, "/students"),
// //   getItem("Courses", "3", <LuBookMarked size={20} />, null, [
// //     getItem("Search", "4", null, "/courses/coursesearch"),
// //     getItem("List", "5", null, "/courses/list"),
// //   ]),
// //   getItem("Universities", "6", <FaUniversity size={20} />, "/universities"),
// //   getItem("Partnerships", "7", <FaHandshake size={20} />, "/partners"),
// //   getItem("Notification", "8", <FaBell size={20} />),
// //   getItem("Push Notification", "9", <IoChatbubbleEllipsesSharp size={20} />),
// //   getItem("Administrator", "10", <MdAdminPanelSettings size={20} />, null, [
// //     getItem("Users", "12", null, `/administrator/users`),
// //     getItem("Role Management", "12", null, `/administrator/rolemanagement`),
// //   ]),
// // ];



// const WebLayout: FC<WebLayoutProps> = ({ children }) => {

//   const screens = localStorage.getItem("Screens");
//   const parsedScreens = screens ? JSON.parse(screens) : [];
//   const permissions = parsedScreens[0].permissions

//   console.log(permissions, "screens");

//   const pathname = usePathname();

//   const items: MenuItem[] = [
//     getItem("Dashboard", "1", <IoMdHome size={20} />, "/dashboard"),
//     getItem("Students", "2", <IoPersonSharp size={20} />, "/students"),
//     getItem("Course Search", "3", <LuBookMarked size={20} />, "/courses/coursesearch"),
//     getItem("Notification", "6", <FaUniversity size={20} />, "/universities"),
//     getItem("Administrator", "10", <MdAdminPanelSettings size={20} />, `/administrator/users`),
//   ];

//   const defaultSelectedKey = React.useMemo(() => {
//     const segments = pathname.split("/").filter(Boolean);
//     return `/${segments[0]}`;
//   }, [pathname]);

//   const [collapsed, setCollapsed] = React.useState(false);

//   return (
//     <Layout style={{ minHeight: "100vh", position: "relative" }}>
//       <CustomHeader />
//       <Layout>
//         <Sider
//           collapsible
//           collapsed={collapsed}
//           onCollapse={(value) => setCollapsed(value)}
//           theme="light"
//           style={{ minHeight: "100vh" }}
//         >
//           <Divider style={{ marginTop: "0px", border: "none" }} />
//           <Menu
//             theme="light"
//             selectedKeys={[defaultSelectedKey]}
//             mode="inline"
//             items={items}
//           />
//         </Sider>
//         <Content
//           style={{
//             margin: "0",
//             padding: "24px",
//             paddingRight: "30px",
//             minHeight: "100vh",
//           }}
//         >
//           {/* <div style={{ background: "#fff", padding: "20px 24px" }}> */}
//           {children}
//           {/* </div> */}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default WebLayout;

"use client";
import React, { FC, ReactNode, useState, useEffect } from "react";
import type { MenuProps } from "antd";
import { Divider, Layout, Menu } from "antd";
import CustomHeader from "../Components/Header/Header";
import Link from "next/link";
import "../globals.css";
import { IoMdHome } from "react-icons/io";
import { IoChatbubbleEllipsesSharp, IoPersonSharp } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUniversity, FaHandshake, FaBell } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { RiBookMarkedFill } from "react-icons/ri";
import { AiFillFileText } from "react-icons/ai";

// type UserRole = {
//   name: string;
//   permissions: Permission[];
// };

type Permission = {
  resource: string;
  actions: Action[];
  type: PermissionType;
};

type Action = "READ" | "WRITE" | "UPDATE";

type PermissionType = "NORMAL" | "SPECIAL" | "LIMITED";

const resourceIcons = {
  DASHBOARD: <IoMdHome size={20} />,
  STUDENTS: <IoPersonSharp size={20} />,
  COURSE_SEARCH: <RiBookMarkedFill size={20} />,
  NOTIFICATION: <FaUniversity size={20} />,
  ADMINISTRATION: <MdAdminPanelSettings size={20} />,
  UNIVERSITIES: <FaUniversity size={20} />,
  PARTNERS: <FaHandshake size={20} />,
  APPLICATIONS: <AiFillFileText size={20} />,
  // PUSH_NOTIFICATION: <IoChatbubbleEllipsesSharp size={20} />,
  // USERS: <IoPersonSharp size={20} />,
  // ROLE_MANAGEMENT: <MdAdminPanelSettings size={20} />,
  // LEADS: <IoPersonSharp size={20} />,
};

interface WebLayoutProps {
  children?: ReactNode;
}

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  path: string | null = null,
  children?: MenuItem[]
): MenuItem {
  return {
    key: path || key,
    icon,
    label: path ? (
      <Link href={path} passHref>
        <span style={{ marginLeft: "0px", fontWeight: "500" }}>{label}</span>
      </Link>
    ) : (
      label
    ),
    children,
  } as MenuItem;
}

// Default menu items
// const defaultItems: MenuItem[] = [
//   getItem("Dashboard", "1", <IoMdHome size={20} />, "/dashboard"),
//   getItem("Students", "2", <IoPersonSharp size={20} />, "/students"),
//   getItem("Course Search", "3", <LuBookMarked size={20} />, "/courses/coursesearch"),
//   getItem("Notification", "6", <FaUniversity size={20} />, "/universities"),
//   getItem("Administrator", "10", <MdAdminPanelSettings size={20} />, `/administrator/users`),
// ];

const defaultItems: MenuItem[] = [
  getItem("Dashboard", "1", <IoMdHome size={20} />, "/dashboard"),
  getItem("Students", "2", <IoPersonSharp size={20} />, "/students"),
  getItem("Courses", "3", <RiBookMarkedFill size={20} />, null, [
    getItem("Search", "4", null, "/courses/coursesearch"),
    getItem("List", "5", null, "/courses/list"),
  ]),
  getItem("Universities", "6", <FaUniversity size={20} />, "/universities"),
  getItem("Partnerships", "7", <MdAdminPanelSettings size={20} />, null, [
    getItem("Partners", "8", null, `/partners`),
    getItem("Leads", "9", null, `/partners/leeds`),
  ]),
  getItem("Application", "10", <AiFillFileText size={20} />, "applications"),
  getItem("Notification", "11", <FaBell size={20} />),
  getItem("Push Notification", "12", <IoChatbubbleEllipsesSharp size={20} />),
  getItem("Administrator", "13", <MdAdminPanelSettings size={20} />, null, [
    getItem("Users", "14", null, `/administrator/users`),
    getItem("Role Management", "15", null, `/administrator/rolemanagement`),
  ]),
];

const WebLayout: FC<WebLayoutProps> = ({ children }) => {

  console.log("i rendered");

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const screens = localStorage.getItem("Screens");
      try {
        const parsedScreens = screens ? JSON.parse(screens) : [];
        setPermissions(parsedScreens[0]?.permissions || []);
      } catch (error) {
        console.error("Error parsing screens from localStorage:", error);
        setPermissions([]);
      }
    }
  }, []);

  // Generate menu items based on permissions or use default
  const items: MenuItem[] = permissions.length > 0
    ? permissions.map((permission: Permission) => {
      const routeName = permission.resource.toLowerCase().replace(/_/g, '');
      const label = permission.resource
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      return getItem(
        label,
        permission.resource,
        resourceIcons[permission.resource as keyof typeof resourceIcons] || null,
        `/${routeName}`
      );
    })
    : defaultItems;

  const defaultSelectedKey = React.useMemo(() => {
    return pathname || ""; // Use the full pathname as the selected key
  }, [pathname]);

  console.log(defaultSelectedKey, "defaultSelectedKeysssssssss");

  const defaultOpenKeys = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return [`/${segments[0]}`]; // Open parent menu key
    }
    return [];
  }, [pathname]);

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout style={{ minHeight: "100vh", position: "relative" }}>
      <CustomHeader />
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          style={{
            minHeight: "100vh",
            fontWeight: 600,
          }}
        >
          <Divider style={{ marginTop: "0px", border: "none" }} />
          <Menu
            theme="light"
            selectedKeys={[defaultSelectedKey]}
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
            items={items}
          />
        </Sider>
        <Content
          style={{
            margin: "0",
            padding: "24px",
            paddingRight: "30px",
            minHeight: "100vh",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default WebLayout;