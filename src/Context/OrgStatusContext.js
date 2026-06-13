import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export const OrgStatusContext = createContext(null);

export function OrgStatusProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { token } = useContext(TokenContext);

  const [orgStatus, setOrgStatus] = useState({
    hasOrg: false,
    isApproved: false,
    orgId: null,
    org: null,
    loading: true,
  });

  const fetchOrgStatus = useCallback(async () => {
    if (!user || user.role !== "OrganizationManager" || !token) {
      setOrgStatus({
        hasOrg: false,
        isApproved: false,
        orgId: null,
        org: null,
        loading: false,
      });
      return;
    }

    try {
      // ── 1. Fetch the org (may not exist yet) ─────────────────────────────
      const orgRes = await fetch(
        `https://localhost:5000/organization/bymanager/${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Backend returns 400/404 when no org found — treat all non-ok as "no org"
      if (!orgRes.ok) {
        setOrgStatus({
          hasOrg: false,
          isApproved: false,
          orgId: null,
          org: null,
          loading: false,
        });
        return;
      }

      const org = await orgRes.json();

      if (!org || !org.id) {
        setOrgStatus({
          hasOrg: false,
          isApproved: false,
          orgId: null,
          org: null,
          loading: false,
        });
        return;
      }

      // ── 2. Fetch the manager's own profile to read the Approved flag ──────
      // The Approved column lives on OrganiztionManager (User), NOT on Organization.
      // In OrgStatusContext.js — replace step 2 with this:
      const managerRes = await fetch(
        `https://localhost:5000/organizationmanager`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let isApproved = false;
      if (managerRes.ok) {
        const managers = await managerRes.json();
        const manager = managers.find((m) => m.id === user.id);
        if (manager) {
          isApproved = manager.approved === true || manager.Approved === true;
        }
      }

      setOrgStatus({
        hasOrg: true,
        isApproved,
        orgId: org.id,
        org,
        loading: false,
      });
    } catch {
      setOrgStatus({
        hasOrg: false,
        isApproved: false,
        orgId: null,
        org: null,
        loading: false,
      });
    }
  }, [user, token]);

  useEffect(() => {
    fetchOrgStatus();
  }, [fetchOrgStatus]);

  return (
    <OrgStatusContext.Provider
      value={{ ...orgStatus, refetch: fetchOrgStatus }}
    >
      {children}
    </OrgStatusContext.Provider>
  );
}
