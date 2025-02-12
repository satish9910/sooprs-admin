import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ArchiveBoxArrowDownIcon
  
} from "@heroicons/react/24/solid";
import Home from "./src/pages/dashboard/home"; // Fixed path
import Profile from "./src/pages/dashboard/profile"; // Fixed path
import Tables from "./src/pages/dashboard/tables"; // Fixed path
import Notifications from "./src/pages/dashboard/notifications"; // Fixed path
import Leads from "./src/pages/dashboard/Leads";

const iconClass = "w-5 h-5 text-inherit";

export const routes = [
  {
    layout: "dashboard",
    
    pages: [
      {
        icon: <HomeIcon className={iconClass} />,
        name: "Dashboard",
        path: "/home", // Fixed path
        element: <Home />,
      },
      {
        icon:<ArchiveBoxArrowDownIcon className={iconClass} />,
        name: "All Leads",
        path: "/leads", // Fixed path
        element: <Leads />,
      },
      {
        icon: <UserCircleIcon className={iconClass} />,
        name: "Profile",
        path: "/profile", // Fixed path
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon className={iconClass} />,
        name: "Tables",
        path: "/tables", // Fixed path
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon className={iconClass} />,
        name: "Notifications",
        path: "/notifications", // Fixed path
        element: <Notifications />,
      },
    ],
  },
];

export default routes;
