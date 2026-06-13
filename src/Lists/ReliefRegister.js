import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import ReliefTable from "../CRUDComponents/ReliefTable";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { reliefRegisterService } from "../services/apiService";

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
      getReliefs();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function getReliefs() {
    try {
      let resp = await reliefRegisterService.getAll();
      setRelifes(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {relifes ? (
        <Table
          tableName={"تسجيل المساعدات"}
          list={relifes}
          columnsToExclude={columnsToExclude}
          url={"reliefreg"}
          searchValue={query}
          setSearchValue={setQuery}
          hidebtn={hidebtn}
          hideactions={hideactions}
          showconfirm={showconfirm}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
