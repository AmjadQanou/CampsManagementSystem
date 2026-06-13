import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { AuthContext } from "../AuthProvider";
import { organizationService } from "../services/apiService";

export default function Organization() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const [orgs, setOrgs] = useState();

  const columnsToExclude = [
    "reliefRegisters",
    "distributionCriterias",
    "reliefRequests",
    "items",
    "organiztionManager",
    "phoneNumber",
    "phoneNumberConfirmed",
    "twoFactorEnabled",
    "lockoutEnd",
    "lockoutEnabled",
    "accessFailedCount",
    "passwordHash",
    "securityStamp",
    "concurrencyStamp",
    "normalizedEmail",
    "normalizedUserName",
    "emailConfirmed",
    "file",
    "organizationManagerId",
    "id",
  ];

  useEffect(() => {
    if (user.role == "CampManager") {
      sethideActions(true);
      sethidebtn(true);
    }
  }, [user.role]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getOrgs();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function getOrgs() {
    try {
      const response = await organizationService.getAll(query);
      if (user.role === "OrganizationManager") {
        setOrgs([response.data]);
      } else {
        setOrgs(response.data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {orgs ? (
        <Table
          tableName={"المؤسسات"}
          list={orgs}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
