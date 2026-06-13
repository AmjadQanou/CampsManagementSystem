import React, { useContext, useEffect } from "react";
import Table from "../CRUDComponents/Table";
import { useState } from "react";
import ReliefTable from "../CRUDComponents/ReliefTable";
import { AuthContext } from "../AuthProvider";
import { campService } from "../services/apiService";

export default function Camps() {
  const columnsToExclude = [
    "dPs",
    "reliefRegisters",
    "campManager",
    "imageUrl",
  ];
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  const [Camps, setCamps] = useState();

  useEffect(() => {
    if (user.role == "OrganizationManager") {
      sethideActions(true);
      sethidebtn(true);
    }
  }, [user.role]);

  useEffect(() => {
    getCamps();
  }, []);

  const [loading, setLoading] = useState(true);

  async function getCamps() {
    try {
      const response = await campService.getOtherCamps();
      setCamps(response.data);
    } catch (error) {
      console.error("Error fetching camps:", error);
    } finally {
      setLoading(false);
    }
  }

  // in JSX
  if (loading) return <div>جاري التحميل...</div>;
  return (
    <div>
      <ReliefTable
        tableName={"مخيمات"}
        list={Camps}
        columnsToExclude={columnsToExclude}
        hidebtn={hidebtn}
        hideactions={hideactions}
      />
    </div>
  );
}
