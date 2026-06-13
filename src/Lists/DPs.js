import React, { useContext, useEffect, useState } from "react";
import DpsTable from "../CRUDComponents/DpsTable";
import { TokenContext } from "../TokenContext";
import { dpService } from "../services/apiService";

export default function DPs() {
  const [DPs, setDPs] = React.useState();
  const dpsFieldOrder = [
    "id",
    "username",
    "password",
    "email",
    "role",
    "fname",
    "lname",
    "dob",
    "gender",
    "contactInfo",

    "approved",
    "fatherName",
    "grandFatherName",
    "identityNo",
    "parentId",
    "unrwaNo",
    "numOfFemales",
    "numOfMales",
    "registerDate",
    "vulnerabilityLevel",
    "tentStatus",
    "relationToFamilyHead",
    "numOfFamilyMembers",
    "pregnantNo",
    "childrenyoungrethan3Y",
    "olderThan60",
    "childrenyoungrethan1Y",
    "childrenyoungrethan9Y",
    // 'campId',
  ];
  const [query, setQuery] = useState("");

  const handleDelete = async (id) => {
    try {
      await dpService.delete(id);
      setDPs((prev) => prev.filter((dp) => dp.id !== id));
    } catch (error) {
      console.error("Failed to delete DP:", error);
      alert("حدث خطأ أثناء الحذف. الرجاء المحاولة مرة أخرى.");
    }
  };
  const columnsToExclude = [
    "displacements",
    "dpsRelif",
    "dpsHealthIssues",
    "camp",
    "notifications",
    "joinId",
    "normalizedUserName",
    "normalizedEmail",
    "securityStamp",
    "concurrencyStamp",
    "twoFactorEnabled",
    "phoneNumberConfirmed",
    "lockoutEnd",
    "lockoutEnabled",
    "accessFailedCount",
    "passwordHash",
    "userName",
    "emailConfirmed",
    "reliefMin",
    "campId",
    "role",
  ];
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getDPs(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  async function getDPs(searchQuery = "") {
    try {
      let resp;
      if (searchQuery) {
        resp = await dpService.searchParent(searchQuery);
      } else {
        resp = await dpService.getParents();
      }
      setDPs(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {DPs ? (
        <DpsTable
          tableName={"نازح"}
          list={DPs}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
          onDelete={handleDelete}
          columnOrder={dpsFieldOrder}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
