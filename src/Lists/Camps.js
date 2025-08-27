import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import ReliefTable from "../CRUDComponents/ReliefTable";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { DataContext } from "../DataContext";

export default function Camps() {
  const columnsToExclude = ["dPs", "reliefRegisters", "campManager"];
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  const { token } = useContext(TokenContext);
  const [Camps, setCamps] = useState([]);
  useEffect(() => {
    if (user.role == "OrganizationManager") {
      sethideActions(true);
      sethidebtn(true);
    }
  }, [0]);

  useEffect(() => {
    async function get() {
      await getCamps("http://camps.runasp.net/DisCamps");
    }
    get();
  }, [Camps.length]);

  async function getCamps(url) {
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

        setCamps(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  return (
    Camps && (
      <div>
        <ReliefTable
          tableName={"مخيمات"}
          list={Camps}
          columnsToExclude={columnsToExclude}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      </div>
    )
  );
}
