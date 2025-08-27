import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { AuthContext } from "../AuthProvider";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const columnsToExclude = ["sender", "receiver"];
  // const [hidebtn,sethidebtn]=useState(false)
  // const [hideactions,sethideActions]=useState(false)
  const { user } = useContext(AuthContext);
  useEffect(() => {
    // if(user.role=="OrganizationManager")
    //   {
    //      sethideActions(true);
    //      sethidebtn(true)
    //   }
    if (user.role == "SystemManager") {
      getNotifications("https://camps.runasp.net/notifications");
    } else getNotifications("https://camps.runasp.net/sen-notifications");
  }, [0]);
  let token = localStorage.getItem("token");
  async function getNotifications(url) {
    console.log(token);

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
        setNotifications(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    notifications && (
      <div>
        <Table
          tableName={"اشعارات"}
          list={notifications}
          columnsToExclude={columnsToExclude}
          //   hidebtn={hidebtn}
          //   hideactions={hideactions}
        />
      </div>
    )
  );
}
