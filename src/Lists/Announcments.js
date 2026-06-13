import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { announcementService } from "../services/apiService";

export default function Announcments() {
  const [announcments, setAnnouncments] = useState();
  const columnsToExclude = ["campManager", "organizationManager"];
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    getAnnouncment();
  }, [0]);

  async function getAnnouncment() {
    try {
      let resp = await announcementService.getAll();
      console.log(resp.data);
      setAnnouncments(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {announcments ? (
        <Table
          tableName={"الاعلانات"}
          list={announcments}
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
