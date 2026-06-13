import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { dpsReliefService } from "../services/apiService";

export default function DpsRelief() {
  const [DpsRelief, setDpsRelief] = useState();
  const columnsToExclude = ["id", "dpsHealthIssues"];
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  useEffect(() => {
    sethideActions(true);
    sethidebtn(true);

    const delayDebounce = setTimeout(() => {
      GetDpsReliefs();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, []);

  async function GetDpsReliefs() {
    try {
      let resp = await dpsReliefService.getAll();
      setDpsRelief(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {DpsRelief ? (
        <Table
          tableName={"توزيع المساعدات"}
          list={DpsRelief}
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
