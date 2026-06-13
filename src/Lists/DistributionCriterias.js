import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { distributionCriteriaService } from "../services/apiService";

export default function DistributionCriterias() {
  const [disCriterias, setDisCriterias] = useState();
  const columnsToExclude = ["id", "organization", "date"];
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  // let token = localStorage.getItem("token");
  const { token } = useContext(TokenContext);

  useEffect(() => {
    if (user.role == "CampManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    const delayDebounce = setTimeout(() => {
      getDisCriterias();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function getDisCriterias() {
    try {
      let resp = await distributionCriteriaService.getAll();
      setDisCriterias(resp.data);
      console.log(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  return (
    <div>
      {disCriterias && (
        <Table
          tableName={"معايير التوزيع"}
          list={disCriterias}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      )}
    </div>
  );
}
