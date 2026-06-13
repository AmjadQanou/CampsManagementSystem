import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { TokenContext } from "../TokenContext";
import { displacementService } from "../services/apiService";

export default function Displacments() {
  const [displacments, setDisplacments] = useState();
  const columnsToExclude = ["campManager", "dPs", "campTo", "campFrom"];
  useEffect(() => {
    getDisplacments();
  }, [0]);

  const { token } = useContext(TokenContext);

  async function getDisplacments() {
    try {
      let resp = await displacementService.getAll();
      setDisplacments(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {displacments ? (
        <Table
          tableName={"تغييرات المخيمات"}
          list={displacments}
          columnsToExclude={columnsToExclude}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
