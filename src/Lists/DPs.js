import React, { useContext, useEffect, useState } from "react";
import DpsTable from "../CRUDComponents/DpsTable";
import { TokenContext } from "../TokenContext";

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
      await fetch(`http://camps.runasp.net/dps/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
    let url = "http://camps.runasp.net/parentdps";
    if (searchQuery) {
      url = `http://camps.runasp.net/parentdps/search?query=${encodeURIComponent(
        searchQuery
      )}`;
    }

    try {
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        let data = await resp.json();
        setDPs(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    DPs && (
      <div>
        <DpsTable
          tableName={"نازح"}
          searchValue={query}
          setSearchValue={setQuery}
          onDelete={handleDelete}
          list={DPs}
          columnsToExclude={columnsToExclude}
          columnOrder={dpsFieldOrder}
        />
      </div>
    )
  );
}
