import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function ReliefRequest() {
  const [reliefRequests, setReliefRequests] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  // let token= localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const columnsToExclude = ["id", "organization", "campManager"];
  useEffect(() => {
    if (user.role == "OrganizationManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    getReliefRequets("https://camps.runasp.net/reliefrequest");
  }, [0]);

  async function getReliefRequets(url) {
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
        setReliefRequests(data);
        console.log(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`https://camps.runasp.net/reliefrequest/${id}`, {
        method: "DELETE",
      });
      setReliefRequests((prev) => prev.filter((dp) => dp.id !== id));
    } catch (error) {
      console.error("Failed to delete DP:", error);
      alert("حدث خطأ أثناء الحذف. الرجاء المحاولة مرة أخرى.");
    }
  };
  return (
    reliefRequests && (
      <div>
        <Table
          tableName={"ReliefRequests"}
          hidebtn={hidebtn}
          hideactions={hideactions}
          url={"reliefreq"}
          list={reliefRequests}
          columnsToExclude={columnsToExclude}
        />
      </div>
    )
  );
}
