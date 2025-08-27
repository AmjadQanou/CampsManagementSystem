import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function Announcments() {
  const [announcments, setAnnouncments] = useState();
  const columnsToExclude = ["campManager", "organizationManager"];
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const url =
      user.role == "CampManager"
        ? "https://camps.runasp.net/announcments/byType?type=camp"
        : user.role == "OrganizationManager"
        ? "https://camps.runasp.net/announcments/byType?type=org"
        : "https://camps.runasp.net/announcments";
    getAnnouncment(url);
  }, [0]);

  async function getAnnouncment(url) {
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
        console.log(data);

        setAnnouncments(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    announcments && (
      <div>
        <Table
          tableName={"الاعلانات"}
          list={announcments}
          columnsToExclude={columnsToExclude}
        />
      </div>
    )
  );
}
