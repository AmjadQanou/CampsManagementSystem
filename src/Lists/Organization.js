import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function Organization() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);

  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const [orgs, setOrgs] = useState();
  const columnsToExclude = [
    "reliefRegisters",
    "distributionCriterias",
    "reliefRequests",
    "items",
    "organiztionManager",
  ];
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (user.role == "CampManager") {
        sethideActions(true);
        sethidebtn(true);
      }
      getOrgs(
        `https://camps.runasp.net/organization?query=${encodeURIComponent(
          query
        )}`
      );
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function getOrgs(url) {
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
        user.role == "OrganizationManager"
          ? await setOrgs([data])
          : await setOrgs(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    orgs && (
      <div>
        <Table
          tableName={"المؤسسات"}
          list={orgs}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      </div>
    )
  );
}
