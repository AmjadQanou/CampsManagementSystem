import React, { useContext, useEffect } from "react";
import SideBar from "./DashboardComponents/SideBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { OrgStatusContext } from "./Context/OrgStatusContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const orgStatus = useContext(OrgStatusContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || orgStatus?.loading) return;

    // Only redirect if on /dashboard with no subroute
    // This prevents redirecting when user navigates to /dashboard/camps, /dashboard/myorg, etc.
    const isOnDashboardRoot = location.pathname === "/dashboard";

    if (!isOnDashboardRoot) {
      // User is already on a subroute, don't redirect
      return;
    }

    // Now apply role-based redirects ONLY when on /dashboard root
    if (user.role === "OrganizationManager") {
      if (!orgStatus.hasOrg) {
        // No org registered yet → send to registration page
        navigate("/dashboard/registerorg", { replace: true });
      } else {
        // Has org, redirect to myorg (waiting screen or dashboard will show)
        navigate("/dashboard/myorg", { replace: true });
      }
    } else if (user.role === "CampManager") {
      navigate("/dashboard/mycamp", { replace: true });
    } else if (user.role === "SystemManager") {
      navigate("/dashboard/admindash", { replace: true });
    }
  }, [user, orgStatus, navigate, location.pathname]);

  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      <SideBar />
      <main className="p-4 h-auto pt-10" style={{ marginRight: "230px" }}>
        <Outlet />
      </main>
    </div>
  );
}
