import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";
import { reliefTrackingService } from "../services/apiService";

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
    getReliefTraking();
  }, [0]);

  async function getReliefTraking() {
    try {
      let resp = await reliefTrackingService.getAll();
      setReliefTracking(resp.data);
      console.log(columnsToExclude);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {reliefTracking ? (
        <Table
          tableName={"تتبع المساعدات"}
          list={reliefTracking}
          columnsToExclude={columnsToExclude}
          url={"relietracking"}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
