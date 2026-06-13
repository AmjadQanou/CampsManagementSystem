import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import { AuthContext } from "../AuthProvider";
import { notificationService } from "../services/apiService";

export default function Notifications() {
  const [notifications, setNotifications] = useState();
  const columnsToExclude = ["sender", "receiver"];
  // const [hidebtn,sethidebtn]=useState(false)
  // const [hideactions,sethideActions]=useState(false)
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user.role == "SystemManager") {
      getNotifications("all");
    } else getNotifications("sent");
  }, [0]);
  async function getNotifications(type) {
    try {
      let resp;
      if (type === "all") {
        resp = await notificationService.getAll();
      } else if (type === "sent") {
        resp = await notificationService.getSent();
      } else {
        resp = await notificationService.getAll();
      }
      setNotifications(resp.data);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {notifications ? (
        <Table
          tableName={"اشعارات"}
          list={notifications}
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
