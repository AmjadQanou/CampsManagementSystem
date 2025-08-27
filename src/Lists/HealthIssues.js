import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

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
      GetHealthIssues(
        `https://camps.runasp.net/healthisuues?query=${encodeURIComponent(
          query
        )}`
      );
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function GetHealthIssues(url) {
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
        setHealthIssues(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    healthIssues && (
      <div>
        <Table
          tableName={"الامراض"}
          list={healthIssues}
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
