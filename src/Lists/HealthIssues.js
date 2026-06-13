import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { healthIssuesService } from "../services/apiService";

export default function HealthIssues() {
  const { token } = useContext(TokenContext);
  const [healthIssues, setHealthIssues] = useState();
  const columnsToExclude = ["id", "dpsHealthIssues"];
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user.role == "CampManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    const delayDebounce = setTimeout(() => {
      GetHealthIssues();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function GetHealthIssues() {
    try {
      let resp = await healthIssuesService.getAll();
      setHealthIssues(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {healthIssues ? (
        <Table
          tableName={"الامراض"}
          list={healthIssues}
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
