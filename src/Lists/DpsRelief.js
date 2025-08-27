import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function DpsRelief() {
  const { token } = useContext(TokenContext);
  const [DpsRelief, setDpsRelief] = useState();
  const columnsToExclude = ["id", "dpsHealthIssues"];
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    sethideActions(true);
    sethidebtn(true);

    const delayDebounce = setTimeout(() => {
      GetDpsReliefs(`https://camps.runasp.net/dpsreleif`);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, []);

  async function GetDpsReliefs(url) {
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
        setDpsRelief(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    DpsRelief && (
      <div>
        <Table
          tableName={"توزيع المساعدات"}
          list={DpsRelief}
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
