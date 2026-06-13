import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import {
  organizationService,
  organizationManagerService,
} from "../services/apiService";

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
      // ── 1. Fetch the org ─────────────────────────────
      const orgRes = await organizationService.getByManager(user.id);
      const org = orgRes.data;

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

      // ── 2. Fetch managers to check Approved flag ──────
      let isApproved = false;
      try {
        const managersRes = await organizationManagerService.getAll();
        const managers = managersRes.data;
        const manager = managers.find((m) => m.id === user.id);
        if (manager) {
          isApproved = manager.approved === true || manager.Approved === true;
        }
      } catch {
        // ignore manager fetch error
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
