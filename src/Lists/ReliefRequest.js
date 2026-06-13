import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import {
  reliefRequestService,
  reliefRegisterService,
} from "../services/apiService";

export default function ReliefRequest() {
  const [reliefRequests, setReliefRequests] = useState();
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);

  const columnsToExclude = ["id", "organization", "campManager"];

  useEffect(() => {
    if (user.role === "OrganizationManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    loadData();
  }, []);

  async function loadData() {
    try {
      // Fetch both relief requests and existing relief registers in parallel
      const [requestsResp, registersResp] = await Promise.all([
        reliefRequestService.getAll(),
        reliefRegisterService.getAll(),
      ]);

      const allRequests = requestsResp.data;
      const allRegisters = registersResp.data;

      // Build a set of relief request IDs that already have a register
      // Adjust the field name below if your register object uses a different key
      const registeredIds = new Set(
        allRegisters.map((r) => r.reliefRequestId).filter(Boolean),
      );

      // Only show requests that haven't been registered yet
      const unregistered = allRequests.filter((r) => !registeredIds.has(r.id));
      setReliefRequests(unregistered);
    } catch (er) {
      console.error(er);
    }
  }

  function handleReliefRegistered(registeredId) {
    setReliefRequests((prev) => prev.filter((r) => r.id !== registeredId));
  }

  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {reliefRequests ? (
        <Table
          tableName={"ReliefRequests"}
          list={reliefRequests}
          columnsToExclude={columnsToExclude}
          hidebtn={hidebtn}
          hideactions={hideactions}
          url={"reliefreq"}
          onReliefRegistered={handleReliefRegistered}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
