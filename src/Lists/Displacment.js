import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { TokenContext } from "../TokenContext";

export default function Displacments() {
  const [displacments, setDisplacments] = useState();
  const columnsToExclude = ["campManager", "dPs", "campTo", "campFrom"];
  useEffect(() => {
    getDisplacments("http://camps.runasp.net/displacement");
  }, [0]);

  const { token } = useContext(TokenContext);

  async function getDisplacments(url) {
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
        setDisplacments(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    displacments && (
      <div>
        <Table
          tableName={"تغييرات المخيمات"}
          list={displacments}
          columnsToExclude={columnsToExclude}
        />
      </div>
    )
  );
}
