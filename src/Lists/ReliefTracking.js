import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function ReliefTracking() {
  const [reliefTracking, setReliefTracking] = useState();
  const columnsToExclude = ["reliefRegister"];
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  useEffect(() => {
    if (user.role == "OrganizationManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    getReliefTraking("https://camps.runasp.net/relieftracking");
  }, [0]);

  async function getReliefTraking(url) {
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
        setReliefTracking(data);
        console.log(columnsToExclude);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    reliefTracking && (
      <div>
        <Table
          tableName={"تتبع المساعدات"}
          url={"relietracking"}
          list={reliefTracking}
          columnsToExclude={columnsToExclude}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      </div>
    )
  );
}
