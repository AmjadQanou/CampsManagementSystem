import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import ReliefTable from "../CRUDComponents/ReliefTable";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function ReliefRegister() {
  const [relifes, setRelifes] = useState();
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [showconfirm, setshowconfirm] = useState(false);

  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  const columnsToExclude = [
    "item",
    "camp",
    "organization",
    "organizationManager",
    "campManager",
    "reliefTracking",
    "dpsRelif",
    "distributionCriteria",
    "distributionDoc",
  ];
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  useEffect(() => {
    if (user.role == "SystemManager") {
      sethideActions(true);
      sethidebtn(true);
    }

    if (user.role == "CampManager") {
      sethideActions(false);
      sethidebtn(true);
      setshowconfirm(true);
    }

    if (user.role == "OrganizationManager") {
      sethideActions(false);
    }
    const delayDebounce = setTimeout(() => {
      getReliefs(
        `https://camps.runasp.net/reliefregister?query=${encodeURIComponent(
          query
        )}`
      );
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function getReliefs(url) {
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
        setRelifes(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  return (
    relifes && (
      <div>
        <Table
          tableName={"تسجيل المساعدات"}
          url={"reliefreg"}
          list={relifes}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
          hidebtn={hidebtn}
          hideactions={hideactions}
          showconfirm={showconfirm}
        />
      </div>
    )
  );
}
