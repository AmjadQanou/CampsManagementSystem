import React, { useContext, useEffect, useState, useCallback } from 'react';
import Table from '../CRUDComponents/Table';
import { AuthContext } from '../AuthProvider';
import api from '../utils/api';

export default function OrganizationManager() {
 const [orgmanagers,setOrgManagers]=useState()
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  const columnsToExclude = [
    "displacements",
    "reliefRequests",
    "passwordHash",
    "accessFailedCount",
    "lockoutEnabled",
    "twoFactorEnabled",
    "lockoutEnd",
    "phoneNumberConfirmed",
    "concurrencyStamp",
    "securityStamp",
    "emailConfirmed",
    "normalizedEmail",
    "normalizedUserName",
    "reliefRegisters",
    "distributionDocumentation",
    "organization",
    "notifications",
    "id",
    "role"
  ];
  const getorgManagers = useCallback(async () => {
    try {
      const response = await api.get("/organizationmanager");
      setOrgManagers(response.data);
    } catch (error) {
      console.error("Error fetching organization managers:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (user.role === "CampManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    getorgManagers();
  }, [user.role, getorgManagers]);

  return (
    orgmanagers && (
      <div>
        <Table 
          tableName={"مدراء المؤسسات"} 
          list={orgmanagers}
          columnsToExclude={columnsToExclude}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      </div>
    )
  );
}
