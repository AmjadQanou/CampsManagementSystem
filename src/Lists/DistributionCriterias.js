import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function DistributionCriterias() {
  const [disCriterias, setDisCriterias] = useState([]);
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
      if (query) {
        getDisCriterias(
          `http://camps.runasp.net/distributioncriteria?query=${encodeURIComponent(
            query
          )}`
        );
      } else {
        getDisCriterias(`http://camps.runasp.net/distributioncriteria`);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function getDisCriterias(url) {
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
        setDisCriterias(data);
        console.log(data); // Display fetched data in console for debugging
      } else {
        throw new Error("Error: " + resp.status);
      }
    } catch (err) {
      console.error(err);
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
