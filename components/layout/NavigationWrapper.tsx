"use client";

import { usePathname } from "next/navigation";
import { CitizenNavbar } from "./CitizenNavbar";

export function NavigationWrapper() {
  const pathname = usePathname();

  // Define the routes that belong to the citizen portal
  const citizenRoutes = [
    "/dashboard",
    "/report",
    "/problem-go",
    "/map",
    "/leaderboard",
    "/awards",
    "/profile",
    "/ranking"
  ];

  // Also match nested routes like /problem-go/123
  const isCitizenRoute = citizenRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isCitizenRoute) {
    return null;
  }

  return <CitizenNavbar />;
}
